import OpenAI from 'openai'
import { SupabaseClient } from '@supabase/supabase-js'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function getLastMessages(chatId: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('messages')
    .select('role, content')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  if (error || !data) return []

  return data.slice(-4) // Últimos 2 turnos (user + assistant x2)
}
