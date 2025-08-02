import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse , NextRequest } from "next/server";
import {
    getAllExpenses,
    createExpense,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "@/lib/db-finance";
import { z } from "zod/v4"
import { storeUserFinancialData, updateUserFinancialData, deleteUserFinancialData } from "@/lib/vectorstore";

// getting the all expense
export async function GET() {
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


const createExpenseSchema = z.object({
    amount: z.number().positive(),
    categoryId: z.string(),
    description: z.string().optional(),
    date: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

// creating the expense
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
        const validatedData = createExpenseSchema.parse(body);

        const { amount, categoryId, description, date } = validatedData;

        const newExpense = await createExpense(
            currentUser.user.id,
            amount,
            categoryId,
            description,
            date
        );

        await storeUserFinancialData(currentUser.user.id, {
            expenses: [{
                category: newExpense.categoryId,
                amount: Number(newExpense.amount),
                date: newExpense.date.toISOString(),
            }]
        });

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

const updateExpenseSchema = z.object({
    amount: z.number().positive().optional(),
    categoryId: z.string().optional(),
    description: z.string().optional(),
    date: z.string().optional().transform(val => val ? new Date(val) : undefined)
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
                { error: "Expense ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const validatedData = updateExpenseSchema.parse(body);

        const oldExpense = await getExpenseById(id, currentUser.user.id);
        if (!oldExpense) {
            return NextResponse.json(
                { error: "Expense not found or you don't have permission to update it" },
                { status: 404 }
            );
        }
        const updatedExpense = await updateExpense(
            id,
            currentUser.user.id,
            validatedData
        );

        if (!updatedExpense) {
            return NextResponse.json(
                { error: "Expense not found or you don't have permission to update it" },
                { status: 404 }
            );
        }
        await updateUserFinancialData(
            currentUser.user.id,
            'expenses',
            {
                category: updatedExpense.categoryId,
                amount: Number(updatedExpense.amount),
                date: updatedExpense.date.toISOString(),
            },
            {
                category: updatedExpense.categoryId,
                amount: Number(updatedExpense.amount),
                date: updatedExpense.date.toISOString(),
            },
        );

        return NextResponse.json(updatedExpense);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.message },
                { status: 400 }
            );
        }

        console.error("Error updating expense:", error);
        return NextResponse.json(
            { error: "Failed to update expense" },
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
                { error: "Expense ID is required" },
                { status: 400 }
            );
        }

        const deletedExpense = await deleteExpense(id, currentUser.user.id);

        if (!deletedExpense) {
            return NextResponse.json(
                { error: "Expense not found or you don't have permission to delete it" },
                { status: 404 }
            );
        }
        await deleteUserFinancialData(
            currentUser.user.id,
            'expenses',
            {
                category: deletedExpense.categoryId,
                amount: Number(deletedExpense.amount),
                date: deletedExpense.date.toISOString(),
            }
        );

        return NextResponse.json(
            { message: "Expense deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting expense:", error);
        return NextResponse.json(
            { error: "Failed to delete expense" },
            { status: 500 }
        );
    }
}