import { authClient, useSession } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAllExpenses } from "@/lib/db-finance";
import { z } from "zod/v4"

export async function GET(req: Request) {
    try {
        const currentUser = await auth.api.getSession({
            headers: await headers(),
        })
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const expenses = await getAllExpenses(currentUser.user.id);
        return NextResponse.json(expenses);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Server Error - failed to load" }, { status: 500 });
    }
}

const requestSchema = z.object({
    amount: z.number().positive(),
    categoryId: z.string(),
    description: z.string().optional(),
    date: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

export async function POST(req: NextRequest) {
    // for checking the user is Authenticated or not
    let currentUser;
    try {
        currentUser = await auth.api.getSession({
            headers: await headers(),
        })
    } catch (authError) {
        console.error("Auth error:", authError);
        return NextResponse.json(
            { error: "Authentication error" },
            { status: 401 }
        );
    }

    if (!currentUser?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedData = requestSchema.parse(body);

        const { amount, categoryId, description, date } = validatedData;

        // Import the createExpense function
        const { createExpense } = await import("@/lib/db-finance");

        const newExpense = await createExpense(
            currentUser.user.id,
            amount,
            categoryId,
            description,
            date
        );

        return NextResponse.json(newExpense, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.message },
                { status: 400 }
            );
        }

        console.error("Error creating expense:", error);
        return NextResponse.json(
            { error: "Failed to create expense" },
            { status: 500 }
        );
    }
}