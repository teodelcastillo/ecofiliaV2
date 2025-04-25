import { FileUp, MessageCircle } from "lucide-react"
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
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Ecofilia Assistant</h1>
      </div>
      <p className="text-muted-foreground mb-4">
      Get instant answers to your sustainability questions through our AI-powered chat — trained on trusted environmental sources to support your work with accuracy and speed.</p>
      <div className="flex items-center gap-2 mb-8">
        <FileUp className="w-5 h-5 text-primary" />
        <i className="text-muted-foreground">Select documents from your library or the public collection and chat with an AI assistant about them.</i>
      </div>
      
      <DocumentChat
        personalDocuments={personalDocs || []}
        publicDocuments={publicDocs || []}
        userId={user.id}
      />
    </div>
  )
}
