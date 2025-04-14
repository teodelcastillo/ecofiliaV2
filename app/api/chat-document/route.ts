import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { OpenAIEmbeddings } from '@langchain/openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

const MAX_TOKENS_BUDGET = 6000;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4); // Rough estimate
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documents, question, userId } = body;

    // ✅ Allow empty documents, but require question and userId
    if (!question?.trim() || !userId) {
      return NextResponse.json({ error: 'Missing question or userId' }, { status: 400 });
    }

    let combinedText = '';
    let totalTokens = 0;

    // ✅ If documents were selected, run embedding + match
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

      const titleMap = Object.fromEntries(docMetadata.map(doc => [doc.id, doc.name]));

      const questionEmbedding = await embedder.embedQuery(question);

      const { data: matches, error } = await supabase.rpc('match_document_chunks', {
        query_embedding: questionEmbedding,
        match_count: 20,
        match_user_id: userId,
        filter_document_ids: documentIds,
      });

      if (error) {
        console.error('❌ match_document_chunks error:', error);
        return NextResponse.json({ error: 'Failed to match document chunks' }, { status: 500 });
      }

      for (const match of matches || []) {
        const chunkText = match.content?.trim();
        if (!chunkText) continue;

        const chunkTokens = estimateTokens(chunkText);
        if (totalTokens + chunkTokens > MAX_TOKENS_BUDGET) break;

        const title = titleMap[match.document_id] || `Document ${match.document_id}`;
        combinedText += `\n--- Document: ${title} (${match.document_type}) ---\n${chunkText}\n`;
        totalTokens += chunkTokens;
      }
    }

    // ✅ Prompt logic — document-aware if we have context, else general answer
    const systemPrompt = `
You are an expert assistant in environmental issues. Your goal is to help the user understand sustainability-related topics in a clean, organized, and professional manner.

Please follow this formatting style using Markdown:
- Use **titles** and **subheadings** with \`###\` or \`####\`.
- Use **bullet points** or **numbered lists** when listing items or sections.
- Bold important keywords and section headers using \`**\`.
- Add a blank line between paragraphs for clarity.
- Avoid repeating the document title excessively.
`;

    const userPrompt = combinedText
      ? `Answer the following question using only the provided excerpts:\n${combinedText}\n\nQuestion: ${question}`
      : `The user did not select any documents. Answer this question to the best of your sustainability and environmental knowledge.\n\nQuestion: ${question}`;

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

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of openaiStream) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
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
