// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session) {
          router.replace("/dashboard"); // ✅ o la ruta que prefieras
        } else {
          router.replace("/auth?type=error&message=Invalid session");
        }
      });
  }, [router]);

  return <p className="text-center mt-20">Verifying session...</p>;
}
