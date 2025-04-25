import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { OpenAIEmbeddings } from '@langchain/openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! })

const MAX_TOKENS_BUDGET = 6000
const DEFAULT_CHUNKS_PER_DOCUMENT = 3

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
      console.warn('⚠️ Missing required fields:', { question, userId, documents })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabase()

    const personalIds = documents.filter(d => d.type === 'user').map(d => d.id)
    const publicIds = documents.filter(d => d.type === 'public').map(d => d.id)
    const allDocumentIds = [...personalIds, ...publicIds]

    console.log('📄 Selected document IDs:', allDocumentIds)

    const [personalMeta, publicMeta] = await Promise.all([
      supabase.from('documents').select('id, name').in('id', personalIds),
      supabase.from('public_documents').select('id, name').in('id', publicIds),
    ])

    if (personalMeta.error || publicMeta.error) {
      console.error('❌ Metadata fetch failed:', personalMeta.error, publicMeta.error)
      return NextResponse.json({ error: 'Metadata fetch failed' }, { status: 500 })
    }

    const titleMap: Record<string, string> = {
      ...Object.fromEntries((personalMeta.data || []).map((doc: any) => [doc.id, doc.name])),
      ...Object.fromEntries((publicMeta.data || []).map((doc: any) => [doc.id, doc.name])),
    }

    const questionEmbedding = await embedder.embedQuery(question)
    console.log('🔍 Generated embedding for question.')

    const { data: matches, error: matchError } = await supabase.rpc('match_document_chunks', {
      query_embedding: questionEmbedding,
      match_count: 100,
      filter_document_ids: allDocumentIds,
    })

    if (matchError) {
      console.error('❌ match_document_chunks failed:', matchError)
      return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
    }

    if (!matches || matches.length === 0) {
      console.warn('⚠️ No matches returned from match_document_chunks')
    } else {
      console.log(`🔎 ${matches.length} match(es) returned.`)
    }

    const isPerDocumentQuestion = /cada documento|uno por uno|describ[íi]r?|por separado/i.test(question)

    const chunksByDoc: Record<string, any[]> = {}
    for (const match of matches || []) {
      const docId = match.document_id
      if (!chunksByDoc[docId]) chunksByDoc[docId] = []
      chunksByDoc[docId].push(match)
    }

    const documentSections: string[] = []
    let totalTokens = 0

    const isManyDocuments = allDocumentIds.length > 1
    const chunksPerDoc = isManyDocuments ? 1 : DEFAULT_CHUNKS_PER_DOCUMENT

    for (const docId of allDocumentIds) {
      const title = titleMap[docId] || `Document ${docId}`
      const matchesForDoc = chunksByDoc[docId] ?? []

      // Ordenar por mejor score
      matchesForDoc.sort((a, b) => (b.similarity_score ?? 0) - (a.similarity_score ?? 0))

      const selectedMatches = matchesForDoc.slice(0, chunksPerDoc)

      const selectedChunks = selectedMatches.length > 0
        ? selectedMatches.map((match: any) => {
            const enriched = [
              match.title && `**${match.title}**`,
              match.summary && `_${match.summary}_`,
              match.keywords && `**Keywords:** ${match.keywords}`,
              match.content && `> ${match.content.trim().replace(/\n/g, '\n> ')}`
            ].filter(Boolean).join('\n\n')
            return enriched
          })
        : [`_(No relevant content found for this document)_`]

      const sectionText = selectedChunks.map(c => `> ${c.replace(/\n/g, '\n> ')}`).join('\n\n')
      const section = `### 📘 ${title}\n${sectionText}`
      const sectionTokens = estimateTokens(section)

      if (!isPerDocumentQuestion && totalTokens + sectionTokens > MAX_TOKENS_BUDGET) {
        console.log(`⚠️ Skipping section for ${docId} due to token budget`)
        continue
      }

      documentSections.push(section)
      totalTokens += sectionTokens
    }

    const systemPrompt = `
      You are Ecofilia, an AI expert in environmental sustainability.

      You help users explore and understand multiple documents. Use the sections below to answer:

      - If the question is about *each document*, respond separately for each.
      - If it's a general question, synthesize across all sources.
      - Always quote and label documents clearly.

      Use Markdown formatting: headings (###), quotes (>), bullet points, and bold text.
      Be professional, accurate, and easy to read.
    `.trim()

    const userPrompt = documentSections.length > 0
      ? `Here are the document excerpts:\n\n${documentSections.join('\n\n')}\n\nQuestion: ${question}`
      : `The user selected documents, but no content could be retrieved.\n\nQuestion: ${question}`

    console.log('🧠 Calling OpenAI with final prompt...')
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
