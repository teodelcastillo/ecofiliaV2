import OpenAI from 'openai'
import { SupabaseClient } from '@supabase/supabase-js'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

import { generateSummary } from "./generateChatSummary"
import { getLastMessages } from "./getLastMessages"

interface BuildContextOptions {
  chatId: string
  supabase: SupabaseClient
  systemPrompt: string
  documentContext?: string
}

export async function buildMessageContext({
  chatId,
  supabase,
  systemPrompt,
  documentContext,
}: BuildContextOptions) {
  const [lastMessages, summary] = await Promise.all([
    getLastMessages(chatId, supabase),
    generateSummary(chatId, supabase),
  ])

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(summary ? [{ role: 'system', content: `Resumen de la conversación:\n${summary}` }] : []),
    ...(documentContext ? [{ role: 'system', content: `Fragmentos relevantes:\n${documentContext}` }] : []),
    ...lastMessages,
  ]

  return messages
}
