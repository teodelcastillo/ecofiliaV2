// utils/supabase/server.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase"; // opcional, si tenés types

export const createClient = () => {
  return createServerComponentClient<Database>({ cookies });
};
