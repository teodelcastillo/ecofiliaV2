"use client"

import type React from "react"

import { useState } from "react"
import { Book, FolderSearch, BarChart3, Brain, ArrowRight, Zap, Target, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function ValueProposition() {
  return (
    <section id="value" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
            {/* Core benefits section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="px-4 py-1 border-primary/20 bg-primary/5 text-primary mb-4">Core Benefits</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-4">
                Our <span className="text-primary">Strategy</span>
              </h2>
              <h4 className="text-2xl md:text-2xl font-bold text-foreground tracking-tight leading-[1.1] mb-4">
                <span className="text-primary">AI-Powered</span> <span>consulting to strengthen your sustainability impact</span>
              </h4>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ecofilia is a consulting firm bringing AI-powered climate intelligence to help organizations
                accelerate sustainability reporting, policy and data analysis, project monitoring & evaluation,
                and ESG action.
              </p>
            </motion.div>
    
            {/* Feature boxes with staggered animation */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <FeatureBox
                icon={<Book className="w-12 h-12" />}
                title="CUSTOMIZED LIBRARY"
                description="Access a comprehensive collection of sustainability resources tailored to your industry and needs."
                delay={0.1}
              />
    
              <FeatureBox
                icon={<FolderSearch className="w-12 h-12" />}
                title="SUSTAINABILITY REPORTING"
                description="Generate detailed sustainability reports with ease, ensuring compliance and transparency."
                delay={0.2}
              />
    
              <FeatureBox
                icon={<BarChart3 className="w-12 h-12" />}
                title="DASHBOARDS & KPI's"
                description="Track and visualize your sustainability KPIs with intuitive dashboards and reporting tools."
                delay={0.3}
              />
    
              <FeatureBox
                icon={<Brain className="w-12 h-12" />}
                title="SUSTAINABILITY ASSISTANT"
                description="Get AI-powered recommendations and assistance for your sustainability initiatives."
                delay={0.4}
              />
            </motion.div>
          </div>
        </section>
  )

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
}