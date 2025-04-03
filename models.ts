export interface Document {
  id: string;
  name: string;
  description?: string;
  category?: string;
  created_at: string;
  file_url?: string;
  file_path?: string;
  file_type?: string;
  user_id?: string;
  type?: string;      
  dateAdded?: string;  
  source?: "user" | "public";
}

export interface Project {
  id: string
  name: string
  description?: string
  category?: string
  client?: string
  user_id: string
  created_at: string
}