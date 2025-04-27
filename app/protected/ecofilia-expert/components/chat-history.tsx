"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { History, Plus, Clock, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

// Nuevo tipo para alinear con tu tabla real de Supabase
interface ChatSession {
  id: string
  title: string
  createdAt: Date
}

interface ChatHistoryProps {
  sessions: ChatSession[]
  activeSession: string | null
  onSelectSession: (id: string) => void
  onNewChat: () => void
}

export function ChatHistory({ sessions, activeSession, onSelectSession, onNewChat }: ChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="h-[calc(100vh-12rem)] shadow-md border-border/50 w-full max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <span>Chat History</span>
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={onNewChat}>
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 pr-9 bg-background/50 border-muted focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 px-4 pb-4">
        <ScrollArea className="h-[calc(100vh-22rem)]">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="bg-muted/50 rounded-full p-3 mb-3">
                <History className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? `No conversations matching "${searchQuery}"` : "No conversation history yet"}
              </p>
              {!searchQuery && (
                <Button variant="outline" size="sm" className="mt-4" onClick={onNewChat}>
                  Start a new conversation
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <AnimatePresence initial={false}>
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        activeSession === session.id
                          ? "bg-primary/10 border-l-2 border-primary"
                          : "hover:bg-accent/50 border-l-2 border-transparent"
                      }`}
                      onClick={() => onSelectSession(session.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-medium truncate">{session.title}</h3>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(session.createdAt, "MMM d, yyyy • h:mm a")}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
