"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Calendar, Download, FileText, Filter, Globe, Plus, Search, Share2, Trash2, User } from "lucide-react"
import { AiReportGenerator } from "./AiReportGenerator"
import { KpiDashboard } from "./KpiDashboard"

type Report = {
    id: string
    title: string
    description: string
    date: string
    author: string
    tags: string[]
    status: "completed" | "draft" | "published"
  }
  
  type Action = {
    icon: React.ReactNode
    label: string
  }
  

  const myReports: Report[] = [
    {
      id: "rep-001",
      title: "Carbon Footprint Analysis Q1 2023",
      description: "Quarterly analysis of carbon emissions across operations",
      date: "2023-03-15",
      author: "Your Name",
      tags: ["carbon", "quarterly"],
      status: "completed",
    },
    {
      id: "rep-002",
      title: "Water Usage Optimization Plan",
      description: "Strategic plan for reducing water consumption",
      date: "2023-05-22",
      author: "Your Name",
      tags: ["water", "strategy"],
      status: "draft",
    },
    {
      id: "rep-003",
      title: "Renewable Energy Transition Report",
      description: "Progress report on renewable energy adoption",
      date: "2023-07-10",
      author: "Your Name",
      tags: ["energy", "renewable"],
      status: "completed",
    },
  ]
  
  const publicReports: Report[] = [
    {
      id: "pub-001",
      title: "Global Climate Impact Assessment 2023",
      description: "Comprehensive analysis of climate change impacts worldwide",
      date: "2023-06-05",
      author: "World Environmental Council",
      tags: ["climate", "global"],
      status: "published",
    },
    {
      id: "pub-002",
      title: "Sustainable Development Goals Progress",
      description: "Annual tracking report on SDG environmental targets",
      date: "2023-04-18",
      author: "United Nations Environment Programme",
      tags: ["SDG", "sustainability"],
      status: "published",
    },
    {
      id: "pub-003",
      title: "Biodiversity Conservation Strategies",
      description: "Best practices for ecosystem preservation and restoration",
      date: "2023-02-28",
      author: "International Conservation Alliance",
      tags: ["biodiversity", "conservation"],
      status: "published",
    },
  ]
  

export function ReportsOverview() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter reports based on search query
  const filteredMyReports = myReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredPublicReports = publicReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Environmental Reports</h1>
        <p className="text-muted-foreground">Access, manage, and generate environmental impact reports</p>
      </div>

      {/* KPI Dashboard */}
      {/*<KpiDashboard /> */}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </div>

          {/* Reports Tabs */}
          <Tabs defaultValue="my-reports">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-reports">
                <User className="mr-2 h-4 w-4" />
                My Reports
              </TabsTrigger>
              <TabsTrigger value="public-reports">
                <Globe className="mr-2 h-4 w-4" />
                Public Reports
              </TabsTrigger>
            </TabsList>

            {/* My Reports Tab */}
            <TabsContent value="my-reports" className="space-y-4 mt-4">
              {filteredMyReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-muted-foreground mt-2">
                    {searchQuery ? "Try a different search term" : "Create your first report to get started"}
                  </p>
                  {!searchQuery && (
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Report
                    </Button>
                  )}
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {filteredMyReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        actions={[
                          { icon: <Download className="h-4 w-4" />, label: "Download" },
                          { icon: <Share2 className="h-4 w-4" />, label: "Share" },
                          { icon: <Trash2 className="h-4 w-4" />, label: "Delete" },
                        ]}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            {/* Public Reports Tab */}
            <TabsContent value="public-reports" className="space-y-4 mt-4">
              {filteredPublicReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No public reports found</h3>
                  <p className="text-muted-foreground mt-2">Try a different search term</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {filteredPublicReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        actions={[
                          { icon: <Download className="h-4 w-4" />, label: "Download" },
                          { icon: <BookOpen className="h-4 w-4" />, label: "View" },
                        ]}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Report Generator Section */}
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
  }
  
  function ReportCard({ report, actions }: ReportCardProps) {
    const statusColors: Record<Report["status"], string> = {
      completed: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-blue-100 text-blue-800",
    }
  
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription className="mt-1">{report.description}</CardDescription>
            </div>
            <Badge className={statusColors[report.status]}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-2">
            {report.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(report.date).toLocaleDateString()}
            <Separator orientation="vertical" className="mx-2 h-4" />
            <User className="mr-1 h-3 w-3" />
            {report.author}
          </div>
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <Button key={index} variant="ghost" size="icon" title={action.label}>
                {action.icon}
                <span className="sr-only">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardFooter>
      </Card>
    )
  }
  
