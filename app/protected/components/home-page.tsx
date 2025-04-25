"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  LibraryBig,
  MessageCircle,
  FolderKanban,
  ChartSpline,
  FileUp,
  FolderPlus,
} from "lucide-react"
import { GiMonsteraLeaf } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";


import type { User } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MonstiaAvatar } from "./monstia-avatar"
import { DocumentUploadModal } from "../dashboard/components/document-upload-modal"
import { CreateProjectModal } from "../projects/components/create-project"
import { RecentActivityCard } from "../dashboard/components/recent-activity-card"
import { Document, Project, Report, Profile, } from "@/models"

interface HomePageProps {
  user: User
  profile: Profile | null
  recentDocuments: Document[]
  projects: Project[]
  reports: Report[]
}

export function HomePage({ user, profile, recentDocuments, projects, reports }: HomePageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  const capitalizedName = (profile?.full_name || "User").replace(/^./, (c) => c.toUpperCase())

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Greeting */}
      <div className="flex items-center gap-4 mb-8">
        <MonstiaAvatar size="md" showFallback />
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {capitalizedName}!
          </h1>
          <p className="text-muted-foreground">
            Welcome to <b>Ecofilia</b> – Accelerating sustainability with <b>intelligence and purpose</b>
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start mt-4">
        {/* Left Column */}
        <div className="md:col-span-1 lg:col-span-2 space-y-6">
          {/* Quick Access Cards */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <MessageCircle className="h-6 w-6 text-primary mb-2" />,
                title: "Ecofilia Assistant",
                description: "Ask Ecofilia anything about sustainability and climate. ",
                href: "/protected/ecofilia-expert",
              },
              {
                icon: <GiMonsteraLeaf className="h-6 w-6 text-primary mb-2" />,
                title: "Sustainability Library",
                description: "Explore accurated selection of sustainability resources",
                href: "/protected/sustainability-library",
              },
              {
                icon: <LibraryBig className="h-6 w-6 text-primary mb-2" />,
                title: "My Library",
                description: "Upload and manage your own sustainability documents",
                href: "/protected/my-library",
              },
              {
                icon: <FolderKanban className="h-6 w-6 text-primary mb-2" />,
                title: "Projects",
                description: "Manage your sustainability projects",
                href: "/protected/projects",
              },
              {
                icon: <TbReportAnalytics className="h-6 w-6 text-primary mb-2" />,
                title: "Reports",
                description: "Generate sustainability reports",
                href: "/protected/reports",
              },
              {
                icon: <ChartSpline className="h-6 w-6 text-primary mb-2" />,
                title: "Analytics",
                description: "Extract sustainability KPIs and insights",
                href: "/protected/analytics",
              },
            ].map(({ icon, title, description, href }) => (
              <Card key={title}>
                <CardHeader className="pb-2">
                  {icon}
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href={href} className="flex items-center">
                    {title === "Ecofilia Assistant"
                        ? "New chat"
                        : title === "My Library"
                        ? "My documents"
                        : title === "Sustainability Library"
                        ? "View resources"
                        : title === "Projects"
                        ? "Manage projects"
                        : title === "Reports"
                        ? "View reports"
                        : title === "Analytics"
                        ? "View Analytics"
                        : ""}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </section>

          <RecentActivityCard
            documents={recentDocuments}
            projects={projects}
            reports={reports}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenProjectModal={() => setIsProjectModalOpen(true)}
          />
        </div>

        {/* Right Column */}
        <div className="md:col-span-1 space-y-6 self-start">
          {/* About Ecofilia 
          <Card className="min-h-[300px] h-full">
            <CardContent className="space-y-3 pt-6">
              <h2>About Ecofilia</h2>
              <p className="text-sm text-muted-foreground">
                Ecofilia is your comprehensive platform for sustainability management—designed for organizations aiming to streamline environmental workflows, ensure compliance, and accelerate climate action.
              </p>
              <p className="text-sm text-muted-foreground">
                We combine modern document intelligence with actionable insights to help you analyze, track, and improve your environmental impact—at scale.
              </p>
              <div className="space-y-2 mt-4">
                {[
                  { icon: <Globe className="h-4 w-4 text-primary" />, label: "AI-powered document analysis" },
                  { icon: <Leaf className="h-4 w-4 text-primary" />, label: "Sustainability reporting" },
                  { icon: <Recycle className="h-4 w-4 text-primary" />, label: "Environmental impact tracking" },
                  { icon: <Puzzle className="h-4 w-4 text-primary" />, label: "Project-based knowledge management" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-start gap-2">
                    {icon}
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          */}

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
                  <TbReportAnalytics className="mr-2 h-4 w-4" />
                  Generate Report
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/protected/ecofilia-expert">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  New Chat
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
