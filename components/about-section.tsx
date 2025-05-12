"use client"

import { useState } from "react"
import { Github, Linkedin, Twitter, Award, BookOpen, Briefcase, ArrowRight, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

// Team member data with extended information
const teamMembers = [
  {
    id: 1,
    name: "Sofia del Castillo",
    role: "Sustainability Expert",
    image: "/HEADSHOTSOFIA.jpeg",
    fallback: "SdC",
    bio: "Climate & Sustainability Expert y la descripcion breve Climate and sustainability expert with over 10 years of experience driving environmental strategy, ESG integration, and policy innovation across public and private sectors.",
    extendedBio:
      "A seasoned sustainability professional with over 10 years of global experience driving climate action and advancing environmental, social, and governance (ESG) goals. Sofía holds a Master’s degree in Climate, Land Use, and Ecosystem Services and has collaborated with leading organizations such as the Inter-American Development Bank, the United Nations, and government institutions. Her expertise spans climate finance, policy design, and sustainability, where she has led projects involving capacity building, international negotiations, stakeholder engagement, and multimillion-dollar funding proposals. With a deep commitment to creating a more sustainable future, Sofía leverages innovative solutions to bridge technology and sustainability, driving measurable impact and promoting resilience in public and private sectors.",
    education:
      "M.Sc. Climate, Land Use, and Ecosystem Services, Paris Saclay, France.\nB.Sc. Chemistry, National University of Córdoba, Argentina.",
    socialLinks: [{ platform: "linkedin", url: "https://www.linkedin.com/in/sofia-del-castillo" }],
  },
  {
    id: 2,
    name: "Gonzalo Gambertoglio",
    role: "Operational Manager & Business Development",
    image: "/HEADHSHOTGON.jpeg",
    fallback: "MC",
    bio: "An entrepreneurial Sales and Operations leader with over 12 years of experience spanning multinational corporations and business ownership.",
    extendedBio:
      "An entrepreneurial Sales and Operations leader with over 12 years of experience spanning multinational corporations and business ownership. Gonzalo Gambertoglio holds an MBA and a Bachelor's in Business Administration. His corporate tenure includes roles at Coca-Cola, Mattel, and Danone, where he excelled in business development, franchise management, and key account leadership, driving strategic initiatives and operational efficiencies. As Co-Managing Partner of Ammos Vacation Rentals, Gonzalo has successfully restructured the business, scaling operations while implementing innovative sales, customer service, and financial processes. He brings a strategic vision and hands-on expertise in transforming challenges into growth opportunities.",
    education:
      "BBA Marketing, Summa Cum Laude, University of Montevallo, USA.\nMBA, UCEMA, Argentina.\nDigital Transformation Diploma, ITBA, Buenos Aires, Argentina.",
    socialLinks: [{ platform: "linkedin", url: "https://www.linkedin.com/in/gonzalogambertoglio" }],
  },
  {
    id: 3,
    name: "Teodoro del Castillo",
    role: "Technology & Product Development",
    image: "/HEADHSOTTEO.jpeg",
    fallback: "TdC",
    bio: "Technical co-founder of Ecofilia, leading the development of AI-powered tools that transform environmental data into actionable insights.",
    extendedBio:
      "As CTO and co-founder of Ecofilia, Teodoro del Castillo spearheads the development of AI-driven solutions that streamline environmental data analysis and reporting. With a strong background in digital transformation and business development, he is dedicated to creating tools that empower environmental consultancies to make data-driven decisions. His leadership ensures that Ecofilia remains at the forefront of technological innovation in the environmental sector.",
    education: "Law School, Universidad Empresarial Siglo 21, Argentina.\nCode your Future, Globant University",

    socialLinks: [
      { platform: "linkedin", url: "https://ar.linkedin.com/in/teodoro-del-castillo" },
    ],
  },
]

export function AboutSection() {
  const [openModal, setOpenModal] = useState<number | null>(null)
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <section id="about" className="w-full py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-background"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Our Team
          </Badge>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
              About <span className="text-primary">Us</span>
            </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
              Ecofilia was born from the belief that sustainability work deserves better tools — intuitive, fast, and
              made for impact. Together, we're blending AI and climate expertise to help professionals tackle today's
              biggest environmental challenges.
            </p>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 py-8 md:grid-cols-3">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              index={index}
              isHovered={hoveredMember === member.id}
              setHovered={(isHovered) => setHoveredMember(isHovered ? member.id : null)}
              openModal={() => setOpenModal(member.id)}
              isModalOpen={openModal === member.id}
              closeModal={() => setOpenModal(null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface TeamMemberCardProps {
  member: (typeof teamMembers)[0]
  index: number
  isHovered: boolean
  setHovered: (isHovered: boolean) => void
  openModal: () => void
  isModalOpen: boolean
  closeModal: () => void
}

function TeamMemberCard({
  member,
  index,
  isHovered,
  setHovered,
  openModal,
  isModalOpen,
  closeModal,
}: TeamMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card className="bg-card overflow-hidden group border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg relative h-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        <CardContent className="p-6 flex flex-col items-center text-center h-full">
          <motion.div
            animate={{
              y: isHovered ? -5 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"></div>
            <Avatar className="h-40 w-40 border-4 border-background shadow-xl relative">
              <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {member.fallback}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {member.name}
          </h3>
          <Badge variant="secondary" className="mt-1 mb-3 bg-primary/10 text-primary border-none">
            {member.role}
          </Badge>

          <p className="text-muted-foreground mb-6 text-sm leading-relaxed flex-grow">{member.bio}</p>

          <div className="flex space-x-3 mb-4">
            {member.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 p-2 rounded-full"
              >
                {link.platform === "github" && <Github className="h-4 w-4" />}
                {link.platform === "linkedin" && <Linkedin className="h-4 w-4" />}
                {link.platform === "twitter" && <Twitter className="h-4 w-4" />}
                <span className="sr-only">{link.platform}</span>
              </a>
            ))}
          </div>

          <Dialog open={isModalOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="group/button border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <span>Get to Know Me</span>
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-primary/20 to-accent/20 flex items-end">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
                <div className="p-6 pb-0 w-full">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-xl relative -mb-10">
                    <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {member.fallback}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="p-6 pt-12">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{member.name}</DialogTitle>
                  <DialogDescription className="text-primary font-medium">{member.role}</DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-3 text-foreground">
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                      Biography
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.extendedBio}</p>
                  </div>

                  <Separator className="bg-border/50" />

                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-3 text-foreground">
                      <Award className="h-4 w-4 mr-2 text-primary" />
                      Education
                    </h4>
                    <div className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
                      {member.education}
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="flex justify-between items-center gap-2 mt-8 pt-4 border-t border-border/50">
                    <div className="flex space-x-2">
                      {member.socialLinks.map((link) => (
                        <a
                          key={link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 p-2 rounded-full"
                        >
                          {link.platform === "github" && <Github className="h-4 w-4" />}
                          {link.platform === "linkedin" && <Linkedin className="h-4 w-4" />}
                          {link.platform === "twitter" && <Twitter className="h-4 w-4" />}
                          <span className="sr-only">{link.platform}</span>
                        </a>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={closeModal}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  )
}
