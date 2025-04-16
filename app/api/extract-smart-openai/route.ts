// NECESARIO PARA VERCEL
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";

// Supabase y OpenAI clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Utilidad para obtener tabla, bucket y campo correcto según tipo
function getDocumentSource(type: "user" | "public") {
  return {
    table: type === "public" ? "public_documents" : "documents",
    bucket: type === "public" ? "documents" : "user-documents",
    pathField: type === "public" ? "file_url" : "file_path",
  };
}

// Divide texto largo en bloques para OpenAI
function splitTextIntoChunks(text: string, maxLength = 12000): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

// Chunking con OpenAI + parsing robusto
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

Formato: JSON estricto en una lista []. No agregues comentarios ni explicaciones.\n\nTexto:\n${chunk}`;

    const res = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "Responde como un especialista en generar vectores para luego procesar. Responde estrictamente en formato JSON plano. No uses Markdown, comillas inteligentes ni ningún tipo de formato adicional.",
        },
        { role: "user", content: prompt },
      ],
    });

    try {
      const raw = res.choices[0].message.content || "[]";
    
      // limpieza básica (podés expandir según necesidad)
      const sanitized = raw
        .replace(/[\u201C\u201D]/g, '"') // comillas curvas → comillas dobles
        .replace(/[\u2018\u2019]/g, "'") // comillas simples curvas
        .replace(/\\(?!["\\/bfnrtu])/g, ""); // elimina barras invertidas mal escapadas
    
      const parsed = JSON.parse(sanitized);
      results.push(...parsed);
    } catch (err) {
      console.warn("❌ Falló el parseo del JSON:", err);
      console.log("📥 Contenido recibido:", res.choices[0].message.content);
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

    const { table, bucket, pathField } = getDocumentSource(type);

    const { data: doc, error: docError } = await supabase
      .from(table)
      .select(pathField)
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const filePath =
      type === "public"
        ? (doc as { file_url?: string }).file_url?.split("/documents/")[1]
        : (doc as { file_path?: string }).file_path;

    if (!filePath) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    console.log("📦 Bucket:", bucket);
    console.log("📄 File path:", filePath);

    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(filePath, 60);

    if (signedUrlError || !signedUrlData) {
      throw new Error("No se pudo generar signed URL");
    }

    const fileRes = await fetch(signedUrlData.signedUrl);
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdf(buffer);
    const extractedText = parsed.text;

    if (!extractedText || extractedText.length < 20) {
      return NextResponse.json({ error: "Text too short or unreadable" }, { status: 500 });
    }

    await supabase.from(table).update({ extracted_text: extractedText }).eq("id", documentId);

    const enhancedChunks = await chunkWithOpenAI(extractedText);

    const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! });
    const embeddings = await embedder.embedDocuments(enhancedChunks.map((c) => c.content));

    const chunksToInsert = enhancedChunks.map((chunk, i) => ({
      document_id: documentId,
      document_type: type,
      content: chunk.content,
      embedding: embeddings[i],
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
      return NextResponse.json({ error: "Failed to insert chunks" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      extractedTextLength: extractedText.length,
      chunksInserted: chunksToInsert.length,
    });
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
