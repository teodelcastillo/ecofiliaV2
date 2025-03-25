export interface Document {
  id: string;
  name: string;
  description?: string;
  category?: string;
  created_at: string;
  file_url?: string;
  file_path: string;
  file_type?: string;
  user_id: string;
  type?: string;       // <- missing in your local defs
  dateAdded?: string;  // <- missing in your local defs
}
