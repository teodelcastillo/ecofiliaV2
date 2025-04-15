// hooks/usePublicDocumentCategories.ts
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

export function usePublicDocumentCategories() {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("public_documents").select("category")

      const raw = data?.map((d) => d.category).filter(Boolean) || []
      setCategories(Array.from(new Set(raw)))
    }

    fetchCategories()
  }, [])

  return categories
}
