import "@/styles/base.css"
import { Metadata } from "next"
import { Host_Grotesk } from "next/font/google"
import { ReactNode } from "react"
import Header from "./header"

const host = Host_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "Byeku", template: "%s • Byeku" },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`mx-auto flex min-h-screen max-w-6xl flex-col p-4 ${host.className}`}
      >
        <Header />
        <main className="grow">{children}</main>
        <footer></footer>
      </body>
    </html>
  )
}
