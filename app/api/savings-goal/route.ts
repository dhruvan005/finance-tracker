import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
    getAllSavingsGoals,
    createSavingsGoal,
    getSavingsGoalById,
    updateSavingsGoal,
    deleteSavingsGoal
} from "@/lib/db-finance";
import { z } from "zod/v4"

// Getting all savings goals
export async function GET(req: Request) {
    try {
        const currentUser = await auth.api.getSession({
            headers: await headers(),
        })
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const savingsGoals = await getAllSavingsGoals(currentUser.user.id);
        return NextResponse.json(savingsGoals);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Server Error - failed to load savings goals" }, { status: 500 });
    }
}

const createSavingsGoalSchema = z.object({
    name: z.string(),
    targetAmount: z.number().positive(),
    targetDate: z.string().transform(val => new Date(val)),
    currentAmount: z.number().min(0).optional()
});

// Creating a savings goal
export async function POST(req: NextRequest) {
    // For checking if the user is authenticated or not
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
        const validatedData = createSavingsGoalSchema.parse(body);

        const { name, targetAmount, targetDate, currentAmount } = validatedData;

        const newSavingsGoal = await createSavingsGoal(
            currentUser.user.id,
            name,
            targetAmount,
            targetDate,
            currentAmount
        );

        return NextResponse.json(newSavingsGoal, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.message },
                { status: 400 }
            );
        }

        console.error("Error creating savings goal:", error);
        return NextResponse.json(
            { error: "Failed to create savings goal" },
            { status: 500 }
        );
    }
}

const updateSavingsGoalSchema = z.object({
    name: z.string().optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().min(0).optional(),
    targetDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

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
                { error: "Savings goal ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const validatedData = updateSavingsGoalSchema.parse(body);

        const updatedSavingsGoal = await updateSavingsGoal(
            id,
            currentUser.user.id,
            validatedData
        );

        if (!updatedSavingsGoal) {
            return NextResponse.json(
                { error: "Savings goal not found or you don't have permission to update it" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedSavingsGoal);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.message },
                { status: 400 }
            );
        }

        console.error("Error updating savings goal:", error);
        return NextResponse.json(
            { error: "Failed to update savings goal" },
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
                { error: "Savings goal ID is required" },
                { status: 400 }
            );
        }

        const deletedSavingsGoal = await deleteSavingsGoal(id, currentUser.user.id);

        if (!deletedSavingsGoal) {
            return NextResponse.json(
                { error: "Savings goal not found or you don't have permission to delete it" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Savings goal deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting savings goal:", error);
        return NextResponse.json(
            { error: "Failed to delete savings goal" },
            { status: 500 }
        );
    }
}
