"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const targetText1 = "With AI."
  const targetText2 = "Together."
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTarget, setCurrentTarget] = useState(targetText1)
  const [showCursor, setShowCursor] = useState(true)

  const typingSpeed = 150
  const deletingSpeed = 100
  const pauseTime = 1200

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && typedText === currentTarget) {
      // Wait before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, pauseTime)
    } else if (isDeleting && typedText === "") {
      // Switch to the other target text
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setCurrentTarget(prev =>
          prev === targetText1 ? targetText2 : targetText1
        )
      }, pauseTime / 2)
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1))
      }, deletingSpeed)
    } else {
      timeout = setTimeout(() => {
        setTypedText(currentTarget.slice(0, typedText.length + 1))
      }, typingSpeed)
    }

    return () => {
      clearTimeout(timeout)
      clearInterval(cursorInterval)
    }
  }, [typedText, isDeleting, currentTarget])

  return (
    <section className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 md:py-12 bg-background">
      <div className="container px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Empowering sustainability.{" "}
              <span className="relative inline-block min-w-[2ch]">
                <span className="text-primary">{typedText}</span>

              </span>
            </h1>
            <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
              Ecofilia helps you analyze, report, and scale climate action <br/>Smarter, faster, and more effectively.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg">Sign Up</Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
