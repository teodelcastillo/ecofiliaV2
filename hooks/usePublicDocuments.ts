// hooks/usePublicDocuments.ts
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

interface PublicDocument {
  id: string
  name: string
  category?: string
  created_at: string
  file_url: string
}

interface UsePublicDocumentsOptions {
  category?: string | null
  search?: string
  limit?: number
  offset?: number
}

export function usePublicDocuments({
  category = null,
  search = "",
  limit = 15,
  offset = 0,
}: UsePublicDocumentsOptions) {
  const [documents, setDocuments] = useState<PublicDocument[]>([])
  const [loading, setLoading] = useState(true)
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
        .range(offset, offset + limit - 1)

      if (category) query = query.eq("category", category)
      if (search) query = query.ilike("name", `%${search}%`)

      const { data, error } = await query

      if (error) {
        setError(error.message)
        setDocuments([])
      } else {
        setDocuments(data || [])
      }

      setLoading(false)
    }

    fetchDocuments()
  }, [category, search, limit, offset])

  return { documents, loading, error }
}
