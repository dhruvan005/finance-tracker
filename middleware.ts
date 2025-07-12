import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const directCookie = request.cookies.get("better-auth.session_token");
    const sessionCookie = getSessionCookie(request, {
        cookieName: "session_token",
        cookiePrefix: "better-auth",
    });

    const isAuthenticated = !!(sessionCookie || directCookie?.value);

    const authPaths = ["/signin", "/signup"];
    const exactPublicPaths = [...authPaths, "/"];
    const prefixPublicPaths = ["/api/auth"];


    if (isAuthenticated && authPaths.includes(path)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }


    const isPublicPath =
        exactPublicPaths.includes(path) ||
        prefixPublicPaths.some((p) => path.startsWith(p));

    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|signin|signup|_next/static|_next/image|favicon.ico|assets/).*)",
        "/(api|trpc)(.*)",

    ],
};
