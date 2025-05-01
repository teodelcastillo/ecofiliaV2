import { ArrowRight, BarChart3, Globe, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ValuePropositionSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-green-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why Choose Ecofilia</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We deliver measurable impact for businesses and the environment through our innovative platform.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-green-100 bg-white">
            <CardHeader className="pb-2">
              <Globe className="h-12 w-12 text-green-600 mb-2" />
              <CardTitle>Reduce Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our solutions help reduce carbon footprint by up to 40% while optimizing resource usage across your
                operations.
              </CardDescription>
              <div className="mt-4 flex items-center text-green-600 font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-white">
            <CardHeader className="pb-2">
              <BarChart3 className="h-12 w-12 text-green-600 mb-2" />
              <CardTitle>Increase Operational Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Clients report an average of 25% improvement in operational efficiency and significant cost savings.
              </CardDescription>
              <div className="mt-4 flex items-center text-green-600 font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-white">
            <CardHeader className="pb-2">
              <Lightbulb className="h-12 w-12 text-green-600 mb-2" />
              <CardTitle>Future-Proof Your Business</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Stay ahead of regulations and market demands with our forward-thinking sustainable business solutions.
              </CardDescription>
              <div className="mt-4 flex items-center text-green-600 font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-green-600 hover:bg-green-700">Discover Our Full Impact</Button>
        </div>
      </div>
    </section>
  )
}
