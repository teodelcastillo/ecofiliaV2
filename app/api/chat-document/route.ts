import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai'; // ✅ FIXED

// 🔑 Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

// 🔑 Initialize OpenAI Client (v4+ syntax)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  console.log('Received POST request at /api/chat-document');

  try {
    // 🟢 Step 1: Parse request body
    const body = await req.json();
    console.log('Request body:', body);

    const { documentId, question } = body;
    if (!documentId || !question) {
      console.error('Missing documentId or question');
      return NextResponse.json({ error: 'Missing documentId or question' }, { status: 400 });
    }
    console.log(`Received documentId: ${documentId}`);
    console.log(`Received question: ${question}`);

    // 🟢 Step 2: Fetch extracted text from Supabase
    console.log('Fetching extracted text from Supabase...');
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('extracted_text')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      console.error('Error fetching document:', docError);
      return NextResponse.json({ error: 'Document not found or no extracted text' }, { status: 404 });
    }
    console.log('Successfully fetched document:', doc);

    if (!doc.extracted_text) {
      console.warn('Extracted text is empty!');
      return NextResponse.json({ error: 'No extracted text available' }, { status: 400 });
    }

    // 🟢 Step 3: Prepare system prompt
    console.log('Preparing system prompt for OpenAI...');
    const systemPrompt = `You are an environmental report assistant. Use the following document content to answer the user's question:\n\n${doc.extracted_text}\n\nQuestion: ${question}`;

    // 🟢 Step 4: Call OpenAI API
    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    console.log('Received response from OpenAI:', completion);

    const answer = completion.choices[0].message.content;
    console.log('Generated answer:', answer);

    // 🟢 Step 5: Return response
    return NextResponse.json({ answer });

  } catch (err: any) {
    console.error('Unhandled server error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
