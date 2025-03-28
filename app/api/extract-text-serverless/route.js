import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

    // Fetch document metadata
    const { data: doc, error: docError } = await supabase
      .from(tableName)
      .select(type === "public" ? "file_url" : "file_path")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    let filePath;
    if (type === "public") {
      const parts = doc.file_url?.split("/documents/");
      filePath = parts?.[1];
    } else {
      filePath = doc.file_path;
    }

    if (!filePath) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 500 });
    }

    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsed = await pdf(buffer);
    const extractedText = parsed.text;

    // Update extracted_text in original document table
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ extracted_text: extractedText })
      .eq("id", documentId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to store extracted text" }, { status: 500 });
    }

    // 🔹 Chunk the text
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([extractedText]);
    const texts = chunks.map((chunk) => chunk.pageContent);

    // 🔹 Embed each chunk
    const embedder = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });
    const embeddings = await embedder.embedDocuments(texts);

    // 🔹 Insert into document_chunks
    const chunksToInsert = embeddings.map((embedding, i) => ({
      document_id: documentId,
      document_type: type,
      content: texts[i],
      embedding,
    }));

    const { error: insertError } = await supabase
      .from("document_chunks")
      .insert(chunksToInsert);

    if (insertError) {
      return NextResponse.json({ error: "Failed to insert chunks" }, { status: 500 });
    }

    return NextResponse.json({ success: true, extractedText, chunksInserted: chunksToInsert.length });
  } catch (err) {
    console.error("❌ Serverless error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
