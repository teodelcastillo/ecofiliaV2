import { createClient } from "@/utils/supabase/client";

export async function uploadAndProcessDocument({
  file,
  name,
  description,
  category,
}: {
  file: File;
  name?: string;
  description?: string;
  category?: string;
}) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No authenticated user");
  }

  const userId = user.id;
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("user-documents")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("documents")
    .insert({
      name: name || file.name,
      description,
      category: category || null,
      file_path: filePath,
      user_id: userId,
      chunking_status: "pending", // ✅ clave
    })
    .select()
    .single();


  if (error) throw error;

  // 🔁 Solo disparamos el primer paso: extracción de texto
  fetch("/api/extract-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      documentId: data.id,
      type: "user",
    }),
  }).catch((err) => {
    console.warn("⚠️ Error starting extraction:", err);
  });
  // 🔁 Paso 1: extracción de texto
await fetch("/api/extract-text", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    documentId: data.id,
    type: "user",
  }),
});

// ⏳ Paso 2: iniciar chunking inicial (procesa solo 1 bloque)
await fetch("/api/chunk-openai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ documentId: data.id }),
});


  return data;
}
