"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { nanoid } from "nanoid"
import { useSession } from "@supabase/auth-helpers-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

import { ChatInterface } from "./chat-interface"
import { DocumentSelectorModal } from "./document-selector-modal"
import { ChatHistory } from "./chat-history"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, History } from "lucide-react"

import type { Message } from "ai"
import type { Document } from "@/models"

interface DocumentChatProps {
  personalDocuments: Document[]
  publicDocuments: Document[]
  userId: string
  projects?: any[] // Using any for now, will be properly typed when implemented
}

export function DocumentChat({ personalDocuments, publicDocuments, userId, projects = [] }: DocumentChatProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [chatSessions, setChatSessions] = useState<{ id: string; title: string; preview: string; date: Date }[]>([])
  const [activeSession, setActiveSession] = useState<string | null>(null)

  const session = useSession()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 1023px)")

  // Auto-hide history on mobile when chat has messages
  useEffect(() => {
    if (isMobile && messages.length > 0) {
      setShowHistory(false)
    }
  }, [messages.length, isMobile])

  const handleDocumentSelect = useCallback(
    (documents: Document[]) => {
      setSelectedDocuments(documents)
      setIsSelectorOpen(false)

      // If user selects documents and there are no messages yet, show a toast
      if (documents.length > 0 && messages.length === 0) {
        toast({
          title: "Documents selected",
          description: `${documents.length} document${documents.length !== 1 ? "s" : ""} ready for chat`,
          duration: 3000,
        })
      }
    },
    [messages.length, toast],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const updateLastAssistantMessage = useCallback((content: string) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === prev.length - 1 && msg.role === "assistant" ? { ...msg, content } : msg)),
    )
  }, [])

  const handleSafeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)
    const userQuestion = input
    setInput("") // Clear the input

    appendMessage({ role: "user", content: userQuestion, id: nanoid() })
    const assistantId = nanoid()
    appendMessage({ role: "assistant", content: "...", id: assistantId })

    try {
      const res = await fetch("/api/chat-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: selectedDocuments.map((doc) => ({
            id: doc.id,
            type: doc.type,
          })),
          question: userQuestion,
          userId,
        }),
      })

      if (!res.ok || !res.body) {
        const error = await res.json()
        throw new Error(error.error || "Unknown error")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let finalAnswer = ""
      let lastFlush = Date.now()

      // Only flush content every 100ms to avoid UI flooding
      const flush = () => {
        updateLastAssistantMessage(finalAnswer)
        lastFlush = Date.now()
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        finalAnswer += chunk

        if (Date.now() - lastFlush > 100) {
          flush()
        }
      }

      // Ensure the final part is written out
      flush()

      // For demo purposes, add this conversation to chat history
      // In a real app, this would be saved to the database
      if (messages.length === 0) {
        const sessionId = nanoid()
        setChatSessions((prev) => [
          {
            id: sessionId,
            title: userQuestion.slice(0, 30) + (userQuestion.length > 30 ? "..." : ""),
            preview: finalAnswer.slice(0, 60) + (finalAnswer.length > 60 ? "..." : ""),
            date: new Date(),
          },
          ...prev,
        ])
        setActiveSession(sessionId)
      }
    } catch (err) {
      console.error("❌ Error streaming response:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the assistant. Please try again.",
      })
      // Remove the loading message
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  const openDocumentSelector = () => {
    setIsSelectorOpen(true)
  }

  return (
    <div className="relative h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      <div
  className={`transition-all duration-300 ease-in-out ${
    showHistory ? "lg:col-span-9" : "lg:col-span-12"
  }`}
>
          <div className="flex flex-col h-full">
            <ChatInterface
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSafeSubmit}
              isLoading={isLoading}
              selectedDocuments={selectedDocuments}
              onOpenDocumentSelector={openDocumentSelector}
            />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 overflow-hidden"
            >
              <ChatHistory
                sessions={chatSessions}
                activeSession={activeSession}
                onSelectSession={(id) => setActiveSession(id)}
                onNewChat={() => {
                  setMessages([])
                  setSelectedDocuments([])
                  setActiveSession(null)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Document selector modal */}
      <DocumentSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        personalDocuments={personalDocuments}
        publicDocuments={publicDocuments}
        projects={projects}
        onDocumentsSelected={handleDocumentSelect}
        selectedDocuments={selectedDocuments}
      />

      {/* Mobile toggle button for history */}
      {isMobile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm border-primary/20"
            onClick={toggleHistory}
          >
            {showHistory ? <ChevronRight className="h-4 w-4" /> : <History className="h-4 w-4" />}
          </Button>
        </motion.div>
      )}

      {/* Desktop toggle button for history */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/2 -translate-y-1/2 z-10"
          style={{ right: showHistory ? "calc(25% - 12px)" : "0" }}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm border-primary/20"
            onClick={toggleHistory}
          >
            {showHistory ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </motion.div>
      )}

      {/* Floating action button to open document selector
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-6 left-6 z-10"
      >
        <Button onClick={openDocumentSelector} className="rounded-full h-12 w-12 shadow-md" size="icon">
          <FolderOpen className="h-5 w-5" />
        </Button>
      </motion.div> */}
    </div>
  )
}
