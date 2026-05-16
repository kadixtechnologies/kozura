import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      // Check if store exists (which means onboarding is complete)
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('seller_id', user.id)
        .single()
        
      if (store) {
        return NextResponse.redirect(`${origin}/seller/dashboard`)
      } else {
        return NextResponse.redirect(`${origin}/seller/onboarding`)
      }
    }
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/seller/login?error=Could not authenticate`)
}
