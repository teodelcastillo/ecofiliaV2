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
      processing_status: "pending",
    })
    .select()
    .single()

  if (error) throw error

  const payload = {
    documentId: data.id,
    type: "user",
  }

  // 👇 Ejecutamos el pipeline asincrónico sin bloquear la UI
  fetch("/api/extract-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(() =>
      fetch("/api/chunk-openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    )
    .then(() =>
      fetch("/api/embed-chunks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    )
    .catch((err) => {
      console.warn("⚠️ Error in async processing pipeline:", err)
    })

  return data
}
