import { pgTable, text, decimal, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    name: text("name"),
    emailVerified: boolean("email_verified").default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
}, (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
}));

export const category = pgTable("category", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(), // 'expense' or 'income'
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
}, (table) => ({
    userIdIdx: index("category_user_id_idx").on(table.userId),
    typeIdx: index("category_type_idx").on(table.type),
}));

export const expenses = pgTable("expenses", {
    id: text("id").primaryKey(),
    amount: decimal("amount").notNull(),
    categoryId: text("categoryId").notNull().references(() => category.id, { onDelete: "restrict" }),
    description: text("description"),
    date: timestamp("date").defaultNow().notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
}, (table) => ({
    userIdIdx: index("expenses_user_id_idx").on(table.userId),
    categoryIdIdx: index("expenses_category_id_idx").on(table.categoryId),
    dateIdx: index("expenses_date_idx").on(table.date),
    userCategoryDateIdx: index("expenses_user_cat_date_idx").on(table.userId, table.categoryId, table.date),
}));

export const incomes = pgTable("incomes", {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    amount: decimal("amount").notNull(),
    date: timestamp("date").defaultNow().notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
}, (table) => ({
    userIdIdx: index("incomes_user_id_idx").on(table.userId),
    dateIdx: index("incomes_date_idx").on(table.date),
}));

export const budget = pgTable("budget", {
    id: text("id").primaryKey(),
    categoryId: text("categoryId").notNull().references(() => category.id, { onDelete: "cascade" }),
    amount: decimal("amount").notNull(),
    period: text("period").notNull(), // 'monthly' or 'yearly'
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
}, (table) => ({
    userCategoryPeriodIdx: index("budget_user_cat_period_idx").on(table.userId, table.categoryId, table.period),
}));

export const savingsGoal = pgTable("savings_goal", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    targetAmount: decimal("target_amount").notNull(),
    currentAmount: decimal("current_amount").notNull().default("0"),
    targetDate: timestamp("target_date").notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
}, (table) => ({
    userIdIdx: index("savings_goal_user_id_idx").on(table.userId),
}));

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (table) => ({
    tokenIdx: index("session_token_idx").on(table.token),
    userIdIdx: index("session_user_id_idx").on(table.userId),
}));

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
}, (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
}));

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
}, (table) => ({
    userIdIdx: index("account_user_id_idx").on(table.userId),
}));


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
