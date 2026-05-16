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

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function checkAdminAuth() {
  const supabase = await createClient();
  
  // 1. Check for admin session cookie (Password flow)
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  if (adminSession) {
    try {
      const data = JSON.parse(adminSession.value);
      if (data.expiresAt > Date.now()) return true;
    } catch (e) {}
  }

  // 2. Check for whitelisted email (Google flow)
  const { data: { user } } = await supabase.auth.getUser();
  if (user && user.email === process.env.ADMIN_WHITELISTED_EMAIL) return true;

  // 3. Check for super_admin role in profiles
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role === "super_admin") return true;
  }
  
  return false;
}

