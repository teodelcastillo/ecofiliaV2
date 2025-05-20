// app/api/send-contact-email/route.ts

import { NextResponse, NextRequest } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })
  }

  try {
    const { error } = await resend.emails.send({
      from: "Ecofilia Contact Form <ecofilia@noreply.ecofilia.host>", // asegúrate que este dominio esté verificado en Resend
      to: "info@ecofilia.site",
      subject: "New message from Ecofilia Contact Form",
      replyTo: email, // Esto es útil para poder responder directamente al remitente
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error("Unexpected server error:", err)
    return NextResponse.json({ success: false, error: "Unexpected server error" }, { status: 500 })
  }
}
