"use client"

import { FormEvent, useState } from "react"

type HaikuResponse = {
  haiku: string[]
  tone: string
}

type ApiError = {
  error: string
}

export function HaikuGenerator() {
  const [body, setBody] = useState("")
  const [tone, setTone] = useState("serene")
  const [result, setResult] = useState<HaikuResponse | null>(null)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!body.trim()) {
      setError("Please provide email content")
      return
    }

    setPending(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/haiku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, tone }),
      })

      if (!response.ok) {
        const payload: ApiError = await response
          .json()
          .catch(() => ({ error: "Unknown error" }))
        setError(payload.error || "Unable to generate haiku")
        return
      }

      const data: HaikuResponse = await response.json()
      setResult(data)
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unexpected error")
    } finally {
      setPending(false)
    }
  }

  const clear = () => {
    setBody("")
    setResult(null)
    setError("")
  }

  return (
    <section>
      <form onSubmit={submit}>
        <label htmlFor="email-body">Email body</label>
        <textarea
          id="email-body"
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={8}
          required
        />

        <fieldset>
          <legend>Select tone</legend>
          {[
            { value: "serene", label: "Serene" },
            { value: "funny", label: "Funny" },
            { value: "corporate", label: "Corporate" },
          ].map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="tone"
                value={option.value}
                checked={tone === option.value}
                onChange={() => setTone(option.value)}
              />
              {option.label}
            </label>
          ))}
        </fieldset>

        <button type="submit" disabled={pending}>
          {pending ? "Generating..." : "Generate haiku"}
        </button>
      </form>

      {error && (
        <div>
          <p>Error: {error}</p>
          <button type="button" onClick={clear}>
            Clear
          </button>
        </div>
      )}

      {result && (
        <div>
          <p>Tone: {result.tone}</p>
          <ol>
            {result.haiku.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ol>
          <button type="button" onClick={clear}>
            Generate another
          </button>
        </div>
      )}
    </section>
  )
}
