import "@/styles/base.css"
import { Metadata } from "next"
import { Host_Grotesk } from "next/font/google"
import { ReactNode } from "react"

const host = Host_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "Byeku", template: "%s • Byeku" },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`flex min-h-screen flex-col ${host.className}`}>
        <header></header>
        <main className="grow">{children}</main>
        <footer></footer>
      </body>
    </html>
  )
}
