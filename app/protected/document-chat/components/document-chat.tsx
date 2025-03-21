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

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/chat/query",
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
  
    // Add user's message locally
    await append({ role: "user", content: input });
  
    // Send to API manually
    try {
      const res = await fetch("/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentIds: selectedDocuments.map((doc) => doc.id),
          projectId: "proj_xyz",
          userId: session?.user.id,
          input: input,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok && data.response) {
        // Append AI message
        await append({ role: "assistant", content: data.response });
      } else {
        console.error(data.error || "Unknown error");
        alert("Error: " + (data.error || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
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
          handleSubmit={handleSafeSubmit} // 🔥 Use the wrapped handler here
          isLoading={isLoading}
          selectedDocuments={selectedDocuments}
        />
      </div>
    </div>
  );
}
