import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
    getAllBudgets,
    getBudgetWithCategoryDetails,
    createBudget,
    getBudgetById,
    updateBudget,
    deleteBudget
} from "@/lib/db-finance";
import { z } from "zod/v4"

// Getting all budgets
export async function GET(req: Request) {
    try {
        const currentUser = await auth.api.getSession({
            headers: await headers(),
        })
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const detailed = url.searchParams.get('detailed');

        let budgets;
        if (detailed === 'true') {
            budgets = await getBudgetWithCategoryDetails(currentUser.user.id);
        } else {
            budgets = await getAllBudgets(currentUser.user.id);
        }
        
        return NextResponse.json(budgets);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Server Error - failed to load budgets" }, { status: 500 });
    }
}

const createBudgetSchema = z.object({
    categoryId: z.string(),
    amount: z.number().positive(),
    period: z.enum(['monthly', 'yearly']),
    startDate: z.string().transform(val => new Date(val)),
    endDate: z.string().transform(val => new Date(val))
});

// Creating a budget
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
        const validatedData = createBudgetSchema.parse(body);

        const { categoryId, amount, period, startDate, endDate } = validatedData;

        // Check that endDate is after startDate
        if (endDate <= startDate) {
            return NextResponse.json(
                { error: "End date must be after start date" },
                { status: 400 }
            );
        }

        const newBudget = await createBudget(
            currentUser.user.id,
            categoryId,
            amount,
            period,
            startDate,
            endDate
        );

        return NextResponse.json(newBudget, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.message },
                { status: 400 }
            );
        }

        console.error("Error creating budget:", error);
        return NextResponse.json(
            { error: "Failed to create budget" },
            { status: 500 }
        );
    }
}

const updateBudgetSchema = z.object({
    categoryId: z.string().optional(),
    amount: z.number().positive().optional(),
    period: z.enum(['monthly', 'yearly']).optional(),
    startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    endDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
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
                { error: "Budget ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const validatedData = updateBudgetSchema.parse(body);

        // If both dates are provided, verify end date is after start date
        if (validatedData.startDate && validatedData.endDate && 
            validatedData.endDate <= validatedData.startDate) {
            return NextResponse.json(
                { error: "End date must be after start date" },
                { status: 400 }
            );
        }

        // If only one date is provided, we should check against the existing record
        if ((validatedData.startDate || validatedData.endDate) && 
            !(validatedData.startDate && validatedData.endDate)) {
            
            const existingBudget = await getBudgetById(id, currentUser.user.id);
            if (!existingBudget) {
                return NextResponse.json(
                    { error: "Budget not found" },
                    { status: 404 }
                );
            }

            // Check that new dates don't conflict with existing ones
            const newStartDate = validatedData.startDate || existingBudget.startDate;
            const newEndDate = validatedData.endDate || existingBudget.endDate;
            
            if (newEndDate <= newStartDate) {
                return NextResponse.json(
                    { error: "End date must be after start date" },
                    { status: 400 }
                );
            }
        }

        const updatedBudget = await updateBudget(
            id,
            currentUser.user.id,
            validatedData
        );

        if (!updatedBudget) {
            return NextResponse.json(
                { error: "Budget not found or you don't have permission to update it" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedBudget);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.message },
                { status: 400 }
            );
        }

        console.error("Error updating budget:", error);
        return NextResponse.json(
            { error: "Failed to update budget" },
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
                { error: "Budget ID is required" },
                { status: 400 }
            );
        }

        const deletedBudget = await deleteBudget(id, currentUser.user.id);

        if (!deletedBudget) {
            return NextResponse.json(
                { error: "Budget not found or you don't have permission to delete it" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Budget deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting budget:", error);
        return NextResponse.json(
            { error: "Failed to delete budget" },
            { status: 500 }
        );
    }
}
