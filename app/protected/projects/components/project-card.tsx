"use client"

import { AlertDialogTitle } from "@/components/ui/alert-dialog"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  FolderKanban,
  MoreVertical,
  Trash2,
  FileText,
  Share2,
  ExternalLink,
  Edit,
  Layers,
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
} from "@/components/ui/alert-dialog"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/models"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async () => {
    if (!project.id) return

    setIsDeleting(true)
    try {
      // Delete the project from the database
      const { error } = await supabase.from("projects").delete().eq("id", project.id)

      if (error) throw error

      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      })

      // Refresh the page after deletion
      window.location.reload()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleShare = () => {
    // Implement share functionality
    // For now, just copy the project name to clipboard
    if (project.name) {
      navigator.clipboard.writeText(project.name)
    } else {
      toast({
        title: "Error",
        description: "Project name is not available to copy.",
        variant: "destructive",
      })
    }
    toast({
      title: "Link copied",
      description: "Project link copied to clipboard.",
    })
  }

  const documentCount = project.documents?.length || 0

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          className={`h-full flex flex-col overflow-hidden transition-all duration-200 ${
            isHovered ? "shadow-md border-primary/30" : "border-border/60"
          }`}
          onClick={onClick}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-md">
                  <FolderKanban className="h-4 w-4 text-primary" />
                </div>
                {project.category && <Badge variant="outline">{project.category}</Badge>}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/protected/projects/${project.id}`)
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteDialog(true)
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="text-lg mt-2 line-clamp-2">{project.name}</CardTitle>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
            )}
          </CardHeader>
          <CardContent className="pb-3 pt-0 flex-grow">
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  {project.created_at
                    ? `Created ${formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}`
                    : "Date unknown"}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Layers className="mr-2 h-4 w-4" />
                <span>
                  {documentCount} document{documentCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <Button
              className="w-full"
              variant={isHovered ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/protected/projects/${project.id}`)
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Project
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove it from our servers.
            </AlertDialogDescription>
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
