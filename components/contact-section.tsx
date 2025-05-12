"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formState)

    // Reset form and show success
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormState({
        name: "",
        email: "",
        message: "",
      })
    }, 5000)
  }

  return (
    <section id="contact" className="w-full py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/10 to-background"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Get in Touch
          </Badge>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
              Contact <span className="text-primary">Us</span>
            </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or want to learn more about our solutions? Get in touch with our team.
            </p>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-5xl items-start gap-8 py-8 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="grid gap-6"
          >
            <ContactCard
              icon={<Mail className="h-6 w-6" />}
              title="Email"
              content="info@ecofilia.site"
              delay={0.1}
              href="mailto:info@ecofilia.site"
            />
            <ContactCard
              icon={<Phone className="h-6 w-6" />}
              title="Phone"
              content="+1 (555) 123-4567"
              delay={0.2}
              href="tel:+15551234567"
            />
            <ContactCard
              icon={<MapPin className="h-6 w-6" />}
              title="Address"
              content="123 Eco Street, Green City, EC 12345"
              delay={0.3}
              href="https://maps.google.com/?q=123+Eco+Street,+Green+City,+EC+12345"
              external
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <div className="h-2 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center text-center py-8"
                    >
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="grid gap-6"
                    >
                      <div className="grid gap-2">
                        <Label
                          htmlFor="name"
                          className={`text-sm font-medium transition-colors duration-200 ${
                            focusedField === "name" ? "text-primary" : "text-foreground"
                          }`}
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your name"
                          className="border-border/50 focus:border-primary/50 transition-colors duration-200"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="email"
                          className={`text-sm font-medium transition-colors duration-200 ${
                            focusedField === "email" ? "text-primary" : "text-foreground"
                          }`}
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your email"
                          className="border-border/50 focus:border-primary/50 transition-colors duration-200"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="message"
                          className={`text-sm font-medium transition-colors duration-200 ${
                            focusedField === "message" ? "text-primary" : "text-foreground"
                          }`}
                        >
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your message"
                          className="min-h-[150px] border-border/50 focus:border-primary/50 transition-colors duration-200"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full group" disabled={isSubmitting} size="lg">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

interface ContactCardProps {
  icon: React.ReactNode
  title: string
  content: string
  delay: number
  href?: string
  external?: boolean
}

function ContactCard({ icon, title, content, delay, href, external }: ContactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden group border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6">
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex items-start gap-4 group-hover:text-primary transition-colors duration-200"
          >
            <div className="mt-1 p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                {title}
              </h3>
              <p className="text-muted-foreground">{content}</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  )
}
