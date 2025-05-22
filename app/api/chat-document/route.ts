import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { generateSummary } from './utils/generateChatSummary'
import { selectTopChunks } from './utils/selectTopChunks'
import { detectStructuredQuestion } from './utils/detectStructuredQuestion'
import { translateToEnglish } from './utils/translateToEnglish'



// --- Configuración ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! })
const MAX_TOKENS_BUDGET = 40000

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PRIVATE_SERVICE_KEY!)
}

function formatChunk(match: any): string {
  const parts = []

  if (match.title) parts.push(`**${match.title.trim()}**`)
  if (match.summary) parts.push(`_${match.summary.trim()}_`)
  if (Array.isArray(match.keywords) && match.keywords.length > 0) parts.push(`**Keywords:** ${match.keywords.join(', ')}`)
  if (match.content) {
    const quotedContent = match.content
      .trim()
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .map((line: any) => `> ${line}`)
      .join('\n')
    parts.push(quotedContent)
  }

  if (parts.length === 0) parts.push(`_(No relevant content found in this section)_`)
  return parts.join('\n\n')
}

const SYSTEM_PROMPT = `
You are Ecofilia, an AI assistant specialized in sustainability, climate change, and ESG.

Your job is to help users understand and analyze key insights from selected documents. Be concise, fact-based, and professionally structured.

### Language:
- Always detect and match the user's language (Spanish or English).

### Knowledge Sources (in priority order):
1. 📚 **Selected document fragments** (main source of truth).
2. 🧠 **Conversation summary** (context only — do not treat as factual).
3. 🤖 **General assistant knowledge** (only use if documents lack the answer, and clarify this explicitly).

### Core Instructions:
- Base your response on document fragments first.
- Clearly cite relevant document titles or sections when referencing.
- If no answer is found in the fragments, explain that, then provide a general answer if possible.
- Do NOT fabricate information.

### Formatting (Markdown):
- Use \`###\` for section headings.
- Use \`**bold**\` for document titles or key terms.
- Use \`> quotes\` for excerpts from the documents.
- Use bullet points (\`-\`) when appropriate.
`.trim()




export async function POST(req: NextRequest) {
  const start = performance.now()

  try {
    const { chatId, documents, question, userId } = await req.json()

  if (!chatId || !question?.trim() || !userId || !Array.isArray(documents)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }


    if (documents.length === 0) {
  console.warn('⚠️ No documents provided. Proceeding with general answer.')

    const generalPrompt = `
    The user has asked a question related to sustainability, climate change, or ESG frameworks.

    No documents were selected for reference.

    Please provide a detailed, accurate, and useful response based on your expert knowledge.

    **Question:** ${question}
    `.trim()


  const openaiStream = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    stream: true,
    max_tokens: 16384,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: generalPrompt },
    ],
  })

  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  ;(async () => {
    for await (const chunk of openaiStream) {
      const content = chunk.choices?.[0]?.delta?.content
      if (content) {
        await writer.write(encoder.encode(content))
      }
    }
    await writer.close()
  })()

  return new NextResponse(readable, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}


    const supabase = getSupabase()
    

    // Separar documentos por tipo
    const userDocumentIds = documents.filter((d: any) => d.type === 'user').map((d: any) => d.id)
    const publicDocumentIds = documents.filter((d: any) => d.type === 'public').map((d: any) => d.id)

    console.log('📄 User Document IDs:', userDocumentIds)
    console.log('📄 Public Document IDs:', publicDocumentIds)

   // Paso previo al embedding:
const normalizedQuery = await translateToEnglish(question.trim())
const { intent, instruction } = await detectStructuredQuestion(question.trim())


const expandedPrompt = (() => {
  switch (intent) {
    case 'extract_indicators':
      return `Extract emissions targets, climate objectives and measurable goals. Question: ${normalizedQuery}`
    case 'identify_actors':
      return `Identify key institutions, implementers or responsible entities. Question: ${normalizedQuery}`
    case 'extract_measures':
      return `List adaptation or mitigation measures and climate strategies mentioned. Question: ${normalizedQuery}`
    case 'summary_each':
      return `Summarize each selected document individually, then identify a common theme. Question: ${normalizedQuery}`
    case 'compare_documents':
      return `Compare the approaches or outcomes described across the selected documents. Question: ${normalizedQuery}`
    case 'common_themes':
      return `What common topics or elements appear across the selected documents? Question: ${normalizedQuery}`
    default:
      return normalizedQuery
  }
})()

