import Link from "next/link"
import { ArrowRight, Leaf, Globe, Recycle, Users, BookOpen, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  
  return (
    <div className="flex flex-col space-y-8 p-6">
      {/* Hero Section */}
      <section className="w-full py-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome to Ecofilia {}</h1>
          <p className="text-muted-foreground">
          Accelerating sustainability with intelligence and purpose          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/protected/document-chat">
                AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/protected/sustainability-library">Sustanability Library</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="w-full py-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Quick Access</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <Card>
              <CardHeader className="pb-2">
                <Users className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Dashboard description</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/protected/dashboard" className="flex items-center">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Globe className="h-6 w-6 text-primary mb-2" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>AI Assistant description</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/protected/document-chat" className="flex items-center">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Recycle className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Analitycs</CardTitle>
                <CardDescription>Analytics description</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/protected/analytics" className="flex items-center">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <BookOpen className="h-6 w-6 text-primary mb-2" />
                <CardTitle>My Library</CardTitle>
                <CardDescription>My library description</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/protected/my-library" className="flex items-center">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <MessageCircle className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Sustainability Library</CardTitle>
                <CardDescription>Sustainablity library description</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/protected/sustainability-library" className="flex items-center">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Leaf className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Reports</CardTitle>
                <CardDescription>Reports description</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/protected/reports" className="flex items-center">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Activity Section 
      <section className="w-full py-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Latest Blog Post</CardTitle>
                <CardDescription>Posted on {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">
                  Discover our latest insights on sustainable practices and environmental conservation efforts.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/blog/latest">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Event</CardTitle>
                <CardDescription>
                  Join us on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">
                  Community cleanup and educational workshop on reducing waste and promoting recycling.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/events">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section 
      <section className="w-full py-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Our Impact</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">1,200+</CardTitle>
                <CardDescription>Trees Planted</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">500+</CardTitle>
                <CardDescription>Community Members</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">25+</CardTitle>
                <CardDescription>Active Projects</CardDescription>
              </CardHeader>
            </Card>
          </div>*
        </div>
      </section>*/}
    </div>
  )
}

