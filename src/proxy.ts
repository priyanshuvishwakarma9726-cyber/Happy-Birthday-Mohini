import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const url = request.nextUrl.clone()

    // 1. Skip middleware for static assets, internal files, and APIs
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next()
    }

    const adminBypass = request.cookies.get('admin_bypass')
    const isAdmin = adminBypass?.value === 'true'

    // 2. Normalize pathname (remove trailing slash for comparison)
    const normalizedPath = pathname.endsWith('/') && pathname !== '/'
        ? pathname.slice(0, -1)
        : pathname

    // 3. Date Logic: Locked until March 30th (IST)
    const now = new Date()
    // IST is UTC+5:30. 
    // We get the UTC time and add 5.5 hours to simulate IST as a UTC date for easy comparison.
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000))
    const currentMonth = istTime.getUTCMonth() // 0=Jan, 1=Feb, 2=Mar
    const currentDay = istTime.getUTCDate()

    const isLocked = (currentMonth < 2) || (currentMonth === 2 && currentDay < 30)

    // 4. Access Logic
    // Admin always allowed
    if (normalizedPath.startsWith('/admin') || isAdmin) {
        return NextResponse.next()
    }

    const isAtGift = normalizedPath === '/gift'
    const isAtLocked = normalizedPath === '/locked'

    // 4. Redirection Logic for Unified Flow
    // If at root or /locked, always send to /gift (our new unified entry point)
    if (normalizedPath === '/' || isAtLocked) {
        return NextResponse.redirect(new URL('/gift', request.url))
    }

    // Protect all other routes (like /home) if it's before March 30 and not an admin
    if (isLocked && !isAtGift) {
        return NextResponse.redirect(new URL('/gift', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
