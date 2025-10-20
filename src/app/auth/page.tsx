import { Metadata } from "next"
import AuthForm from "./auth-form"

export const metadata: Metadata = { title: "Auth" }

export default function Auth() {
  return (
    <>
      <h1>Auth</h1>
      <AuthForm />
    </>
  )
}
