"use client";

import { useChat } from "@ai-sdk/react";
import { useSession } from "@supabase/auth-helpers-react";
import { DocumentSelector } from "./document-selector";
import { ChatInterface } from "./chat-interface";
import { useState } from "react";

import type { Document } from "@/models";

interface DocumentChatProps {
  personalDocuments: Document[];
  publicDocuments: Document[];
  userId: string;
}

export function DocumentChat({ personalDocuments, publicDocuments, userId }: DocumentChatProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const session = useSession();

  // ✅ Disable automatic call to API from useChat
  const { messages, input, handleInputChange, isLoading, append } = useChat({
    api: "", // disables auto-calling API
    initialMessages: [],
  });

  const handleDocumentSelect = (documents: Document[]) => {
    setSelectedDocuments(documents);
  };

  const handleSafeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedDocuments.length === 0) {
      alert("Please select at least one document before starting chat.");
      return;
    }

    if (!input || input.trim() === "") {
      alert("Please enter a message before sending.");
      return;
    }

    // Add user message to local chat UI
    await append({ role: "user", content: input });

    try {
      const res = await fetch("/api/chat-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: selectedDocuments.map((doc) => ({
            id: doc.id,
            type: doc.type, // "public" or "user"
          })),
          question: input,
        }),
      });

      const data = await res.json();

      if (res.ok && data.response) {
        await append({ role: "assistant", content: data.response });
      } else {
        console.error(data.error || "Unknown error");
        alert("Error: " + (data.error || "Unknown"));
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("An unexpected error occurred while contacting the AI.");
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
