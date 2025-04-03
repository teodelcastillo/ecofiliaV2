"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, FileIcon } from "lucide-react";
import { getFileIcon } from "../utils/file-icons";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentUploaded: (document: any) => void;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onDocumentUploaded,
}: UploadDocumentDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  // 🔄 Fetch user's projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setProjects(data);
    };

    if (open) fetchProjects();
  }, [open, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!file) {
      setError("Please upload a file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Authentication error. Please log in again.");
      }

      const fileExt = getFileExtension(file.name);
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("user-documents")
        .upload(filePath, file);

      if (uploadError) throw new Error(`File upload error: ${uploadError.message}`);

      const { data: document, error: insertError } = await supabase
        .from("documents")
        .insert({
          name: title,
          description,
          category,
          file_path: filePath,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw new Error(`Database insert error: ${insertError.message}`);

      // ✅ Vincular al proyecto si se eligió uno
// ✅ Vincular al proyecto si se eligió uno
if (projectId) {
  console.log("✅ Intentando vincular documento al proyecto:");
  console.log("projectId:", projectId);
  console.log("documentId:", document.id);

  const { error: linkError } = await supabase.from("project_documents").insert({
    project_id: projectId,
    document_id: document.id,           // 👈 Solo para documentos privados
    public_document_id: null            // 👈 Por claridad
  });
  
  if (linkError) {
    console.error("❌ Error al vincular documento al proyecto:", linkError.message);
    console.error("🔍 Detalles del error:", linkError);
  } else {
    console.log("✅ Documento vinculado correctamente al proyecto");
  }
} else {
  console.log("ℹ️ No se seleccionó ningún proyecto, no se vinculará el documento.");
}


      // Trigger text extraction
      try {
        const response = await fetch(`${window.location.origin}/api/extract-text-serverless`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: document.id,
            type: "user",
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          console.error("Text extraction failed:", errData.error);
        }
      } catch (extractionError) {
        console.error("Failed to call extract-text function:", extractionError);
      }

      onDocumentUploaded(document);

      // Reset
      setTitle("");
      setDescription("");
      setCategory("");
      setProjectId(undefined);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onOpenChange(false);
    } catch (err: any) {
      console.error("Error uploading document:", err);
      setError(err.message || "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  const FileTypeIcon = file ? getFileIcon(getFileExtension(file.name)) : FileIcon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add a new document to your library, and optionally to a project.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="required">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project">Link to Project (optional)</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="file" className="required">File</Label>
              {!file ? (
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX, XLSX (max 10MB)</p>
                  <Input
                    id="file"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <div className="p-2 bg-muted rounded">
                    <FileTypeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
