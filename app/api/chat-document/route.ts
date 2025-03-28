import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { OpenAIEmbeddings } from "@langchain/openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

const MAX_TOTAL_CHARS = 115_000;

export async function POST(req: NextRequest) {
  console.log('🚀 POST /api/chat/query');

  try {
    const body = await req.json();
    const { documents, question, userId } = body;

    if (!documents?.length || !question?.trim() || !userId) {
      return NextResponse.json({ error: 'Missing question, documents, or userId' }, { status: 400 });
    }

    const documentIds = documents.map((doc: { id: string }) => doc.id);

    // 🔹 Embed the user question
    const questionEmbedding = await embedder.embedQuery(question);

    // 🔹 Retrieve all matching chunks via vector search (limited to selected docs)
    const { data: matches, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: questionEmbedding,
      match_count: 15,
      match_user_id: userId,
      filter_document_ids: documentIds,
    });

    if (error) {
      console.error('❌ match_document_chunks error:', error);
      return NextResponse.json({ error: 'Failed to match document chunks' }, { status: 500 });
    }

    if (!matches?.length) {
      return NextResponse.json({ error: 'No relevant content found in selected documents' }, { status: 400 });
    }

    // 🔹 Build the context string
    let combinedText = '';
    for (const match of matches) {
      const chunkText = match.content?.trim();
      if (!chunkText) continue;

      if ((combinedText + chunkText).length > MAX_TOTAL_CHARS) break;
      combinedText += `\n--- Chunk from document ${match.document_id} (${match.document_type}) ---\n${chunkText}\n`;
    }

    if (!combinedText.trim()) {
      return NextResponse.json({ error: 'No usable content from matched chunks' }, { status: 400 });
    }

    const systemPrompt = `You are an expert assistant in environmental issues. Respond clearly, completely, and professionally. Always explain the reasoning behind your answer, and if appropriate, include examples or calculations. Use the following retrieved chunks to answer the user's question:\n\n${combinedText}\n\nQuestion: ${question}`;

    console.log(`🧠 Prompt length: ${systemPrompt.length} chars`);

    // 🔹 Generate answer with OpenAI
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      });
    } catch (apiErr) {
      console.error("❌ OpenAI API error:", apiErr);
      return NextResponse.json({ error: 'OpenAI failed to generate a response' }, { status: 500 });
    }

    const answer = completion.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return NextResponse.json({ error: 'No answer returned from OpenAI' }, { status: 500 });
    }

    return NextResponse.json({ response: answer });

  } catch (err) {
    console.error("🔥 Unhandled server error:", err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
