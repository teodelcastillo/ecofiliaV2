"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface NotificationSettingsProps {
  user: User
  profile: any
}

export default function NotificationSettings({ user, profile }: NotificationSettingsProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Default notification preferences or from profile
  const [emailNotifications, setEmailNotifications] = useState(
    profile?.notifications?.email || {
      marketing: true,
      updates: true,
      comments: true,
      mentions: true,
    },
  )

  const handleToggleChange = (key: string) => {
    setEmailNotifications((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          notifications: {
            email: emailNotifications,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your notification preferences.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">Receive emails about new features and special offers</p>
                </div>
                <Switch
                  id="marketing"
                  checked={emailNotifications.marketing}
                  onCheckedChange={() => handleToggleChange("marketing")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="updates">Product updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new releases and updates</p>
                </div>
                <Switch
                  id="updates"
                  checked={emailNotifications.updates}
                  onCheckedChange={() => handleToggleChange("updates")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="comments">Comments</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone comments on your content</p>
                </div>
                <Switch
                  id="comments"
                  checked={emailNotifications.comments}
                  onCheckedChange={() => handleToggleChange("comments")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mentions">Mentions</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
                </div>
                <Switch
                  id="mentions"
                  checked={emailNotifications.mentions}
                  onCheckedChange={() => handleToggleChange("mentions")}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
