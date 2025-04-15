"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"

// Define the form schema with Zod
const waitlistFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  occupation: z.enum(["student", "researcher", "consultant", "freelancer", "other"], {
    required_error: "Please select an occupation",
  }),
  organization: z.string().optional(),
})

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>

interface WaitlistModalProps {
  children?: React.ReactNode
  className?: string
}

export function WaitlistModal({ children, className }: WaitlistModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Initialize the form
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phoneNumber: "",
      organization: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: WaitlistFormValues) {
    setIsSubmitting(true)

    try {
      // Insert the waitlist entry into Supabase
      const { error } = await supabase.from("waitlist").insert([
        {
          email: data.email,
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          occupation: data.occupation,
          organization: data.organization || null,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      // Show success state
      setIsSuccess(true)
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you when the community launches.",
      })

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setIsSuccess(false)
        form.reset()
        setOpen(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting waitlist form:", error)
      toast({
        title: "Something went wrong",
        description: "There was an error adding you to the waitlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || <Button className={className}>Join Waitlist</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Join the Waitlist</DialogTitle>
              <DialogDescription>
                Be the first to know when our community feature launches. Fill out the form below to join the waitlist.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Occupation <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your occupation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="researcher">Researcher</SelectItem>
                          <SelectItem value="consultant">Consultant</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company or institution" {...field} />
                      </FormControl>
                      <FormDescription>The organization or institution you're affiliated with</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-sm text-muted-foreground mt-6">
                  <span className="text-red-500">*</span> Required fields
                </p>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Join Waitlist"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">You're on the list!</h3>
            <p className="text-muted-foreground">
              Thanks for your interest! We'll notify you when our community feature launches.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
