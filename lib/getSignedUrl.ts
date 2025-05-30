// utils/getSignedUrl.ts
import { createClient } from "@/utils/supabase/client";

export const getSignedUrl = async (bucket: string, filePath: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 60 * 10); // 10 minutes

  if (error) {
    console.error("Failed to get signed URL", error);
    return null;
  }

  return data?.signedUrl || null;
};
