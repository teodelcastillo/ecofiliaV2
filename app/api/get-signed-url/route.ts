import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { filePath } = await req.json()

  console.log("🔐 Requested filePath:", filePath)

  // Validamos que el documento exista y sea del usuario
  const {
    data: doc,
    error,
  } = await supabase
    .from("documents")
    .select("id")
    .eq("file_path", filePath)
    .single()

  if (error || !doc) {
    console.warn("❌ Document not found or not owned:", error?.message)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  

  console.log("📦 Generando signed URL para filePath:", filePath)

  const { data: signed, error: signError } = await supabase.storage
    .from("user_documents")
    .createSignedUrl(filePath, 60 * 5)
  
  console.log("🧾 Resultado signedUrl:", signed)
  console.log("❌ Error (si hubo):", signError)
  

  if (signError || !signed) {
    console.error("🧨 Signed URL error:", signError?.message)
    return NextResponse.json({ error: "Signed URL generation failed" }, { status: 500 })
  }

  return NextResponse.json({ signedUrl: signed.signedUrl })
}
