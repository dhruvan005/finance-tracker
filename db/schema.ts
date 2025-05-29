import { pgTable, uuid, text, decimal, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").unique().notNull(),
    name: text("name"),
});

export const category = pgTable("category", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: text("type").notNull(), // 'expense' or 'income'
    userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const expenses = pgTable("expenses", {
    id: uuid("id").primaryKey().defaultRandom(),
    amount: decimal("amount").notNull(),
    categoryId: uuid("categoryId").notNull().references(() => category.id, { onDelete: "restrict" }),
    description: text("description"),
    date: timestamp("date").defaultNow().notNull(),
    userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const incomes = pgTable("incomes", {
    id: uuid("id").primaryKey().defaultRandom(),
    source: text("source").notNull(),
    amount: decimal("amount").notNull(),
    categoryId: uuid("categoryId").notNull().references(() => category.id, { onDelete: "restrict" }),
    date: timestamp("date").defaultNow().notNull(),
    userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const budget = pgTable("budget", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("categoryId").notNull().references(() => category.id, { onDelete: "cascade" }),
    amount: decimal("amount").notNull(),
    period: text("period").notNull(), // 'monthly' or 'yearly'
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const savingsGoal = pgTable("savings_goal", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    targetAmount: decimal("target_amount").notNull(),
    currentAmount: decimal("current_amount").notNull().default("0"),
    targetDate: timestamp("target_date").notNull(),
    userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});


export const session = pgTable("session", {
    id: uuid("id").primaryKey().defaultRandom(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});
export const verification = pgTable("verification", {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

export const account = pgTable("account", {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id").notNull(),
    providerId: uuid("provider_id").notNull(),
    userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

// Define relations
export const userRelations = relations(user, ({ many }) => ({
    expenses: many(expenses),
    incomes: many(incomes),
    categories: many(category),
    budgets: many(budget),
    savingsGoals: many(savingsGoal),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
    user: one(user, {
        fields: [category.userId],
        references: [user.id],
    }),
    expenses: many(expenses),
    incomes: many(incomes),
    budgets: many(budget),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
    user: one(user, {
        fields: [expenses.userId],
        references: [user.id],
    }),
    category: one(category, {
        fields: [expenses.categoryId],
        references: [category.id],
    }),
}));

export const incomesRelations = relations(incomes, ({ one }) => ({
    user: one(user, {
        fields: [incomes.userId],
        references: [user.id],
    }),
    category: one(category, {
        fields: [incomes.categoryId],
        references: [category.id],
    }),
}));

export const budgetRelations = relations(budget, ({ one }) => ({
    user: one(user, {
        fields: [budget.userId],
        references: [user.id],
    }),
    category: one(category, {
        fields: [budget.categoryId],
        references: [category.id],
    }),
}));

export const savingsGoalRelations = relations(savingsGoal, ({ one }) => ({
    user: one(user, {
        fields: [savingsGoal.userId],
        references: [user.id],
    }),
}));
