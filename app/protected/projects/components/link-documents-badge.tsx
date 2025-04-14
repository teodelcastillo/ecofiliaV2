"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DocumentSelectorModal } from "../../ecofilia-expert/components/document-selector-modal"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Document } from "@/models"

interface LinkDocumentsBadgeProps {
  projectId: string
  onDocumentsLinked: () => void
}

export function LinkDocumentsBadge({ projectId, onDocumentsLinked }: LinkDocumentsBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [personalDocuments, setPersonalDocuments] = useState<Document[]>([])
  const [publicDocuments, setPublicDocuments] = useState<Document[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])

  const supabase = createClient()
  const { toast } = useToast()

  const openModal = async () => {
    setIsLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Fetch user's documents
      const { data: userDocs, error: userDocsError } = await supabase
        .from("documents")
        .select("id, name, file_path, created_at, user_id, category, description")
        .eq("user_id", user.id)

      if (userDocsError) throw userDocsError

      // Fetch public documents
      const { data: publicDocs, error: publicDocsError } = await supabase
        .from("public_documents")
        .select("id, name, file_url, created_at, category, description")

      if (publicDocsError) throw publicDocsError

      setPersonalDocuments(userDocs || [])
      setPublicDocuments(publicDocs || [])
      setIsOpen(true)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentsSelected = async (documents: Document[]) => {
    if (documents.length === 0) {
      setIsOpen(false)
      return
    }

    setIsLoading(true)

    try {
      // Create links for each selected document
      const links = documents.map((doc) => {
        if (doc.type === "user") {
          return {
            project_id: projectId,
            document_id: doc.id,
            public_document_id: null,
          }
        } else {
          return {
            project_id: projectId,
            document_id: null,
            public_document_id: doc.id,
          }
        }
      })

      // Insert links into project_documents table
      const { error } = await supabase.from("project_documents").insert(links)

      if (error) throw error

      toast({
        title: "Documents linked",
        description: `${documents.length} document${documents.length !== 1 ? "s" : ""} linked to project.`,
      })

      // Call the callback to refresh documents
      onDocumentsLinked()
    } catch (error) {
      console.error("Error linking documents:", error)
      toast({
        title: "Error",
        description: "Failed to link documents to project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={openModal} disabled={isLoading} id="link-documents-button">
        <Plus className="mr-2 h-4 w-4" />
        Link Documents
      </Button>

      <DocumentSelectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        personalDocuments={personalDocuments}
        publicDocuments={publicDocuments}
        onDocumentsSelected={handleDocumentsSelected}
        selectedDocuments={selectedDocuments}
      />
    </>
  )
}
