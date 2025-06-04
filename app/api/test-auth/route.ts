import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from "better-auth/cookies";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
    // Get all cookies for debugging
    const allCookies = Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]));

    // Try to get session using better-auth's getSessionCookie
    const sessionCookie = getSessionCookie(request, {
        cookieName: "session_token",
        cookiePrefix: "better-auth",
    });

    // Try to get session using the auth API
    const session = await auth.api.getSession({
        headers: await headers(),
    }).catch(e => {
        console.error("Error getting session:", e);
        return null;
    });

    return NextResponse.json({
        message: "Auth test endpoint",
        allCookies,
        sessionCookieExists: !!sessionCookie,
        sessionFromApi: session ? {
            exists: true,
            userId: session.user?.id,
            email: session.user?.email
        } : null,
    });
}
