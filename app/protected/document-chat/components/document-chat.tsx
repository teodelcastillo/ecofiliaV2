"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { DocumentSelector } from "./document-selector";
import { ChatInterface } from "./chat-interface";
import { useState } from "react";
import { nanoid } from "nanoid";

import type { Message } from "ai";
import type { Document } from "@/models";

interface DocumentChatProps {
  personalDocuments: Document[];
  publicDocuments: Document[];
  userId: string;
}

export function DocumentChat({ personalDocuments, publicDocuments, userId }: DocumentChatProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const handleDocumentSelect = (documents: Document[]) => {
    setSelectedDocuments(documents);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const appendMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateLastAssistantMessage = (content: string) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === prev.length - 1 && msg.role === "assistant"
          ? { ...msg, content }
          : msg
      )
    );
  };

  const handleSafeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedDocuments.length === 0 || !input.trim()) {
      alert("Please enter a question and select at least one document.");
      return;
    }

    setIsLoading(true);
    const userQuestion = input;
    setInput(""); // Clear the input

    appendMessage({ role: "user", content: userQuestion, id: nanoid() });

    // Add placeholder assistant message
    const assistantId = nanoid();
    appendMessage({ role: "assistant", content: "...", id: assistantId });

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
      });

      if (!res.ok || !res.body) {
        const error = await res.json();
        throw new Error(error.error || "Unknown error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let finalAnswer = "";

      let updating = false;
      const scheduleUpdate = () => {
        if (updating) return;
        updating = true;
        requestAnimationFrame(() => {
          updateLastAssistantMessage(finalAnswer);
          updating = false;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        finalAnswer += chunk;
        scheduleUpdate();
      }

      updateLastAssistantMessage(finalAnswer);
    } catch (err) {
      console.error("❌ Error streaming response:", err);
      alert("Failed to get a response from the assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <DocumentSelector
          personalDocuments={personalDocuments}
          publicDocuments={publicDocuments}
          onDocumentsSelected={handleDocumentSelect}
          selectedDocuments={selectedDocuments}
        />
      </div>
      <div className="lg:col-span-2">
        <ChatInterface
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSafeSubmit}
          isLoading={isLoading}
          selectedDocuments={selectedDocuments}
        />
      </div>
    </div>
  );
}
