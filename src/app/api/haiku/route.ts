import { auth } from "@/lib/auth"
import { openai } from "@/lib/openai"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const payload = await request.json()

  if (!payload.body || !payload.tone) {
    return NextResponse.json(
      { error: "body and tone are required" },
      { status: 400 },
    )
  }

  if (typeof payload.body !== "string" || typeof payload.tone !== "string") {
    return NextResponse.json(
      { error: "body and tone must be strings" },
      { status: 400 },
    )
  }

  const body = payload.body.trim().slice(0, 3000)
  const tone = payload.tone.trim().slice(0, 30)

  if (!["serene", "funny", "corporate"].includes(tone)) {
    return NextResponse.json({ error: "invalid tone" }, { status: 400 })
  }

  const contextPrompt = [
    "You prepare context for haiku email signatures.",
    "Reply using exactly this format:",
    "Summary: <one sentence, max 30 words>",
    "Keywords: <comma-separated list of up to 6 short phrases>",
    "Sentiment: <positive | neutral | negative>",
    "Provide only plain text; no additional formatting or commentary.",
    "Paraphrase or summarize any sensitive details instead of copying the email verbatim.",
    `Email: ${body}`,
  ].join("\n")

  const { output_text: context } = await openai.responses.create({
    model: "gpt-4o-mini",
    input: contextPrompt,
  })

  const haikuPrompt = [
    "You craft haiku signatures for emails.",
    "Write a single haiku in three lines (5 syllables, 7 syllables, 5 syllables).",
    "Do not add labels or commentary—just the haiku lines.",
    "Provide only the three haiku lines in plain text with no extra formatting or commentary.",
    `Tone: ${tone}`,
    `Context: ${context}`,
  ].join("\n")

  const { output_text: haiku } = await openai.responses.create({
    model: "gpt-5-mini",
    input: haikuPrompt,
  })

  const raw = haiku.trim().split(/\r?\n/)
  const lines = raw.map((line) => line.trim())

  if (lines.length !== 3) {
    return NextResponse.json(
      { error: "haiku must contain exactly three lines" },
      { status: 502 },
    )
  }

  if (lines.some((line) => line.length === 0)) {
    return NextResponse.json(
      { error: "haiku lines cannot be empty" },
      { status: 502 },
    )
  }

  return NextResponse.json({ haiku: lines, tone })
}
