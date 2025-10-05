import { Metadata } from "next"
import { HaikuGenerator } from "./haiku-generator"

export const metadata: Metadata = { title: "Haiku Generator" }

export default function Home() {
  return (
    <>
      <h1>Haiku Email Signature Generator</h1>

      <p>
        Paste an email, pick a tone, and preview the haiku that could sign it.
      </p>

      <HaikuGenerator />
    </>
  )
}
