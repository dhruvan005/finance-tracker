import { useSession } from '@/lib/auth-client'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'


export async function GET() {

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        console.log("Session", session)
        console.log("User", session?.user)

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            id: session.user.id,
            name: session.user.name || "User",
            email: session.user.email || "",
            image: session.user.image,
        })
    }
    catch (error) {
        console.error("Error in Fatching the user : ", error);
        return NextResponse.json({ error: "Failed to fatch User" }, { status: 500 })
    }
}