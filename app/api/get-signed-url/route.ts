// app/api/get-signed-url/route.ts

import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()

  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get('filePath')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !filePath) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: doc } = await supabase
    .from('documents')
    .select('id')
    .eq('user_id', user.id)
    .eq('file_path', filePath)
    .single()

  if (!doc) {
    return NextResponse.json({ error: 'Not authorized or file not found' }, { status: 403 })
  }

  const { data: signed } = await supabase.storage
    .from('user_documents')
    .createSignedUrl(filePath, 60 * 60)

  if (!signed) {
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
  }

  return NextResponse.json({ url: signed.signedUrl })
}
