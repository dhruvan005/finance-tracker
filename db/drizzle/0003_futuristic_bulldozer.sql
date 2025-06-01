ALTER TABLE "incomes" DROP CONSTRAINT "incomes_categoryId_category_id_fk";
--> statement-breakpoint
DROP INDEX "incomes_category_id_idx";--> statement-breakpoint
DROP INDEX "incomes_user_cat_date_idx";--> statement-breakpoint
ALTER TABLE "incomes" DROP COLUMN "categoryId";