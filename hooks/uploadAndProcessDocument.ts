// /lib/uploadAndProcessDocument.ts
import { createClient } from "@/utils/supabase/client";

export async function uploadAndProcessDocument({
  file,
  userId,
  name,
  description,
  category,
}: {
  file: File;
  userId: string;
  name?: string;
  description?: string;
  category?: string;
}) {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("documents")
    .insert({
      name: name || file.name,
      description,
      category: category || null,
      file_path: filePath,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  const extractRes = await fetch("/api/extract-smart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      documentId: data.id,
      type: "user",
    }),
  });

  if (!extractRes.ok) {
    const err = await extractRes.json();
    console.warn("⚠️ Extraction failed:", err);
  }

  return data;
}
