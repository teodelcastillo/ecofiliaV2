// app/protected/admin/processing-status.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ProcessingDocument {
  id: string;
  name: string;
  chunking_status: string;
  chunking_done: boolean;
  chunking_offset: number;
}

export default function ProcessingStatusPage() {
  const [documents, setDocuments] = useState<ProcessingDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchStatus = async () => {
    const res = await fetch("/api/get-processing-status");
    const data = await res.json();
    setDocuments(data.documents || []);
  };

  const handleContinueProcessing = async () => {
    setIsProcessing(true);
    const res = await fetch("/api/continue-processing", { method: "POST" });
    await fetchStatus();
    setIsProcessing(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Estado de procesamiento de documentos</h1>

      <Button onClick={handleContinueProcessing} disabled={isProcessing}>
        {isProcessing ? "Procesando..." : "📥 Seguir procesando"}
      </Button>

      <div className="mt-6 space-y-4">
        {documents.length === 0 && <p>No hay documentos en proceso.</p>}

        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded p-4 shadow-sm bg-white dark:bg-muted"
          >
            <h2 className="text-lg font-semibold">{doc.name}</h2>
            <p className="text-sm text-muted-foreground">
              Estado: <strong>{doc.chunking_status}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Offset: {doc.chunking_offset} | Completado: {doc.chunking_done ? "✅ Sí" : "❌ No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}