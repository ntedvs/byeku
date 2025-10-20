"use client"

import { FormEvent, useState } from "react"

export default function Generator() {
  const [body, setBody] = useState("")
  const [tone, setTone] = useState("serene")
  const [lines, setLines] = useState<string[]>([])

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    const { lines, error } = await fetch("/api/haiku", {
      method: "POST",
      body: JSON.stringify({ body, tone }),
    }).then((res) => res.json())

    if (!error) setLines(lines)
  }

  return (
    <>
      <form onSubmit={submit}>
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        <label htmlFor="tone">Tone</label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="serene">Serene</option>
          <option value="funny">Funny</option>
          <option value="corporate">Corporate</option>
        </select>

        <button>Submit</button>
      </form>

      {lines.length > 0 && lines.map((line) => <p key={line}>{line}</p>)}
    </>
  )
}
