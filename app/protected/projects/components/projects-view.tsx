"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProjectCard } from "./project-card"
import type { Project } from "@/models"
import { createClient } from "@/utils/supabase/client"
import { CreateProjectModal } from "./create-project"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const categories = ["All", "Sustainability", "Energy", "Water", "Waste"]
interface ProjectsViewProps {
  onSelectProject?: (project: Project) => void
  className?: string
}

export function ProjectsView({ onSelectProject, className = "" }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error.message)
      } else {
        setProjects(data || [])
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleProjectClick = (project: Project) => {
    if (onSelectProject) {
      onSelectProject(project)
    } else {
      router.push(`/protected/projects/${project.id}`)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>

        <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Category: {selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {categories.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <p className="text-muted-foreground">Loading projects...</p>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg"
          >
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ProjectCard project={project} onClick={() => handleProjectClick(project)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
