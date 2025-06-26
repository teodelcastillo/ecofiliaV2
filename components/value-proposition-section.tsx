"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Zap, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight } from "lucide-react"

export function ValueProposition() {
  const router = useRouter()

  const platformBenefits = [
    "Automated sustainability, ESG, and climate reporting",
    "AI-powered document analysis (policies, projects, technical reports)",
    "Data structuring and indicator tracking for informed decision-making",
    "Custom dashboards and integrations with your internal systems",
    "Knowledge Hubs to systematize technical information",
  ]

  const consultancyBenefits = [
    "Strategic advisory and regulatory alignment",
    "Integration of frameworks such as NDCs, TCFD, SDGs, GRI, MDBs, and others",
    "Development, review, and validation of key reports, plans, and documents",
    "Institutional knowledge management and capacity building",
    "Benchmarking of sustainability tools and digital solutions",
  ]

  return (
    <section id="value" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge className="px-4 py-1 border-primary/20 bg-primary/5 text-primary mb-4">Core Benefits</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-4">
            Our <span className="text-primary">Strategy</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ecofilia is a consulting firm that combines technology and expert consultancy to strengthen sustainability impact.
          </p>
            <a
              href="/EcofiliaBrochure-eng.pdf"
              download
              className="inline-block my-8"
            >
              <Button
                variant="outline"
                className="text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                Download our Strategy
              </Button>
            </a>

        </motion.div>


        {/* Approach Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 "
        >
          <ApproachCard
            title="Technology Platform"
            description="Ecofilia's platform leverages AI to deliver structured analysis, insights, and automation for climate and sustainability work."
            icon={<Zap className="w-6 h-6" />}
            color="primary"
            buttonText="See How It Works"
            delay={0.1}
            benefits={platformBenefits}
            onClick={() => router.push("#solutions")}
          />

          <ApproachCard
            title="Expert Consulting"
            description="Work hand-in-hand with our experts to design impactful climate strategies and reports aligned with global frameworks."
            icon={<Target className="w-6 h-6" />}
            color="accent"
            buttonText="Talk to Our Team"
            delay={0.2}
            benefits={consultancyBenefits}
            onClick={() => router.push("#contact")}
          />
        </motion.div>
      </div>
    </section>
  )
}

interface ApproachCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: "primary" | "accent"
  buttonText: string
  delay: number
  onClick?: () => void
  benefits: string[]
}

function ApproachCard({
  title,
  description,
  icon,
  color,
  buttonText,
  delay,
  onClick,
  benefits,
}: ApproachCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`rounded-2xl p-8 border border-border/50 hover:border-${color}/30 transition-all duration-300 hover:shadow-lg group relative overflow-hidden`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-24 h-24 bg-${color}/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2`}
      ></div>

      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-${color}/10 text-${color} mb-6`}>
          {icon}
        </div>

        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>

        <ul className="space-y-3 mb-8">
          {benefits.map((text, idx) => (
            <li key={idx} className="flex items-center">
              <Shield className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
              <span className="text-sm">{text}</span>
            </li>
          ))}
        </ul>

        <Button variant="outline" className="group/button" onClick={onClick}>
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4 transform group-hover/button:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </motion.div>
  )
}
