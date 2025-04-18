// /api/get-processing-status/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PRIVATE_SERVICE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('documents')
    .select('id, name, chunking_status, chunking_offset, chunking_done')
    .neq('chunking_status', 'done')
    .order('created_at', { ascending: true })

  return NextResponse.json({ documents: data ?? [], error })
}
