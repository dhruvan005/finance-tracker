// This file is for the utility functions for the db interaction 
// All the db tasks shoud be done from here 

import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { expenses, category } from "@/db/schema";
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

