import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OpenAIEmbeddings } from '@langchain/openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! });

const MAX_TOKENS_BUDGET = 6000;
const SIMILARITY_THRESHOLD = 0.75;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

const getSupabase = () => {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PRIVATE_SERVICE_KEY!
  );
};

export async function POST(req: NextRequest) {
  const start = performance.now();

  try {
    const body = await req.json();
    const { documents, question, userId } = body;

    if (!question?.trim() || !userId) {
      return NextResponse.json({ error: 'Missing question or userId' }, { status: 400 });
    }

    if (!Array.isArray(documents) || documents.some((d) => !d.id || !d.type)) {
      return NextResponse.json({ error: 'Each document must include id and type' }, { status: 400 });
    }

    const supabase = getSupabase();
    let combinedText = '';
    let totalTokens = 0;

    const personalIds = documents.filter((d) => d.type === 'user').map((d) => d.id);
    const publicIds = documents.filter((d) => d.type === 'public').map((d) => d.id);

    // Get metadata from both tables
    const [personalMeta, publicMeta] = await Promise.all([
      supabase.from('documents').select('id, name').in('id', personalIds),
      supabase.from('public_documents').select('id, name').in('id', publicIds),
    ]);

    if (personalMeta.error || publicMeta.error) {
      console.error('❌ Metadata errors:', personalMeta.error, publicMeta.error);
      return NextResponse.json({ error: 'Error fetching document metadata' }, { status: 500 });
    }

    const titleMap: Record<string, string> = {
      ...Object.fromEntries((personalMeta.data || []).map((doc: { id: any; name: any; }) => [doc.id, doc.name])),
      ...Object.fromEntries((publicMeta.data || []).map((doc: { id: any; name: any; }) => [doc.id, doc.name])),
    };

    const allIds = [...personalIds, ...publicIds];
    const questionEmbedding = await embedder.embedQuery(question);

    const { data: matches, error: matchError } = await supabase.rpc('match_document_chunks', {
      query_embedding: questionEmbedding,
      match_count: 50,
      match_user_id: userId,
      filter_document_ids: allIds,
    });

    if (matchError) {
      console.error('❌ match_document_chunks error:', matchError);
      return NextResponse.json({ error: 'Failed to match document chunks' }, { status: 500 });
    }

    // Filter and group chunks
    const filteredMatches = (matches ?? []).filter(
      (m: { similarity_score: number | undefined; }) => m.similarity_score === undefined || m.similarity_score >= SIMILARITY_THRESHOLD
    );

    const chunksByDoc: Record<string, any[]> = {};
    for (const match of filteredMatches) {
      if (!chunksByDoc[match.document_id]) chunksByDoc[match.document_id] = [];
      chunksByDoc[match.document_id].push(match);
    }

    // Interleave chunks (max 3 per doc, then cycle through again)
    const flattenedChunks: any[] = [];
    let done = false;
    let index = 0;
    while (!done) {
      done = true;
      for (const docId of Object.keys(chunksByDoc)) {
        const chunk = chunksByDoc[docId][index];
        if (chunk) {
          flattenedChunks.push(chunk);
          done = false;
        }
      }
      index++;
    }

    // Build combined text up to token budget
    for (const match of flattenedChunks) {
      const chunkText = match.content?.trim();
      if (!chunkText) continue;

      const chunkTokens = estimateTokens(chunkText);
      if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET) break;

      const title = titleMap[match.document_id] || `Document ${match.document_id}`;
      const docTypeLabel = match.document_type === 'public' ? '🌐 Public' : '🔒 Private';

      combinedText += `\n### 📄 Source: *${title}* (${docTypeLabel})\n> ${chunkText.replace(/\n/g, '\n> ')}\n`;
      totalTokens += chunkTokens;
    }

    const systemPrompt = `
You are **Monstia**, an AI expert in environmental sustainability. 
Your mission is to help users by referencing the provided documents in a clear, structured, and friendly manner.

When answering:
- Always indicate which document you're referring to (by name or title).
- Use **Markdown formatting**:
  - \`###\` and \`####\` for headings
  - Bullet points or numbered lists
  - \`**\` for bold concepts
  - Use \`> quotes\` to reference document excerpts
- Separate paragraphs with a blank line.

Be professional, friendly, and insightful. If no documents are given, answer based on your sustainability expertise.
`;

    const userPrompt = combinedText
      ? `Here are excerpts from selected documents. Use them to answer clearly, always referencing the sources.\n\n${combinedText}\n\nQuestion: ${question}`
      : `The user did not select any documents. Answer this question based on your knowledge of sustainability and climate change.\n\nQuestion: ${question}`;

    const openaiStream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      stream: true,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      for await (const chunk of openaiStream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) await writer.write(encoder.encode(content));
      }
      await writer.close();
    })();

    console.log(`⏱️ Monstia response generated in ${(performance.now() - start).toFixed(1)}ms`);

    return new NextResponse(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (err) {
    console.error('🔥 Unhandled server error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
