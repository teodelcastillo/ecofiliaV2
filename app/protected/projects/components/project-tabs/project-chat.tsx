"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, ExternalLink, Bot, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import type { Project } from "@/models"

interface ProjectChatProps {
  project: Project
}

export function ProjectChat({ project }: ProjectChatProps) {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleChatRedirect = () => {
    setIsRedirecting(true)
    // Redirect to chat with project context
    // You can pass project ID as a query parameter or route parameter
    router.push(`/protected/chat?project=${project.id}`)
  }

  const chatFeatures = [
    {
      icon: <Bot className="h-5 w-5" />,
      title: "AI-Powered Analysis",
      description: "Get intelligent insights about your project documents and data",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Smart Recommendations",
      description: "Receive personalized suggestions to improve your sustainability initiatives",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Natural Conversations",
      description: "Ask questions in plain language about your project metrics and progress",
    },
  ]

  const quickQuestions = [
    "¿Cuál es el objetivo principal del proyecto REDD+ en la Cuenca Caimancito?",
    "¿Qué superficie forestal está involucrada en el proyecto?",
    "¿Qué actores forman parte del Comité de Cuenca?",
    "¿Cómo se garantiza la participación de comunidades indígenas?",
    "¿Qué avances se han logrado hasta la fecha?",
    "¿Qué salvaguardas REDD+ ya se están cumpliendo?",
  ]

  const faqAnswers = {
    "¿Cuál es el objetivo principal del proyecto REDD+ en la Cuenca Caimancito?":
      "👉 Promover el manejo forestal sustentable y la restauración de bosques nativos en las regiones de Yungas y Chaco jujeño, integrando beneficios sociales, ambientales y económicos a través de una gobernanza local fortalecida.",

    "¿Qué superficie forestal está involucrada en el proyecto?":
      "👉 Se proyecta intervenir +150.000 hectáreas bajo manejo forestal sustentable, dentro de un área total de influencia superior a 750.000 hectáreas.",

    "¿Qué actores forman parte del Comité de Cuenca?":
      "👉 El Comité incluye al Ministerio de Ambiente de Jujuy, INTA, municipios locales, FAO, comunidades indígenas, y representantes del sector productivo. Fue formalizado en julio 2024.",

    "¿Cómo se garantiza la participación de comunidades indígenas?":
      "👉 Se identificaron 32 comunidades indígenas en la cuenca. Participan en el diagnóstico territorial y mesas locales, aunque aún se recomienda desarrollar un protocolo de consulta previa (CLPI) conforme al marco REDD+ nacional.",

    "¿Qué avances se han logrado hasta la fecha?":
      "👉 Ya se realizó el diagnóstico participativo, se identificaron actores clave (17 aserraderos, +130 carpinterías), y se iniciaron talleres de sociabilización. El Plan de Gestión se encuentra en elaboración y validación.",

    "¿Qué salvaguardas REDD+ ya se están cumpliendo?":
      "👉 Se cumplen 5 de las 7 salvaguardas REDD+: consistencia con estrategias nacionales, participación efectiva, gobernanza forestal, conservación de bosques y prevención de riesgos de reversión. Aún deben fortalecerse los mecanismos de consulta indígena y la gestión de riesgos sociales/ambientales.",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <MessageCircle className="h-8 w-8 text-primary" />
        </motion.div>

        <div>
          <h3 className="text-2xl font-bold">Chat with {project.name}</h3>
          <p className="text-muted-foreground">Get AI-powered insights and assistance for your project</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Button size="lg" onClick={handleChatRedirect} disabled={isRedirecting} className="gap-2">
            {isRedirecting ? (
              "Redirecting..."
            ) : (
              <>
                <MessageCircle className="h-4 w-4" />
                Start Conversation
                <ExternalLink className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-3">
        {chatFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Questions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Quick Questions to Get Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Try asking these questions to explore your project data:
            </p>
            {quickQuestions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-3 bg-muted/50 rounded-lg border border-dashed cursor-pointer hover:bg-muted transition-colors"
                onClick={handleChatRedirect}
              >
                <p className="text-sm">{question}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Preguntas Frecuentes - Proyecto REDD+ Cuenca Caimancito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(faqAnswers).map(([question, answer], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="border rounded-lg overflow-hidden"
              >
                <div className="p-3 bg-muted/30 border-b">
                  <p className="text-sm font-medium">{question}</p>
                </div>
                <div className="p-3">
                  <p className="text-sm text-muted-foreground">{answer}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border"
      >
        <h4 className="font-semibold mb-2">Ready to explore your project?</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Start a conversation to unlock AI-powered insights and get personalized recommendations.
        </p>
        <Button onClick={handleChatRedirect} disabled={isRedirecting}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Open Chat Interface
        </Button>
      </motion.div>
    </div>
  )
}
