"use client"

import { useChat } from "@ai-sdk/react";
import { useSession } from "@supabase/auth-helpers-react"; // to grab user info
import { DocumentSelector } from "./document-selector";
import { ChatInterface } from "./chat-interface";
import { useState } from "react";
import { Document } from "c:/Users/teodo/OneDrive/Escritorio/ECOFILIA/ecofiliaV2/ecofilia-auth/models";

export function DocumentChat() {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const session = useSession(); // assuming you already have auth setup
  const userId= session?.user.id;

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat/query", // Updated to point to query endpoint
    body: {
      documentIds: selectedDocuments.map((doc) => doc.id),
      projectId: "proj_xyz", // Replace this with the actual project ID (can pass as prop)
      userId: session?.user.id, // pass user id to backend
    },
  });

  const handleDocumentSelect = (documents: Document[]) => {
    setSelectedDocuments(documents);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <DocumentSelector
          onDocumentsSelected={handleDocumentSelect}
          selectedDocuments={selectedDocuments}
          userId={userId || ""} />
      </div>
      <div className="lg:col-span-2">
        <ChatInterface
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          selectedDocuments={selectedDocuments}
        />
      </div>
    </div>
  );
}
