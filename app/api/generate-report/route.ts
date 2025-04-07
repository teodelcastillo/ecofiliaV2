import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Document, Packer, Paragraph, TextRun } from 'docx'

const supabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY })

const MAX_TOKENS_BUDGET = 6000
const ALLOWED_REPORT_TYPES = ['overview', 'inputs', 'filter'] as const
type ReportType = (typeof ALLOWED_REPORT_TYPES)[number]

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function truncateToTokenLimit(text: string, maxTokens: number): string {
  const tokens = text.split(/\s+/)
  return tokens.slice(0, maxTokens).join(' ')
}

function generatePrompt(reportType: ReportType, content: string) {
  const promptTemplates: Record<ReportType, { system: string; user: string }> = {
    overview: {
      system: `You are a project development analyst. Your task is to write a professional and structured Project Overview report.`,
      user: `Use the following project-related content:\n\n${content}\n\nStructure the report with:\n1. Project name, context, and stakeholders\n2. Budget and financial plan\n3. General and specific objectives\n4. Climate and sustainability alignment\n5. Expected impact and key indicators (KPIs)\n6. Green finance justification\n7. Paris Agreement compliance summary.`,
    },
    inputs: {
      system: `Act as a climate and urban development expert. Write an Annex with inputs for a Climate Change and Sustainability report.`,
      user: `Using the following documents:\n\n${content}\n\nWrite a detailed input annex including:\n1. Climate change context in Brazil and the region\n2. Adaptation and mitigation challenges\n3. Project approach (housing, mobility, green infra, governance)\n4. Green finance strategy and NDC justification.`,
    },
    filter: {
      system: `Act as a sustainability analyst specialized in climate-aligned project evaluation. Generate a Climate Change and Sustainability Filter report.`,
      user: `Generate a Sustainability Filter Report including:\n1. Project title and summary\n2. Mitigation and adaptation analysis\n3. Paris Agreement alignment\n4. Green finance eligibility\n5. Final sustainability remarks\n\nContent:\n\n${content}`,
    },
  }

  return promptTemplates[reportType]
}

// Helper to create a .docx buffer
async function generateDocxFromText(text: string): Promise<Uint8Array> {
  const paragraphs = text.split('\n').map(line =>
    new Paragraph({
      children: [new TextRun(line)],
    })
  )

  const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] })
  const buffer = await Packer.toBuffer(doc)
  return buffer
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectId, reportType }: { projectId?: string; reportType?: string } = body

    if (!projectId || !reportType || !ALLOWED_REPORT_TYPES.includes(reportType as ReportType)) {
      return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 })
    }

    // Fetch document IDs linked to the project
    const { data: projectDocs, error: docsError } = await supabase
      .from('project_documents')
      .select('document_id, public_document_id')
      .eq('project_id', projectId)

    if (docsError || !projectDocs?.length) {
      return NextResponse.json({ error: 'Failed to fetch project documents' }, { status: 500 })
    }

    const documentIds = projectDocs
      .map((d) => d.document_id || d.public_document_id)
      .filter(Boolean)

    // Use a union RPC to fetch metadata from both documents & public_documents
    const { data: docMetadata, error: metaError } = await supabase
      .rpc('fetch_documents_metadata', { doc_ids: documentIds })

    if (metaError || !docMetadata?.length) {
      return NextResponse.json({ error: 'Failed to fetch document metadata' }, { status: 500 })
    }

    const titleMap = Object.fromEntries(docMetadata.map((doc: any) => [doc.id, doc.name]))

    const questionEmbedding = await embedder.embedQuery('Generate report content')

    const { data: matches, error: matchError } = await supabase.rpc('match_document_chunks', {
      query_embedding: questionEmbedding,
      match_count: 60,
      filter_document_ids: documentIds,
      match_user_id: null,
    })

    if (matchError || !matches?.length) {
      return NextResponse.json({ error: 'No relevant content found' }, { status: 400 })
    }

    const groupedText: Record<string, string[]> = {}
    let totalTokens = 0

    for (const match of matches) {
      const text = match.content?.trim()
      if (!text) continue

      const tokenCount = estimateTokens(text)
      if (totalTokens + tokenCount > MAX_TOKENS_BUDGET) break

      const docId = match.document_id
      if (!groupedText[docId]) groupedText[docId] = []
      groupedText[docId].push(text)
      totalTokens += tokenCount
    }

    let combinedText = ''
    for (const [docId, chunks] of Object.entries(groupedText)) {
      const title = titleMap[docId] || `Document ${docId}`
      combinedText += `\n--- Document: ${title} ---\n${chunks.join('\n\n')}\n`
    }

    const safeText = truncateToTokenLimit(combinedText, MAX_TOKENS_BUDGET)
    const prompt = generatePrompt(reportType as ReportType, safeText)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
      temperature: 0.7,
    })

    const report = completion.choices?.[0]?.message?.content?.trim()

    if (!report) {
      return NextResponse.json({ error: 'OpenAI returned no content' }, { status: 500 })
    }

    // 1. Generate .docx buffer
    const docBuffer = await generateDocxFromText(report)

    // 2. Upload to Supabase Storage
    const filename = `${reportType}-report-${Date.now()}.docx`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("project-reports") // ✅ crea este bucket en Supabase
      .upload(`${projectId}/${filename}`, docBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        upsert: true,
      })

    if (uploadError) {
      console.error("❌ Failed to upload docx:", uploadError)
      return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
    }

    // 3. Get public URL
    const { data: publicUrl } = supabase.storage
      .from("project-reports")
      .getPublicUrl(`${projectId}/${filename}`)

    // 4. Save metadata to project_reports table
    const { error: insertError } = await supabase.from('project_reports').insert({
      project_id: projectId,
      type: reportType,
      file_url: publicUrl.publicUrl,
    })

    if (insertError) {
      console.error('❌ Failed to save metadata:', insertError)
      return NextResponse.json({ error: 'Failed to save report metadata' }, { status: 500 })
    }

    return NextResponse.json({ file_url: publicUrl.publicUrl })
  } catch (err) {
    console.error('❌ Report generation error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
