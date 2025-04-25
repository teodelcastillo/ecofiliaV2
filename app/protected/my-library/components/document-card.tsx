"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  FileText,
  MoreVertical,
  Trash2,
  Download,
  Share2,
  ExternalLink,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
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
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Document } from "@/models"

interface DocumentCardProps {
  document: Document
  onDelete?: (id: string) => void
}

export function DocumentCard({ document: doc, onDelete }: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const getSignedUrlFromApi = async (filePath: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/get-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      })
  
      const { signedUrl, error } = await res.json()
  
      if (!res.ok || !signedUrl) {
        console.error("Signed URL error:", error)
        throw new Error(error || "Failed to generate signed URL")
      }
  
      return signedUrl
    } catch (error) {
      console.error("Signed URL fetch error:", error)
      toast({ title: "Error", description: "Could not generate file URL.", variant: "destructive" })
      return null
    }
  }
  

  const handleDelete = async () => {
    if (!doc.id) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("documents").delete().eq("id", doc.id)
      if (error) throw error

      if (doc.file_path) {
        const { error: storageError } = await supabase.storage.from("documents").remove([doc.file_path])
        if (storageError) console.error("Storage deletion error:", storageError)
      }

      toast({ title: "Document deleted", description: "The document has been successfully deleted." })
      onDelete?.(doc.id)
    } catch (error) {
      console.error("Delete error:", error)
      toast({ title: "Error", description: "Failed to delete the document.", variant: "destructive" })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDownload = async () => {
    if (!doc.file_path) return
    const url = await getSignedUrlFromApi(doc.file_path)
    if (!url) return

    const a = document.createElement("a")
    a.href = url
    a.download = doc.name || "document"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({ title: "Download started", description: "Your document is being downloaded." })
  }

  const handleView = async () => {
    if (!doc.file_path) return
    const url = await getSignedUrlFromApi(doc.file_path)
    if (url) {
      window.open(url, "_blank")
    } else {
      toast({ title: "Error", description: "Failed to open the document.", variant: "destructive" })
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(doc.name || "")
    toast({ title: "Link copied", description: "Document name copied to clipboard." })
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className={`h-full flex flex-col overflow-hidden transition-all duration-200 ${
          isHovered ? "shadow-md border-primary/30" : "border-border/60"
        }`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                {doc.category && <Badge variant="outline">{doc.category}</Badge>}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleView}><ExternalLink className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Download</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}><Share2 className="mr-2 h-4 w-4" />Share</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit Details</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="text-lg mt-2 line-clamp-2">{doc.name || "Untitled"}</CardTitle>
            {doc.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {doc.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="pb-3 pt-0 flex-grow">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {doc.created_at
                  ? `Added ${formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}`
                  : "Date unknown"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <Button className="w-full" variant={isHovered ? "default" : "outline"} onClick={handleView}>
              <ExternalLink className="mr-2 h-4 w-4" />View Document
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the document.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
