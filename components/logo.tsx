"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface LogoProps {
  className?: string
  showTagline?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", showTagline = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: {
      container: "h-8",
      logo: "text-xl",
      tagline: "text-[8px]",
      leaf: "w-7 h-7 mr-1",
      tracking: "tracking-[0.2em]",  // ahora mucho más ancho
    },
    md: {
      container: "h-10",
      logo: "text-2xl",
      tagline: "text-[10px]",
      leaf: "w-9 h-9 mr-2",
      tracking: "tracking-[0.25em]",
    },
    lg: {
      container: "h-16",
      logo: "text-4xl",
      tagline: "text-xs",
      leaf: "w-14 h-14 mr-3",
      tracking: "tracking-[0.3em]",
    },
  }

  const currentSize = sizes[size]

  const ecofiliaRef = useRef<HTMLSpanElement>(null)
  const taglineRef = useRef<HTMLSpanElement>(null)
  const [scaleX, setScaleX] = useState(1)

  useEffect(() => {
    if (ecofiliaRef.current && taglineRef.current) {
      const ecofiliaWidth = ecofiliaRef.current.offsetWidth
      const taglineWidth = taglineRef.current.offsetWidth

      if (taglineWidth > 0) {
        const calculatedScale = ecofiliaWidth / taglineWidth
        setScaleX(calculatedScale > 1 ? 1 : calculatedScale)
      }
    }
  }, [size, showTagline])

  return (
    <Link href="/" className={`flex flex-col items-start ${className}`}>
      <div className={`flex items-center ${currentSize.container}`}>
        <Image src="/ECOFILIALEAF.png" alt="Ecofilia Leaf" width={52} height={52} />
        <div className="flex flex-col">
          <span
            ref={ecofiliaRef}
            className={`font-bold ${currentSize.logo} ${currentSize.tracking} leading-none`}
          >
            ECOFILIA
          </span>

          {showTagline && (
            <span
              ref={taglineRef}
              className={`font-medium ${currentSize.tagline} text-primary uppercase leading-tight tracking-[-0.05em]`}
              style={{
                transform: `scale(${scaleX}, 1.08)`,
                transformOrigin: "left",
              }}
            >
              EMPOWERING SUSTAINABILITY
            </span>

          )}
        </div>
      </div>
    </Link>
  )
}
