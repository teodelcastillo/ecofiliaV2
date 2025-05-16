import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { OpenAIEmbeddings } from '@langchain/openai'

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
You are Ecofilia, an expert assistant in sustainability, climate change, and ESG frameworks.

You assist users by analyzing one or more documents and answering their questions clearly, usefully, and professionally.

### Language:
- Detect the user's language.
- If the question is in **English**, respond in **English**.
- If the question is in **Spanish**, respond in **Spanish**.
- Match the language used by the user consistently throughout the response.

### Core Rules:
- If documents are provided, prioritize information from those documents.
- Always **cite clearly** which document or section your answer is based on.
- If no documents are selected, provide a high-quality, accurate response based on your own expert knowledge.
- If documents are selected but no relevant content is found, state this clearly and then provide a helpful general answer.
- Do **not invent** information.
- If the user requests analysis **per document**, format your answer by document.
- If the user asks a **general question**, synthesize key ideas across all documents.

### Formatting Guidelines (Markdown):
- Use \`###\` for section headings (e.g., per document or topic).
- Use \`**bold**\` for document names, sections, and key terms.
- Use \`> quotes\` to highlight relevant excerpts from documents.
- Use bullet points \`-\` for lists or multi-part answers.
- Always prioritize clarity, structure, and professional tone.

### Response Priorities (in this order):
1. Detect and match the user’s language.
2. Factual accuracy.
3. Relevant, useful information.
4. Provide helpful answers even when documents are missing or incomplete.
5. Complete and detailed responses.
6. Clear formatting and structure.
7. Richness and depth of insight.
8. Professional tone, accessible for non-expert audiences.

Stay precise, organized, and helpful. Your goal is to make sustainability knowledge accessible and actionable.
`.trim()


export async function POST(req: NextRequest) {
  const start = performance.now()

  try {
    const { documents, question, userId } = await req.json()

    if (!question?.trim() || !userId || !Array.isArray(documents)) {
      console.warn('⚠️ Missing required fields')
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

    // Embedding de la pregunta
    const questionEmbedding = await embedder.embedQuery(question)
    console.log('🔍 Question embedded.')

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

// Buscar chunks relevantes para cada documento
const chunkResults = await Promise.all(
  documents.map(async (doc: any) => {
    const field = doc.type === 'public' ? 'public_document_id' : 'document_id'

    try {
      // Buscar top 15 por embedding
      const { data: matches, error } = await supabase.rpc('match_smart_chunks_by_public_id', {
        query_embedding: questionEmbedding,
        match_count: 15,
        filter_document_ids: [doc.id],
      })

      console.log(`🔍 Chunks encontrados para ${doc.id}:`, matches)


      if (error) {
        throw new Error(`RPC error: ${error.message}`)
      }

      const filteredMatches = (matches || [])
        .filter((m: { similarity: number }) => m.similarity >= 0.05)
        .sort((a: { similarity: number }, b: { similarity: number }) => b.similarity - a.similarity)

      if (filteredMatches.length > 0) {
        console.log(`📌 Chunks relevantes para ${doc.id}:`, filteredMatches.map((m: { chunk_index: any; similarity: any; title: string | any[]; content: string | any[] }) => ({
          index: m.chunk_index,
          sim: (m.similarity ?? 0).toFixed(4),
          title: m.title?.slice(0, 40),
          content: m.content?.slice(0, 100),
        })))
        return { docId: doc.id, chunks: filteredMatches }
      }

      // Fallback si no hay chunks relevantes
      console.warn(`⚠️ No chunks relevantes para documento ${doc.id}. Probando fallback...`)

      const { data: fallbackChunk, error: fallbackError } = await supabase
        .from('smart_chunks')
        .select('*')
        .eq(field, doc.id)
        .order('chunk_index', { ascending: true })
        .limit(1)
        .single()

      if (fallbackError || !fallbackChunk) {
        console.warn(`⚠️ No se encontró fallback chunk para ${doc.id}`)
        documentsMissing.push(doc.id)
        return null
      }

      return { docId: doc.id, chunks: [fallbackChunk] }

    } catch (err) {
      console.error(`🔥 Error buscando chunks para ${doc.id}:`, err)
      documentsMissing.push(doc.id)
      return null
    }
  })
)


    const perDocumentChunks = chunkResults.filter((r) => r !== null)

    // Construir contexto
    const documentSections: string[] = []
    let totalTokens = 0

    for (const { docId, chunks } of perDocumentChunks) {
      const title = titleMap[docId] || `Document ${docId}`
      const topChunks = chunks.slice(0, 3)

      for (const match of topChunks) {
        const chunkText = formatChunk(match)
        const chunkTokens = estimateTokens(chunkText)

        if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET) break

        const section = `### 📘 ${title}\n\n${chunkText}`
        documentSections.push(section)
        totalTokens += chunkTokens
      }
    }

    const summaryBlock = `
**Resumen:**
- Documentos incluidos:
${perDocumentChunks.map(({ docId }) => `✅ ${titleMap[docId] || `Document ${docId}`}`).join('\n')}
${documentsMissing.length > 0 ? `\n- Documentos omitidos:\n${documentsMissing.map((id) => `⚠️ ${id}`).join('\n')}` : ''}
- Total fragmentos usados: ${documentSections.length}
- Tokens usados: ${totalTokens}/${MAX_TOKENS_BUDGET}
`.trim()

    const userPrompt = `
${summaryBlock}

A continuación se presentan fragmentos de los documentos seleccionados:

${documentSections.join('\n\n')}

Por favor, responde la siguiente pregunta basándote en la información anterior:

**Pregunta:** ${question}
`.trim()

    // Llamar a OpenAI
    console.log('🧠 Llamando a OpenAI...')

    const openaiStream = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      stream: true,
      max_tokens: 16384,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
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
