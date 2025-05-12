"use client"

import type React from "react"

import { ArrowRight, Zap, Target, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"


export function SolutionSection() {
  const router = useRouter()
  const platformBenefits = [
  "Automated ESG & climate reporting",
  "AI-based document analysis",
  "Real-time KPI tracking",
  "Custom dashboards & integrations",
]

const consultancyBenefits = [
  "Strategic advisory & regulatory alignment",
  "NDC, TCFD, SDG integration",
  "Climate finance guidance",
  "Climate impact modeling & disclosure",
]


  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading section with animated reveal */}
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
              <p className="text-muted-foreground max-w-2xl mx-auto">
            Ecofilia empowers sustainability professionals by combining powerful technology with expert guidance,
            creating a comprehensive solution for your environmental management needs.
          </p>
        </motion.div>

        {/* Dual approach section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          {/* Platform approach */}
          <ApproachCard
            title="Technology Platform"
            description="Our AI-powered platform automates repetitive tasks and provides powerful tools for sustainability management."
            icon={<Zap className="w-6 h-6" />}
            color="primary"
            buttonText="Explore Platform"
            delay={0.1}
            benefits={platformBenefits}
            onClick={() => router.push("/auth")}
          />

          <ApproachCard
            title="Expert Consultancy"
            description="Partner with our experts to design AI-powered strategies tailored to your goals — unlocking opportunities, driving impact, and ensuring global compliance."
            icon={<Target className="w-6 h-6" />}
            color="accent"
            buttonText="Discover Services"
            delay={0.3}
            benefits={consultancyBenefits}
            onClick={() => {
              const contact = document.getElementById("contact")
              if (contact) contact.scrollIntoView({ behavior: "smooth" })
            }}
          />


        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50">
            <Button size="lg" className="px-8 rounded-full group" onClick={() => window.location.href = "#contact"}>
              <span>Discover How We Can Help</span>
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
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



function ApproachCard({ title, description, icon, color, buttonText, delay, onClick, benefits }: ApproachCardProps) {
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
            <BenefitItem key={idx} text={text} />
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

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center">
      <Shield className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </li>
  )
}
