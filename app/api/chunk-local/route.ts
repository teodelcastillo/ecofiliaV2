export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";
import * as tiktoken from "tiktoken";

const tokenizer = tiktoken.get_encoding("cl100k_base");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

// Lista de palabras comunes que queremos ignorar para keywords
const STOPWORDS = new Set([
  "the", "and", "for", "are", "with", "this", "that", "from", "have",
  "has", "was", "were", "been", "will", "shall", "can", "could", "would",
  "should", "on", "in", "at", "of", "to", "a", "an", "is", "it", "as", "by",
  "we", "you", "your", "our", "their", "there", "be", "or", "but", "if",
]);

function countTokens(text: string) {
  return tokenizer.encode(text).length;
}

function chunkText(text: string, maxLength: number) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

// Generador rápido de title (primeras 7 palabras)
function generateTitle(text: string) {
  const words = text.split(/\s+/).slice(0, 7).join(" ");
  return words.trim();
}

// Generador rápido de summary (primeras 25 palabras)
function generateSummary(text: string) {
  const words = text.split(/\s+/).slice(0, 25).join(" ");
  return words.trim();
}

// Generador rápido de keywords
function generateKeywords(text: string) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const freq: Record<string, number> = {};

  for (const word of words) {
    if (!STOPWORDS.has(word) && word.length > 2) {
      freq[word] = (freq[word] || 0) + 1;
    }
  }

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const keywords = sorted.slice(0, 7).map(([word]) => word);
  return keywords.join(", ");
}

export async function POST(req: Request) {
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

    const text = document.extracted_text;
    const chunks = chunkText(text, 1000);

    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const insertedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const tokenCount = countTokens(chunk);

      const embeddingResult = await embedder(chunk, { pooling: 'mean' });
      const embeddingVector = Array.from(embeddingResult.data);

      insertedChunks.push({
        public_document_id: documentId,
        chunk_index: i,
        content: chunk,
        token_count: tokenCount,
        title: generateTitle(chunk),
        summary: generateSummary(chunk),
        keywords: generateKeywords(chunk),
        embedding: embeddingVector,
      });
    }

    const { error: insertError } = await supabase.from("smart_chunks").insert(insertedChunks);

    if (insertError) {
      console.error("Error inserting chunks:", insertError);
      return NextResponse.json({ error: "Failed to insert chunks" }, { status: 500 });
    }

    await supabase.from("documents").update({ chunking_status: "done" }).eq("id", documentId);

    return NextResponse.json({ success: true, chunkCount: chunks.length });
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
