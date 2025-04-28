export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

// Configuración
const MAX_CHUNKS_TO_PROCESS = 50;
const EMBEDDING_BATCH_SIZE = 50;

const embedder = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
});

// Estimar tokens por longitud (sencillo, rápido y serverless-friendly)
function countTokens(text: string) {
  return Math.ceil(text.length / 4);
}

// Chunkear texto basado en longitud
function chunkText(text: string, chunkSizeTokens = 400, overlapTokens = 100): string[] {
  const estimatedTokens = Math.ceil(text.length / 4);
  const approxChunkSizeChars = Math.ceil((chunkSizeTokens / estimatedTokens) * text.length);

  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    const chunk = text.slice(i, i + approxChunkSizeChars);
    chunks.push(chunk.trim());
    i += approxChunkSizeChars - Math.floor(overlapTokens / 4);
  }

  return chunks;
}

// Crear título, resumen y keywords rápidamente
function generateTitle(text: string) {
  return text.split(/\s+/).slice(0, 7).join(" ").trim();
}

function generateSummary(text: string) {
  return text.split(/\s+/).slice(0, 25).join(" ").trim();
}

function generateKeywords(text: string): string[] {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const STOPWORDS = new Set([
      "the", "and", "for", "are", "with", "this", "that", "from", "have",
      "has", "was", "were", "been", "will", "shall", "can", "could", "would",
      "should", "on", "in", "at", "of", "to", "a", "an", "is", "it", "as", "by",
      "we", "you", "your", "our", "their", "there", "be", "or", "but", "if",
    ]);
    const freq: Record<string, number> = {};
  
    for (const word of words) {
      if (!STOPWORDS.has(word) && word.length > 2) {
        freq[word] = (freq[word] || 0) + 1;
      }
    }
  
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([word]) => word); // 👈 No join, devolver array real
  }
  

// Batching de embeddings + procesamiento paralelo
async function embedChunksInBatches(chunks: string[], batchSize = EMBEDDING_BATCH_SIZE) {
  const batchPromises = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    batchPromises.push(embedder.embedDocuments(batch));
  }

  const batchResults = await Promise.all(batchPromises);
  return batchResults.flat(); // Unificar todos los embeddings
}

export async function POST(req: Request) {
  const startTime = performance.now();

  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
    }

    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("extracted_text")
      .eq("id", documentId)
      .single();

    if (docError || !document || !document.extracted_text) {
      return NextResponse.json({ error: "Document not found or no extracted text" }, { status: 404 });
    }

    console.log(`📄 Extracted text length: ${document.extracted_text.length}`);

    const chunkingStart = performance.now();
    const chunks = chunkText(document.extracted_text);
    console.log(`🧩 Chunks generated: ${chunks.length}`);
    console.log(`⏱️ Chunking time: ${(performance.now() - chunkingStart).toFixed(1)} ms`);

    const limitedChunks = chunks.slice(0, MAX_CHUNKS_TO_PROCESS);
    if (chunks.length > MAX_CHUNKS_TO_PROCESS) {
      console.warn(`⚠️ Limiting to first ${MAX_CHUNKS_TO_PROCESS} chunks to avoid timeout.`);
    }

    const embeddingStart = performance.now();
    const embeddings = await embedChunksInBatches(limitedChunks);
    console.log(`🧠 Embeddings generated for ${embeddings.length} chunks.`);
    console.log(`⏱️ Embedding time (parallelized): ${(performance.now() - embeddingStart).toFixed(1)} ms`);

    const insertedChunks = limitedChunks.map((chunk, i) => ({
      id: uuidv4(),
      public_document_id: null,
      document_id: documentId,
      chunk_index: i,
      content: chunk,
      token_count: countTokens(chunk),
      title: generateTitle(chunk),
      summary: generateSummary(chunk),
      keywords: generateKeywords(chunk),
      embedding: embeddings[i],
      created_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase.from("smart_chunks").insert(insertedChunks);

    if (insertError) {
      console.error("❌ Error inserting chunks:", insertError);
      return NextResponse.json({ error: "Failed to insert chunks" }, { status: 500 });
    }

    await supabase.from("documents").update({ chunking_status: "done" }).eq("id", documentId);

    console.log(`✅ Total processing time: ${(performance.now() - startTime).toFixed(1)} ms`);

    return NextResponse.json({ success: true, chunksInserted: insertedChunks.length });
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
