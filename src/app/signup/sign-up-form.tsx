"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
}

export function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [pending, setPending] = useState(false)
  const [general, setGeneral] = useState("")

  const router = useRouter()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    setName(cleanName)
    setEmail(cleanEmail)
    setPassword(cleanPassword)

    const run: FieldErrors = {}

    if (!cleanName) {
      run.name = "Please enter your full name"
    }

    if (!cleanEmail) {
      run.email = "Please enter your email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      run.email = "Enter a valid email address"
    }

    if (!cleanPassword) {
      run.password = "Please enter a password"
    } else if (cleanPassword.length < 8) {
      run.password = "Password must be at least 8 characters"
    }

    setErrors(run)
    setGeneral("")

    if (Object.keys(run).length > 0) return
    setPending(true)

    await authClient.signUp.email(
      {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
      },
      {
        onSuccess: () => router.push("/"),
        onError: (ctx) => setGeneral(ctx.error.message),
      },
    )

    setPending(false)
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="name">Full Name</label>
      <input
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
      />

      {errors.name && <span>{errors.name}</span>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      {errors.email && <span>{errors.email}</span>}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        minLength={8}
        required
      />

      {errors.password && <span>{errors.password}</span>}
      {general && <span>{general}</span>}

      <button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Account"}
      </button>
    </form>
  )
}
