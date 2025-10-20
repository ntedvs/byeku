"use client"

import { client } from "@/lib/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    const clean = email.trim().toLowerCase()

    if (!clean) {
      setError("Please enter your email")
      return
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError("Please enter a valid email")
      return
    }

    await client.signIn.magicLink({ email: clean })
    router.push("/")
  }

  return (
    <form onSubmit={submit}>
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

      {error && <p>{error}</p>}

      <button>Submit</button>
    </form>
  )
}
