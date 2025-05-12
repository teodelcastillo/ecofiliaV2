import { signUpAction } from "@/app/actions/sign-up";
import { AuthClient } from "./auth-client";

export default function AuthPage() {
  return <AuthClient onSignUp={signUpAction} />;
}
