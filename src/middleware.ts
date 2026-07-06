import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lets the exact same build serve two roles depending on which domain it's
// deployed behind: set APP_MODE=admin on the admin.noamani.com deployment and
// APP_MODE=customer on the noamani.com deployment (or leave unset to serve
// everything, e.g. in local dev). API routes are never touched here — each
// deployment needs its own full API surface since its frontend calls relative
// /api/* paths, and those routes already enforce their own admin-auth checks.
const APP_MODE = process.env.APP_MODE;

export function middleware(request: NextRequest) {
  if (!APP_MODE) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');

  if (APP_MODE === 'admin' && !isAdminPage) {
    return NextResponse.redirect(new URL(`https://noamani.com${pathname}${search}`));
  }

  if (APP_MODE === 'customer' && isAdminPage) {
    return NextResponse.redirect(new URL(`https://admin.noamani.com${pathname}${search}`));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
