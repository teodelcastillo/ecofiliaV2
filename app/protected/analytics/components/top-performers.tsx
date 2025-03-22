import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const topPerformers = [
  { name: "Green Office Initiative", score: 95, change: "+5%" },
  { name: "Solar Panel Installation", score: 92, change: "+3%" },
  { name: "Waste Reduction Program", score: 88, change: "+7%" },
  { name: "Sustainable Supply Chain", score: 85, change: "+2%" },
  { name: "Energy Efficiency Audit", score: 83, change: "+4%" },
]

export function TopPerformers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((project, index) => (
            <div key={project.name} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{project.name}</p>
                <p className="text-sm text-muted-foreground">Score: {project.score}</p>
              </div>
              <Badge variant="secondary">{project.change}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

