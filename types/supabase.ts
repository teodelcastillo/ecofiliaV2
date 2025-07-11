export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          chunking_done: boolean | null
          chunking_offset: number | null
          chunking_status: string | null
          created_at: string | null
          description: string | null
          embedding_status: string | null
          extracted_text: string | null
          file_path: string
          id: string
          last_processed_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          chunking_done?: boolean | null
          chunking_offset?: number | null
          chunking_status?: string | null
          created_at?: string | null
          description?: string | null
          embedding_status?: string | null
          extracted_text?: string | null
          file_path: string
          id?: string
          last_processed_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          chunking_done?: boolean | null
          chunking_offset?: number | null
          chunking_status?: string | null
          created_at?: string | null
          description?: string | null
          embedding_status?: string | null
          extracted_text?: string | null
          file_path?: string
          id?: string
          last_processed_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string | null
          content: string
          created_at: string | null
          id: string
          role: string | null
        }
        Insert: {
          chat_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          admin: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          admin?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          admin?: boolean | null
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          created_at: string | null
          document_id: string | null
          id: string
          project_id: string
          public_document_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          project_id: string
          public_document_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          project_id?: string
          public_document_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_documents_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_project_documents_public_docs"
            columns: ["public_document_id"]
            isOneToOne: false
            referencedRelation: "public_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reports: {
        Row: {
          created_at: string | null
          file_url: string
          id: string
          project_id: string | null
          type: Database["public"]["Enums"]["Report Types"]
        }
        Insert: {
          created_at?: string | null
          file_url: string
          id?: string
          project_id?: string | null
          type?: Database["public"]["Enums"]["Report Types"]
        }
        Update: {
          created_at?: string | null
          file_url?: string
          id?: string
          project_id?: string | null
          type?: Database["public"]["Enums"]["Report Types"]
        }
        Relationships: [
          {
            foreignKeyName: "project_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          client: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          client?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          client?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      public_documents: {
        Row: {
          category: string | null
          created_at: string | null
          extracted_text: string | null
          file_url: string
          id: string
          name: string
        }
        Insert: {
          category: string | null
          created_at?: string | null
          extracted_text?: string | null
          file_url: string
          id?: string
          name: string
        }
        Update: {
          category: string | null
          created_at?: string | null
          extracted_text?: string | null
          file_url?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      smart_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          keywords: string[] | null
          public_document_id: string | null
          summary: string | null
          title: string | null
          token_count: number
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          keywords?: string[] | null
          public_document_id?: string | null
          summary?: string | null
          title?: string | null
          token_count: number
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          keywords?: string[] | null
          public_document_id?: string | null
          summary?: string | null
          title?: string | null
          token_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "smart_chunks_public_document_id_fkey"
            columns: ["public_document_id"]
            isOneToOne: false
            referencedRelation: "public_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          occupation: string
          organization: string | null
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          occupation: string
          organization?: string | null
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          occupation?: string
          organization?: string | null
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      projects_with_document_count: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          client: string | null
          user_id: string
          created_at: string | null
          document_count: number
        }
      }
    }

    
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      fetch_documents_metadata: {
        Args: { doc_ids: string[] }
        Returns: {
          id: string
          name: string
        }[]
      }
      get_unique_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_project_chunks: {
        Args: {
          query_embedding: string
          match_count: number
          project_document_ids: string[]
          project_public_document_ids: string[]
          match_user_id: string
        }
        Returns: {
          document_id: string
          content: string
          similarity: number
          document_type: string
        }[]
      }
      match_smart_chunks: {
        Args: {
          query_embedding: string
          match_count?: number
          filter_document_ids?: string[]
        }
        Returns: {
          id: string
          public_document_id: string
          content: string
          title: string
          summary: string
          keywords: string[]
          similarity_score: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      Category:
        | "NDCs"
        | "NAPs"
        | "LTS"
        | "ESG"
        | "IPCC"
        | "IPBES"
        | "EIAs"
        | "SDGs"
      document_source: "user" | "public"
      "Report Types": "overview" | "inputs" | "sustainability"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Category: ["NDCs", "NAPs", "LTS", "ESG", "IPCC", "IPBES", "EIAs", "SDGs", ],
      document_source: ["user", "public"],
      "Report Types": ["overview", "inputs", "sustainability"],
    },
  },
} as const
