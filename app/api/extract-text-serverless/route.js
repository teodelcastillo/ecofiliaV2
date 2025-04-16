import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";

export async function POST(req) {
  try {
    console.log("🔥 extract-text-serverless TRIGGERED");

    const { documentId, type } = await req.json();
    console.log("📅 Received request for document:", documentId, "| type:", type);

    if (!documentId || !type) {
      console.error("❌ Missing documentId or type");
      return NextResponse.json({ error: "Missing documentId or type" }, { status: 400 });
    }

    const tableName = type === "public" ? "public_documents" : "documents";
    const bucketName = type === "public" ? "documents" : "user-documents";

    console.log("🧾 tableName:", tableName, "| bucketName:", bucketName);

    const { data: doc, error: docError } = await supabase
      .from(tableName)
      .select(type === "public" ? "file_url" : "file_path")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      console.error("❌ Document fetch error:", docError);
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const filePath = type === "public"
      ? doc.file_url?.split("/documents/")[1]
      : doc.file_path;

    if (!filePath) {
      console.error("❌ Invalid file path:", filePath);
      return NextResponse.json({ error: "Invalid file path" }, { status: 500 });
    }

    console.log("📂 Downloading file from:", filePath);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("❌ Download error:", downloadError);
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdf(buffer);
    const extractedText = parsed.text;

    console.log("📄 Extracted text length:", extractedText.length);

    if (!extractedText || extractedText.length < 20) {
      console.warn("⚠️ Extracted text too short. Might be scanned/invisible.");
    }

    const { error: updateError } = await supabase
      .from(tableName)
      .update({ extracted_text: extractedText })
      .eq("id", documentId);

    if (updateError) {
      console.error("❌ Failed to update extracted text:", updateError);
      return NextResponse.json({ error: "Failed to store extracted text" }, { status: 500 });
    }

    const enhancedChunks = await chunkWithSections(extractedText);
    console.log("🧠 Generated", enhancedChunks.length, "chunks");

    const texts = enhancedChunks.map((c) => c.content);

    const embedder = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const embeddings = await embedder.embedDocuments(texts);
    console.log("🔗 Embeddings generated:", embeddings.length);

    const chunksToInsert = embeddings.map((embedding, i) => ({
      document_id: documentId,
      document_type: type,
      content: enhancedChunks[i].content,
      embedding,
      section_title: enhancedChunks[i].section_title,
      chunk_index: enhancedChunks[i].chunk_index,
    }));

    const { error: insertError } = await supabase
      .from("document_chunks")
      .insert(chunksToInsert);

    if (insertError) {
      console.error("❌ Failed to insert chunks:", insertError);
      return NextResponse.json({ error: "Failed to insert chunks" }, { status: 500 });
    }

    console.log("✅ Extraction complete");
    return NextResponse.json({
      success: true,
      extractedTextLength: extractedText.length,
      chunksInserted: chunksToInsert.length,
    });
  } catch (err) {
    console.error("🔥 Unexpected server error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
