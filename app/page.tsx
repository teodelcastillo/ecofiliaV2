import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-colors hover:opacity-80">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Ecofilia</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="hidden md:flex gap-4">
            <Link href="/auth?tab=sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth?tab=sign-up">
              <Button size="sm">Join Us</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 pb-2">
                  Empowering Sustainability. Together.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
                  Join our community of sustainability enthusiasts and start making a difference today. 
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                <Link href="/auth?tab=sign-in" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base rounded-full">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth?tab=sign-up" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base rounded-full">
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-center">
              <div className="rounded-lg border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                <Leaf className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Sustainable Solutions</h3>
                <p className="text-muted-foreground">Discover eco-friendly approaches to everyday challenges.</p>
              </div>
              <div className="rounded-lg border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                <Leaf className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Community Driven</h3>
                <p className="text-muted-foreground">Connect with like-minded individuals passionate about change.</p>
              </div>
              <div className="rounded-lg border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                <Leaf className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Innovative Thinking</h3>
                <p className="text-muted-foreground">Explore cutting-edge ideas for a greener tomorrow.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/50">
        <div className="container flex flex-col gap-6 py-8 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-semibold">Ecofilia</span>
            </div>
            <nav className="flex gap-6 flex-wrap">
              <Link href="#" className="text-sm hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="#" className="text-sm hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#" className="text-sm hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="#" className="text-sm hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Ecofilia. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
