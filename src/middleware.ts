import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const adminBypass = request.cookies.get('admin_bypass')
    const isAdmin = adminBypass?.value === 'true'

    const url = request.nextUrl.clone()

    // Date Logic: Locked until March 30th
    // Javascript Month is 0-indexed (0=Jan, 1=Feb, 2=March)
    // We want to lock if Date < March 30

    const now = new Date()
    // Convert to IST roughly (UTC+5:30) for consistency
    const istOffset = 5.5 * 60 * 60 * 1000
    const istTime = new Date(now.getTime() + istOffset)

    const currentMonth = istTime.getUTCMonth()
    const currentDay = istTime.getUTCDate()

    // Debug Log (Server side)
    // console.log(`Middleware Check: Month=${currentMonth}, Day=${currentDay}, Admin=${isAdmin}`)

    // Lock Condition: 
    // If Month is Jan(0) or Feb(1) => Locked
    // If Month is March(2) AND Day < 30 => Locked
    // Else => Unlocked
    const isLocked = (currentMonth < 2) || (currentMonth === 2 && currentDay < 30)

    // 1. Admin Logic: Always Allow
    if (url.pathname.startsWith('/admin') || isAdmin) {
        return NextResponse.next()
    }

    const isLockedPath = url.pathname === '/locked'

    // 2. Locked State (Before March 30)
    if (isLocked) {
        // If user is NOT on /locked, force them there
        if (!isLockedPath) {
            return NextResponse.redirect(new URL('/locked', request.url))
        }
        // If they are on /locked, let them stay
        return NextResponse.next()
    }

    // 3. Unlocked State (After March 30)
    // If user tries to go to /locked, or is at root /, send them to /gift
    if (isLockedPath || url.pathname === '/') {
        return NextResponse.redirect(new URL('/gift', request.url))
    }

    // Allow all other routes (e.g. /gift, /home, /memories)
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
