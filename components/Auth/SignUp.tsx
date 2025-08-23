"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Input } from "../ui/input";

export default function SignUp({ redirectTo }: { redirectTo: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onResponse: () => {
            setLoading(false);
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            // Auto sign in after successful signup
            authClient.signIn.email(
              {
                email,
                password,
              },
              {
                onSuccess: () => {
                  toast.success("Successfully signed in!");
                  router.push("/dashboard");
                },
                onError: (ctx: { error?: { message: string } }) => {
                  toast.error(
                    ctx.error?.message ||
                      "Failed to sign in after account creation",
                  );
                },
              },
            );
          },
          onError: (ctx: { error?: { message: string } }) => {
            toast.error(ctx.error?.message || "Failed to create account");
            setLoading(false);
          },
        },
      );
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-none bg-transparent border-none backdrop-blur-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Snow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="group w-full h-12 rounded-lg bg-accent/20 text-sm font-semibold text-primary-foreground/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-2 border border-border/40"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRightIcon
                      className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                      size={16}
                      aria-hidden="true"
                    />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                await authClient.signIn.social(
                  {
                    provider: "google",
                    callbackURL: redirectTo,
                  },
                  {
                    onRequest: () => setLoading(true),
                    onResponse: () => setLoading(false),
                    onError: (ctx: { error?: { message: string } }) => {
                      toast.error(
                        ctx.error?.message || "Failed to sign up with Google",
                      );
                      setLoading(false);
                    },
                  },
                );
              }}
              className="inline-flex w-full h-12 items-center justify-center gap-2 rounded-lg border border-border/40 bg-accent/20 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                width="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="truncate">Google</span>
            </button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
