import { Folder } from "lucide-react"
import { ProjectsView } from "./components/projects-view"

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <Folder className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>
      <p className="text-muted-foreground mb-8">Your centralized space to organize sustainability initiatives and unlock AI-powered insights, reporting, and collaboration.<br/>Create and manage your projects, track progress, and collaborate with your team.</p>
      <ProjectsView />
    </div>
     )
}

