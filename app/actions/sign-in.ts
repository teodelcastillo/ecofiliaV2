"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";
import type { Database } from "@/types/supabase";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = createPagesBrowserClient<Database>();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return encodedRedirect("error", "/auth?tab=sign-in", error.message);
  }

  return redirect("/protected");
};
