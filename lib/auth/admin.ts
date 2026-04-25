import { createClient as createServerClient } from '@/lib/supabase/server'

export async function getAdminSession() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session && isAdmin(session.user.email)) {
    return session
  }
  return null
}

export function isAdmin(email: string | undefined | null) {
  return email === process.env.ADMIN_WHITELISTED_EMAIL
}
