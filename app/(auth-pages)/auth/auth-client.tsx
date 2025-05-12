"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { signInAction } from "@/app/actions/sign-in";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AuthClientProps {
  onSignUp: (formData: FormData) => void;
}

export function AuthClient({ onSignUp }: AuthClientProps) {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const type = searchParams.get("type");
  const initialTab = searchParams.get("tab") === "sign-up" ? "sign-up" : "sign-in";

  const [activeTab, setActiveTab] = useState(initialTab);
  const formattedMessage: Message = message ? { message } : { message: "" };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  if (type === "success" && message && activeTab === "sign-up") {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Verification Email Sent</h2>
              <p className="text-muted-foreground mb-4">Please check your email to complete your registration.</p>
              <Link href="/auth?tab=sign-in" className="text-primary hover:underline flex items-center justify-center gap-1">
                Return to sign in <ArrowRight size={16} />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-md">
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="space-y-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="sign-in" className="mt-0">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
                <motion.form
                  className="space-y-4 mt-4"
                  action={signInAction}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Email */}
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Mail size={18} />
                      </div>
                      <Input id="signin-email" name="email" type="email" placeholder="you@example.com" className="pl-10" required />
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock size={18} />
                      </div>
                      <Input id="signin-password" name="password" type="password" placeholder="••••••••" className="pl-10" required />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SubmitButton pendingText="Signing In..." className="w-full">Sign in</SubmitButton>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormMessage message={formattedMessage} />
                  </motion.div>
                </motion.form>
              </TabsContent>

              <TabsContent value="sign-up" className="mt-0">
                <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                <CardDescription>Enter your details to create your account</CardDescription>
                <motion.form
                  className="space-y-4 mt-4"
                  action={onSignUp}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="signup-full-name">Full Name</Label>
                    <Input id="signup-full-name" name="full_name" type="text" placeholder="John Doe" required />
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Mail size={18} />
                      </div>
                      <Input id="signup-email" name="email" type="email" placeholder="you@example.com" className="pl-10" required />
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock size={18} />
                      </div>
                      <Input id="signup-password" name="password" type="password" placeholder="Create a password" className="pl-10" minLength={6} required />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Password must be at least 6 characters long</p>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SubmitButton formAction={onSignUp} pendingText="Creating account..." className="w-full">Sign up</SubmitButton>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormMessage message={formattedMessage} />
                  </motion.div>
                </motion.form>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardFooter className="flex justify-center border-t p-4">
            {activeTab === "sign-in" ? (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button onClick={() => setActiveTab("sign-up")} className="text-primary font-medium hover:underline">Sign up</button>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setActiveTab("sign-in")} className="text-primary font-medium hover:underline">Sign in</button>
              </p>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
