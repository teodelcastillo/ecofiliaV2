"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DocumentSelectorModal } from "../../ecofilia-expert/components/document-selector-modal"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Document } from "@/models"

interface LinkDocumentsBadgeProps {
  projectId: string | null
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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data: userDocs, error: userDocsError } = await supabase
        .from("documents")
        .select("id, name, file_path, created_at, user_id, category, description")
        .eq("user_id", user.id)

      if (userDocsError) throw userDocsError

      const { data: publicDocs, error: publicDocsError } = await supabase
        .from("public_documents")
        .select("id, name, file_url, created_at, category")

      if (publicDocsError) throw publicDocsError

      setPersonalDocuments(userDocs || [])
      setPublicDocuments(publicDocs || [])
      setIsOpen(true)
    } catch (error: any) {
      console.error("Error loading documents:", {
        message: error?.message,
        name: error?.name,
        details: error?.details,
        hint: error?.hint,
        error,
      })

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
      if (!projectId) {
        throw new Error("Project ID is required")
      }

      // Get existing linked document/public_document IDs
      const { data: existingLinks, error: existingError } = await supabase
        .from("project_documents")
        .select("document_id, public_document_id")
        .eq("project_id", projectId)

      if (existingError) throw existingError

      const existingIds = new Set(
        existingLinks?.map(link => link.document_id ?? link.public_document_id)
      )

      // Filter only new links
      const newLinks = documents
        .filter(doc => !existingIds.has(doc.id))
        .map(doc => ({
          project_id: projectId,
          document_id: doc.type === "user" ? doc.id : null,
          public_document_id: doc.type === "public" ? doc.id : null,
        }))

      if (newLinks.length === 0) {
        toast({
          title: "No new documents to link",
          description: "All selected documents are already linked to this project.",
        })
        return
      }

      const { error } = await supabase.from("project_documents").insert(newLinks)

      if (error) throw error

      toast({
        title: "Documents linked",
        description: `${newLinks.length} document${newLinks.length !== 1 ? "s" : ""} linked to project.`,
      })

      onDocumentsLinked()
    } catch (error: any) {
      console.error("Error linking documents:", {
        message: error?.message,
        name: error?.name,
        details: error?.details,
        hint: error?.hint,
        error,
      })

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
