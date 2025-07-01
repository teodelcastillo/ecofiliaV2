"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import type { Project } from "@/models"

interface ProjectMonitoringProps {
  project: Project
}

// Mock data - replace with real data from your backend
const mockMetrics = {
  completion: 75,
  documentsProcessed: 12,
  totalDocuments: 16,
  lastActivity: "2 hours ago",
  reportsGenerated: 3,
  collaborators: 5,
  milestones: {
    completed: 4,
    total: 6,
  },
  trends: {
    documentsThisWeek: 8,
    documentsLastWeek: 5,
    reportsThisMonth: 3,
    reportsLastMonth: 1,
  },
}

const mockActivities = [
  {
    id: 1,
    type: "document_added",
    description: "New document added: Sustainability Report Q4",
    timestamp: "2 hours ago",
    status: "success",
  },
  {
    id: 2,
    type: "report_generated",
    description: "Summary report generated successfully",
    timestamp: "1 day ago",
    status: "success",
  },
  {
    id: 3,
    type: "milestone_completed",
    description: "Data collection phase completed",
    timestamp: "3 days ago",
    status: "success",
  },
  {
    id: 4,
    type: "alert",
    description: "Missing documents for analysis",
    timestamp: "5 days ago",
    status: "warning",
  },
]

const mockMilestones = [
  { id: 1, name: "Project Setup", completed: true, dueDate: "2024-01-15" },
  { id: 2, name: "Data Collection", completed: true, dueDate: "2024-01-30" },
  { id: 3, name: "Initial Analysis", completed: true, dueDate: "2024-02-15" },
  { id: 4, name: "Report Generation", completed: true, dueDate: "2024-02-28" },
  { id: 5, name: "Review & Validation", completed: false, dueDate: "2024-03-15" },
  { id: 6, name: "Final Delivery", completed: false, dueDate: "2024-03-30" },
]

export function ProjectMonitoring({ project }: ProjectMonitoringProps) {
  const [metrics, setMetrics] = useState(mockMetrics)
  const [activities, setActivities] = useState(mockActivities)
  const [milestones, setMilestones] = useState(mockMilestones)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document_added":
        return <FileText className="h-4 w-4" />
      case "report_generated":
        return <TrendingUp className="h-4 w-4" />
      case "milestone_completed":
        return <CheckCircle className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.completion}%</div>
              <Progress value={metrics.completion} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {metrics.milestones.completed} of {metrics.milestones.total} milestones completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.documentsProcessed}/{metrics.totalDocuments}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">
                  +{metrics.trends.documentsThisWeek - metrics.trends.documentsLastWeek} this week
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Documents processed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.reportsGenerated}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">
                  +{metrics.trends.reportsThisMonth - metrics.trends.reportsLastMonth} this month
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total reports</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.lastActivity}</div>
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{metrics.collaborators} collaborators</span>
              </div>
              <p className="text-xs text-muted-foreground">Recent project activity</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Milestones */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {milestone.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    <div>
                      <p className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}>
                        {milestone.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Due: {milestone.dueDate}</p>
                    </div>
                  </div>
                  <Badge variant={milestone.completed ? "default" : "secondary"}>
                    {milestone.completed ? "Completed" : "Pending"}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <div className={`p-1 rounded-full ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
