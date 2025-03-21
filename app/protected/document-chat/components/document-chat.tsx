"use client";

import { useChat } from "@ai-sdk/react";
import { useSession } from "@supabase/auth-helpers-react";
import { DocumentSelector } from "./document-selector";
import { ChatInterface } from "./chat-interface";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  description?: string;
  category?: string;
  created_at: string;
  file_url?: string;
  file_type?: string;
  user_id: string;
  [key: string]: any;
}

interface DocumentChatProps {
  personalDocuments: Document[];
  publicDocuments: Document[];
  userId: string;
}

export function DocumentChat({ personalDocuments, publicDocuments, userId }: DocumentChatProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const session = useSession();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat/query",
    body: {
      documentIds: selectedDocuments.map((doc) => doc.id),
      projectId: "proj_xyz",
      userId: session?.user.id,
    },
  });

  const handleDocumentSelect = (documents: Document[]) => {
    setSelectedDocuments(documents);
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
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          selectedDocuments={selectedDocuments}
        />
      </div>
    </div>
  );
}
