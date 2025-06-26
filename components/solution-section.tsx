"use client"

import type React from "react"
import { Book, FolderSearch, BarChart3, Brain, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"

export function SolutionSection() {
  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
          <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-4">
            Comprehensive <span className="text-primary">Sustainability Solutions</span>
          </h2>

        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          <FeatureBox
            icon={<Book className="w-12 h-12" />}
            title="Knowledge Hubs"
            description="Systematize technical documentation for policies, plans, and frameworks using AI-enhanced libraries."
            delay={0.1}
          />

          <FeatureBox
            icon={<FolderSearch className="w-12 h-12" />}
            title="Sustainability Reporting"
            description="Extract insights from sustainability documents including ESG reports, climate policies, and project plans."
            delay={0.2}
          />

          <FeatureBox
            icon={<BarChart3 className="w-12 h-12" />}
            title="Dashboards & KPIs"
            description="Track impact using sustainability indicators, climate goals, and operational metrics in real time."
            delay={0.3}
          />

          <FeatureBox
            icon={<Brain className="w-12 h-12" />}
            title="AI Sustainability Assistant"
            description="Receive AI-powered guidance and recommendations tailored to your sustainability context."
            delay={0.4}
          />
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50">
            <Button
              size="lg"
              className="px-8 rounded-full group"
              onClick={() => window.location.href = "#contact"}
            >
              <span>Tailored Solutions</span>
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureBoxProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function FeatureBox({ icon, title, description, delay }: FeatureBoxProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-background/50 backdrop-blur-sm rounded-xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 h-full"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          animate={{
            y: isHovered ? -5 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="mb-6 relative"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"></div>
          <div className="relative bg-gradient-to-br from-background to-accent/30 p-5 rounded-full border border-border/50 text-primary shadow-sm group-hover:border-primary/50 transition-colors duration-300">
            {icon}
          </div>
        </motion.div>

        <h3 className="text-lg font-bold text-foreground tracking-wide mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4">{description}</p>

        <div className="h-1 w-12 bg-primary/30 rounded-full mt-auto transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </motion.div>
  )
}
