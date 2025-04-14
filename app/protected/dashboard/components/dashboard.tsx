"use client"

import type React from "react"

import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FileText,
  BarChart,
  FileUp,
  FolderPlus,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { DocumentUploadModal } from "./document-upload-modal"
import { CreateProjectModal } from "../../projects/components/create-project"
import { RecentActivityCard } from "./recent-activity-card"

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

interface DashboardProps {
  user: User
  recentDocuments: Document[]
  projects: Project[]
  reports: Report[]
}

export function Dashboard({ user, recentDocuments, projects, reports }: DashboardProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  // Get user's first name for greeting
  const firstName = user.email?.split("@")[0] || "User"
  const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

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
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {capitalizedName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {capitalizedName}
          </h1>
          <p className="text-muted-foreground">Here's an overview of your recent activity</p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">


          {/* Recent Activity */}
          <RecentActivityCard
            documents={recentDocuments}
            projects={projects}
            reports={reports}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenProjectModal={() => setIsProjectModalOpen(true)}
            />

        </div>

        {/* Right column (1/3 width) */}
        <div className="space-y-6">
          {/* Sustainability Score */}

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
                  Ecofilia Epert
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

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string
  trend: string
  color: "emerald" | "blue" | "cyan" | "purple" | "amber"
}

function MetricCard({ icon, title, value, trend, color }: MetricCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900",
    blue: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900",
    cyan: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950 dark:border-cyan-900",
    purple: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-900",
    amber: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-900",
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={`border ${colorClasses[color]}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            {icon}
            <span className="text-xs font-medium text-muted-foreground">{trend}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function EmptyState({
  message,
  description,
  action,
}: { message: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      {action}
    </div>
  )
}
