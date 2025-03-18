"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client"; 
import type { Document } from "@/models";

interface DocumentSelectorProps {
  onDocumentsSelected: (documents: Document[]) => void;
  selectedDocuments: Document[];
  userId: string; // Add userId prop for personal docs filtering
}

export function DocumentSelector({ onDocumentsSelected, selectedDocuments, userId }: DocumentSelectorProps) {
  const [personalDocuments, setPersonalDocuments] = useState<Document[]>([]);
  const [publicDocuments, setPublicDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch documents from Supabase
  useEffect(() => {
    const fetchDocuments = async () => {
      // Fetch personal documents
      const supabase = await createClient();
      const { data: personal, error: personalError } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId); // Filter personal docs by user

      if (!personalError && personal) {
        setPersonalDocuments(personal);
      }

      // Fetch public documents
      const { data: pubDocs, error: publicError } = await supabase
        .from("public_documents")
        .select("*");

      if (!publicError && pubDocs) {
        setPublicDocuments(pubDocs);
      }
    };

    fetchDocuments();
  }, [userId]);

  const toggleDocumentSelection = (document: Document) => {
    const isSelected = selectedDocuments.some((doc) => doc.id === document.id);

    if (isSelected) {
      onDocumentsSelected(selectedDocuments.filter((doc) => doc.id !== document.id));
    } else {
      onDocumentsSelected([...selectedDocuments, document]);
    }
  };

  const filterDocuments = (documents: Document[]) => {
    if (!searchQuery) return documents;
    return documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredPersonalDocs = filterDocuments(personalDocuments);
  const filteredPublicDocs = filterDocuments(publicDocuments);

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <CardTitle>Select Documents</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">My Library</TabsTrigger>
            <TabsTrigger value="public">Public Library</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4">
            <ScrollArea className="h-[calc(100vh-22rem)]">
              <DocumentList
                documents={filteredPersonalDocs}
                selectedDocuments={selectedDocuments}
                onToggle={toggleDocumentSelection}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="public" className="mt-4">
            <ScrollArea className="h-[calc(100vh-22rem)]">
              <DocumentList
                documents={filteredPublicDocs}
                selectedDocuments={selectedDocuments}
                onToggle={toggleDocumentSelection}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface DocumentListProps {
  documents: Document[];
  selectedDocuments: Document[];
  onToggle: (document: Document) => void;
}

function DocumentList({ documents, selectedDocuments, onToggle }: DocumentListProps) {
  if (documents.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No documents found</p>;
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
          onClick={() => onToggle(doc)}
        >
          <Checkbox checked={selectedDocuments.some((d) => d.id === doc.id)} onCheckedChange={() => onToggle(doc)} />
          <div className="flex-1">
            <p className="text-sm font-medium">{doc.name}</p>
            <p className="text-xs text-muted-foreground">{doc.type?.toUpperCase()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
