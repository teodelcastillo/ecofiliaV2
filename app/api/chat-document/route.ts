import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { OpenAIEmbeddings } from '@langchain/openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! })

const MAX_TOKENS_BUDGET = 6000
const MAX_CHUNKS_PER_DOCUMENT = 3
const SIMILARITY_THRESHOLD = 0.75

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

const getSupabase = () => {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PRIVATE_SERVICE_KEY!)
}

export async function POST(req: NextRequest) {
  const start = performance.now()

  try {
    const body = await req.json()
    const { documents, question, userId } = body

    if (!question?.trim() || !userId || !Array.isArray(documents)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabase()

    const personalIds = documents.filter((d) => d.type === 'user').map((d) => d.id)
    const publicIds = documents.filter((d) => d.type === 'public').map((d) => d.id)

    const [personalMeta, publicMeta] = await Promise.all([
      supabase.from('documents').select('id, name').in('id', personalIds),
      supabase.from('public_documents').select('id, name').in('id', publicIds),
    ])

    if (personalMeta.error || publicMeta.error) {
      return NextResponse.json({ error: 'Metadata fetch failed' }, { status: 500 })
    }

    const titleMap: Record<string, string> = {
      ...Object.fromEntries((personalMeta.data || []).map((doc: { id: any; name: any }) => [doc.id, doc.name])),
      ...Object.fromEntries((publicMeta.data || []).map((doc: { id: any; name: any }) => [doc.id, doc.name])),
    }

    const allDocumentIds = [...personalIds, ...publicIds]
    const questionEmbedding = await embedder.embedQuery(question)

    const { data: matches, error: matchError } = await supabase.rpc('match_document_chunks', {
      query_embedding: questionEmbedding,
      match_count: 50,
      match_user_id: userId,
      filter_document_ids: allDocumentIds,
    })

    if (matchError) {
      console.error('❌ Error in match_document_chunks:', matchError)
      return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
    }

    // Agrupar chunks por documento
    const chunksByDoc: Record<string, string[]> = {}

    for (const match of matches || []) {
      if (!match.content) continue
      if (match.similarity_score !== undefined && match.similarity_score < SIMILARITY_THRESHOLD) continue

      const docId = match.document_id
      if (!chunksByDoc[docId]) chunksByDoc[docId] = []
      if (chunksByDoc[docId].length < MAX_CHUNKS_PER_DOCUMENT) {
        chunksByDoc[docId].push(match.content.trim())
      }
    }

    // 👉 Detectar intención del usuario
    const isPerDocumentQuestion = /cada documento|uno por uno|describ[íi]r?|por separado/i.test(question)

    const documentSections: string[] = []
    let totalTokens = 0

    for (const docId of allDocumentIds) {
      const title = titleMap[docId] || `Document ${docId}`
      const chunks = chunksByDoc[docId] ?? []

      const selectedChunks =
        chunks.length > 0
          ? chunks.slice(0, MAX_CHUNKS_PER_DOCUMENT)
          : [`(No relevant content found for this document)`]

      const sectionText = selectedChunks.map((c) => `> ${c.replace(/\n/g, '\n> ')}`).join('\n\n')
      const section = `### 📘 ${title}\n${sectionText}`
      const sectionTokens = estimateTokens(section)

      // Si no es consulta por documento, aplicar límite de tokens
      if (!isPerDocumentQuestion && totalTokens + sectionTokens > MAX_TOKENS_BUDGET) continue

      documentSections.push(section)
      totalTokens += sectionTokens
    }

    const systemPrompt = `
You are Monstia, an AI expert in environmental sustainability.

You help users explore and understand multiple documents. Use the sections below to answer:

- If the question is about *each document*, respond separately for each.
- If it's a general question, synthesize across all sources.
- Always quote and label documents clearly.

Use Markdown formatting: headings (###), quotes (>), bullet points, and bold text.
Be professional, accurate, and easy to read.
`

    const userPrompt = documentSections.length > 0
      ? `Here are the document excerpts:\n\n${documentSections.join('\n\n')}\n\nQuestion: ${question}`
      : `The user selected documents, but no content could be retrieved.\n\nQuestion: ${question}`

    const openaiStream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      stream: true,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    const encoder = new TextEncoder()
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    ;(async () => {
      for await (const chunk of openaiStream) {
        const content = chunk.choices?.[0]?.delta?.content
        if (content) await writer.write(encoder.encode(content))
      }
      await writer.close()
    })()

    console.log(`✅ Monstia response generated in ${(performance.now() - start).toFixed(1)}ms`)
    return new NextResponse(readable, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    console.error('🔥 Unhandled error in chat-document:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
