import { createClient } from '@/lib/supabase/client'

export async function getSellerSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getSellerProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  return profile
}

export async function isOnboardingComplete(sellerId: string) {
  const supabase = createClient()
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('seller_id', sellerId)
    .single()
    
  return !!store
}

export async function getSellerStore(sellerId: string) {
  const supabase = createClient()
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('seller_id', sellerId)
    .single()
  return store
}

export async function signOutSeller() {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/seller/login'
}
