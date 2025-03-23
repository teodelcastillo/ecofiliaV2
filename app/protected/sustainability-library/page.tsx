import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Map, Target, PieChart, Thermometer, Leaf, HelpCircle } from "lucide-react"
import Link from "next/link"

const resources = [
  {
    icon: FileText,
    title: "Nationally Determined Contributions (NDCs)",
    description: "Understand the commitments countries have made under the Paris Agreement.",
    category: "NDCs",
  },
  {
    icon: Map,
    title: "National Adaptation Plans (NAPs)",
    description: "Discover strategies for adapting to climate change across different nations.",
    category: "NAPs",
  },
  // ... add the rest
]

export default function SustainabilityOverview() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sustainability Library</h1>
        <p className="text-muted-foreground">
          Explore a curated selection of global sustainability documents to guide your environmental strategies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Link key={resource.title} href={`/protected/sustainability-library/${encodeURIComponent(resource.category)}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <resource.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{resource.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
