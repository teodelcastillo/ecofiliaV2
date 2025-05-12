import { signUpAction } from "@/app/actions/sign-up";
import { AuthClient } from "./auth-client";
import { Suspense } from "react";

export default function AuthPage() {
  return (

  <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
    <AuthClient onSignUp={signUpAction} />
  </Suspense>
  
  )
}
