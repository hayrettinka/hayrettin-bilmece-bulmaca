import createMiddleware from 'next-intl/middleware';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'tr'],

  // Used when no locale matches
  defaultLocale: 'tr',

  // Detect locale based on user's browser language
  localeDetection: true
});

export async function middleware(req: NextRequest) {
  // Handle auth for admin routes
  if (req.nextUrl.pathname.includes('/admin')) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If no session and trying to access admin, redirect to login
    if (!session) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'tr';
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, req.url)
      );
    }

    return res;
  }

  // Handle internationalization for other routes
  return intlMiddleware(req);
}

export const config = {
  // Match internationalized pathnames and admin routes
  matcher: ['/', '/(tr|en)/:path*', '/admin/:path*']
};
