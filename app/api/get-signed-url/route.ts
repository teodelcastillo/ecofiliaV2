import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/types/supabase"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookies(),
  })

  const body = await req.json()
  const filePath = body.filePath?.trim()

  console.log("📥 Received filePath:", filePath)

  if (!filePath) {
    console.warn("⚠️ Missing file path in request.")
    return NextResponse.json({ error: "Missing file path" }, { status: 400 })
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("❌ User session error:", userError)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("👤 Authenticated user ID:", user.id)

  // Buscar documento en la base de datos
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id, file_path, user_id")
    .eq("file_path", filePath)
    .eq("user_id", user.id)
    .single()

  if (docError || !doc) {
    console.warn("🛑 Document not found or not owned by user")
    return NextResponse.json({ error: "Unauthorized access to document" }, { status: 403 })
  }


  const { data: signedData, error: signedError } = await supabase.storage
    .from("user-documents")
    .createSignedUrl(filePath, 60 * 5)

  if (signedError || !signedData?.signedUrl) {
    console.error("❌ Signed URL generation failed")

    const message = signedError?.message || "Failed to generate signed URL"

    return NextResponse.json({ error: message })
  }


  return NextResponse.json({ signedUrl: signedData.signedUrl })
}
