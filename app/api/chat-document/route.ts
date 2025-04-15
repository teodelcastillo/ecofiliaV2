import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OpenAIEmbeddings } from '@langchain/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const embedder = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
});

const MAX_TOKENS_BUDGET = 6000;
const SIMILARITY_THRESHOLD = 0.75; // adjustable

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

    let combinedText = '';
    let totalTokens = 0;
    const supabase = getSupabase();

    if (documents?.length > 0) {
      const documentIds = documents.map((doc: { id: string }) => doc.id);

      const { data: docMetadata, error: metaError } = await supabase
        .from('documents')
        .select('id, name')
        .in('id', documentIds);

      if (metaError || !docMetadata) {
        console.error('❌ Failed to fetch document titles:', metaError);
        return NextResponse.json({ error: 'Failed to fetch document titles' }, { status: 500 });
      }

      const titleMap: Record<string, string> = Object.fromEntries(
        docMetadata.map((doc: { id: string; name: string }) => [doc.id, doc.name])
      );

      const questionEmbedding = await embedder.embedQuery(question);

      const { data: matches, error: matchError } = await supabase.rpc('match_document_chunks', {
        query_embedding: questionEmbedding,
        match_count: 50, // get more to filter/diversify
        match_user_id: userId,
        filter_document_ids: documentIds,
      });

      if (matchError) {
        console.error('❌ match_document_chunks error:', matchError);
        return NextResponse.json({ error: 'Failed to match document chunks' }, { status: 500 });
      }

      // ✅ Filter by similarity score (you’ll need to return it from RPC)
      interface Match {
        document_id: string;
        content: string;
        similarity_score?: number;
        document_type?: string;
      }

      const filteredMatches: Match[] = matches?.filter(
        (m: Match) => m.similarity_score === undefined || m.similarity_score >= SIMILARITY_THRESHOLD
      ) ?? [];

      // ✅ Group by document
      const chunksByDoc: Record<string, any[]> = {};
      for (const match of filteredMatches) {
        if (!chunksByDoc[match.document_id]) chunksByDoc[match.document_id] = [];
        chunksByDoc[match.document_id].push(match);
      }

      // ✅ Interleave chunks from different documents (max 3 per doc)
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

      // ✅ Inject context up to token limit
      for (const match of flattenedChunks) {
        const chunkText = match.content?.trim();
        if (!chunkText) continue;

        const chunkTokens = estimateTokens(chunkText);
        if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET) break;

        const title = titleMap[match.document_id] || `Document ${match.document_id}`;
        combinedText += `\n### 📄 Source: *${title}* (${match.document_type})\n> ${chunkText.replace(/\n/g, '\n> ')}\n`;
        totalTokens += chunkTokens;
      }
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
