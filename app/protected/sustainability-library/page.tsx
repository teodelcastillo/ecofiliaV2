import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Map, Target, PieChart, Thermometer, Leaf } from "lucide-react"
import Link from "next/link"
import { GiMonsteraLeaf } from "react-icons/gi"

const resources = [
  {
    icon: FileText,
    title: "All categories",
    description: "All our documents. Explore a curated selection of global sustainability documents.",
    category: "all",
  },
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
  {
    icon: Target,
    title: "Long-Term Strategies (LTS)",
    description: "Review long-term approaches to achieving sustainability goals.",
    category: "all",
  },
  {
    icon: PieChart,
    title: "ESG Guidelines",
    description: "Follow best practices for Environmental, Social, and Governance performance.",
    category: "all",
  },
  {
    icon: Thermometer,
    title: "IPCC Reports",
    description:
      "Access the latest scientific findings on climate change from the Intergovernmental Panel on Climate Change.",
    category: "all",
  },
  {
    icon: Leaf,
    title: "IPBES Reports",
    description:
      "Explore biodiversity assessments from the Intergovernmental Science-Policy Platform on Biodiversity and Ecosystem Services.",
    category: "all",
  },
]

export default function SustainabilityOverview() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <GiMonsteraLeaf className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Sustainability Library</h1>
      </div>
        <p className="text-muted-foreground mb-8">
        Explore a curated selection of global sustainability documents to guide your environmental strategies and analysis.        </p>

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
