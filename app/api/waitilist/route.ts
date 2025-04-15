import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const body = await request.json()
    const { email, fullName, phoneNumber, occupation, organization } = body
    
    // Validate required fields
    if (!email || !fullName || !phoneNumber || !occupation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Insert into waitlist table
    const { data, error } = await supabase.from("waitlist").insert([
      {
        email,
        full_name: fullName,
        phone_number: phoneNumber,
        occupation,
        organization: organization || null,
        created_at: new Date().toISOString(),
      },
    ]).select()
    
    if (error) {
      console.error("Error inserting waitlist entry:", error)
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error processing waitlist request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
