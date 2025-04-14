import { Suspense } from "react";
import { AuthClient } from "./auth-client";

export default function AuthPageWrapper() {
  return (
    <Suspense>
      <AuthClient />
    </Suspense>
  );
}
