"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark", "grayscale", "dark-grayscale", "standard-dark"]}
    >
      {children}
    </ThemeProvider>
  )
}
