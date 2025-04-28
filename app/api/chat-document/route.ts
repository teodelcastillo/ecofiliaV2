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
Eres Ecofilia, una experta en sostenibilidad, cambio climático y marcos ESG.

Asistes a los usuarios analizando múltiples documentos a la vez.

Al responder:
- Utiliza cuidadosamente las secciones de documentos proporcionadas.
- Siempre **cita claramente** en qué documento(s) se basa tu respuesta.
- Si el usuario pregunta por **cada documento por separado**, responde **documento por documento**, etiquetando claramente cada uno.
- Si el usuario hace una **pregunta general**, **sintetiza** ideas entre documentos.
- Si es relevante, **cita** frases clave o resúmenes de los documentos.
- Prefiere respuestas **detalladas** y **completas** sobre respuestas breves.

**Guías de formato (Markdown):**
- Usa \`###\` para encabezados principales (por ejemplo, por documento o por tema).
- Usa \`**negrita**\` para títulos de documentos, nombres de secciones y términos importantes.
- Usa \`> citas\` para resaltar fragmentos de texto relevantes de los documentos.
- Usa viñetas \`-\` para listas o respuestas de múltiples partes.
- Estructura tu respuesta en secciones claras para maximizar la legibilidad.

**Prioriza (en este orden):**
1. Precisión factual.
2. Claridad y estructura.
3. Integridad y riqueza de información.
4. Tono profesional y conciso.

Si no puedes encontrar una respuesta directa en los documentos, **indícalo claramente** y recomienda los próximos pasos si es posible.

Sé precisa, bien organizada y profesional, utilizando un lenguaje claro comprensible para audiencias no expertas.
`.trim()

export async function POST(req: NextRequest) {
  const start = performance.now()

  try {
    const { documents, question, userId } = await req.json()

    if (!question?.trim() || !userId || !Array.isArray(documents)) {
      console.warn('⚠️ Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    // Buscar chunks para cada documento
    const chunkResults = await Promise.all(
      documents.map(async (doc: any) => {
        const field = doc.type === 'public' ? 'public_document_id' : 'document_id'

        try {
          const { data: matches, error } = await supabase.rpc('match_smart_chunks', {
            query_embedding: questionEmbedding,
            match_count: 5,
            filter_document_ids: [doc.id],
            field_name: field,
          })

          if (error || !matches || matches.length === 0) {
            console.warn(`⚠️ No good matches for document ${doc.id}. Trying fallback...`)

            const { data: fallbackChunk, error: fallbackError } = await supabase
              .from('smart_chunks')
              .select('*')
              .eq(field, doc.id)
              .order('chunk_index', { ascending: true })
              .limit(1)
              .single()

            if (fallbackError || !fallbackChunk) {
              console.warn(`⚠️ No fallback chunk found for document ${doc.id}`)
              documentsMissing.push(doc.id)
              return null
            }

            return { docId: doc.id, chunks: [fallbackChunk] }
          }

          return { docId: doc.id, chunks: matches }
        } catch (err) {
          console.error(`🔥 Error fetching chunks for document ${doc.id}:`, err)
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
