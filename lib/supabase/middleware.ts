import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function supabaseMiddleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  if (pathname.startsWith('/admin')) {
    const whitelistedEmail = process.env.ADMIN_WHITELISTED_EMAIL
    const isAuthorized = user && user.email === whitelistedEmail
    
    let isVerified = false;
    let sessionExpired = false;
    let sessionData: any = null;

    const sessionCookie = request.cookies.get('admin_session')?.value;
    if (sessionCookie) {
      try {
        sessionData = JSON.parse(sessionCookie);
        const now = Date.now();
        
        // Check absolute expiry (5 hours)
        if (now > sessionData.expiresAt) {
          sessionExpired = true;
        } 
        // Check inactivity (30 mins)
        else if (now - sessionData.lastActive > 30 * 60 * 1000) {
          sessionExpired = true;
        } 
        else {
          isVerified = true;
        }
      } catch (e) {
        // Invalid cookie JSON
      }
    }

    if (sessionExpired) {
      url.pathname = '/auth/admin-logout'
      return NextResponse.redirect(url)
    }

    if (pathname === '/admin/login') {
      if (isAuthorized) {
        if (isVerified) {
          url.pathname = '/admin'
          return NextResponse.redirect(url)
        } else {
          url.pathname = '/admin/verify'
          return NextResponse.redirect(url)
        }
      }
    } else if (pathname === '/admin/verify') {
      if (!isAuthorized) {
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      } else if (isVerified) {
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    } else {
      if (!isAuthorized) {
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      } else if (!isVerified) {
        url.pathname = '/admin/verify'
        return NextResponse.redirect(url)
      }
    }

    // If authorized and verified, we update the lastActive timestamp
    if (isAuthorized && isVerified && sessionData) {
      sessionData.lastActive = Date.now();
      supabaseResponse.cookies.set('admin_session', JSON.stringify(sessionData), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 5 * 60 * 60 // 5 hours
      });
    }
  }

  if (pathname.startsWith('/seller')) {
    if (pathname === '/seller/login') {
      if (user) {
        const { data: store } = await supabase.from('stores').select('id').eq('seller_id', user.id).single()
        url.pathname = store ? '/seller/dashboard' : '/seller/onboarding'
        return NextResponse.redirect(url)
      }
    } else if (pathname === '/seller/onboarding') {
      if (!user) {
        url.pathname = '/seller/login'
        return NextResponse.redirect(url)
      }
    } else {
      if (!user) {
        url.pathname = '/seller/login'
        return NextResponse.redirect(url)
      }
      const { data: store } = await supabase.from('stores').select('id').eq('seller_id', user.id).single()
      if (!store) {
        url.pathname = '/seller/onboarding'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
