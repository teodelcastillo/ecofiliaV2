import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const MAX_TOTAL_CHARS = 115_000;
const MAX_PER_DOC_CHARS = 30_000;

export async function POST(req: NextRequest) {
  console.log('🚀 POST /api/chat/query');

  try {
    const body = await req.json();
    const { documents, question } = body;

    if (!documents?.length || !question?.trim()) {
      return NextResponse.json({ error: 'Missing question or documents' }, { status: 400 });
    }

    let combinedText = '';

    for (const doc of documents) {
      if (!doc.id || !doc.type) {
        console.warn(`⚠️ Skipping doc with missing id/type`, doc);
        continue;
      }

      const table = doc.type === 'public' ? 'public_documents' : 'documents';
      const { data, error } = await supabase
        .from(table)
        .select('extracted_text')
        .eq('id', doc.id)
        .single();

      if (error || !data?.extracted_text?.trim()) {
        console.warn(`⚠️ Skipping doc ${doc.id}: empty or fetch error`, error);
        continue;
      }

      let text = data.extracted_text.trim();

      if (text.length > MAX_PER_DOC_CHARS) {
        console.warn(`✂️ Truncating doc ${doc.id} from ${text.length} to ${MAX_PER_DOC_CHARS}`);
        text = text.slice(0, MAX_PER_DOC_CHARS);
      }

      combinedText += `\n--- Document ${doc.id} Content ---\n${text}\n`;
    }

    if (!combinedText.trim()) {
      return NextResponse.json({ error: 'No usable text from documents' }, { status: 400 });
    }

    if (combinedText.length > MAX_TOTAL_CHARS) {
      console.error("❌ Combined text still too large, even after slicing. Aborting.");
      return NextResponse.json({
        error: 'Selected documents are too long. Try fewer or smaller documents.',
      }, { status: 400 });
    }

    const systemPrompt = `You are an expert assistant in environmental issues. Respond clearly, completely, and professionally. Always explain the reasoning behind your answer, and if appropriate, include examples or calculations. Use the following documents to answer the user's question:\n\n${combinedText}\n\nQuestion: ${question}`;

    console.log(`🧠 Prompt length: ${systemPrompt.length} chars`);

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
