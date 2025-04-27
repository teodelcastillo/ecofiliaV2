import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { OpenAIEmbeddings } from '@langchain/openai';

// --- Configuración ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! });
const MAX_TOKENS_BUDGET = 40000; // 40k tokens para el modelo gpt-4.1-mini

// --- Utilidades ---
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PRIVATE_SERVICE_KEY!);
}

// --- API Handler ---
export async function POST(req: NextRequest) {
  const start = performance.now();

  try {
    // 1. Parsear y validar input
    const { documents, question, userId } = await req.json();
    if (!question?.trim() || !userId || !Array.isArray(documents)) {
      console.warn('⚠️ Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabase();
    const publicIds = documents.map(d => d.id);

    console.log('📄 Public document IDs:', publicIds);

    // 2. Embedding de la pregunta
    const questionEmbedding = await embedder.embedQuery(question);
    console.log('🔍 Question embedded.');

    // 3. Buscar chunks relevantes en smart_chunks
    const { data: matches, error: matchError } = await supabase.rpc('match_smart_chunks', {
      query_embedding: questionEmbedding,
      match_count: 100,
      filter_document_ids: publicIds,
    });

    if (matchError) {
      console.error('❌ match_smart_chunks failed:', matchError);
      return NextResponse.json({ error: 'Matching failed' }, { status: 500 });
    }

    if (!matches || matches.length === 0) {
      console.warn('⚠️ No matches returned');
    } else {
      console.log(`🔎 ${matches.length} match(es) found.`);
    }

    // 4. Organizar chunks por documento
    const chunksByDoc: Record<string, any[]> = {};
    for (const match of matches ?? []) {
      const docId = match.public_document_id;
      if (!chunksByDoc[docId]) chunksByDoc[docId] = [];
      chunksByDoc[docId].push(match);
    }

    // 5. Traer metadata de documentos para armar nombres amigables
    const [personalMeta, publicMeta] = await Promise.all([
      supabase.from('documents').select('id, name').in('id', []), // No personalIds
      supabase.from('public_documents').select('id, name').in('id', publicIds),
    ]);

    const titleMap: Record<string, string> = {
      ...Object.fromEntries((personalMeta.data || []).map((doc: any) => [doc.id, doc.name])),
      ...Object.fromEntries((publicMeta.data || []).map((doc: any) => [doc.id, doc.name])),
    };

    // 6. Seleccionar chunks garantizados y sobrantes
    const guaranteedChunks: any[] = [];

    for (const docId of publicIds) {
      const matchesForDoc = chunksByDoc[docId] ?? [];
      if (matchesForDoc.length > 0) {
        matchesForDoc.sort((a, b) => (b.similarity_score ?? 0) - (a.similarity_score ?? 0));
        guaranteedChunks.push(matchesForDoc[0]);
      }
    }

    const leftoverChunks = (matches ?? [])
      .filter((match: any) => !guaranteedChunks.includes(match))
      .sort((a: { similarity_score: any; }, b: { similarity_score: any; }) => (b.similarity_score ?? 0) - (a.similarity_score ?? 0));

// 7. Construir contexto para OpenAI
const documentSections: string[] = [];
let totalTokens = 0;

// --- (1) Agregar garantizados primero ---
for (const match of guaranteedChunks) {
  const chunkText = formatChunk(match);
  const chunkTokens = estimateTokens(chunkText);

  // Siempre agregar al menos un chunk por documento, aunque superemos el budget ligeramente
  if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET && documentSections.length > 0) {
    console.warn(`⚠️ Budget exceeded while adding guaranteed chunks.`);
    break;
  }

  const title = titleMap[match.public_document_id] || `Document ${match.public_document_id}`;
  const section = `### 📘 ${title}\n\n${chunkText}`;
  documentSections.push(section);
  totalTokens += chunkTokens;
}

// --- (2) Agregar sobrantes SOLO si queda espacio ---
for (const match of leftoverChunks) {
  const chunkText = formatChunk(match);
  const chunkTokens = estimateTokens(chunkText);

  if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET) {
    console.log(`⚠️ Token budget reached after adding extras.`);
    break;
  }

  const title = titleMap[match.public_document_id] || `Document ${match.public_document_id}`;
  const section = `### 📘 ${title}\n\n${chunkText}`;
  documentSections.push(section);
  totalTokens += chunkTokens;
}


// --- Construir el resumen dinámico dinámico mejorado ---

// Documentos incluidos realmente en el contexto
const documentsIncluded = guaranteedChunks.map(match => match.public_document_id);

// Documentos seleccionados que NO lograron tener chunks garantizados
const documentsMissing = publicIds.filter(id => !documentsIncluded.includes(id));

// Construir texto
const documentsCovered = documentsIncluded
  .map(id => titleMap[id] ? `✅ ${titleMap[id]}` : `✅ Document ${id}`)
  .join('\n');

const documentsOmitted = documentsMissing.length > 0
  ? documentsMissing
      .map(id => titleMap[id] ? `⚠️ ${titleMap[id]}` : `⚠️ Document ${id}`)
      .join('\n')
  : '';

const summaryBlock = `
**Summary:**
- Documents included:
${documentsCovered}
${documentsOmitted ? `\n- Documents NOT included (no excerpts found):\n${documentsOmitted}` : ''}
- Total excerpts used: ${documentSections.length}
- Total tokens consumed: ${totalTokens} / ${MAX_TOKENS_BUDGET}
`.trim();


    // --- Crear prompts para OpenAI ---
    const systemPrompt = `
You are Ecofilia, an AI expert in sustainability, climate change, and ESG frameworks.

You assist users by analyzing multiple documents at once.

When answering:
- Use the provided document sections carefully.
- Always clearly **cite** which document(s) your answer is based on.
- If the user asks for **each document separately**, answer **document by document**, clearly labeling each.
- If the user asks a **general question**, **synthesize** insights across documents.
- If relevant, **quote** key phrases or summaries from the documents.
- Prefer **detailed** and **comprehensive** answers over brief ones.

**Formatting Guidelines (Markdown):**
- Use \`###\` for main headings (e.g., per document or per topic).
- Use \`**bold**\` for document titles, section names, and important terms.
- Use \`> quotes\` to highlight relevant text excerpts from the documents.
- Use bullet points \`-\` for lists or multi-part answers.
- Structure your response into clear sections to maximize readability.

**Prioritize (in this order):**
1. Factual accuracy.
2. Clarity and structure.
3. Completeness and richness of information.
4. Professional and concise tone.

If you cannot find a direct answer from the documents, **say so clearly** and recommend next steps if possible.

Be accurate, well-organized, and professional, using clear language understandable by non-expert audiences.
`.trim();

    const userPrompt = documentSections.length > 0
      ? `
${summaryBlock}

The following are excerpts from selected documents:

${documentSections.join('\n\n')}

Please answer the following question based on the information above:

**Question:** ${question}
      `.trim()
      : `
The user selected documents, but no relevant excerpts were found.

Please still try to answer the following question if possible:

**Question:** ${question}
      `.trim();

    // --- Llamar a OpenAI ---
    console.log('🧠 Calling OpenAI...');

    const openaiStream = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      stream: true,
      max_tokens: 16384,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    // --- Responder como Stream ---
    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    ;(async () => {
      for await (const chunk of openaiStream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) await writer.write(encoder.encode(content));
      }
      await writer.close();
    })();

    console.log(`✅ Response generated in ${(performance.now() - start).toFixed(1)}ms`);

    return new NextResponse(readable, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (err) {
    console.error('🔥 Unhandled error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

// --- Helper para formatear cada chunk ---
function formatChunk(match: any): string {
  const parts = [];

  if (match.title) {
    parts.push(`**${match.title.trim()}**`);
  }

  if (match.summary) {
    parts.push(`_${match.summary.trim()}_`);
  }

  if (Array.isArray(match.keywords) && match.keywords.length > 0) {
    parts.push(`**Keywords:** ${match.keywords.join(', ')}`);
  }

  if (match.content) {
    const quotedContent = match.content
      .trim()
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .map((line: any) => `> ${line}`)
      .join('\n');
    parts.push(quotedContent);
  }

  if (parts.length === 0) {
    parts.push(`_(No relevant content found in this section)_`);
  }

  return parts.join('\n\n');
}