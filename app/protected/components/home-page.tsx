"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Leaf,
  Globe,
  Recycle,
  BookOpen,
  MessageCircle,
  FileText,
  FolderKanban,
  BarChart,
  FileUp,
  FolderPlus,
  Puzzle,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { DocumentUploadModal } from "../dashboard/components/document-upload-modal"
import { CreateProjectModal } from "../projects/components/create-project"
import { RecentActivityCard } from "../dashboard/components/recent-activity-card"

interface Document {
  id: string
  name: string
  file_path?: string
  created_at: string
  category?: string
}

interface Project {
  id: string
  name: string
  description?: string
  category?: string
  created_at: string
}

interface Report {
  id: string
  project_id: string
  projectName: string
  type: string
  name?: string
  created_at: string
}

interface HomePageProps {
  user: User
  profile: {
    full_name?: string
    avatar_url?: string
    role?: string
  }
  recentDocuments: Document[]
  projects: Project[]
  reports: Report[]
}


export function HomePage({ user, profile, recentDocuments, projects, reports }: HomePageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  // Get user's first name for greeting
  const displayName = profile?.full_name || "User"
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1)
  

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with greeting */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {capitalizedName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {capitalizedName}
          </h1>
          <p className="text-muted-foreground">
            Welcome to Ecofilia - Accelerating sustainability with intelligence and purpose
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full py-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/protected/ecofilia-expert">
              AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/protected/sustainability-library">Sustainability Library</Link>
          </Button>
        </div>
      </section>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Left column (2/3 width on large screens) */}
        <div className="md:col-span-1 lg:col-span-2 space-y-6">
          {/* Quick Access Section */}
          <section className="w-full">
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <Globe className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>Chat with your documents using AI</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/protected/ecofilia-expert" className="flex items-center">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <BookOpen className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>My Library</CardTitle>
                    <CardDescription>Access your uploaded documents</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/protected/my-library" className="flex items-center">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <MessageCircle className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Sustainability Library</CardTitle>
                    <CardDescription>Browse sustainability resources</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/protected/sustainability-library" className="flex items-center">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <FolderKanban className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Manage your sustainability projects</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/protected/projects" className="flex items-center">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <Leaf className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>Generate sustainability reports</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/protected/reports" className="flex items-center">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <Recycle className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>View sustainability analytics</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/protected/analytics" className="flex items-center">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <RecentActivityCard
            documents={recentDocuments}
            projects={projects}
            reports={reports}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenProjectModal={() => setIsProjectModalOpen(true)}
          />
        </div>

        {/* Right column (1/3 width on large screens) */}
        <div className="md:col-span-1 space-y-6 self-start">
          {/* About Ecofilia */}
          <section className="w-full">
            <div className="space-y-6">
              <Card className="min-h-[300px] h-full">
                <CardContent className="space-y-3 pt-6">
                  <h2>About Ecofilia</h2>
                  <p className="text-sm text-muted-foreground">
                    Ecofilia is your comprehensive platform for sustainability management—designed for organizations
                    aiming to streamline environmental workflows, ensure compliance, and accelerate climate action.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We combine modern document intelligence with actionable insights to help you analyze, track, and
                    improve your environmental impact—at scale.
                  </p>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">AI-powered document analysis</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Sustainability reporting</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Recycle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Environmental impact tracking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Puzzle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Project-based knowledge management</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" onClick={() => setIsUploadModalOpen(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <Button className="w-full justify-start" onClick={() => setIsProjectModalOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link href="/protected/reports">
                  <BarChart className="mr-2 h-4 w-4" />
                  Generate Report
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/protected/ecofilia-expert">
                  <FileText className="mr-2 h-4 w-4" />
                  Ecofilia Expert
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <DocumentUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} userId={user.id} />
      <CreateProjectModal open={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
    </div>
  )
}

export default HomePage
