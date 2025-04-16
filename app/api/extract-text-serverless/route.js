// 👇 NECESARIO PARA VERCEL
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";

// ...todo lo demás igual


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractSectionTitles(text) {
  const regex = /(?:^|\n)([A-Z][A-Z0-9\s\-]{5,})(?=\n)/g;
  const matches = [...text.matchAll(regex)];
  return matches.map((match) => ({
    index: match.index ?? 0,
    title: match[1].trim(),
  }));
}

async function chunkWithSections(fullText) {
  const sectionMarkers = extractSectionTitles(fullText);
  const chunks = [];

  for (let i = 0; i < sectionMarkers.length; i++) {
    const start = sectionMarkers[i].index;
    const end = sectionMarkers[i + 1]?.index ?? fullText.length;
    const sectionText = fullText.slice(start, end).trim();
    const sectionTitle = sectionMarkers[i].title;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const sectionChunks = await splitter.createDocuments([sectionText]);
    const texts = sectionChunks.map((chunk) => chunk.pageContent);

    texts.forEach((content, j) => {
      chunks.push({
        content,
        section_title: sectionTitle,
        chunk_index: chunks.length,
      });
    });
  }

  return chunks;
}

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
    console.log("📂 Table:", tableName, "| Bucket:", bucketName);

    const { data: doc, error: docError } = await supabase
      .from(tableName)
      .select(type === "public" ? "file_url" : "file_path")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      console.error("❌ Failed to fetch document metadata:", docError);
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const filePath = type === "public"
      ? doc.file_url?.split("/documents/")[1]
      : doc.file_path;

    if (!filePath) {
      console.error("❌ Invalid file path:", filePath);
      return NextResponse.json({ error: "Invalid file path" }, { status: 500 });
    }

    console.log("📄 Fetching file from:", filePath);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("❌ Failed to download file:", downloadError);
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }

    console.log("📦 File downloaded. Extracting text...");

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsed = await pdf(buffer);
    const extractedText = parsed.text;

    if (!extractedText || extractedText.length < 20) {
      console.warn("⚠️ Extracted text too short. Might be scanned/invisible.");
    } else {
      console.log("✅ Text extracted. Length:", extractedText.length);
    }

    const { error: updateError } = await supabase
      .from(tableName)
      .update({ extracted_text: extractedText })
      .eq("id", documentId);

    if (updateError) {
      console.error("❌ Failed to update document with extracted text:", updateError);
      return NextResponse.json({ error: "Failed to store extracted text" }, { status: 500 });
    }

    console.log("🧠 Chunking with sections...");
    const enhancedChunks = await chunkWithSections(extractedText);
    console.log("📚 Chunks created:", enhancedChunks.length);

    const texts = enhancedChunks.map((c) => c.content);

    console.log("🔗 Generating embeddings...");
    const embedder = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const embeddings = await embedder.embedDocuments(texts);
    console.log("🧬 Embeddings generated:", embeddings.length);

    const chunksToInsert = embeddings.map((embedding, i) => ({
      document_id: documentId,
      document_type: type,
      content: enhancedChunks[i].content,
      embedding,
      section_title: enhancedChunks[i].section_title,
      chunk_index: enhancedChunks[i].chunk_index,
    }));

    console.log("💾 Inserting chunks into database...");
    const { error: insertError } = await supabase
      .from("document_chunks")
      .insert(chunksToInsert);

    if (insertError) {
      console.error("❌ Failed to insert chunks:", insertError);
      return NextResponse.json({ error: "Failed to insert chunks" }, { status: 500 });
    }

    console.log("✅ All done. Chunks inserted:", chunksToInsert.length);
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
