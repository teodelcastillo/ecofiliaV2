  "use client"

  import type React from "react"

  import { useEffect, useState } from "react"
  import { createClient } from "@/utils/supabase/client"
  import type { User } from "@supabase/supabase-js"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { useToast } from "@/hooks/use-toast"

  interface ProfileFormProps {
    user: User
    profile: any
  }

  export default function ProfileForm({ user, profile }: ProfileFormProps) {

    
    const supabase = createClient()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [displayName, setDisplayName] = useState(profile?.full_name || "")
    useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        console.log("Session user id:", data.session?.user.id);
      });
    }, []);
    

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      try {
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            full_name: displayName,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" } // 👈 fixes the RLS conflict
        );
        
      
        
        if (error) {
          console.error("Supabase upsert error:", error.message);
          throw error;
        }
        

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "There was an error updating your profile.",
          variant: "destructive",
        });
        console.error("Supabase update error:", error);
      } finally {
        setLoading(false)
      }
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled readOnly />
              <p className="text-sm text-muted-foreground">
                Your email address is managed by Supabase Auth and cannot be changed here.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
          </CardContent>
          <CardFooter>
          <Button type="submit" disabled={loading || displayName === profile?.full_name}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>

          </CardFooter>
        </form>
      </Card>
    )
  }
