"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const targetText = "Together."
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  // Calculate the midpoint - we'll only delete until this point
  const halfwayPoint = Math.ceil(targetText.length -7)

  // Control typing/deleting speed
  const typingSpeed = 150
  const deletingSpeed = 100
  const pauseTime = 1500

  useEffect(() => {
    // Blink cursor continuously
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    // Handle typing and deleting
    let timeout

    if (!isDeleting && typedText === targetText) {
      // Pause before starting to delete
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, pauseTime)
    } else if (isDeleting && typedText.length === halfwayPoint) {
      // Stop deleting at halfway point and start typing again
      timeout = setTimeout(() => {
        setIsDeleting(false)
      }, pauseTime / 2)
    } else if (isDeleting) {
      // Delete one character
      timeout = setTimeout(() => {
        setTypedText(targetText.slice(0, typedText.length - 1))
      }, deletingSpeed)
    } else {
      // Type one character
      timeout = setTimeout(() => {
        setTypedText(targetText.slice(0, typedText.length + 1))
      }, typingSpeed)
    }

    return () => {
      clearTimeout(timeout)
      clearInterval(cursorInterval)
    }
  }, [typedText, isDeleting, halfwayPoint])

  return (
    <section className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 md:py-12 bg-background">
      <div className="container px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Empowering sustainability.{" "}
              <span className="relative inline-block min-w-[2ch]">
                <span className="text-primary">{typedText}</span>
                <span
                  className={`absolute ${showCursor ? "opacity-100" : "opacity-0"} transition-opacity text-primary`}
                >
                  |
                </span>
              </span>
            </h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
              Ecofilia brings innovative eco-friendly solutions to help businesses and communities thrive while
              protecting our planet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg">Learn More</Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
