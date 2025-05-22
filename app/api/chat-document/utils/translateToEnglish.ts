// utils/translateToEnglish.ts

import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

/**
 * Traduce un texto al inglés utilizando GPT-3.5. Si ya está en inglés, lo devuelve tal cual.
 */
export async function translateToEnglish(input: string): Promise<string> {
  if (!input || input.trim().length === 0) return ''

  const prompt = `
You are a translation assistant.
Your task is to translate the following text to clear and professional English, keeping the original meaning.
If the text is already in English, return it unchanged.

Text:
${input}
`.trim()

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    max_tokens: 512,
    temperature: 0,
    messages: [
      { role: 'system', content: 'You are a professional translator.' },
      { role: 'user', content: prompt },
    ],
  })

  const translated = response.choices?.[0]?.message?.content?.trim()
  return translated || input
}
