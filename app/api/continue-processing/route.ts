// /api/continue-processing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 1. Buscar documentos con chunking pendiente
    const { data: docs, error } = await supabase
      .from('documents')
      .select('id, chunking_done')
      .eq('chunking_done', false)
      .order('created_at', { ascending: true })
      .limit(1); // procesar de a uno

    if (error || !docs || docs.length === 0) {
      return NextResponse.json({ message: 'No documents to process' }, { status: 200 });
    }

    const documentId = docs[0].id;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/chunk-openai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId }),
    });
    

    const result = await res.json();

    return NextResponse.json({ message: 'Processed one chunk block', result });
  } catch (err: any) {
    console.error('Error in continue-processing:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}