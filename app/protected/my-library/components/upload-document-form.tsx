"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Upload, Loader2, X } from "lucide-react"

interface UploadDocumentFormProps {
  userId: string
  onSuccess: (document: any) => void
}

export function UploadDocumentForm({ userId, onSuccess }: UploadDocumentFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      if (!name) {
        setName(selectedFile.name.split(".")[0])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `${userId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file)
      if (uploadError) throw uploadError

      const { data, error } = await supabase
        .from("documents")
        .insert({
          name: name || file.name,
          description,
          category: category || null,
          file_path: filePath,
          user_id: userId,
        })
        .select()
        .single()

      if (error) throw error

      // ✅ Extraer texto y chunks
      const extractRes = await fetch("/api/extract-text-serverless", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: data.id,
          type: "user",
        }),
      })

      if (!extractRes.ok) {
        const err = await extractRes.json()
        console.warn("⚠️ Extraction failed:", err)
        toast({
          title: "Extraction warning",
          description: "File was uploaded but content extraction may have failed.",
          variant: "destructive",
        })
      }

      onSuccess(data)

      // Reset form
      setName("")
      setDescription("")
      setCategory("")
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error("❌ Error uploading document:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="flex-1"
            disabled={isUploading}
          />
          {file && (
            <Button type="button" variant="ghost" size="icon" onClick={clearFile} disabled={isUploading}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {file && (
          <p className="text-xs text-muted-foreground">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Document Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter document name"
          disabled={isUploading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a brief description"
          disabled={isUploading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category (Optional)</Label>
        <Select value={category} onValueChange={setCategory} disabled={isUploading}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Research">Research</SelectItem>
            <SelectItem value="Report">Report</SelectItem>
            <SelectItem value="Sustainability">Sustainability</SelectItem>
            <SelectItem value="Energy">Energy</SelectItem>
            <SelectItem value="Water">Water</SelectItem>
            <SelectItem value="Waste">Waste</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isUploading || !file}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
