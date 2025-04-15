"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

interface AppearanceSettingsProps {
  user: User
  profile: any
}

export default function AppearanceSettings({ user, profile }: AppearanceSettingsProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(profile?.appearance?.theme || "system")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          appearance: {
            theme,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Appearance settings updated",
        description: "Your appearance preferences have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your appearance settings.",
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
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the application looks for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-4 text-lg font-medium">Theme</h3>
              <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-3 rounded-md bg-white p-2 shadow-sm">
                      <div className="space-y-2">
                        <div className="h-2 w-[80px] rounded-lg bg-[#eaeaea]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#eaeaea]" />
                      </div>
                    </div>
                    <span className="block w-full text-center font-normal">Light</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-3 rounded-md bg-slate-900 p-2 shadow-sm">
                      <div className="space-y-2">
                        <div className="h-2 w-[80px] rounded-lg bg-slate-700" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-700" />
                      </div>
                    </div>
                    <span className="block w-full text-center font-normal">Dark</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="system" id="system" className="sr-only" />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-3 flex items-center justify-center space-x-2">
                      <div className="rounded-md bg-white p-2 shadow-sm">
                        <div className="h-2 w-[30px] rounded-lg bg-[#eaeaea]" />
                      </div>
                      <div className="rounded-md bg-slate-900 p-2 shadow-sm">
                        <div className="h-2 w-[30px] rounded-lg bg-slate-700" />
                      </div>
                    </div>
                    <span className="block w-full text-center font-normal">System</span>
                  </Label>
                </div>
              </RadioGroup>
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
