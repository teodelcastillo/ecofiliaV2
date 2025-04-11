import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Ecofilia",
    default: "Ecofilia - Sustainability Platform",
  },
  description: "Manage your sustainability documents and projects with our eco-friendly platform",
  keywords: ["sustainability", "eco-friendly", "green technology", "environmental", "ecofilia"],
  authors: [{ name: "Ecofilia Team" }],
  creator: "Ecofilia",
  publisher: "Ecofilia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ecofilia.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ecofilia.vercel.app",
    title: "Ecofilia - Sustainability Platform",
    description: "Manage your sustainability documents and projects with our eco-friendly platform",
    siteName: "Ecofilia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ecofilia - Sustainability Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ecofilia - Sustainability Platform",
    description: "Manage your sustainability documents and projects with our eco-friendly platform",
    images: ["/og-image.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0fdf4" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          {/* Skip to content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
          >
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  )
}
