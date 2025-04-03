"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Calendar, Download, FileText, Filter, Globe, Plus, Search, Share2, Trash2, User, BarChart3, Bookmark, Clock, AlertTriangle } from 'lucide-react'
import { AiReportGenerator } from "./AiReportGenerator" 
import { motion } from "framer-motion"

type Report = {
  id: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  status: "completed" | "draft" | "published"
  priority?: "high" | "medium" | "low"
  category?: "environmental" | "social" | "economic" | "governance"
}

type Action = {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

const myReports: Report[] = [
  {
    id: "rep-001",
    title: "Brazil Housing Project Report",
    description: "Floripa for All - Sustainable housing initiative impact assessment",
    date: "2023-03-15",
    author: "Sofia del Castillo",
    tags: ["housing", "sustainability"],
    status: "completed",
    priority: "high",
    category: "social"
  },
  {
    id: "rep-002",
    title: "Water Usage Optimization Plan",
    description: "Strategic plan for reducing water consumption in urban areas",
    date: "2023-05-22",
    author: "Your Name",
    tags: ["water", "strategy", "conservation"],
    status: "draft",
    priority: "medium",
    category: "environmental"
  },
  {
    id: "rep-003",
    title: "Renewable Energy Transition Report",
    description: "Progress report on renewable energy adoption across regional facilities",
    date: "2023-07-10",
    author: "Your Name",
    tags: ["energy", "renewable", "transition"],
    status: "completed",
    priority: "high",
    category: "environmental"
  },
]

const publicReports: Report[] = [
  {
    id: "pub-001",
    title: "Global Climate Impact Assessment 2023",
    description: "Comprehensive analysis of climate change impacts worldwide",
    date: "2023-06-05",
    author: "World Environmental Council",
    tags: ["climate", "global", "assessment"],
    status: "published",
    category: "environmental"
  },
  {
    id: "pub-002",
    title: "Sustainable Development Goals Progress",
    description: "Annual tracking report on SDG environmental targets and achievements",
    date: "2023-04-18",
    author: "United Nations Environment Programme",
    tags: ["SDG", "sustainability", "goals"],
    status: "published",
    category: "governance"
  },
  {
    id: "pub-003",
    title: "Biodiversity Conservation Strategies",
    description: "Best practices for ecosystem preservation and restoration in protected areas",
    date: "2023-02-28",
    author: "International Conservation Alliance",
    tags: ["biodiversity", "conservation", "ecosystem"],
    status: "published",
    category: "environmental"
  },
]

export function ReportsOverview() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSelect = (id: string, isSelected: boolean) => {
    setSelectedReports((prev) =>
      isSelected ? [...prev, id] : prev.filter((reportId) => reportId !== id)
    )
  }

  const handleSelectAll = (reports: Report[], isSelected: boolean) => {
    if (isSelected) {
      setSelectedReports((prev) => [...prev, ...reports.map(r => r.id)])
    } else {
      setSelectedReports((prev) => 
        prev.filter(id => !reports.some(r => r.id === id))
      )
    }
  }

  const filteredMyReports = myReports.filter(
    (report) => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesFilter = !activeFilter || 
        report.category === activeFilter || 
        report.tags.includes(activeFilter)
      
      return matchesSearch && matchesFilter
    }
  )

  const filteredPublicReports = publicReports.filter(
    (report) => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesFilter = !activeFilter || 
        report.category === activeFilter || 
        report.tags.includes(activeFilter)
      
      return matchesSearch && matchesFilter
    }
  )

  const allMyReportsSelected = filteredMyReports.length > 0 && 
    filteredMyReports.every(report => selectedReports.includes(report.id))
  
  const allPublicReportsSelected = filteredPublicReports.length > 0 && 
    filteredPublicReports.every(report => selectedReports.includes(report.id))

  const categories = [
    { value: "environmental", label: "Environmental" },
    { value: "social", label: "Social" },
    { value: "economic", label: "Economic" },
    { value: "governance", label: "Governance" }
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Environmental Reports
        </h1>
        <p className="text-muted-foreground text-lg">
          Access, manage, and generate environmental impact reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-10 h-12 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-xl"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-5 w-5" />
                  <span className="sr-only">Filter</span>
                  {activeFilter && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
                  )}
                </Button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 top-14 z-10 w-64 bg-background rounded-lg border shadow-lg p-4 space-y-3">
                    <h3 className="font-medium">Filter by Category</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`filter-${category.value}`}
                            checked={activeFilter === category.value}
                            onCheckedChange={(checked) => {
                              setActiveFilter(checked ? category.value : null)
                            }}
                          />
                          <label 
                            htmlFor={`filter-${category.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {category.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => setActiveFilter(null)}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Button className="h-12 rounded-xl">
                <Plus className="mr-2 h-5 w-5" />
                New Report
              </Button>
            </div>
          </div>

          <Tabs defaultValue="my-reports" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl p-1">
              <TabsTrigger value="my-reports" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="mr-2 h-4 w-4" />
                My Reports
              </TabsTrigger>
              <TabsTrigger value="public-reports" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Globe className="mr-2 h-4 w-4" />
                Public Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-reports" className="space-y-4 mt-6">
              {selectedReports.length > 0 && (
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg mb-4">
                  <div className="text-sm font-medium">
                    {selectedReports.length} report(s) selected
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
              
              {filteredMyReports.length === 0 ? (
                <EmptyState 
                  icon={<FileText className="h-16 w-16 text-muted-foreground/50" />}
                  title="No reports found"
                  description={searchQuery ? "Try a different search term or clear filters" : "Create your first report to get started"}
                  action={!searchQuery ? (
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Report
                    </Button>
                  ) : (
                    <Button variant="outline" className="mt-4" onClick={() => {
                      setSearchQuery("")
                      setActiveFilter(null)
                    }}>
                      Clear search and filters
                    </Button>
                  )}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="select-all-my" 
                        checked={allMyReportsSelected}
                        onCheckedChange={(checked) => handleSelectAll(filteredMyReports, !!checked)}
                      />
                      <label htmlFor="select-all-my" className="text-sm font-medium">
                        Select all
                      </label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {filteredMyReports.length} report(s)
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {filteredMyReports.map((report, index) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <ReportCard
                            report={report}
                            selected={selectedReports.includes(report.id)}
                            onSelect={handleSelect}
                            actions={[
                              { icon: <Download className="h-4 w-4" />, label: "Download" },
                              { icon: <Share2 className="h-4 w-4" />, label: "Share" },
                              { icon: <Trash2 className="h-4 w-4" />, label: "Delete" },
                            ]}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>

            <TabsContent value="public-reports" className="space-y-4 mt-6">
              {selectedReports.length > 0 && (
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg mb-4">
                  <div className="text-sm font-medium">
                    {selectedReports.length} report(s) selected
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
              
              {filteredPublicReports.length === 0 ? (
                <EmptyState 
                  icon={<Globe className="h-16 w-16 text-muted-foreground/50" />}
                  title="No public reports found"
                  description="Try a different search term or clear filters"
                  action={
                    <Button variant="outline" className="mt-4" onClick={() => {
                      setSearchQuery("")
                      setActiveFilter(null)
                    }}>
                      Clear search and filters
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="select-all-public" 
                        checked={allPublicReportsSelected}
                        onCheckedChange={(checked) => handleSelectAll(filteredPublicReports, !!checked)}
                      />
                      <label htmlFor="select-all-public" className="text-sm font-medium">
                        Select all
                      </label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {filteredPublicReports.length} report(s)
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {filteredPublicReports.map((report, index) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <ReportCard
                            report={report}
                            selected={selectedReports.includes(report.id)}
                            onSelect={handleSelect}
                            actions={[
                              { icon: <Download className="h-4 w-4" />, label: "Download" },
                              { icon: <BookOpen className="h-4 w-4" />, label: "View" },
                              { icon: <Bookmark className="h-4 w-4" />, label: "Save" },
                            ]}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <AiReportGenerator />
        </div>
      </div>
    </div>
  )
}

type ReportCardProps = {
  report: Report
  actions: Action[]
  selected: boolean
  onSelect: (id: string, selected: boolean) => void
}

function ReportCard({ report, actions, selected, onSelect }: ReportCardProps) {
  const statusColors: Record<Report["status"], string> = {
    completed: "bg-green-100 text-green-800 border-green-200",
    draft: "bg-amber-100 text-amber-800 border-amber-200",
    published: "bg-blue-100 text-blue-800 border-blue-200",
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    environmental: <Globe className="h-4 w-4 text-emerald-500" />,
    social: <User className="h-4 w-4 text-blue-500" />,
    economic: <BarChart3 className="h-4 w-4 text-violet-500" />,
    governance: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  }

  const priorityColors: Record<string, string> = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-blue-100 text-blue-800 border-blue-200",
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-primary/70">
      <div className="absolute top-4 left-4 z-10">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(report.id, !!checked)}
          className="h-5 w-5 rounded-md border-2"
        />
      </div>
      
      <CardHeader className="pl-12 pb-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">{report.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{report.description}</CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={`${statusColors[report.status]} px-3 py-1 rounded-full text-xs font-medium border`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </Badge>
            {report.priority && (
              <Badge variant="outline" className={`${priorityColors[report.priority]} px-2 py-0.5 text-xs rounded-full`}>
                {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pl-12 pb-3">
        <div className="flex flex-wrap gap-2">
          {report.category && (
            <Badge variant="outline" className="text-xs flex items-center gap-1 rounded-full px-3 py-1">
              {categoryIcons[report.category]}
              {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
            </Badge>
          )}
          {report.tags.filter(tag => tag).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs rounded-full px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pl-12 flex justify-between items-center pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <div className="flex items-center mr-3">
            <Clock className="mr-1 h-3 w-3" />
            {new Date(report.date).toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            {report.author}
          </div>
        </div>
        
        <div className="flex gap-1">
          {actions.map((action, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              size="icon" 
              title={action.label}
              className="h-8 w-8 rounded-full hover:bg-muted"
              onClick={action.onClick}
            >
              {action.icon}
              <span className="sr-only">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

type EmptyStateProps = {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-xl border border-dashed">
      <div className="rounded-full bg-background p-4 border mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        {description}
      </p>
      {action}
    </div>
  )
}