const questionEmbedding = await embedder.embedQuery(expandedPrompt)
console.log('🔍 Expanded prompt embedded.')


    // Cargar metadata
    const titleMap: Record<string, string> = {}

    if (publicDocumentIds.length > 0) {
      const { data: publicMeta } = await supabase
        .from('public_documents')
        .select('id, name')
        .in('id', publicDocumentIds)

      if (publicMeta) {
        for (const doc of publicMeta) {
          titleMap[doc.id] = doc.name
        }
      }
    }

    if (userDocumentIds.length > 0) {
      const { data: userMeta } = await supabase
        .from('documents')
        .select('id, name')
        .in('id', userDocumentIds)

      if (userMeta) {
        for (const doc of userMeta) {
          titleMap[doc.id] = doc.name
        }
      }
    }

    const documentsMissing: string[] = []

// Buscar chunks relevantes para cada documento (parche: usar todos si hay pocos docs)
const chunkResults = await Promise.all(
  documents.map(async (doc: any) => {
    const field = doc.type === 'public' ? 'public_document_id' : 'document_id'

    try {
      // 👉 Si hay pocos documentos seleccionados, usar todos los chunks directamente
      if (documents.length <= 2) {
        const { data: allChunks, error: allChunksError } = await supabase
          .from('smart_chunks')
          .select('*')
          .eq(field, doc.id)
          .order('chunk_index', { ascending: true })

          
        if (allChunksError || !allChunks || allChunks.length === 0) {
          throw new Error(`No chunks found for ${doc.id}`)
        }

        console.log(`✅ Usando todos los chunks para documento ${doc.id} (${allChunks.length} chunks)`)

        return { docId: doc.id, chunks: allChunks }
      }

      // 🔍 Buscar chunks con scoring optimizado
      const { data: matches, error } = await supabase.rpc('match_smart_chunks_by_public_id_v2', {
        query_embedding: questionEmbedding,
        match_count: 30,
        filter_document_ids: [doc.id],
      })

      if (error) {
        throw new Error(`RPC error: ${error.message}`)
      }

      if (!matches || matches.length === 0) {
        console.warn(`⚠️ No chunks devueltos para documento ${doc.id}. Probando fallback...`)
        throw new Error('Sin resultados')
      }

      // 🧠 Ordenar por relevance_score y filtrar por similarity (opcional)
      const sortedMatches = matches
        .filter((m: { similarity: number }) => m.similarity >= 0.05)
        .sort((a: any, b: any) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0))

      // 🎯 Aplicar selección dinámica de top chunks
      let filteredMatches = sortedMatches

      if (intent === 'extract_indicators') {
        const indicatorKeywords = ['meta', 'objetivo', 'target', 'reducción', '2030', 'emisiones', 'limite']
        filteredMatches = sortedMatches.filter((chunk: { title: string; content: string }) =>
          indicatorKeywords.some((kw) =>
            (chunk.title?.toLowerCase() || '').includes(kw) ||
            (chunk.content?.toLowerCase() || '').includes(kw)
          )
        )
        if (filteredMatches.length === 0) {
          filteredMatches = sortedMatches
        }
      }

      const topChunks = selectTopChunks(filteredMatches, MAX_TOKENS_BUDGET * 0.25)

      console.log(`📌 Chunks seleccionados para ${doc.id}:`, topChunks.map((m: any) => ({
        index: m.chunk_index,
        sim: (m.similarity ?? 0).toFixed(4),
        score: (m.relevance_score ?? 0).toFixed(4),
        title: m.title?.slice(0, 40),
        content: m.content?.slice(0, 100),
      })))

      return { docId: doc.id, chunks: topChunks }

    } catch (fallbackError) {
      console.warn(`⚠️ Usando fallback para ${doc.id}: ${typeof fallbackError === 'object' && fallbackError && 'message' in fallbackError ? (fallbackError as { message: string }).message : String(fallbackError)}`)

      const { data: fallbackChunk, error: fallbackQueryError } = await supabase
        .from('smart_chunks')
        .select('*')
        .eq(field, doc.id)
        .order('chunk_index', { ascending: true })
        .limit(1)
        .single()

      if (fallbackQueryError || !fallbackChunk) {
        console.warn(`❌ No se encontró fallback chunk para ${doc.id}`)
        documentsMissing.push(doc.id)
        return null
      }

      return { docId: doc.id, chunks: [fallbackChunk] }
    }
  })
)





    const perDocumentChunks = chunkResults.filter((r) => r !== null)

    // Construir contexto
    const documentSections: string[] = []
    let totalTokens = 0

    for (const { docId, chunks } of perDocumentChunks) {
      const title = titleMap[docId] || `Document ${docId}`

      const formattedChunks = chunks.map(formatChunk)
      const fullSection = `### 📘 ${title}\n\n${formattedChunks.join('\n\n')}`

      const sectionTokens = estimateTokens(fullSection)
      if (totalTokens + sectionTokens > MAX_TOKENS_BUDGET) break

      documentSections.push(fullSection)
      totalTokens += sectionTokens
    }


    const summaryBlock = `
      **Resumen:**
      - Documentos incluidos:
      ${perDocumentChunks.map(({ docId }) => `✅ ${titleMap[docId] || `Document ${docId}`}`).join('\n')}
      ${documentsMissing.length > 0 ? `\n- Documentos omitidos:\n${documentsMissing.map((id) => `⚠️ ${id}`).join('\n')}` : ''}
      - Total fragmentos usados: ${documentSections.length}
      - Tokens usados: ${totalTokens}/${MAX_TOKENS_BUDGET}
      `.trim()
      

      const documentContext = `
      ${summaryBlock}

      A continuación se presentan fragmentos de los documentos seleccionados:

      ${documentSections.join('\n\n')}
      `.trim()

      // 👉 Construcción del array con historial + contexto

      // ⏳ 1. Generar resumen del historial (20 mensajes máx)
      const summary = await generateSummary(chatId, supabase)

      // 📋 2. Construir mensajes con prioridad: system > resumen > documento > pregunta
      const messages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...(summary ? [{
          role: 'system',
          content: `🧠 *Resumen de la conversación anterior:* (usar solo como contexto general, no como fuente de verdad)\n${summary}`,
        }] : []),
        {
          role: 'user',
          content: `📄 *Usá exclusivamente los siguientes fragmentos de documentos como base para tu respuesta:* \n\n${documentContext}`,
        },

        {
          role: 'user',
          content: `
            Los mensajes anteriores contienen tres tipos de contexto:

            1. Fragmentos de documentos seleccionados — *esto es tu fuente principal de verdad*.
            2. Resumen del historial de conversación — *esto es útil para contexto, pero no debe usarse como fuente factual*.
            3. Tu conocimiento general como asistente — *solo usar si es necesario, y aclararlo explícitamente*.

            Respondé con base en estos fragmentos, citando lo relevante. Si no encontrás información suficiente, indicá claramente las limitaciones.
            Si no encontrás respuesta en los fragmentos, indicá que no hay información suficiente y luego brindá una respuesta en base a tu razonamiento que pueda enriquecer al usuario.
            Si la pregunta incluye múltiples subtemas, abordalos por separado en secciones distintas, incluso si no todos tienen respuesta documental.

            ${instruction ? `🧭 *Instrucción adicional detectada automáticamente:* ${instruction}` : ''}

            **Pregunta del usuario:** ${question.trim()}
        `.trim(),
        }

      ]


      console.log("🧠 Mensajes enviados a OpenAI:")
      messages.forEach((msg, i) => {
        const preview = msg.content.length > 100 ? msg.content.slice(0, 100) + '...' : msg.content
        console.log(`  [${i}] (${msg.role}): ${preview.replace(/\n/g, ' ')}`)
      })


      const openaiStream = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        stream: true,
        max_tokens: 16384,
        messages: messages as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
      })

    // Responder como stream
    const encoder = new TextEncoder()
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    ;(async () => {
      for await (const chunk of openaiStream) {
        const content = chunk.choices?.[0]?.delta?.content
        if (content) {
          await writer.write(encoder.encode(content))
        }
      }
      await writer.close()
    })()

    console.log(`✅ Response generated in ${(performance.now() - start).toFixed(1)}ms`)

    return new NextResponse(readable, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })

  } catch (err) {
    console.error('🔥 Unhandled error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
