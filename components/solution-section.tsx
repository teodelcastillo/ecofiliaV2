import { CheckCircle, Leaf, Recycle, Sprout } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SolutionSection() {
  return (
    <section id="solution" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-foreground">The Solution</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our innovative platform integrates sustainable practices with cutting-edge technology to create a
              comprehensive ecosystem for environmental management.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 py-12 lg:grid-cols-2">
          {/* Video Section */}
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <p className="text-muted-foreground">Click to play our solution overview</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sprout className="mr-2 h-5 w-5 text-primary" />
                  Sustainable Resource Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our platform optimizes resource allocation and usage, reducing waste and maximizing efficiency across
                  your operations.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Recycle className="mr-2 h-5 w-5 text-primary" />
                  Circular Economy Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Transform your business model with our circular economy solutions that turn waste into resources and
                  create sustainable value chains.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  Environmental Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stay ahead of regulations with our compliance tools that monitor, report, and optimize your
                  environmental impact.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-primary" />
                  Carbon Footprint Reduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Measure, track, and reduce your carbon emissions with our comprehensive carbon management system.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Insights Section
        <div className="mt-16 bg-muted rounded-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 text-foreground">Key Insights</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform has delivered measurable results for businesses across various industries.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <p className="font-medium text-foreground">Average reduction in carbon emissions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$2.5M</div>
              <p className="font-medium text-foreground">Average annual savings for enterprise clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <p className="font-medium text-foreground">Compliance rate with environmental regulations</p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
