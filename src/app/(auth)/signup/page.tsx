'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signUp, resendVerificationEmail } from '../actions'
import { toast } from 'sonner'

function SignUpForm() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [prefillEmail, setPrefillEmail] = useState('')
  const [prefillPassword, setPrefillPassword] = useState('')

  // Pre-fill email/password from sessionStorage if available
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signupEmail')
    const storedPassword = sessionStorage.getItem('signupPassword')
    if (storedEmail) setPrefillEmail(storedEmail)
    if (storedPassword) setPrefillPassword(storedPassword)
  }, [])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setUserEmail(formData.get('email') as string)

    try {
      const result = await signUp(formData)

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success) {
        setShowVerificationMessage(true)
        toast.success(result.message)
      }
    } catch {
      // Redirect happened (success case with auto-confirm)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendEmail() {
    if (!userEmail) return

    setIsLoading(true)
    const formData = new FormData()
    formData.set('email', userEmail)

    try {
      const result = await resendVerificationEmail(formData)

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success) {
        toast.success(result.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle className="text-primary">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              We&apos;ve sent a verification link to <strong>{userEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>
              Click the link in your email to verify your account and start
              exploring your Human Design chart.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Wrong email?{' '}
              <button
                onClick={() => setShowVerificationMessage(false)}
                className="text-primary hover:underline"
              >
                Go back
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">
            Create Your Account
          </CardTitle>
          <CardDescription>
            Start your Human Design journey today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={prefillEmail}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                defaultValue={prefillPassword}
                required
                minLength={8}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
            {searchParams.get('redirect') && (
              <input
                type="hidden"
                name="redirect"
                value={searchParams.get('redirect') || ''}
              />
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Create Account</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      }>
        <SignUpForm />
      </Suspense>
    </div>
  )
}
