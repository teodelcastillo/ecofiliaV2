export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function getDocumentSource(type: "user" | "public") {
  return {
    table: type === "public" ? "public_documents" : "documents",
  };
}

function splitTextIntoChunks(text: string, maxLength = 12000): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

const ChunkSchema = z.object({
  section_title: z.string(),
  content: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()),
  section_level: z.number(),
  start_char: z.number(),
  end_char: z.number(),
});

const ChunkListSchema = z.array(ChunkSchema);

async function chunkWithOpenAI(fullText: string) {
  const rawChunks = splitTextIntoChunks(fullText);
  const results = [];

  for (const chunk of rawChunks) {
    const prompt = `Analiza el siguiente texto y devuélvelo como una lista de objetos JSON. Cada objeto debe tener:
- section_title
- content
- summary
- keywords
- section_level
- start_char
- end_char

Formato: JSON estricto en una lista []. No incluyas explicaciones, solo JSON.

Texto:
${chunk}`;

    const res = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Devuelve únicamente un JSON plano válido, bien formateado y estrictamente compatible con JSON.parse. Nada de markdown, comentarios ni comillas inteligentes.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = res.choices[0].message.content || "[]";
    const jsonMatch = raw.match(/\[.*\]/s);

    if (!jsonMatch) {
      console.warn("⚠️ No se encontró JSON válido en la respuesta:", raw);
      continue;
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      const validated = ChunkListSchema.parse(parsed);
      results.push(...validated);
    } catch (err) {
      console.warn("❌ JSON inválido o no matchea con el schema:", err);
    }
  }

  return results.map((chunk, i) => ({
    ...chunk,
    chunk_index: i,
    tokens: Math.ceil(chunk.content.length / 4),
    page_number: null,
  }));
}

export async function POST(req: Request) {
  try {
    const { documentId, type } = await req.json();

    if (!documentId || !type) {
      return NextResponse.json({ error: "Missing documentId or type" }, { status: 400 });
    }

    const { table } = getDocumentSource(type);

    const { data: doc, error: docError } = await supabase
      .from(table)
      .select("extracted_text")
      .eq("id", documentId)
      .single();

    if (docError || !doc?.extracted_text) {
      return NextResponse.json({ error: "Extracted text not found" }, { status: 404 });
    }

    const enhancedChunks = await chunkWithOpenAI(doc.extracted_text);

    const chunksToInsert = enhancedChunks.map((chunk) => ({
      document_id: documentId,
      document_type: type,
      content: chunk.content,
      embedding: null, // se agregará luego en la siguiente función
      section_title: chunk.section_title,
      chunk_index: chunk.chunk_index,
      section_level: chunk.section_level,
      tokens: chunk.tokens,
      start_char: chunk.start_char,
      end_char: chunk.end_char,
      page_number: chunk.page_number,
      keywords: chunk.keywords,
      summary: chunk.summary,
    }));

    const { error: insertError } = await supabase.from("document_chunks").insert(chunksToInsert);

    if (insertError) {
      return NextResponse.json({ error: "Failed to insert chunks", details: insertError.message }, { status: 500 });
    }

    await supabase.from(table).update({ processing_status: "chunked" }).eq("id", documentId);

    return NextResponse.json({
      success: true,
      chunksInserted: chunksToInsert.length,
    });
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
