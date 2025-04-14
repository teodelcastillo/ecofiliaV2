"use client"

import { forgotPasswordAction } from "@/app/actions"
import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

export default function ForgotPassword() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const type = searchParams.get("type")

  // Format message for FormMessage component
  const formattedMessage: Message = message ? { message } : { message: "" };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // If there's a success message, show a confirmation screen
  if (type === "success" && message) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-4">
                We've sent you instructions on how to reset your password. Please check your inbox.
              </p>
              <Link href="/auth" className="text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft size={16} /> Return to sign in
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-md">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="space-y-1">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
              <CardDescription>Enter your email to receive a password reset link</CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              className="space-y-4"
              action={forgotPasswordAction}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <SubmitButton formAction={forgotPasswordAction} pendingText="Sending..." className="w-full">
                  Reset Password
                </SubmitButton>
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormMessage message={formattedMessage} />
              </motion.div>
            </motion.form>
          </CardContent>

          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/auth" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
