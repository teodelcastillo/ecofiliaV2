export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

function getDocumentSource(type: "user" | "public") {
  return {
    table: type === "public" ? "public_documents" : "documents",
  };
}

export async function POST(req: Request) {
  try {
    const { documentId, type } = await req.json();

    if (!documentId || !type) {
      return NextResponse.json({ error: "Missing documentId or type" }, { status: 400 });
    }

    const { table } = getDocumentSource(type);

    // 1. Buscar todos los chunks sin embedding
    const { data: chunks, error } = await supabase
      .from("document_chunks")
      .select("id, content")
      .eq("document_id", documentId)
      .eq("document_type", type)
      .is("embedding", null);

    if (error || !chunks || chunks.length === 0) {
      return NextResponse.json({ error: "No chunks found or all already embedded" }, { status: 404 });
    }

    // 2. Calcular embeddings
    const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! });
    const embeddings = await embedder.embedDocuments(chunks.map((chunk) => chunk.content));

    // 3. Actualizar cada chunk con su embedding
    const updates = await Promise.allSettled(
      chunks.map((chunk, i) =>
        supabase
          .from("document_chunks")
          .update({ embedding: embeddings[i] })
          .eq("id", chunk.id)
      )
    );

    const failed = updates.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      return NextResponse.json({ error: `${failed.length} embeddings failed to update` }, { status: 500 });
    }

    // 4. Marcar como completo
    await supabase.from(table).update({ processing_status: "embedded" }).eq("id", documentId);

    return NextResponse.json({
      success: true,
      chunksUpdated: chunks.length,
    });
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
