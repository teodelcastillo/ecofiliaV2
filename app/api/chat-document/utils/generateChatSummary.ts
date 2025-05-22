import OpenAI from 'openai'
import { SupabaseClient } from '@supabase/supabase-js'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function generateSummary(chatId: string, supabase: SupabaseClient): Promise<string> {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('role, content')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
    .limit(20)

  if (error || !messages || messages.length === 0) return ''

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [
      { role: 'system', content: 'Resumí esta conversación en menos de 5 líneas.' },
      ...messages.map(({ role, content }) => ({ role, content })),
    ],
    max_tokens: 300,
  })

  const summary = completion.choices[0].message.content?.trim() || ''
  return summary
}
