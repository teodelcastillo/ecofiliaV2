"use client";

import { useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChatInterface } from "./chat-interface";
import { DocumentSelectorModal } from "./document-selector-modal";
import { ChatHistory } from "./chat-history";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import type { Message } from "ai";
import type { Document } from "@/models";

interface DocumentChatProps {
  personalDocuments: Document[];
  publicDocuments: Document[];
  userId: string;
  projects?: any[];
}

const supabase = createClient();

export function DocumentChat({ personalDocuments, publicDocuments, userId, projects = [] }: DocumentChatProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<(Document & { type: "user" | "public" | "project" })[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<{ id: string; title: string; preview: string; date: Date }[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const personalDocsWithType = personalDocuments.map(doc => ({ ...doc, type: "user" as const }));
  const publicDocsWithType = publicDocuments.map(doc => ({ ...doc, type: "public" as const }));

  useEffect(() => {
    if (isMobile && messages.length > 0) setShowHistory(false);
  }, [messages.length, isMobile]);

  useEffect(() => {
    loadChatSessions();
  }, []);



  const handleDocumentSelect = useCallback(
    (documents: (Document & { type: "user" | "public" | "project" })[]) => {
      setSelectedDocuments(documents);
      setIsSelectorOpen(false);
  
      if (documents.length > 0 && messages.length === 0) {
        toast({
          title: "Documents selected",
          description: `${documents.length} document${documents.length !== 1 ? "s" : ""} ready for chat`,
          duration: 3000,
        });
      }
    },
    [messages.length, toast]
  );
  

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);

  const appendMessage = useCallback((message: Message) => setMessages(prev => [...prev, message]), []);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setMessages(prev => prev.map((msg, i) => (i === prev.length - 1 && msg.role === "assistant" ? { ...msg, content } : msg)));
  }, []);

const saveMessage = async (chatId: string, role: "user" | "assistant", content: string) => {
  console.log("💾 Guardando mensaje:", { chatId, role, content });

  const { data, error: msgError } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, role, content }])
    .select()
    .single();

  if (msgError) {
    console.error("❌ Error al insertar mensaje:", msgError.message);
    throw new Error(msgError.message);
  }

  const { error: updateError } = await supabase
    .from("chats")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", chatId);

  if (updateError) {
    console.error("❌ Error al actualizar updated_at en chats:", updateError.message);
  }

  return data; // Podés usarlo si luego querés mostrar algo en UI
};



  const createNewChat = async (title: string) => {
    const { data: newChat, error } = await supabase.from("chats").insert([{ user_id: userId, title }]).select().single();

    if (error || !newChat) throw new Error("Failed to create chat session.");

    setActiveSession(newChat.id);
    return newChat.id;
  };

  const handleSafeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    setIsLoading(true);
    const userQuestion = input;
    setInput("");

    let chatId = activeSession;

    try {
      if (!chatId) chatId = await createNewChat(userQuestion.slice(0, 30));

      const userMessageId = nanoid();
      appendMessage({ id: userMessageId, role: "user", content: userQuestion });
      await saveMessage(chatId, "user", userQuestion);

      const assistantId = nanoid();
      appendMessage({ id: assistantId, role: "assistant", content: "..." });

      const res = await fetch("/api/chat-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: selectedDocuments.map(doc => ({ id: doc.id, type: doc.type })),
          question: userQuestion,
          userId,
        }),
      });

      if (!res.ok || !res.body) {
        const error = await res.json();
        throw new Error(error.error || "Unknown error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let finalAnswer = "";
      let lastFlush = Date.now();

      const flush = () => {
        updateLastAssistantMessage(finalAnswer);
        lastFlush = Date.now();
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        finalAnswer += decoder.decode(value, { stream: true });
        if (Date.now() - lastFlush > 100) flush();
      }

      flush();
      await saveMessage(chatId, "assistant", finalAnswer);

    } catch (err) {
      console.error("❌ Error streaming response:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the assistant. Please try again.",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

const loadChatSessions = async () => {
    console.log("🚀 Ejecutando loadChatSessions"); // <- Verifica que se ejecuta

  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false }); // 🔄 antes era created_at

  if (error) {
    console.error("Error loading chat sessions:", error.message);
    return;
  }

  if (data) {
    setChatSessions(
      data.map((chat) => ({
        id: chat.id,
        title: chat.title || "Untitled Chat",
        preview: "",
        date: new Date(chat.updated_at ?? chat.created_at ?? ""), // 🔄 usar updated_at si existe, fallback to empty string if both are null
      }))
    );
  }
};


const loadChatMessages = async (chatId: string) => {
  console.log("📥 Ejecutando loadChatMessages para:", chatId); // 👈🏼 agrega esto

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Error fetching messages:", error.message);
    return;
  }

  if (data) {
    console.log("✅ Mensajes recuperados:", data); // 👈🏼 agrega esto
    setMessages(
      data
        .filter(msg => msg.role)
        .map(msg => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }))
    );
    setInput("");
  }
};



  const toggleHistory = () => setShowHistory(prev => !prev);
  const openDocumentSelector = () => setIsSelectorOpen(true);

  return (
    <div className="relative h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
        <div className={`transition-all duration-300 ease-in-out ${showHistory ? "lg:col-span-9" : "lg:col-span-12"}`}>
          <ChatInterface
            key={activeSession ?? "new"} // 👈 esto fuerza un remount al cambiar de sesión
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSafeSubmit}
            isLoading={isLoading}
            selectedDocuments={selectedDocuments}
            onOpenDocumentSelector={openDocumentSelector}
          />
        </div>

        {/*<AnimatePresence initial={false}> */}
          {showHistory && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="lg:col-span-3 overflow-hidden">
              <ChatHistory
                sessions={chatSessions.map(session => ({ ...session, createdAt: session.date }))}
                activeSession={activeSession}
                onSelectSession={(id) => {
                  console.log("🟡 Chat seleccionado:", id);
                  setMessages([]);            // Limpia los mensajes anteriores inmediatamente
                  setActiveSession(id);       // Actualiza el estado
                  loadChatMessages(id);       // Carga los mensajes del nuevo chat
                }}




                onNewChat={() => {
                  setMessages([]);
                  setSelectedDocuments([]);
                  setActiveSession(null);
                }}
              />
            </motion.div>
          )}
        {/*</AnimatePresence>*/}
      </div>

      <DocumentSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        personalDocuments={personalDocsWithType}
        publicDocuments={publicDocsWithType}
        onDocumentsSelected={handleDocumentSelect}
        selectedDocuments={selectedDocuments}
      />

      {isMobile ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={toggleHistory}>
            {showHistory ? <ChevronRight className="h-4 w-4" /> : <History className="h-4 w-4" />}
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-1/2 -translate-y-1/2 z-10" style={{ right: showHistory ? "calc(25% - 12px)" : "0" }}>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={toggleHistory}>
            {showHistory ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </motion.div>
      )}
    </div>
  );
}