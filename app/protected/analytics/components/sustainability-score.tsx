import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Droplet, Zap, Recycle } from "lucide-react"

const scores = [
  { title: "Overall Score", value: 85, icon: Leaf, change: 5 },
  { title: "Water Usage", value: 78, icon: Droplet, change: -2 },
  { title: "Energy Efficiency", value: 92, icon: Zap, change: 8 },
  { title: "Waste Reduction", value: 81, icon: Recycle, change: 3 },
]

export function SustainabilityScore() {
  return (
    <>
      {scores.map((score) => (
        <Card key={score.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{score.title}</CardTitle>
            <score.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{score.value}</div>
            <p className="text-xs text-muted-foreground">
              {score.change > 0 ? "+" : ""}
              {score.change}% from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

