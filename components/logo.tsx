import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  className?: string
  showTagline?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", showTagline = true, size = "md" }: LogoProps) {
  // Size mappings
  const sizes = {
    sm: {
      container: "h-8",
      logo: "text-xl",
      tagline: "text-[8px]",
      leaf: "w-7 h-7 mr-1",
    },
    md: {
      container: "h-10",
      logo: "text-2xl",
      tagline: "text-[10px]",
      leaf: "w-9 h-9 mr-2",
    },
    lg: {
      container: "h-16",
      logo: "text-4xl",
      tagline: "text-xs",
      leaf: "w-14 h-14 mr-3",
    },
  }

  const currentSize = sizes[size]

  return (
    <Link href="/" className={`flex flex-col items-start ${className}`}>
      <div className={`flex items-center ${currentSize.container}`}>
        {/* Monstera Leaf SVG */}
        <Image src="/ECOFILIALEAF.png" alt="Ecofilia Leaf" width={52} height={52} />

        {/* Logo Text */}
        <div className="flex flex-col">
          <span className={`font-bold tracking-wider ${currentSize.logo} leading-none`}>ECOFILIA</span>

          {showTagline && (
            <span className={`font-medium tracking-wider ${currentSize.tagline} text-primary uppercase leading-tight`}>
              EMPOWERING SUSTAINABILITY
            </span>
          )}
        </div>
      </div>
    </Link>
    )
}
  
