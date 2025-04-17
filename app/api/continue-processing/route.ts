export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

const MAX_DOCS_PER_RUN = 3;

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const validToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Buscar documentos pendientes de chunking
    const { data: docsToChunk, error: chunkError } = await supabase
      .from("documents")
      .select("id")
      .eq("processing_status", "extracted")
      .eq("chunking_done", false)
      .order("updated_at", { ascending: true })
      .limit(MAX_DOCS_PER_RUN);

    if (chunkError) {
      console.error("❌ Error fetching documents to chunk:", chunkError);
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
    }

    for (const doc of docsToChunk ?? []) {
      console.log(`🧩 Processing chunk for document ${doc.id}...`);
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chunk-openai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          type: "user",
        }),
      });
    }

    // 2. Buscar documentos listos para embed (chunking_done = true pero aún no embebidos)
    const { data: docsToEmbed, error: embedError } = await supabase
      .from("documents")
      .select("id")
      .eq("processing_status", "extracted")
      .eq("chunking_done", true)
      .order("updated_at", { ascending: true })
      .limit(MAX_DOCS_PER_RUN);

    if (embedError) {
      console.error("❌ Error fetching documents to embed:", embedError);
      return NextResponse.json({ error: "Failed to fetch documents to embed" }, { status: 500 });
    }

    for (const doc of docsToEmbed ?? []) {
      console.log(`🔗 Embedding chunks for document ${doc.id}...`);
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/embed-chunks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          type: "user",
        }),
      });
    }

    return NextResponse.json({
      processedChunking: docsToChunk?.length || 0,
      processedEmbedding: docsToEmbed?.length || 0,
      chunkedIds: docsToChunk?.map((d) => d.id) || [],
      embeddedIds: docsToEmbed?.map((d) => d.id) || [],
    });
  } catch (err) {
    console.error("🔥 Error in continue-processing:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}