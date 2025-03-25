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

// Max token estimate → 128,000 tokens = ~500,000 characters (very rough estimate)
const MAX_TEXT_LENGTH = 100_000; // Safely under limit

export async function POST(req: NextRequest) {
  console.log('🚀 Received POST request at /api/chat/query');

  try {
    // Step 1: Parse request body
    const body = await req.json();
    console.log('🟢 Request body:', body);

    const { documents, question } = body;

    // Step 2: Early Validation Logs
    if (!documents || !Array.isArray(documents)) {
      console.error('❌ documents array is missing or invalid');
      return NextResponse.json({ error: 'No documents selected' }, { status: 400 });
    }

    if (documents.length === 0) {
      console.error('❌ No documents provided');
      return NextResponse.json({ error: 'No documents selected' }, { status: 400 });
    }

    if (!question || question.trim() === '') {
      console.error('❌ Question is empty');
      return NextResponse.json({ error: 'Question is empty' }, { status: 400 });
    }

    console.log(`🟢 Documents selected:`, documents);

    let combinedText = '';

    // Step 3: Fetch extracted_text from all selected documents
    for (const doc of documents) {
      if (!doc.id || !doc.type) {
        console.warn(`⚠️ Document missing id or type:`, doc);
        continue;
      }

      const table = doc.type === 'public' ? 'public_documents' : 'documents';

      console.log(`📄 Fetching extracted_text from table: ${table}, ID: ${doc.id}`);
      const { data, error } = await supabase
        .from(table)
        .select('extracted_text')
        .eq('id', doc.id)
        .single();

      if (error || !data) {
        console.error(`❌ Error fetching document ${doc.id}:`, error);
        continue;
      }

      if (!data.extracted_text || !data.extracted_text.trim()) {
        console.warn(`⚠️ Document ${doc.id} has empty extracted_text`);
        continue;
      }

      console.log(`✅ Fetched extracted_text length for ${doc.id}: ${data.extracted_text.length}`);
      combinedText += `\n--- Document ${doc.id} Content ---\n${data.extracted_text}\n`;
    }

    if (!combinedText.trim()) {
      console.warn('❌ Combined extracted text is empty after processing all documents!');
      return NextResponse.json({ error: 'No extracted text found for selected documents' }, { status: 400 });
    }

    // Step 4: Smart truncation
    if (combinedText.length > MAX_TEXT_LENGTH) {
      console.warn(`⚠️ Combined text too long (${combinedText.length} chars), truncating...`);
      combinedText = combinedText.slice(0, MAX_TEXT_LENGTH);
    }
    console.log(`🟢 Final combinedText length: ${combinedText.length}`);

    // Step 5: Prepare system prompt
    const systemPrompt = `You are an environmental report assistant. Use the following documents content to answer the user's question:\n\n${combinedText}\n\nQuestion: ${question}`;

    console.log(`🟢 Sending systemPrompt to OpenAI... Prompt length: ${systemPrompt.length}`);

    // Step 6: Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    const answer = completion.choices[0].message.content;
    console.log('✅ Generated OpenAI answer:', answer);

    // Step 7: Return response
    return NextResponse.json({ response: answer });

  } catch (err: any) {
    console.error('🔥 Unhandled server error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
