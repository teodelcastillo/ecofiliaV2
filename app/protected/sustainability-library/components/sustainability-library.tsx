"use client"

import { useState } from "react";
import { DocumentCard } from "./document-card";
import { DocumentFilters } from "./document-filters";

interface SustainabilityLibraryProps {
  documents: any[];
  categories: string[];
}

export function SustainabilityLibrary({ documents, categories }: SustainabilityLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDocuments = selectedCategory
    ? documents.filter((doc) => doc.category === selectedCategory)
    : documents;

  return (
    <div>
      <div className="mb-4">
      <DocumentFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}
