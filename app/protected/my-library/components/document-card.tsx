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

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!document.id) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("documents").delete().eq("id", document.id)
      if (error) throw error

      if (document.file_path) {
        const { error: storageError } = await supabase.storage.from("documents").remove([document.file_path])
        if (storageError) console.error("Storage deletion error:", storageError)
      }

      toast({ title: "Document deleted", description: "The document has been successfully deleted." })
      onDelete?.(document.id)
    } catch (error) {
      console.error("Delete error:", error)
      toast({ title: "Error", description: "Failed to delete the document.", variant: "destructive" })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDownload = async () => {
    if (!document.file_path) return

    try {
      const { data, error } = await supabase.storage.from("documents").download(document.file_path)
      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = window.document.createElement("a")
      a.href = url
      a.download = document.name || "document"
      window.document.body.appendChild(a)
      a.click()
      window.document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({ title: "Download started", description: "Your document is being downloaded." })
    } catch (error) {
      console.error("Download error:", error)
      toast({ title: "Download failed", description: "Try again later.", variant: "destructive" })
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(document.name || "")
    toast({ title: "Link copied", description: "Document name copied to clipboard." })
  }

  const getFileUrl = async () => {
    if (!document.file_path) return null
    try {
      const { data, error } = await supabase.storage.from("documents").createSignedUrl(document.file_path, 60)
      if (error) throw error
      return data.signedUrl
    } catch (error) {
      console.error("Signed URL error:", error)
      return null
    }
  }

  const handleView = async () => {
    const url = await getFileUrl()
    if (url) {
      window.open(url, "_blank")
    } else {
      toast({ title: "Error", description: "Failed to open the document.", variant: "destructive" })
    }
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
                {document.category && <Badge variant="outline">{document.category}</Badge>}
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
            <CardTitle className="text-lg mt-2 line-clamp-2">{document.name || "Untitled"}</CardTitle>
            {document.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {document.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="pb-3 pt-0 flex-grow">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {document.created_at
                  ? `Added ${formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}`
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
