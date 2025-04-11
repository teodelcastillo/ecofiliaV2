"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, User, Eye, Download, Share2 } from "lucide-react"
import { formatDate } from "../utils/format-date"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DocumentCardProps {
  document: {
    id: string
    name?: string
    description?: string
    category?: string
    created_at?: string
    file_url?: string
    author?: string
    [key: string]: any
  }
}

export function DocumentCardEnhanced({ document }: DocumentCardProps) {
  const { name, description, category, created_at, file_url, author } = document
  const [isHovered, setIsHovered] = useState(false)

  const handleDownload = () => {
    if (file_url) {
      window.open(file_url, "_blank")
    }
  }

  const handleShare = () => {
    if (navigator.share && file_url) {
      navigator
        .share({
          title: name || "Shared Document",
          text: description || "Check out this document",
          url: file_url,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else if (file_url) {
      navigator.clipboard
        .writeText(file_url)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Error copying:", err))
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full flex flex-col overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-2">
            {category && <Badge variant="secondary">{category}</Badge>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="line-clamp-1">{name || "Unnamed Document"}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1">{description || "No description available"}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <div className="space-y-2 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="truncate">{author}</span>
              </div>
            )}
            {created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(created_at)}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button className="w-full" variant={isHovered ? "default" : "outline"} asChild>
            <a href={file_url || "#"} target="_blank" rel="noopener noreferrer">
              {isHovered ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Open Document
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  View Document
                </>
              )}
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
