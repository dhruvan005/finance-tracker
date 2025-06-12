// In @/lib/categories.ts
import { db } from "@/db";
import { category } from "@/db/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export const defaultCategories = [
  { name: "Food", type: "expense" as const },
  { name: "Transport", type: "expense" as const },
  { name: "Entertainment", type: "expense" as const },
  { name: "Salary", type: "income" as const },
  { name: "Freelance", type: "income" as const },
] as const;

export async function createDefaultCategory(userId: string): Promise<void> {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId provided');
  }

  const timestamp = new Date();

  const categoriesToInsert = defaultCategories.map((cat) => ({
    id: nanoid(),
    name: cat.name,
    type: cat.type,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  try {
    await db.insert(category).values(categoriesToInsert);
    console.log(`Successfully created ${categoriesToInsert.length} default categories for user ${userId}`);
  } catch (error) {
    console.error('Database error creating default categories:', error);
    throw new Error(`Failed to create default categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}



export async function userHasCategories(userId: string): Promise<boolean> {
  if (!userId || typeof userId !== 'string') {
    return false;
  }

  try {
    const existingCategories = await db.select({
      id: category.id
    })
      .from(category)
      .where(eq(category.userId, userId))
      .limit(1);

    return existingCategories.length > 0;
  } catch (error) {
    console.error('Error checking user categories:', error);
    return false;
  }
}

export async function ensureUserHasDefaultCategories(userId: string): Promise<void> {
  const hasCategories = await userHasCategories(userId);

  if (!hasCategories) {
    await createDefaultCategory(userId);
  }
}