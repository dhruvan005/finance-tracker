import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAllIncomes, createIncome, getIncomeById, updateIncome, deleteIncome } from "@/lib/db-finance";
import { z } from "zod/v4"
import { storeUserFinancialData, updateUserFinancialData, deleteUserFinancialData } from "@/lib/vectorstore";

export async function GET() {
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
        await storeUserFinancialData(currentUser.user.id, {
            income: [{
                source: newIncome.source,
                amount: parseFloat(newIncome.amount),
                date: newIncome.date.toISOString()
            }]
        });

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

        // Get the old income data before updating
        const oldIncome = await getIncomeById(id, currentUser.user.id);

        if (!oldIncome) {
            return NextResponse.json(
                { error: "Income not found" },
                { status: 404 }
            );
        }

        const updatedIncome = await updateIncome(
            id,
            currentUser.user.id,
            validatedData
        );

        if (updatedIncome) {
            // Update the vector store with new data
            await updateUserFinancialData(
                currentUser.user.id,
                'income',
                {
                    source: oldIncome.source,
                    amount: parseFloat(oldIncome.amount)
                },
                {
                    source: updatedIncome.source,
                    amount: parseFloat(updatedIncome.amount),
                    date: updatedIncome.date.toISOString()
                }
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

        // Get the income data before deleting
        const incomeToDelete = await getIncomeById(id, currentUser.user.id);

        if (!incomeToDelete) {
            return NextResponse.json(
                { error: "Income not found" },
                { status: 404 }
            );
        }

        // Delete from database
        const deletedIncome = await deleteIncome(id, currentUser.user.id);

        if (deletedIncome) {
            // Delete from vector store
            await deleteUserFinancialData(
                currentUser.user.id,
                'income',
                {
                    source: incomeToDelete.source,
                    amount: parseFloat(incomeToDelete.amount)
                }
            );
        }

        return NextResponse.json({
            message: "Income deleted successfully",
            income: deletedIncome
        });

    } catch (error) {
        console.error("Failed to delete income:", error);
        return NextResponse.json(
            { error: "Failed to delete income" },
            { status: 500 }
        );
    }
}