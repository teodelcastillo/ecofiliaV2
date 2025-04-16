import { createClient } from "@/utils/supabase/client"

export async function uploadAndProcessDocument({
  file,
  name,
  description,
  category,
}: {
  file: File
  name?: string
  description?: string
  category?: string
}) {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("No authenticated user")
  }

  const userId = user.id
  const fileExt = file.name.split(".").pop()
  const filePath = `${userId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from("user-documents")
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from("documents")
    .insert({
      name: name || file.name,
      description,
      category: category || null,
      file_path: filePath,
      user_id: userId,
      processing_status: "pending", // 👈 inicializamos el estado
    })
    .select()
    .single()

  if (error) throw error

  // 👇 Disparamos el procesamiento en segundo plano (sin await)
  fetch("/api/extract-smart-openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      documentId: data.id,
      type: "user",
    }),
  }).catch((err) => {
    console.warn("⚠️ Background extraction failed to trigger:", err)
  })

  return data
}
