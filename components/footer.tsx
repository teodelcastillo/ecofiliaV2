import Link from "next/link"
import { Leaf } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Logo } from "./logo"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Logo size="sm"  />
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Ecofilia. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
