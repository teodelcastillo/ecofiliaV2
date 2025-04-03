"use client"

import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Project } from "@/models"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()
  const formattedDate = formatDistanceToNow(new Date(project.created_at), { addSuffix: true })

  const handleViewDetails = () => {
    router.push(`/protected/projects/${project.id}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handleViewDetails}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.category}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleViewDetails}>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit project</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Archive project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{project.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-3 w-3" />
            {project.client}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Updated {formattedDate}</CardFooter>
    </Card>
  )
}
