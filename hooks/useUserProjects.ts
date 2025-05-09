"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Project } from "@/models"

export function useUserProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchProjects = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching projects:", error.message)
        setError(error.message)
        setProjects([])
      } else {
        console.log("✅ Simple projects fetch:", data)
        setProjects(data || [])
      }

      setLoading(false)
    }

    fetchProjects()
  }, [])

  return { projects, loading, error }
}
