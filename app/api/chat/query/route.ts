import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input } = body;

    if (!input || input.trim() === "") {
      return NextResponse.json({ error: "Input is empty" }, { status: 400 });
    }

    const systemPrompt = `You are a helpful AI assistant. Answer the user's question.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message || "OpenAI API error." }, { status: 500 });
  }
}
