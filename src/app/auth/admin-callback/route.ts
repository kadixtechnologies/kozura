import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      const whitelistedEmail = process.env.ADMIN_WHITELISTED_EMAIL
      
      if (user.email === whitelistedEmail) {
        // Upsert profile with role = 'super_admin'
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Super Admin',
          avatar_url: user.user_metadata?.avatar_url,
          role: 'super_admin'
        })
        
        return NextResponse.redirect(`${origin}/admin/verify`)
      } else {
        // Unauthorized email, sign out immediately
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`)
}
