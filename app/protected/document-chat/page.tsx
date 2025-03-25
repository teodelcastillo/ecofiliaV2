import { DocumentChat } from "./components/document-chat";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DocumentChatPage() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user's personal documents
  const { data: personalDocs } = await supabase
    .from("documents")
    .select("id, name, description, category, created_at, file_path, file_type, user_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch public documents
  const { data: publicDocs } = await supabase
    .from("public_documents")
    .select("*")
    .order("created_at", { ascending: false });

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
  );
}
