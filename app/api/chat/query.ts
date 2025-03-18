import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { extractTextFromPDF } from "@/lib/extractText";
import { openai } from "@/lib/openai";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { documentIds, query, userId, projectId } = req.body;

  if (!documentIds || documentIds.length === 0 || !query) {
    return res.status(400).json({ error: "Missing documents or query" });
  }

  // 1️⃣ Fetch all selected documents & validate ownership
  const { data: docs, error } = await supabase
    .from("documents")
    .select("*")
    .in("id", documentIds)
    .eq("user_id", userId)
    .eq("project_id", projectId);

  if (error || docs.length === 0) return res.status(404).json({ error: "Documents not found or unauthorized" });

  let combinedText = "";

  for (const doc of docs) {
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from("user_documents")
      .download(doc.storage_path);

    if (fileError) continue; // Skip problematic docs

    const buffer = await fileData.arrayBuffer();
    const text = await extractTextFromPDF(Buffer.from(buffer));

    combinedText += `\n--- Document: ${doc.title} ---\n` + text;
  }

  // Limit text size to fit token limit
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

  return res.status(200).json({ answer });
}
