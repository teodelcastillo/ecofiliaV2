"use client"

import { useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  MoreVertical,
  Download,
  Share2,
  Edit,
  Trash2,
  FolderIcon as FolderMove,
  Eye,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import type { Document } from "@/models"

interface DocumentListProps {
  documents: Document[]
  onDocumentClick?: (document: Document) => void
  onDownload?: (document: Document) => Promise<void>
  onShare?: (document: Document) => void
  onRename?: (document: Document) => void
  onMove?: (document: Document) => void
  onDelete?: (document: Document) => void
  isLoading?: boolean
}

export function DocumentList({
  documents,
  onDocumentClick,
  onDownload,
  onShare,
  onRename,
  onMove,
  onDelete,
  isLoading = false,
}: DocumentListProps) {
  const [processingDoc, setProcessingDoc] = useState<string | null>(null)
  const { toast } = useToast()

  const getDocumentIcon = (type: string | undefined) => {
    if (!type) return <File className="h-5 w-5 text-gray-500" />

    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
    }
  }

  const formatFileSize = (bytes: number | undefined) => {
    if (bytes === undefined) return "Unknown"

    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleAction = async (action: (document: Document) => Promise<void> | void, document: Document) => {
    try {
      setProcessingDoc(document.id)
      await action(document)
    } catch (error) {
      console.error(`Error performing action:`, error)
      toast({
        title: "Action failed",
        description: "There was an error performing this action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingDoc(null)
    }
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span>Loading documents...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No documents found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => {
              const {
                id,
                name = "Untitled",
                file_type: type,
                created_at,
                user_id,
                category,
              } = document

              const isProcessing = processingDoc === id
              const modifiedDate = created_at
              const modifiedRelative = modifiedDate
                ? formatDistanceToNow(new Date(modifiedDate), { addSuffix: true })
                : "Unknown"
              const modifiedAbsolute = modifiedDate ? format(new Date(modifiedDate), "MMM d, yyyy") : "Unknown"

              return (
                <motion.tr
                  key={id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${onDocumentClick ? "cursor-pointer" : ""} hover:bg-muted/50`}
                  onClick={() => onDocumentClick?.(document)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getDocumentIcon("pdf")}
                      <span className="truncate max-w-[300px]">{name}</span>
                      {category && (
                        <Badge variant="outline" className="ml-2">
                          {category}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{type?.toUpperCase() || "Unknown"}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{modifiedRelative}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{modifiedAbsolute}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{user_id || "Unknown"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isProcessing || !onDocumentClick}
                              onClick={(e) => {
                                e.stopPropagation()
                                onDocumentClick?.(document)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {onDownload && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isProcessing}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction(onDownload, document)
                                }}
                              >
                                {isProcessing ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {onShare && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isProcessing}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction(onShare, document)
                                }}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isProcessing}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onRename && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction(onRename, document)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                          )}
                          {onMove && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction(onMove, document)
                              }}
                            >
                              <FolderMove className="h-4 w-4 mr-2" />
                              Move
                            </DropdownMenuItem>
                          )}
                          {(onRename || onMove) && onDelete && <DropdownMenuSeparator />}
                          {onDelete && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction(onDelete, document)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </motion.tr>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
