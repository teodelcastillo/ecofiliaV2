"use client"

import { ProjectReportsView } from "../ProjectReportsView"
import type { Project } from "@/models"

interface ProjectReportsProps {
  project: Project
}

export function ProjectReports({ project }: ProjectReportsProps) {
  return (
    <div>
      <ProjectReportsView project={project} />
    </div>
  )
}
