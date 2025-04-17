// app/api/chunk-openai/route.ts

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { chunkWithOpenAI } from "@/lib/chunking";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

function getDocumentSource(type: "user" | "public") {
  return {
    table: type === "public" ? "public_documents" : "documents",
  };
}

const MAX_CHARS_PER_BATCH = 12000;

function extractChunk(text: string, offset: number, max = MAX_CHARS_PER_BATCH) {
  return text.slice(offset, offset + max);
}

export async function POST(req: Request) {
  try {
    const { documentId, type } = await req.json();
    const { table } = getDocumentSource(type);

    const { data: doc, error } = await supabase
      .from(table)
      .select("extracted_text, chunking_offset")
      .eq("id", documentId)
      .single();

    if (error || !doc?.extracted_text) {
      return NextResponse.json({ error: "Extracted text not found" }, { status: 404 });
    }

    const offset = doc.chunking_offset ?? 0;
    const fullText = doc.extracted_text;
    const fragment = extractChunk(fullText, offset);

    if (!fragment || fragment.length === 0) {
      await supabase.from(table).update({ chunking_done: true }).eq("id", documentId);
      return NextResponse.json({ done: true, message: "All text already processed" });
    }

    const parsedChunks = await chunkWithOpenAI(fragment, offset);

    const currentChunkCount = await supabase
      .from("document_chunks")
      .select("id", { count: "exact", head: true })
      .eq("document_id", documentId)
      .eq("document_type", type);

    const baseIndex = currentChunkCount.count || 0;

    const chunksToInsert = parsedChunks.map((chunk, i) => ({
      document_id: documentId,
      document_type: type,
      content: chunk.content,
      embedding: null,
      section_title: chunk.section_title,
      chunk_index: baseIndex + i,
      section_level: chunk.section_level,
      tokens: chunk.tokens,
      start_char: chunk.start_char,
      end_char: chunk.end_char,
      page_number: chunk.page_number,
      keywords: chunk.keywords,
      summary: chunk.summary,
    }));

    await supabase.from("document_chunks").insert(chunksToInsert);

    const newOffset = offset + fragment.length;
    const chunkingDone = newOffset >= fullText.length;

    await supabase.from(table).update({
      chunking_offset: newOffset,
      chunking_done: chunkingDone,
    }).eq("id", documentId);

    return NextResponse.json({
      success: true,
      chunksInserted: chunksToInsert.length,
      chunkingDone,
      nextOffset: newOffset,
    });
  } catch (err) {
    console.error("🔥 Error in chunk-openai:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}