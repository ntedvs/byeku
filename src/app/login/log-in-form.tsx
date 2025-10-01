"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

type FieldErrors = {
  email?: string
  password?: string
}

export function LogInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [pending, setPending] = useState(false)
  const [general, setGeneral] = useState("")

  const router = useRouter()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    setEmail(cleanEmail)
    setPassword(cleanPassword)

    const run: FieldErrors = {}

    if (!cleanEmail) {
      run.email = "Please enter your email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      run.email = "Enter a valid email address"
    }

    if (!cleanPassword) {
      run.password = "Please enter a password"
    }

    setErrors(run)
    setGeneral("")

    if (Object.keys(run).length > 0) return
    setPending(true)

    await authClient.signIn.email(
      {
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
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
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
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        required
      />

      {errors.password && <span>{errors.password}</span>}
      {general && <span>{general}</span>}

      <button type="submit" disabled={pending}>
        {pending ? "Logging..." : "Log In"}
      </button>
    </form>
  )
}
