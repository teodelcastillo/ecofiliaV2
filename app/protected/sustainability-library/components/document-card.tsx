import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, User } from "lucide-react"
import { formatDate } from "../utils/format-date"

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

export function DocumentCard({ document }: DocumentCardProps) {
  const { name, description, category, created_at, file_url, author } = document

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        {category && (
          <div className="mb-2">
            <Badge variant="secondary">{category}</Badge>
          </div>
        )}
        <CardTitle>{name || "Unnamed Document"}</CardTitle>
        <CardDescription className="line-clamp-2">{description || "No description available"}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          {author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{author}</span>
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
      <CardFooter>
        <Button className="w-full" variant="outline" asChild>
          <a href={file_url || "#"} target="_blank" rel="noopener noreferrer">
            <FileText className="mr-2 h-4 w-4" />
            View Document
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
