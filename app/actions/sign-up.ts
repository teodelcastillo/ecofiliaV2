"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function signUpAction(formData: FormData) {
  const fullName = formData.get("full_name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.ecofilia.host";

  if (!email || !password) {
    return redirect("/auth");
  }

  const { error } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { full_name: fullName },
    },
  });
  console.log("🔍 Email redirect origin:", origin);
  console.log("🔍 Email redirect URL:", `${origin}/auth/callback`);

  if (error) {
    return redirect(`/auth&type=error&message=${encodeURIComponent(error.message)}`);
  }

  return redirect(`/auth&type=success&message=${encodeURIComponent("Verification email sent")}`);
}
