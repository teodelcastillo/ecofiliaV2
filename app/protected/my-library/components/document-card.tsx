"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, MoreVertical, Download, Trash2 } from "lucide-react"
import { formatDate } from "../utils/format-date"
import { createClient } from "@/utils/supabase/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getFileIcon } from "../utils/file-icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getSignedUrl } from "@/lib/getSignedUrl";



interface DocumentCardProps {
  document: {
    id: string
    name: string
    description?: string
    category?: string
    created_at: string
    file_path: string
    file_type?: string
    user_id: string
    [key: string]: any
  }
  isOwner?: boolean
  onDelete?: (documentId: string) => void
}

export function DocumentCard({ document, isOwner = false, onDelete }: DocumentCardProps) {
  const { id, name, description, category, created_at, file_path, file_type } = document
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const FileTypeIcon = getFileIcon(file_type)

  const handleOpenDocument = async (filePath: string) => {
    const signedUrl = await getSignedUrl(filePath);
    if (signedUrl) {
      window.open(signedUrl, "_blank");
    } else {
      alert("Could not access file. Please try again.");
    }
  };

const handleDownload = async () => {
  if (!file_path) return;

  const signedUrl = await getSignedUrl(file_path);
  if (signedUrl) {
    const link = document.createElement("a");
    link.href = signedUrl;
    link.download = name || "document.pdf"; // fallback filename
    link.click();
  } else {
    alert("Could not download file. Please try again.");
  }
};

  const handleDelete = async () => {
    if (!id) return

    setIsDeleting(true)
    const supabase = createClient()

    try {
      // Delete the file from storage if it exists
      if (file_path) {
          await supabase.storage.from("user_documents").remove([file_path])
      }

      // Delete the document record
      const { error } = await supabase.from("documents").delete().eq("id", id)

      if (error) throw error

      // Notify parent component
      if (onDelete) {
        onDelete(id)
      }
    } catch (error) {
      console.error("Error deleting document:", error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              {category && (
                <div className="mb-2">
                  <Badge variant="secondary">{category}</Badge>
                </div>
              )}
            </div>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDownload} disabled={!file_path}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <CardTitle className="line-clamp-1">{name || "Untitled Document"}</CardTitle>
          <CardDescription className="line-clamp-2">{description || "No description available"}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(created_at)}</span>
            </div>
            {file_type && (
              <div className="flex items-center gap-2">
                <FileTypeIcon className="h-4 w-4" />
                <span className="uppercase">{file_type}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline" onClick={() => handleOpenDocument(document.file_path)} disabled={!file_path}>
            <FileText className="mr-2 h-4 w-4" />
            View Document
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

