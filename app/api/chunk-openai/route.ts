// /api/chunk-openai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const CHUNKS_PER_CALL = 3;
const CHUNK_SIZE = 1000;

export async function POST(req: NextRequest) {
  const { documentId } = await req.json();
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });

  try {
    const { data: doc, error: docErr } = await supabase
      .from('documents')
      .select('extracted_text, chunking_offset')
      .eq('id', documentId)
      .single();

    if (docErr || !doc?.extracted_text) throw new Error('Document or text not found');

    const fullText = doc.extracted_text;
    const offset = doc.chunking_offset ?? 0;

    const blocks = splitTextIntoChunks(fullText, CHUNK_SIZE);
    const remaining = blocks.slice(offset, offset + CHUNKS_PER_CALL);

    if (remaining.length === 0) {
      await supabase.from('documents').update({
        chunking_done: true,
        chunking_status: 'done',
      }).eq('id', documentId);
      return NextResponse.json({ message: 'Chunking complete' });
    }

    const enrichedChunks = await Promise.all(
      remaining.map((content, i) => enrichChunkWithOpenAI(content, offset + i))
    );

    const inserts = enrichedChunks.map((chunk) => ({
      document_id: documentId,
      ...chunk,
    }));

    const { error: insertErr } = await supabase
      .from('document_chunks')
      .insert(inserts);

      if (insertErr) {
        console.error("❌ Insert error:", insertErr);
        console.log("📦 Inserts preview:", JSON.stringify(inserts, null, 2));
        throw new Error("Failed to insert chunks");
      }
      
    const newOffset = offset + remaining.length;
    const chunkingDone = newOffset >= blocks.length;

    await supabase.from('documents').update({
      chunking_offset: newOffset,
      chunking_done: chunkingDone,
      chunking_status: chunkingDone ? 'done' : 'in_progress',
    }).eq('id', documentId);

    return NextResponse.json({ message: 'Chunks processed', done: chunkingDone });
  } catch (err: any) {
    console.error('Chunking error:', err);
    await supabase.from('documents').update({ chunking_status: 'failed' }).eq('id', documentId);
    return NextResponse.json({ error: err.message || 'Chunking failed' }, { status: 500 });
  }
}

function splitTextIntoChunks(text: string, size: number): string[] {
  const result = [];
  for (let i = 0; i < text.length; i += size) {
    result.push(text.slice(i, i + size));
  }
  return result;
}

async function enrichChunkWithOpenAI(content: string, index: number) {
  const prompt = `For the following text, return a JSON with:\n- title (if identifiable)\n- summary (1-2 sentences)\n- keywords (max 5)\n- token_count estimate\n\nText:\n${content}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: 'You are a document analyst.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  });

  const raw = completion.choices[0].message.content?.trim() || '{}';
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const json = JSON.parse(cleaned);

  return {
    chunk_index: index,
    content,
    title: json.title || null,
    summary: json.summary || null,
    keywords: json.keywords || null,
    token_count: json.token_count || Math.ceil(content.length / 4),
  };
}