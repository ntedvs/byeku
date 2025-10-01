import { openai } from "@/lib/openai"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
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
    `Tone: ${tone}`,
    `Context: ${context}`,
  ].join("\n")

  const { output_text: haiku } = await openai.responses.create({
    model: "gpt-5",
    input: haikuPrompt,
  })

  // Step 2: derive contextual summary clues for prompting
  // Step 3: generate candidate haiku lines from the model
  // Step 4: verify syllable structure and repair if needed
  // Step 5: return the final haiku with companion metadata

  return NextResponse.json({
    status: "not-implemented",
    payload: { body, tone },
    context,
    haiku,
  })
}
