import { DocumentChat } from "./components/document-chat"
import { requireUser } from "@/lib/require-user"

export default async function DocumentChatPage() {
  const { user, supabase } = await requireUser()

  const { data: personalDocs } = await supabase
    .from("documents")
    .select("id, name, description, category, created_at, file_path, user_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: publicDocs } = await supabase
    .from("public_documents")
    .select("id, name, category, created_at, file_url")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Document Chat</h1>
      <p className="text-muted-foreground mb-8">
        Select documents from your library or the public collection and chat with an AI assistant about them.
      </p>
      <DocumentChat
        personalDocuments={personalDocs || []}
        publicDocuments={publicDocs || []}
        userId={user.id}
      />
    </div>
  )
}
