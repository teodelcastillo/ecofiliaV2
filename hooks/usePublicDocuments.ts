// hooks/usePublicDocuments.ts
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Document } from "@/models"
import {
    PublicDocumentCategory
} from "@/types/categories"

interface UsePublicDocumentsOptions {
  category?:  PublicDocumentCategory | null
  search?: string
  page?: number
  pageSize?: number
}

export function usePublicDocuments({
  category = null,
  search = "",
  page = 0,
  pageSize = 15,
}: UsePublicDocumentsOptions) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      let query = supabase
        .from("public_documents")
        .select("id, name, category, created_at, file_url")
        .order("created_at", { ascending: false })

      if (category) {
        query = query.eq("category", category)
      }

      if (search) {
        // When searching, ignore category
        query = query.or(`name.ilike.%${search}%`)
      } else if (category) {
        // Only apply category if no search is active
        query = query.eq("category", category)
      }
      

      const from = page * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error } = await query

      if (error) {
        setError(error.message)
        setDocuments([])
      } else {
        // If it's the first page, replace. Else append.
        setDocuments((prev) => (page === 0 ? data || [] : [...prev, ...(data || [])]))
        setHasMore((data?.length || 0) === pageSize)
      }

      setLoading(false)
    }

    fetchDocuments()
  }, [category, search, page, pageSize])

  return { documents, loading, error, hasMore }
}
