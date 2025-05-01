"use client"

import { useState } from "react"
import { Github, Linkedin, Twitter, Award, BookOpen, Briefcase } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// Team member data with extended information
const teamMembers = [
  {
    id: 1,
    name: "Sofia del Castillo",
    role: "CSO & Co-Founder",
    image: "/TEO2.jpg",
    fallback: "SdC",
    bio: "Sustainability professional with 10+ years of experience in sustainability and corporate environmental strategy.",
    extendedBio: "A seasoned sustainability professional with over 10 years of global experience driving climate action and advancing environmental, social, and governance (ESG) goals. Sofía holds a Master’s degree in Climate, Land Use, and Ecosystem Services and has collaborated with leading organizations such as the Inter-American Development Bank, the United Nations, and government institutions. Her expertise spans climate finance, policy design, and sustainability, where she has led projects involving capacity building, international negotiations, stakeholder engagement, and multimillion-dollar funding proposals. With a deep commitment to creating a more sustainable future, Sofía leverages innovative solutions to bridge technology and sustainability, driving measurable impact and promoting resilience in public and private sectors.",
    education: "Ph.D. Environmental Science, Stanford University\nM.Sc. Sustainability Management, MIT\nB.Sc. Biology, UC Berkeley",
    achievements: ["Named in Forbes 40 Under 40 for Sustainability", "Author of 'Corporate Pathways to Net Zero'", "TED Talk: 'Reimagining Business in a Carbon-Constrained World'"],
    socialLinks: [
      { platform: "linkedin", url: "https://www.linkedin.in/..." },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    image: "/team-member-2.png",
    fallback: "MC",
    bio: "Tech innovator with expertise in AI and machine learning applications for environmental monitoring and optimization.",
    extendedBio: "Michael pioneered the use of machine learning algorithms for environmental data analysis at Google before co-founding Ecofilia. His work has led to breakthrough innovations in resource optimization and predictive environmental modeling. He leads our technical team in developing scalable solutions that make sustainability measurable and actionable for businesses of all sizes.",
    education: "M.S. Computer Science, Carnegie Mellon University\nB.S. Electrical Engineering, UC San Diego",
    achievements: ["Patent holder for 5 AI-driven environmental monitoring systems", "Lead developer of GreenMetrics™ platform", "Winner of the Global CleanTech Innovation Award"],
    socialLinks: [
      { platform: "github", url: "#" },
      { platform: "linkedin", url: "#" },
    ],
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Head of Partnerships",
    image: "/team-member-3.png",
    fallback: "ER",
    bio: "Business development expert specializing in creating sustainable partnerships across industries and sectors.",
    extendedBio: "Elena has a proven track record of building strategic partnerships that drive both business growth and environmental impact. Before joining Ecofilia, she led global partnership initiatives at the World Wildlife Fund, connecting corporations with conservation projects. Her approach to partnership development focuses on creating shared value that benefits businesses, communities, and the environment.",
    education: "MBA, Harvard Business School\nB.A. International Relations, Georgetown University",
    achievements: ["Established partnerships generating over $50M in sustainable business", "Developed the Circular Economy Alliance with 30+ global brands", "Author of 'Partnership Economics: The Business Case for Sustainability'"],
    socialLinks: [
      { platform: "linkedin", url: "#" },
      { platform: "twitter", url: "#" },
    ],
  },
]

export function AboutSection() {
  const [openModal, setOpenModal] = useState<number | null>(null)

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-foreground">About Us</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Meet the team behind Ecofilia's mission to create sustainable solutions for a better world.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id} className="bg-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-40 w-40 mb-4">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex space-x-3 mb-4">
                  {member.socialLinks.map((link) => (
                    <Button key={link.platform} variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      {link.platform === "github" && <Github className="h-4 w-4" />}
                      {link.platform === "linkedin" && <Linkedin className="h-4 w-4" />}
                      {link.platform === "twitter" && <Twitter className="h-4 w-4" />}
                      <span className="sr-only">{link.platform}</span>
                    </Button>
                  ))}
                </div>
                <Dialog open={openModal === member.id} onOpenChange={(open) => setOpenModal(open ? member.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Get to Know Me
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.fallback}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </DialogTitle>
                      <DialogDescription className="text-primary font-medium">{member.role}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-6">
                      <div>
                        <h4 className="text-sm font-medium flex items-center mb-2">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Biography
                        </h4>
                        <p className="text-muted-foreground text-sm">{member.extendedBio}</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium flex items-center mb-2">
                          <Award className="h-4 w-4 mr-2" />
                          Education
                        </h4>
                        <div className="text-muted-foreground text-sm whitespace-pre-line">{member.education}</div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium flex items-center mb-2">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Key Achievements
                        </h4>
                        <ul className="text-muted-foreground text-sm list-disc pl-5 space-y-1">
                          {member.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setOpenModal(null)}>
                          Close
                        </Button>
                        <Button>Connect</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
