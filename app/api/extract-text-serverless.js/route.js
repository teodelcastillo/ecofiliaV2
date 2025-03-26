// /app/api/extract-text-serverless/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import pdf from "pdf-parse";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SERVICE_KEY
);

export async function POST(req) {
  try {
    console.log("🔥 extract-text-serverless TRIGGERED");
    const { documentId, type } = await req.json();

    if (!documentId || !type) {
      return NextResponse.json({ error: "Missing documentId or type" }, { status: 400 });
    }

    let tableName = "";
    let bucketName = "";

    if (type === "public") {
      tableName = "public_documents";
      bucketName = "documents";
    } else if (type === "user") {
      tableName = "documents";
      bucketName = "user-documents";
    } else {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    const { data: doc, error: docError } = await supabase
      .from(tableName)
      .select(type === "public" ? "file_url" : "file_path")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      console.error("Error fetching document:", docError);
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    let filePath;
    if (type === "public") {
      const publicUrl = doc.file_url;
      const parts = publicUrl?.split("/documents/");
      filePath = parts?.[1];
      if (!filePath) {
        return NextResponse.json({ error: "Invalid public file_url" }, { status: 500 });
      }
    } else {
      filePath = doc.file_path;
      if (!filePath) {
        return NextResponse.json({ error: "Missing file_path in document" }, { status: 500 });
      }
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Error downloading file:", downloadError);
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdf(buffer);
    console.log("Extracted text length:", parsed.text.length);

    const { error: updateError } = await supabase
      .from(tableName)
      .update({ extracted_text: parsed.text })
      .eq("id", documentId);

    if (updateError) {
      console.error("Error updating document:", updateError);
      return NextResponse.json({ error: "Failed to store extracted text" }, { status: 500 });
    }

    return NextResponse.json({ success: true, extractedText: parsed.text });
  } catch (err) {
    console.error("Serverless error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
