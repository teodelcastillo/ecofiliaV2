import type React from "react"
import { Leaf } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 transition-colors hover:opacity-80">
            <Image src="/ECOFILIALEAF.png" alt="Ecofilia Logo" width={32} height={32} className="h-8 w-8" />
            <span className="font-bold text-lg tracking-tight">Ecofilia</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-b from-secondary/30 to-background/80">{children}</main>
      <footer className="border-t py-4 bg-background">
        <div className="container flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Ecofilia. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
