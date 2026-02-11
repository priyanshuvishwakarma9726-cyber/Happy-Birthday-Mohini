import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const body = await request.json()
    const { secret } = body

    const envSecret = process.env.ADMIN_SECRET || '';
    const isValid = secret?.trim() === envSecret.trim();

    console.log("Login Attempt:", {
        inputProvided: !!secret,
        envSecretExists: !!envSecret,
        match: isValid
    });

    if (isValid) {
        const cookieStore = await cookies()

        // Key for general admin access validation
        cookieStore.set('admin_access', secret, {
            httpOnly: false, // Allow client JS to read if needed, or stick to httpOnly for security
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        // Key SPECIFICALLY for middleware bypass
        cookieStore.set('admin_bypass', 'true', {
            httpOnly: false, // Let client read to confirm state
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
        })

        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
}
