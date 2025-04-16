export interface Document {
  id: string | null;
  name: string | null;
  description?: string | null;
  category?: string | null;
  created_at: string | null;
  file_url?: string | null;
  file_path?: string | null;
  file_type?: string | null;
  user_id?: string | null;
  type?: string | null;      
  dateAdded?: string | null;
  body?: string | null;  
  processing_status?: string | null;
  source?: "user" | "public";
}

export interface Project {
  id: string | null
  name: string | null
  description?: string | null
  category?: string | null
  client?: string | null
  user_id: string | null
  created_at: string | null
  documents?: Document[]
}

export interface Report {
  id: string | null
  project_id: string | null
  projectName: string | null
  type: string | null
  name?: string | null
  created_at: string | null
  file_url?: string | null
  file_path?: string | null
}

export interface Profile {
  full_name?: string | null
  avatar_url?: string | null
  role?: string | null
}