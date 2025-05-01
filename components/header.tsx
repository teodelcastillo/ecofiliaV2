"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
            <Image src="/ECOFILIALEAF.png" alt="Ecofilia Logo" width={32} height={32} className="h-8 w-8" />        
             <span className="text-xl font-bold text-foreground">Ecofilia</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Button
            onClick={() => scrollToSection("solution")}
            variant="ghost"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            The Solution
          </Button>
          <Button
            onClick={() => scrollToSection("about")}
            variant="ghost"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            About Us
          </Button>
          <Button
            onClick={() => scrollToSection("contact")}
            variant="ghost"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contact
          </Button>
          <Button>Get Started</Button>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              <Button
                onClick={() => scrollToSection("solution")}
                variant="ghost"
                className="justify-start text-sm font-medium transition-colors hover:text-primary"
              >
                The Solution
              </Button>
              <Button
                onClick={() => scrollToSection("about")}
                variant="ghost"
                className="justify-start text-sm font-medium transition-colors hover:text-primary"
              >
                About Us
              </Button>
              <Button
                onClick={() => scrollToSection("contact")}
                variant="ghost"
                className="justify-start text-sm font-medium transition-colors hover:text-primary"
              >
                Contact
              </Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
