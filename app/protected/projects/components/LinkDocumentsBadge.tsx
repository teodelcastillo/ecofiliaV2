"use client"

import { useEffect, useState } from "react"
import { Plus, Library, User, X, Check, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/utils/supabase/client"

interface LinkDocumentsBadgeProps {
  projectId: string
  className?: string
  onDocumentsLinked?: () => void
}

export function LinkDocumentsBadge({ projectId, className = "", onDocumentsLinked }: LinkDocumentsBadgeProps) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([])
  const [publicDocs, setPublicDocs] = useState<any[]>([])
  const [userDocs, setUserDocs] = useState<any[]>([])

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [userRes, publicRes] = await Promise.all([
        supabase.from("documents").select("id, name, category, created_at, file_path, user_id"),
        supabase.from("public_documents").select("id, name, category, created_at, file_url")
      ])

      setUserDocs(userRes.data || [])
      setPublicDocs(publicRes.data || [])
    }

    if (open) fetchDocuments()
  }, [open])

  const handleToggle = (doc: any) => {
    const alreadySelected = selectedDocuments.some(d => d.id === doc.id && d.source === doc.source)
    setSelectedDocuments(prev =>
      alreadySelected ? prev.filter(d => !(d.id === doc.id && d.source === doc.source)) : [...prev, doc]
    )
  }

  const handleSubmit = async () => {
    const insertions = selectedDocuments.map((doc) => {
      return doc.source === "user"
        ? { project_id: projectId, document_id: doc.id, public_document_id: null }
        : { project_id: projectId, document_id: null, public_document_id: doc.id }
    })

    const { error } = await supabase.from("project_documents").insert(insertions)
    if (!error) {
      setSelectedDocuments([])
      setOpen(false)
      onDocumentsLinked?.()
    } else {
      console.error("Error linking documents:", error.message)
    }
  }

  const filterDocs = (docs: any[]) =>
    docs.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Badge className={`cursor-pointer px-3 py-1.5 text-sm font-medium hover:bg-primary/90 ${className}`}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Link Documents
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Link Documents to Project</DialogTitle>
          <DialogDescription>Select from your library or public documents.</DialogDescription>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" /> My Documents
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Library className="h-4 w-4" /> Public Library
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[300px] pr-4">
            <TabsContent value="user" className="space-y-4 mt-2">
              {filterDocs(userDocs).map((doc) => (
                <DocumentItem
                  key={doc.id}
                  doc={{ ...doc, source: "user" }}
                  selected={selectedDocuments.some(d => d.id === doc.id && d.source === "user")}
                  onToggle={() => handleToggle(doc)}
                />
              ))}
            </TabsContent>

            <TabsContent value="public" className="space-y-4 mt-2">
              {filterDocs(publicDocs).map((doc) => (
                <DocumentItem
                  key={doc.id}
                  doc={{ ...doc, source: "public" }}
                  selected={selectedDocuments.some(d => d.id === doc.id && d.source === "public")}
                  onToggle={() => handleToggle(doc)}
                />
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={selectedDocuments.length === 0}>
            Link {selectedDocuments.length} Document{selectedDocuments.length > 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DocumentItem({ doc, selected, onToggle }: { doc: any, selected: boolean, onToggle: () => void }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
        selected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
      }`}
      onClick={onToggle}
    >
      <Checkbox checked={selected} onCheckedChange={onToggle} className="h-5 w-5" />
      <div className="flex-1 overflow-hidden">
        <h4 className="font-medium leading-none line-clamp-1">{doc.name}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {doc.category || "Uncategorized"} • {new Date(doc.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${selected ? "bg-primary text-white" : "bg-muted"}`}>
        {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </div>
    </div>
  )
}
