// /app/api/extract-smart/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { encoding_for_model } from "tiktoken";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const enc = encoding_for_model("gpt-4");

function estimateTokens(text: string): number {
  return enc.encode(text).length;
}

function splitText(text: string, maxTokens: number = 6000): string[] {
  const splits: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + 12000;
    if (end > text.length) end = text.length;
    splits.push(text.slice(start, end));
    start = end;
  }

  return splits;
}

function inferPageNumber(startChar: number, pages: string[]): number {
  let charCount = 0;
  for (let i = 0; i < pages.length; i++) {
    charCount += pages[i].length;
    if (startChar < charCount) return i + 1;
  }
  return pages.length;
}

async function extractPdfText(buffer: Buffer): Promise<{ text: string; pages: string[] }> {
  const pdf = await getDocument({ data: buffer }).promise;
  const numPages = pdf.numPages;
  const allPages: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    const pageText = strings.join(" ").replace(/\s+/g, " ").trim();
    allPages.push(pageText);
  }

  const fullText = allPages.join("\n\n");
  return { text: fullText, pages: allPages };
}


async function getSemanticChunks(textBlock: string): Promise<any[]> {
  const prompt = `
Dividí el siguiente texto en bloques autocontenidos de entre 150 y 300 palabras. Cada bloque debe representar una idea o sección clara. Devolveme un JSON con:

[
  {
    "title": "Título del bloque",
    "content": "Texto del bloque",
    "start_char": 0,
    "end_char": 1234
  }
]

Texto:

"""${textBlock}"""
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0.3,
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const chunks = JSON.parse(completion.choices[0].message.content || "[]");
    return Array.isArray(chunks) ? chunks : [];
  } catch (e) {
    console.error("🛑 Error parsing chunks JSON:", e);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { documentId, type } = await req.json();

    if (!documentId || !type) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
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

    let filePath: string | undefined;

    if (type === "public" && "file_url" in doc) {
      filePath = doc.file_url?.split("/documents/")[1];
    } else if ("file_path" in doc) {
      filePath = doc.file_path;
    }

    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from(bucketName)
      .download(filePath || "");

    if (downloadError || !fileData) {
      return NextResponse.json({ error: "Download failed" }, { status: 500 });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { text: extractedText, pages } = await extractPdfText(buffer);

    await supabase
      .from(tableName)
      .update({ extracted_text: extractedText })
      .eq("id", documentId);

    const textBlocks = splitText(extractedText);
    const allChunks: any[] = [];

    for (const block of textBlocks) {
      const semanticChunks = await getSemanticChunks(block);
      semanticChunks.forEach((c, i) => {
        const tokens = estimateTokens(c.content);
        const page_number = inferPageNumber(c.start_char, pages);

        allChunks.push({
          title: c.title,
          content: c.content,
          start_char: c.start_char,
          end_char: c.end_char,
          tokens,
          page_number,
        });
      });
    }

    const embedder = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const embeddings = await embedder.embedDocuments(allChunks.map((c) => c.content));

    const chunksToInsert = embeddings.map((embedding, i) => ({
      document_id: documentId,
      document_type: type,
      content: allChunks[i].content,
      embedding,
      section_title: allChunks[i].title,
      chunk_index: i,
      start_char: allChunks[i].start_char,
      end_char: allChunks[i].end_char,
      tokens: allChunks[i].tokens,
      page_number: allChunks[i].page_number,
    }));

    const { error: insertError } = await supabase
      .from("document_chunks")
      .insert(chunksToInsert);

    if (insertError) {
      return NextResponse.json({ error: "Insert failed", details: insertError }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      totalChunks: chunksToInsert.length,
    });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}