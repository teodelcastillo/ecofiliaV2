// app/api/send-contact-email/route.ts

import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  try {
    const { data, error } = await resend.emails.send({
      from: "Ecofilia Contact Form <no-reply@ecofilia.site>",
      to: "info@ecofilia.site",
      subject: "New message from Ecofilia Contact Form",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    if (error) {
      console.error("Email sending error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ success: false, error: "Unexpected server error" }, { status: 500 })
  }
}
