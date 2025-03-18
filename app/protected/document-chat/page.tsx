import { DocumentChat } from "./components/document-chat";

export default function DocumentChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Document Chat</h1>
      <p className="text-muted-foreground mb-8">
        Select documents from your library or the public collection and chat with an AI assistant about them.
      </p>
      <DocumentChat />
    </div>
  )
}

