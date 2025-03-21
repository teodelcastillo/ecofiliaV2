import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin"; 
import { extractTextFromPDF } from "@/lib/extractText";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentIds, messages, userId } = body;

    console.log("Request Body:", body);
    
    if (!documentIds || documentIds.length === 0 || !messages || messages.length === 0) {
      return NextResponse.json({ error: "Missing documents or messages" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content || '';

    // Fetch documents ✅
    const { data: docs, error } = await supabaseAdmin
      .from("documents")
      .select("*")
      .in("id", documentIds)
      .eq("user_id", userId); // User's own documents only

    console.log(docs, error);

    if (error || docs.length === 0) {
      return NextResponse.json({ error: "Documents not found or unauthorized" }, { status: 404 });
    }

    let combinedText = "";

    for (const doc of docs) {
      const { data: fileData, error: fileError } = await supabaseAdmin
        .storage
        .from("user_documents")
        .download(doc.storage_path);

      if (fileError) continue;

      const buffer = await fileData.arrayBuffer();
      const text = await extractTextFromPDF(Buffer.from(buffer));

      combinedText += `\n--- Document: ${doc.title} ---\n` + text;
    }

    const safeText = combinedText.slice(0, 10000);

    const prompt = `
You are analyzing the following environmental documents:

${safeText}

User question: ${query}

Provide a clear, concise answer based only on the document content.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = completion.choices[0].message.content;

    return NextResponse.json({ answer });

  } catch (err) {
    console.error("Error in query route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
