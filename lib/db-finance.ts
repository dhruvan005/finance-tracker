// This file is for the utility functions for the db interaction 
// All the db tasks shoud be done from here 

import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { expenses, category, incomes, budget, savingsGoal } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";

export const getAllExpenses = async (userId: string): Promise<InferSelectModel<typeof expenses>[]> => {
    try {
        const expenseRecords = await db
            .select()
            .from(expenses)
            .where(eq(expenses.userId, userId));
        return expenseRecords;

    } catch (error) {
        console.error("Failed to fetch expenses:", error);
        throw new Error("Failed to fetch expenses");
    }
}

export const createExpense = async (
    userId: string,
    amount: number,
    categoryId: string,
    description?: string,
    date?: Date
) => {
    try {
        const newExpense = await db
            .insert(expenses)
            .values({
                id: uuidv4(),
                amount: amount.toString(),
                categoryId,
                description,
                date: date || new Date(),
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return newExpense[0];
    } catch (error) {
        console.error("Failed to create expense:", error);
        throw new Error("Failed to create expense");
    }
}

export const getExpensesGroupedByCategory = async (userId: string, startDate?: Date, endDate?: Date) => {
    try {
        const conditions = [eq(expenses.userId, userId)];
        if (startDate) {
            conditions.push(sql`${expenses.date} >= ${startDate}`);
        }
        if (endDate) {
            conditions.push(sql`${expenses.date} <= ${endDate}`);
        }

        const result = await db
            .select({
                categoryId: category.id,
                categoryName: category.name,
                totalAmount: sql<string>`SUM(${expenses.amount})`,
                count: sql<number>`COUNT(*)`
            })
            .from(expenses)
            .innerJoin(category, eq(expenses.categoryId, category.id))
            .where(and(...conditions))
            .groupBy(category.id, category.name);

        return result;
    } catch (error) {
        console.error("Failed to fetch expenses grouped by category:", error);
        throw new Error("Failed to fetch expenses grouped by category");
    }
}

export const getExpenseById = async (id: string, userId: string): Promise<InferSelectModel<typeof expenses> | undefined> => {
    try {
        const expenseRecord = await db
            .select()
            .from(expenses)
            .where(and(
                eq(expenses.id, id),
                eq(expenses.userId, userId)
            ));
        return expenseRecord[0];

    } catch (error) {
        console.error("Failed to fetch expense:", error);
        throw new Error("Failed to fetch expense");
    }
}

export const updateExpense = async (
    id: string,
    userId: string,
    data: { amount?: number; categoryId?: string; description?: string; date?: Date }
) => {
    try {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        
        if (data.amount !== undefined) {
            updateData.amount = data.amount.toString();
        }
        if (data.categoryId !== undefined) {
            updateData.categoryId = data.categoryId;
        }
        if (data.description !== undefined) {
            updateData.description = data.description;
        }
        if (data.date !== undefined) {
            updateData.date = data.date;
        }

        const updatedExpense = await db
            .update(expenses)
            .set(updateData)
            .where(and(
                eq(expenses.id, id),
                eq(expenses.userId, userId)
            ))
            .returning();

        return updatedExpense[0];
    } catch (error) {
        console.error("Failed to update expense:", error);
        throw new Error("Failed to update expense");
    }
}

export const deleteExpense = async (id: string, userId: string) => {
    try {
        const deletedExpense = await db
            .delete(expenses)
            .where(and(
                eq(expenses.id, id),
                eq(expenses.userId, userId)
            ))
            .returning();

        return deletedExpense[0];
    } catch (error) {
        console.error("Failed to delete expense:", error);
        throw new Error("Failed to delete expense");
    }
}

export const getCategoriesWithExpenseCounts = async (userId: string) => {
    try {
        const result = await db
            .select({
                id: category.id,
                name: category.name,
                type: category.type,
                expenseCount: sql<number>`COUNT(${expenses.id})`
            })
            .from(category)
            .leftJoin(expenses, eq(category.id, expenses.categoryId))
            .where(eq(category.userId, userId))
            .groupBy(category.id, category.name, category.type)
            .orderBy(desc(sql<number>`COUNT(${expenses.id})`));

        return result;
    } catch (error) {
        console.error("Failed to fetch categories with expense counts:", error);
        throw new Error("Failed to fetch categories with expense counts");
    }
}

export const getAllCategories = async (userId: string, type?: string) => {
    try {
        const conditions = [eq(category.userId, userId)];
        if (type) {
            conditions.push(eq(category.type, type));
        }

        return await db
            .select()
            .from(category)
            .where(and(...conditions));
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw new Error("Failed to fetch categories");
    }
}

export const createCategory = async (
    userId: string,
    name: string,
    type: 'expense' | 'income'
) => {
    try {
        const newCategory = await db
            .insert(category)
            .values({
                id: uuidv4(),
                name,
                type,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return newCategory[0];
    } catch (error) {
        console.error("Failed to create category:", error);
        throw new Error("Failed to create category");
    }
}

export const updateCategory = async (
    id: string,
    userId: string,
    data: { name?: string; type?: 'expense' | 'income' }
) => {
    try {
        const updatedCategory = await db
            .update(category)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(and(
                eq(category.id, id),
                eq(category.userId, userId)
            ))
            .returning();

        return updatedCategory[0];
    } catch (error) {
        console.error("Failed to update category:", error);
        throw new Error("Failed to update category");
    }
}

export const createIncome = async (
    userId: string,
    source: string,
    amount: number,
    date?: Date,
) => {
    try {
        const newIncome = await db
            .insert(incomes)
            .values({
                id: uuidv4(),
                source,
                amount: amount.toString(),
                date: date || new Date(),
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return newIncome[0];
    } catch (error) {
        console.error("Failed to create income:", error);
        throw new Error("Failed to create income");
    }
}

export const getAllIncomes = async (userId: string): Promise<InferSelectModel<typeof incomes>[]> => {
    try {
        const incomeRecords = await db
            .select()
            .from(incomes)
            .where(eq(incomes.userId, userId))
            .orderBy(desc(incomes.date));
        return incomeRecords;

    } catch (error) {
        console.error("Failed to fetch incomes:", error);
        throw new Error("Failed to fetch incomes");
    }
}

export const getIncomeById = async (id: string, userId: string): Promise<InferSelectModel<typeof incomes> | undefined> => {
    try {
        const incomeRecord = await db
            .select()
            .from(incomes)
            .where(and(
                eq(incomes.id, id),
                eq(incomes.userId, userId)
            ));
        return incomeRecord[0];

    } catch (error) {
        console.error("Failed to fetch income:", error);
        throw new Error("Failed to fetch income");
    }
}

export const updateIncome = async (
    id: string,
    userId: string,
    data: { source?: string; amount?: number; date?: Date }
) => {
    try {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        
        if (data.source !== undefined) {
            updateData.source = data.source;
        }
        if (data.amount !== undefined) {
            updateData.amount = data.amount.toString();
        }
        if (data.date !== undefined) {
            updateData.date = data.date;
        }

        const updatedIncome = await db
            .update(incomes)
            .set(updateData)
            .where(and(
                eq(incomes.id, id),
                eq(incomes.userId, userId)
            ))
            .returning();

        return updatedIncome[0];
    } catch (error) {
        console.error("Failed to update income:", error);
        throw new Error("Failed to update income");
    }
}

export const deleteIncome = async (id: string, userId: string) => {
    try {
        const deletedIncome = await db
            .delete(incomes)
            .where(and(
                eq(incomes.id, id),
                eq(incomes.userId, userId)
            ))
            .returning();

        return deletedIncome[0];
    } catch (error) {
        console.error("Failed to delete income:", error);
        throw new Error("Failed to delete income");
    }
}

// Savings Goals Functions
export const createSavingsGoal = async (
    userId: string,
    name: string,
    targetAmount: number,
    targetDate: Date,
    currentAmount: number = 0
) => {
    try {
        const newSavingsGoal = await db
            .insert(savingsGoal)
            .values({
                id: uuidv4(),
                name,
                targetAmount: targetAmount.toString(),
                currentAmount: currentAmount.toString(),
                targetDate,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return newSavingsGoal[0];
    } catch (error) {
        console.error("Failed to create savings goal:", error);
        throw new Error("Failed to create savings goal");
    }
}

export const getAllSavingsGoals = async (userId: string): Promise<InferSelectModel<typeof savingsGoal>[]> => {
    try {
        const savingsGoals = await db
            .select()
            .from(savingsGoal)
            .where(eq(savingsGoal.userId, userId))
            .orderBy(savingsGoal.targetDate);
        return savingsGoals;

    } catch (error) {
        console.error("Failed to fetch savings goals:", error);
        throw new Error("Failed to fetch savings goals");
    }
}

export const getSavingsGoalById = async (id: string, userId: string): Promise<InferSelectModel<typeof savingsGoal> | undefined> => {
    try {
        const savingsGoalRecord = await db
            .select()
            .from(savingsGoal)
            .where(and(
                eq(savingsGoal.id, id),
                eq(savingsGoal.userId, userId)
            ));
        return savingsGoalRecord[0];

    } catch (error) {
        console.error("Failed to fetch savings goal:", error);
        throw new Error("Failed to fetch savings goal");
    }
}

export const updateSavingsGoal = async (
    id: string,
    userId: string,
    data: { name?: string; targetAmount?: number; currentAmount?: number; targetDate?: Date }
) => {
    try {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        
        if (data.name !== undefined) {
            updateData.name = data.name;
        }
        if (data.targetAmount !== undefined) {
            updateData.targetAmount = data.targetAmount.toString();
        }
        if (data.currentAmount !== undefined) {
            updateData.currentAmount = data.currentAmount.toString();
        }
        if (data.targetDate !== undefined) {
            updateData.targetDate = data.targetDate;
        }

        const updatedSavingsGoal = await db
            .update(savingsGoal)
            .set(updateData)
            .where(and(
                eq(savingsGoal.id, id),
                eq(savingsGoal.userId, userId)
            ))
            .returning();

        return updatedSavingsGoal[0];
    } catch (error) {
        console.error("Failed to update savings goal:", error);
        throw new Error("Failed to update savings goal");
    }
}

export const deleteSavingsGoal = async (id: string, userId: string) => {
    try {
        const deletedSavingsGoal = await db
            .delete(savingsGoal)
            .where(and(
                eq(savingsGoal.id, id),
                eq(savingsGoal.userId, userId)
            ))
            .returning();

        return deletedSavingsGoal[0];
    } catch (error) {
        console.error("Failed to delete savings goal:", error);
        throw new Error("Failed to delete savings goal");
    }
}

// Budget Functions
export const createBudget = async (
    userId: string,
    categoryId: string,
    amount: number,
    period: 'monthly' | 'yearly',
    startDate: Date,
    endDate: Date
) => {
    try {
        const newBudget = await db
            .insert(budget)
            .values({
                id: uuidv4(),
                categoryId,
                amount: amount.toString(),
                period,
                startDate,
                endDate,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return newBudget[0];
    } catch (error) {
        console.error("Failed to create budget:", error);
        throw new Error("Failed to create budget");
    }
}

export const getAllBudgets = async (userId: string): Promise<InferSelectModel<typeof budget>[]> => {
    try {
        const budgets = await db
            .select()
            .from(budget)
            .where(eq(budget.userId, userId));
        return budgets;

    } catch (error) {
        console.error("Failed to fetch budgets:", error);
        throw new Error("Failed to fetch budgets");
    }
}

export const getBudgetById = async (id: string, userId: string): Promise<InferSelectModel<typeof budget> | undefined> => {
    try {
        const budgetRecord = await db
            .select()
            .from(budget)
            .where(and(
                eq(budget.id, id),
                eq(budget.userId, userId)
            ));
        return budgetRecord[0];

    } catch (error) {
        console.error("Failed to fetch budget:", error);
        throw new Error("Failed to fetch budget");
    }
}

export const getBudgetWithCategoryDetails = async (userId: string) => {
    try {
        const result = await db
            .select({
                id: budget.id,
                categoryId: budget.categoryId,
                categoryName: category.name,
                amount: budget.amount,
                period: budget.period,
                startDate: budget.startDate,
                endDate: budget.endDate
            })
            .from(budget)
            .innerJoin(category, eq(budget.categoryId, category.id))
            .where(eq(budget.userId, userId));

        return result;
    } catch (error) {
        console.error("Failed to fetch budgets with category details:", error);
        throw new Error("Failed to fetch budgets with category details");
    }
}

export const updateBudget = async (
    id: string,
    userId: string,
    data: { categoryId?: string; amount?: number; period?: 'monthly' | 'yearly'; startDate?: Date; endDate?: Date }
) => {
    try {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        
        if (data.categoryId !== undefined) {
            updateData.categoryId = data.categoryId;
        }
        if (data.amount !== undefined) {
            updateData.amount = data.amount.toString();
        }
        if (data.period !== undefined) {
            updateData.period = data.period;
        }
        if (data.startDate !== undefined) {
            updateData.startDate = data.startDate;
        }
        if (data.endDate !== undefined) {
            updateData.endDate = data.endDate;
        }

        const updatedBudget = await db
            .update(budget)
            .set(updateData)
            .where(and(
                eq(budget.id, id),
                eq(budget.userId, userId)
            ))
            .returning();

        return updatedBudget[0];
    } catch (error) {
        console.error("Failed to update budget:", error);
        throw new Error("Failed to update budget");
    }
}

export const deleteBudget = async (id: string, userId: string) => {
    try {
        const deletedBudget = await db
            .delete(budget)
            .where(and(
                eq(budget.id, id),
                eq(budget.userId, userId)
            ))
            .returning();

        return deletedBudget[0];
    } catch (error) {
        console.error("Failed to delete budget:", error);
        throw new Error("Failed to delete budget");
    }
}