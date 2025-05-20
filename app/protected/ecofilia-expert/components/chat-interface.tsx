"use client"

import type React from "react"
import type { Message } from "ai"
import { type FormEvent, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, FileText, FolderOpen } from "lucide-react"
import type { Document } from "@/models"
import { Badge } from "@/components/ui/badge"
import ChatMarkdown from "../../components/chat-markdown"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MonstiaAvatar } from "../../components/monstia-avatar"
import { UserAvatar } from "../../components/user-avatar"

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  selectedDocuments: Document[]
  onOpenDocumentSelector: () => void
}

export function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  selectedDocuments,
  onOpenDocumentSelector,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const isSubmitDisabled = isLoading || !input.trim(); // remove document requirement

  console.log("🔁 ChatInterface renderizado para", messages.length, "mensajes");


  return (
    <Card className="h-full shadow-md border-border/50 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span>{}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-3 gap-1.5" onClick={onOpenDocumentSelector}>
                    <FolderOpen className="h-4 w-4" />
                    <span>Select Documents</span>
                    {selectedDocuments.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedDocuments.length}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {selectedDocuments.length > 0
                    ? `${selectedDocuments.length} document${selectedDocuments.length !== 1 ? "s" : ""} selected`
                    : "No documents selected"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {selectedDocuments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-2"
          >
            <div className="flex flex-wrap gap-1.5">
              {selectedDocuments.map((doc) => (
                <Badge key={doc.id} variant="outline" className="bg-secondary/50">
                  {doc.name}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 px-4">
        <ScrollArea className="h-full pr-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4 max-w-md p-6"
              >
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <MonstiaAvatar />
                </div>
                <h3 className="text-xl font-medium">Start a conversation with Ecofilia</h3>
                <p className="text-muted-foreground text-sm">
                  Try selecting documents from your library or the public collection and ask questions about their content.
                </p>
                <Button variant="outline" className="mt-2" onClick={onOpenDocumentSelector}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Select Documents
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "user" ? (
                      <UserAvatar size="md" />
                    ) : (
                      <MonstiaAvatar size="md" />
                    )}

                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-card border shadow-sm"
                      }`}
                    >
                      <ChatMarkdown content={message.content} />
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-3 pb-4">
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          <div className="flex items-end gap-2 relative">
            <Textarea
              aria-label="Ask Ecofilia anything you need to support your sustainability work..."
              placeholder="Ask Ecofilia anything you need to support your sustainability work..."
              value={input}
              onChange={handleInputChange}
              className="min-h-24 flex-1 pr-12 resize-none border-muted focus-visible:ring-primary/50"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-3 right-3 h-8 w-8 rounded-full shadow-sm"
              disabled={isSubmitDisabled}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
            {selectedDocuments.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground flex items-center gap-1.5 pl-1"
              >
                AI-generated response. Our tool is configured using reliable sources and technical frameworks, but responses may still contain errors. Please verify the information before making important decisions.
              </motion.p>
            )}
        </form>
      </CardFooter>
    </Card>
  )
}
