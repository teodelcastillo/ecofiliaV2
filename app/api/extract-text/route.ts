// /api/extract-text/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// @ts-expect-error
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth"; // Para Word
import * as XLSX from "xlsx";  // Para Excel

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

function getDocumentSource(type: "user" | "public") {
  return {
    table: type === "public" ? "public_documents" : "documents",
    bucket: type === "public" ? "documents" : "user-documents",
    pathField: type === "public" ? "file_url" : "file_path",
  };
}

// 🔥 Nuevo: función para detectar tipo de archivo y extraer texto
async function extractText(buffer: Buffer, fileName: string): Promise<string> {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (!extension) throw new Error("No file extension found.");

  if (extension === "pdf") {
    const parsed = await pdf(buffer);
    return parsed.text;
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (extension === "xlsx") {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetText = XLSX.utils.sheet_to_csv(sheet);
      text += `\n\n=== Sheet: ${sheetName} ===\n\n${sheetText}`;
    });

    return text;
  }

  throw new Error(`Unsupported file type: ${extension}`);
}

export async function POST(req: Request) {
  try {
    const { documentId, type } = await req.json();

    if (!documentId || !type) {
      return NextResponse.json({ error: "Missing documentId or type" }, { status: 400 });
    }

    const { table, bucket, pathField } = getDocumentSource(type);

    await supabase.from(table).update({ chunking_status: "in_progress" }).eq("id", documentId);

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

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60);

    if (signedUrlError || !signedUrlData) {
      return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
    }

    const fileRes = await fetch(signedUrlData.signedUrl);
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";
    try {
      extractedText = await extractText(buffer, filePath); // 🔥 ahora extraemos el tipo correcto
      console.log("📄 Extracted text length:", extractedText.length);
    } catch (err) {
      console.error("❌ Text extraction failed:", err);
      await supabase.from(table).update({ chunking_status: "failed" }).eq("id", documentId);
      return NextResponse.json({ error: "Text extraction failed" }, { status: 500 });
    }

    if (!extractedText || extractedText.length < 20) {
      console.warn("⚠️ Extracted text too short or empty");
      await supabase.from(table).update({ chunking_status: "failed" }).eq("id", documentId);
      return NextResponse.json({ error: "Text too short or unreadable" }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from(table)
      .update({ extracted_text: extractedText, chunking_status: "extracted" })
      .eq("id", documentId);

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/continue-processing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    }).catch((err) => {
      console.warn("⚠️ Error triggering continue-processing:", err);
    });

    if (updateError) {
      return NextResponse.json({ error: "Failed to update extracted text" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      extractedTextLength: extractedText.length,
    });
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
