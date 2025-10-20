import { db } from "@/lib/drizzle"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { magicLink } from "better-auth/plugins"
import nodemailer from "nodemailer"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER)

        await transporter.sendMail({
          from: "Oderum <auth@oderum.com>",
          to: email,
          subject: "Sign in to Oderum",
          html: `<p>Click <a href=${url}>here</a> to sign in.</p>`,
        })
      },
    }),
  ],
})
