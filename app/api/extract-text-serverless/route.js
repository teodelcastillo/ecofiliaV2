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
    console.log("\uD83D\uDD25 extract-text-serverless TRIGGERED");

    const { documentId, type } = await req.json();
    console.log("\uD83D\uDCC5 Received request for document:", documentId, "| type:", type);

    if (!documentId || !type) {
      return NextResponse.json({ error: "Missing documentId or type" }, { status: 400 });
    }

    const tableName = type === "public" ? "public_documents" : "documents";
    const bucketName = type === "public" ? "documents" : "user-documents";

    const { data: doc, error: docError } = await supabase
      .from(tableName)
      .select(type === "public" ? "file_url" : "file_path")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const filePath = type === "public"
      ? doc.file_url?.split("/documents/")[1]
      : doc.file_path;

    if (!filePath) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 500 });
    }

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

    if (!extractedText || extractedText.length < 20) {
      console.warn("⚠️ Extracted text too short. Might be scanned/invisible.");
    }

    const { error: updateError } = await supabase
      .from(tableName)
      .update({ extracted_text: extractedText })
      .eq("id", documentId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to store extracted text" }, { status: 500 });
    }

    const enhancedChunks = await chunkWithSections(extractedText);
    const texts = enhancedChunks.map((c) => c.content);

    const embedder = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const embeddings = await embedder.embedDocuments(texts);

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
      return NextResponse.json({ error: "Failed to insert chunks" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      extractedTextLength: extractedText.length,
      chunksInserted: chunksToInsert.length,
    });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
