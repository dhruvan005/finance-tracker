import { db } from "@/db";
import { category } from "@/db/schema";
import { sql } from "drizzle-orm";

const EXPENSE_CATEGORIES = [
  { id: "food", name: "Food & Dining" },
  { id: "transportation", name: "Transportation" },
  { id: "utilities", name: "Utilities" },
  { id: "entertainment", name: "Entertainment" },
  { id: "healthcare", name: "Healthcare" },
  { id: "shopping", name: "Shopping" },
  { id: "housing", name: "Housing" },
  { id: "education", name: "Education" },
  { id: "personal", name: "Personal Care" },
  { id: "other", name: "Other" },
];

const INCOME_CATEGORIES = [
  { id: "salary", name: "Salary" },
  { id: "freelance", name: "Freelance" },
  { id: "business", name: "Business" },
  { id: "investment", name: "Investment" },
  { id: "other-income", name: "Other Income" },
];

async function seedCategories() {
  try {
    console.log("Starting category seeding...");

    // First, clear existing categories (optional - remove if you want to keep existing ones)
    // await db.delete(category);
    
    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

    // Insert categories one by one to handle conflicts
    for (const cat of allCategories) {
      try {
        await db
          .insert(category)
          .values({
            id: cat.id,
            name: cat.name,
          })
          .onConflictDoNothing(); // Skip if already exists
        
        console.log(`✓ Inserted category: ${cat.name}`);
      } catch (error) {
        console.log(`✗ Category ${cat.name} might already exist, skipping...`);
      }
    }

    console.log("\n✅ Category seeding completed successfully!");
    console.log(`Total categories: ${allCategories.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedCategories();
