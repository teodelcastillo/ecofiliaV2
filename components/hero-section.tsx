"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


// Add these keyframes and utility classes to your existing component
// without modifying your globals.css
const blobStyles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.bg-grid-pattern {
  background-image: linear-gradient(to right, rgba(22, 163, 74, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(22, 163, 74, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
`

export function HeroSection() {
  const router = useRouter()

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
    // Add the styles to the document
    const styleElement = document.createElement("style")
    styleElement.innerHTML = blobStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

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
        setCurrentTarget((prev) => (prev === targetText1 ? targetText2 : targetText1))
      }, pauseTime / 2)
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setTypedText((prev) => prev.slice(0, -1))
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
    <section className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 md:py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-secondary opacity-70"></div>

      {/* Decorative Elements - using your theme colors */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]"></div>

      <div className="container px-4 md:px-6 max-w-4xl relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Empowering sustainability.{" "}
              <span className="relative inline-block min-w-[2ch]">
                <span className="text-primary">{typedText}</span>
              </span>
            </h1>
            <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
              Ecofilia helps you analyze, report, and scale climate action <br />
              Smarter, faster, and more effectively.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative inline-flex">
              <Button size="lg" onClick={() => router.push("/auth")}>Sign Up</Button>
              <div className="absolute -right-2 -top-2">
                <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium text-xs shadow-sm">
                  Free
                </div>
              </div>
            </div>
            <a href="#contact">
              <Button variant="outline" size="lg">Contact Us</Button>
            </a>

          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center mt-8">
          <p className="text-sm text-muted-foreground">✅ Trusted by sustainability professionals across all Latin America.</p>
          <p className="text-sm text-muted-foreground">No credit card required. Start making a difference today.</p>
        </div>
      </div>
    </section>
  )
}
