"use client"

import { client } from "@/lib/client"
import Link from "next/link"

export default function Header() {
  const { data: session, isPending: pending } = client.useSession()

  return (
    <header className="flex justify-between">
      <Link href="/">Byeku</Link>

      <div className="flex gap-4">
        {!pending &&
          (session ? (
            <>
              <Link href="/account">Account</Link>
              <button onClick={() => client.signOut()}>Sign Out</button>
            </>
          ) : (
            <Link href="/auth">Sign In</Link>
          ))}
      </div>
    </header>
  )
}
