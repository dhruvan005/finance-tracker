import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";


export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;


    // console.log("Request path:", path);
    // console.log("All cookies:", Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])));


    const sessionCookie = getSessionCookie(request, {
        cookieName: "session_token",
        cookiePrefix: "better-auth",
    });

    // console.log("Session Cookie:", sessionCookie);
    const directCookie = request.cookies.get("better-auth.session_token");
    // console.log("Direct Cookie:", directCookie);

    const isAuthenticated = !!sessionCookie || !!directCookie;

    const authPaths = ["/signin", "/signup"];
    const exactPublicPaths = [...authPaths, "/"];

    const prefixPublicPaths = ["/api/auth"];


    if (isAuthenticated && authPaths.includes(path)) {
        // console.log("Redirecting authenticated user from auth page to home");
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Only check authentication for non-public paths
    const isPublicPath =
        exactPublicPaths.includes(path) ||
        prefixPublicPaths.some((p) => path.startsWith(p));

    // console.log("Is public path:", isPublicPath);

    if (!isAuthenticated && !isPublicPath) {
        // console.log("Redirecting unauthenticated user to signin");
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|signin|signup|_next/static|_next/image|favicon.ico).*)",
        "/(api|trpc)(.*)",
    ],
};