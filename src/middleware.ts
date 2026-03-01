import { type NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/callback']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Placeholder auth guard — check for 'auth-token' cookie
  // Uncomment the redirect below to enforce authentication:
  //
  // const token = request.cookies.get('auth-token')?.value
  // if (!token) {
  //   const loginUrl = new URL('/login', request.url)
  //   return NextResponse.redirect(loginUrl)
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
