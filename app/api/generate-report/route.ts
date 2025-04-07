import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"


const supabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY })

const MAX_TOKENS_BUDGET = 6000
const ALLOWED_REPORT_TYPES = ['overview', 'inputs', 'sustainability'] as const
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
      system: `You are a senior development project analyst working for a multilateral development bank. Your task is to write a formal and structured Project Overview report, aligned with international development and climate finance standards.`,
      user: `
    Using the following extracted content from project documents:\n\n{content}\n\n
    
    Generate a report titled: "Project Overview".
    
    Structure the report with the following sections:
    
    1. **Project Title**
       - Name of the operation and a clear identification of the project.
    
    2. **Project Summary**
       - Describe the purpose of the project, key implementing institutions (e.g., IDB, local governments), and financing structure.
       - Include modality (e.g., Multiple Works), total budget, and breakdown of international and local contributions.
    
    3. **Objectives**
       - Describe the general development objective of the project.
       - List specific objectives, using bullet points where needed:
         - e.g., improving housing, mobility, urban infrastructure, environmental quality, and institutional capacity.
    
    4. **Climate and Sustainability**
       - Clearly state the operation’s alignment with the **Paris Agreement** (mitigation and adaptation).
       - Mention climate strategies integrated into the project design:
         - Public transport prioritization
         - Sustainable mobility (cycling, pedestrian infrastructure)
         - Nature-based solutions and resilience measures
       - Include Climate Finance eligibility (% if possible), with justification.
       - Include Green Finance eligibility, mentioning biodiversity, pollution reduction, or disaster risk management components.
    
    5. **Expected Impacts**
       - Provide a concise bullet-point list of measurable impacts:
         - e.g., number of families benefiting, reduced emissions, improved infrastructure, economic benefits.
    
    Use a formal tone, clear headers, and concise professional language suitable for inclusion in IDB or donor-facing documentation. Avoid excessive verbosity. Keep the format clean, and ensure consistency with sustainability-aligned reporting practices.
    
    Close with a concluding statement summarizing the transformative potential of the project in its urban, environmental, and institutional dimensions.
    `,
    }
,    
    inputs: {
      system: `Act as a senior climate and urban development expert. Your role is to write detailed annex content for a Climate Change and Sustainability Report.`,
      user: `
        Using the following project documents and extracted content:\n\n{content}\n\n
        
        Write a report titled: "Inputs for Climate Change and Sustainability Annex". 
        The report must include:
        
        1. A disclaimer paragraph clarifying the illustrative purpose of the document and Ecofilia's role.
        2. Project Title and Operation Number
        3. Project Summary (purpose, location, budget, financiers)
        4. Detailed sections with numbered headings:
          1. Introduction to climate change and sustainability aspects in the context of the operation
            - Climate Change Context in Brazil
            - Local Climate Change Challenges
            - Proposed project approach for climate integration
          2. Climate Change Adaptation
            - Alignment with NDC and National Adaptation Plan
            - Vulnerability context (climate hazards, exposure, vulnerability)
            - Application of Standard 4 of the ESPF
            - Conclusion of alignment with the adaptation goal of the Paris Agreement
          3. Climate Change Mitigation
            - Compatibility with NDC mitigation goals
            - GHG emission context and mitigation contributions
            - Classification of activities
            - Specific assessment of alignment with PA mitigation objective
            - Conclusion
          4. Climate Finance Approach
            - Mitigation finance eligible measures
            - Adaptation finance eligible measures
          5. Green Finance Approach
            - Urban biodiversity and environmental strategies
            - Circular economy and sustainable urban planning
        
        The output should be formal, technical, and structured. Format sections with clear headers and avoid bullet points unless necessary. Use bold or ALL CAPS for section titles if needed.
        
        Important: This report is not official nor final. It is intended to illustrate how Ecofilia can support sustainability screenings and reporting.
        
        End with a clear and concise conclusion.
        `,
    },
    
    sustainability: {
      system: `You are a sustainability and climate finance analyst specialized in multilateral development bank (MDB) criteria. Your task is to generate a Climate Change and Sustainability Filter report aligned with the IDB's Paris Agreement Assessment methodology.`,
      user: `
    Use the following project documents and extracted information:\n\n{content}\n\n
    
    Generate a report titled: "Climate Change and Sustainability Filter".
    
    The report must include the following structured sections:
    
    1. **Disclaimer**
       - State that the document is illustrative, based on project data, and not a formal assessment or financial advice.
       - Mention Ecofilia's role as a support platform for sustainability screenings.
    
    2. **Project Identification**
       - Title and number of the operation
       - Team leader (if applicable)
       - Investment lending category (choose from: Investment Loan / Policy-Based Loan / Results-Based Loan / GOM - Multiple Works)
    
    3. **Universally Aligned Activities**
       - List and justify activities that fall under the "universally aligned" categories according to MDB/IDB alignment guidance.
       - Use categories such as AGRICULTURE, TRANSPORT, BUILDINGS, TECHNOLOGY, SERVICES.
       - If any category marked with an asterisk (*), include justification based on IDB guidance.
    
    4. **Activities Requiring Specific Alignment Assessment**
       - Identify activities not automatically aligned that require further justification (e.g., road expansion).
       - List them and explain alignment risks and mitigation strategies.
    
    5. **Paris Agreement Alignment Strategy**
       - For each non-automatically aligned activity, outline recommendations or project features that support alignment.
       - Include examples such as public transport prioritization, sustainable urban mobility plans, decarbonization roadmaps.
    
    6. **Climate Finance Potential**
       - Indicate whether the operation includes climate finance-eligible components.
       - Justify based on MDB methodology (e.g., BRT studies, energy-efficient housing, reforestation, NbS).
    
    7. **Green Finance Potential**
       - Assess whether the project contributes to green finance eligibility.
       - Include urban biodiversity, NbS, pollution reduction, environmental governance, and institutional capacity.
    
    End the report with a **clear and neutral tone**, using structured formatting and professional language suitable for review by IDB, development banks, or climate finance institutions.
    
    Format the report using numbered sections, avoid excessive use of bullet points, and maintain formal tone throughout.
    `,
    }
    
  }

  return promptTemplates[reportType]
}

// Helper to create a .docx buffer
export async function generateDocxFromText(text: string): Promise<Uint8Array> {
  const lines = text.split("\n").filter(line => line.trim() !== "")
  const paragraphs: Paragraph[] = []

  for (const line of lines) {
    if (line.startsWith("# ")) {
      // H1
      paragraphs.push(
        new Paragraph({
          text: line.replace("# ", "").trim(),
          heading: HeadingLevel.HEADING_1,
        })
      )
    } else if (line.startsWith("## ")) {
      // H2
      paragraphs.push(
        new Paragraph({
          text: line.replace("## ", "").trim(),
          heading: HeadingLevel.HEADING_2,
        })
      )
    } else if (line.startsWith("### ")) {
      // H3
      paragraphs.push(
        new Paragraph({
          text: line.replace("### ", "").trim(),
          heading: HeadingLevel.HEADING_3,
        })
      )
    } else if (line.startsWith("**") && line.endsWith("**")) {
      // Bold full line
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.replace(/\*\*/g, "").trim(),
              bold: true,
            }),
          ],
        })
      )
    } else {
      // Normal paragraph
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(line.trim())],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }, // ~1.5 line space
        })
      )
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  })

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
