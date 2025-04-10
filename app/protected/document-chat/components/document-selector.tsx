"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Document } from "@/models";

interface DocumentSelectorProps {
  personalDocuments: Document[];
  publicDocuments: Document[];
  onDocumentsSelected: (documents: Document[]) => void;
  selectedDocuments: Document[];
}

export function DocumentSelector({
  personalDocuments,
  publicDocuments,
  onDocumentsSelected,
  selectedDocuments,
}: DocumentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDocumentSelection = (document: Document, type: 'user' | 'public') => {
    const isSelected = selectedDocuments.some((doc) => doc.id === document.id);

    const docWithType = { ...document, type }; // Explicitly add type here

    if (isSelected) {
      onDocumentsSelected(selectedDocuments.filter((doc) => doc.id !== document.id));
    } else {
      onDocumentsSelected([...selectedDocuments, docWithType]);
    }
  };

  const filterDocuments = (documents: Document[]) => {
    if (!searchQuery) return documents;
    return documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
                onToggle={(doc) => toggleDocumentSelection(doc, 'user')}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="public" className="mt-4">
            <ScrollArea className="h-[calc(100vh-22rem)]">
              <DocumentList
                documents={filteredPublicDocs}
                selectedDocuments={selectedDocuments}
                onToggle={(doc) => toggleDocumentSelection(doc, 'public')}
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
            <p className="text-xs text-muted-foreground">{doc.category?.toUpperCase() || 'UNKNOWN'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
