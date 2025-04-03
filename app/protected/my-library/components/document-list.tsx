"use client"

import { formatDistanceToNow } from "date-fns"
import {
  FileText,
  FileSpreadsheet,
  FileIcon as FilePresentation,
  MoreVertical,
  Download,
  Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Document } from "@/models"

interface DocumentListProps {
  documents: Document[]
  onDocumentClick?: (document: Document) => void
}

export function DocumentList({ documents, onDocumentClick }: DocumentListProps) {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "xlsx":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case "pptx":
        return <FilePresentation className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="rounded-md border overflow-x-auto">
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
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No documents found
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => {
              const {
                id,
                name = "Untitled",
                type = "file",
              } = document

              return (
                <TableRow
                  key={id}
                  className="cursor-pointer"
                  onClick={() => onDocumentClick?.(document)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(type)}
                      <span>{name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{type?.toUpperCase()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Share">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Move</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
