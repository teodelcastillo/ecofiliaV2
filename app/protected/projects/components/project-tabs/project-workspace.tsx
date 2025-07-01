"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare, Clock, AlertCircle, Plus, Calendar, User, Flag, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Project } from "@/models"

interface Task {
  id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: string
  assignee?: string
  createdAt: string
}

interface ProjectWorkspaceProps {
  project: Project
}

// Mock data - replace with real data from your backend
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review sustainability metrics",
    description: "Analyze the latest sustainability data and identify key trends",
    status: "pending",
    priority: "high",
    dueDate: "2024-01-20",
    assignee: "John Doe",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Complete environmental impact assessment",
    description: "Finalize the environmental impact assessment for Q4",
    status: "in_progress",
    priority: "medium",
    dueDate: "2024-01-25",
    assignee: "Jane Smith",
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    title: "Upload energy consumption data",
    description: "Upload the latest energy consumption reports to the system",
    status: "completed",
    priority: "low",
    dueDate: "2024-01-15",
    assignee: "Mike Johnson",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    title: "Prepare quarterly report",
    description: "Compile all data into the quarterly sustainability report",
    status: "pending",
    priority: "high",
    dueDate: "2024-01-30",
    assignee: "Sarah Wilson",
    createdAt: "2024-01-12",
  },
]

export function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [showAddTask, setShowAddTask] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all")

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      status: "pending",
      priority: "medium",
      createdAt: new Date().toISOString(),
    }

    setTasks([newTask, ...tasks])
    setNewTaskTitle("")
    setNewTaskDescription("")
    setShowAddTask(false)
  }

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: task.status === "completed" ? "pending" : "completed",
          }
        }
        return task
      }),
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Workspace</h3>
          <p className="text-sm text-muted-foreground">Manage tasks and track progress for {project.name}</p>
        </div>
        <Button onClick={() => setShowAddTask(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(taskCounts).map(([status, count]) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`cursor-pointer transition-colors ${filter === status ? "ring-2 ring-primary" : ""}`}
              onClick={() => setFilter(status as any)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{status.replace("_", " ")}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  {getStatusIcon(status)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Task description (optional)"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                    Add Task
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddTask(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className={`${task.status === "completed" ? "opacity-75" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="mt-1"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4
                          className={`font-medium ${
                            task.status === "completed" ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            <Flag className="mr-1 h-3 w-3" />
                            {task.priority}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {task.description && (
                        <p
                          className={`text-sm ${
                            task.status === "completed" ? "text-muted-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {task.assignee}
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {task.dueDate}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          {getStatusIcon(task.status)}
                          <span className="capitalize">{task.status.replace("_", " ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 border border-dashed rounded-lg"
          >
            <CheckSquare className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all"
                ? "Create your first task to get started"
                : `No ${filter.replace("_", " ")} tasks found`}
            </p>
            {filter === "all" && (
              <Button onClick={() => setShowAddTask(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
