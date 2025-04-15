import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AccountSettings from "./components/account-settings"
import ProfileSettings from "./components/profile-settings"
import NotificationSettings from "./components/notification-settings"
import AppearanceSettings from "./components/appearance-settings"

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch the user's profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountSettings user={session.user} />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileSettings user={session.user} profile={profile} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings user={session.user} profile={profile} />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings user={session.user} profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
