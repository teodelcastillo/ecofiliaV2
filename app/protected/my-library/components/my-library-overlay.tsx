"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LibraryBig, BookOpen, FolderOpen, BrainCircuit, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { WaitlistModal } from "../../community/components/waitlist-modal"
import { useState } from "react"

export function LibraryComingSoonOverlay() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  // Simple close function that only affects the current session
  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred background - this will show the library page blurred in the background */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Coming soon card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-2xl"
      >
        <Card className="border-2 border-primary/20 shadow-xl relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Close overlay"
          >
            <X className="h-5 w-5" />
          </button>

          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <LibraryBig className="h-16 w-16 text-primary/80" />
                <BookOpen className="h-10 w-10 text-primary/60 absolute -bottom-2 -right-2" />
                <FolderOpen className="h-8 w-8 text-primary/70 absolute -top-1 -left-4" />
                <BrainCircuit className="h-8 w-8 text-primary absolute -top-2 -right-4" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Library Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-muted-foreground">
              This library section is coming soon! It will be your centralized space to organize all your sustainability
              documents and resources.
            </p>

            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-md">
                Ecofilia's library will empower your sustainability initiatives with AI-powered document management,
                helping you organize, search, and extract insights from your sustainability documents, reports, and
                resources to make better environmental decisions.
              </p>
            </div>

            <div className="pt-4 gap-4 flex flex-col sm:flex-row justify-center items-center">
              <WaitlistModal>
                <Button size="lg" className="px-8">
                  I want to try this feature!
                </Button>
              </WaitlistModal>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
