import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (redirectTo && redirectTo.startsWith("/")) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // Redirige al login con mensaje de éxito
  return NextResponse.redirect(
    `${origin}/auth?tab=sign-in&type=success&message=Email verified. You can now log in.`
  );
}
