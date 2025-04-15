import ProfileForm from "./profile-form"
import { requireUser } from "@/lib/require-user"


export default async function ProfilePage() {
  const { user, supabase } = await requireUser()


  // Fetch the user's profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and profile information</p>
        </div>

        <ProfileForm user={user} profile={profile} />
      </div>
    </div>
  )
}
