// hooks/usePublicDocuments.ts
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

interface Document {
  id: string
  name: string
  category?: string
  created_at: string
  file_url: string
}

interface UsePublicDocumentsOptions {
  category?: string | null
  search?: string
  page?: number
  pageSize?: number
}

export function usePublicDocuments({ category, search = "", page = 0, pageSize = 10 }: UsePublicDocumentsOptions) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      let query = supabase
        .from("public_documents")
        .select("id, name, category, created_at, file_url")
        .order("created_at", { ascending: false })
        .range(page * pageSize, page * pageSize + pageSize - 1)

      if (category) query = query.eq("category", category)
      if (search) query = query.ilike("name", `%${search}%`)

      const { data, error } = await query

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setDocuments((prev) => {
        const merged = [...prev, ...(data || [])]
        return Array.from(new Map(merged.map((doc) => [doc.id, doc])).values())
      })
      setHasMore((data?.length || 0) === pageSize)
      setLoading(false)
    }

    fetchDocuments()
  }, [category, search, page, pageSize])

  return { documents, loading, hasMore, error }
}
