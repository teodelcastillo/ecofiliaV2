import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { MyLibrary } from "./components/my-library"

export default async function MyLibraryPage() {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user is logged in, redirect to login page
  if (!user) {
    redirect("/sign-in")
  }

  // Fetch user's documents
  console.log("📁 Fetching documents for user:", user.id);

    const { data: userDocuments, error } = await supabase
      .from("documents")
      .select("id, name, file_path, created_at, user_id, category, description, file_type")
      .eq("user_id", user.id)
      .limit(10);
    
    if (error) {
      console.error("❌ Error fetching documents:", error.message);
    }
    
    console.log("✅ Documents fetched:", userDocuments?.length);
  

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">My Library</h1>
      <p className="text-muted-foreground mb-8">Manage your personal documents and projects</p>
      <MyLibrary documents={userDocuments || []} userId={user.id} />
    </div>
  )
}

