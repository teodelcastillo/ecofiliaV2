"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyLibrary } from "./my-library"
import { ProjectsView } from "../../projects/components/projects-view"
import { FileText, FolderKanban } from "lucide-react"
import { motion } from "framer-motion"
import type { Document, Project } from "@/models"

interface IntegratedLibraryProps {
  documents: Document[]
  userId: string
  initialLimit: number
}

export function IntegratedLibrary({ documents, userId, initialLimit }: IntegratedLibraryProps) {
  const [activeTab, setActiveTab] = useState("documents")

  const handleProjectSelect = (project: Project) => {
    // Handle project selection if needed
    console.log("Selected project:", project)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>My Documents</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span>My Projects</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <MyLibrary documents={documents} userId={userId} initialLimit={initialLimit} />
          </motion.div>
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectsView onSelectProject={handleProjectSelect} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
