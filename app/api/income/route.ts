import { authClient, useSession } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAllIncomes, createIncome, getIncomeById, updateIncome, deleteIncome } from "@/lib/db-finance";
import { z } from "zod/v4"

export async function GET(req: Request) {
    try {
        const currentUser = await auth.api.getSession({
            headers: await headers(),
        })
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const incomes = await getAllIncomes(currentUser.user.id);
        return NextResponse.json(incomes);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Server Error - failed to load" }, { status: 500 });
    }
}

const createIncomeSchema = z.object({
    source: z.string(),
    amount: z.number().positive(),
    date: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

const updateIncomeSchema = z.object({
    source: z.string().optional(),
    amount: z.number().positive().optional(),
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
        const validatedData = createIncomeSchema.parse(body);

        const { source, amount, date } = validatedData;

        const newIncome = await createIncome(
            currentUser.user.id,
            source,
            amount,
            date
        );

        return NextResponse.json(newIncome, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.message },
                { status: 400 }
            );
        }

        console.error("Error creating income:", error);
        return NextResponse.json(
            { error: "Failed to create income" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    // Authenticate user
    let currentUser;
    try {
        currentUser = await auth.api.getSession({
            headers: await headers(),
        });
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
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Income ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const validatedData = updateIncomeSchema.parse(body);

        const updatedIncome = await updateIncome(
            id,
            currentUser.user.id,
            validatedData
        );

        if (!updatedIncome) {
            return NextResponse.json(
                { error: "Income not found or you don't have permission to update it" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedIncome);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.message },
                { status: 400 }
            );
        }

        console.error("Error updating income:", error);
        return NextResponse.json(
            { error: "Failed to update income" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    // Authenticate user
    let currentUser;
    try {
        currentUser = await auth.api.getSession({
            headers: await headers(),
        });
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
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Income ID is required" },
                { status: 400 }
            );
        }

        const deletedIncome = await deleteIncome(id, currentUser.user.id);

        if (!deletedIncome) {
            return NextResponse.json(
                { error: "Income not found or you don't have permission to delete it" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Income deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting income:", error);
        return NextResponse.json(
            { error: "Failed to delete income" },
            { status: 500 }
        );
    }
}