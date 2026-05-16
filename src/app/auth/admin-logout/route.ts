import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  
  const url = new URL(request.url)
  return NextResponse.redirect(`${url.origin}/admin/login?expired=true`)
}
