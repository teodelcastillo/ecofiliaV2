"use client"

import type React from "react"
import type { Message } from "ai";
import { type FormEvent, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from "lucide-react"
import type { Document } from "@/models"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  selectedDocuments: Document[]
}

export function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  selectedDocuments,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Chat with Documents</span>
          <div className="flex gap-1">
            {selectedDocuments.length > 0 ? (
              <Badge variant="outline">
                {selectedDocuments.length} document{selectedDocuments.length !== 1 ? "s" : ""} selected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                No documents selected
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-3">
                <h3 className="text-lg font-medium">Start a conversation</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Select documents from your library or the public collection and ask questions about them.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {messages.map((message, index) => (
                <div key={message.id || index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8">
                      {message.role === "user" ? (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>U</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>AI</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          <div className="flex items-end gap-2">
            <Textarea
              aria-label="Ask a question about your documents"
              placeholder="Ask a question about your documents..."
              value={input}
              onChange={handleInputChange}
              className="min-h-24 flex-1"
              disabled={isLoading || selectedDocuments.length === 0}
            />
            <Button
              type="submit"
              size="icon"
              className="h-24"
              disabled={isLoading || !input.trim() || selectedDocuments.length === 0}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          {selectedDocuments.length === 0 && (
            <p className="text-xs text-muted-foreground">Please select at least one document to start chatting</p>
          )}
        </form>
      </CardFooter>
    </Card>
  )
}

