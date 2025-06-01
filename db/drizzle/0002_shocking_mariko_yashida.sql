CREATE INDEX "account_user_id_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "budget_user_cat_period_idx" ON "budget" USING btree ("userId","categoryId","period");--> statement-breakpoint
CREATE INDEX "category_user_id_idx" ON "category" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "category_type_idx" ON "category" USING btree ("type");--> statement-breakpoint
CREATE INDEX "expenses_user_id_idx" ON "expenses" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "expenses_category_id_idx" ON "expenses" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "expenses_date_idx" ON "expenses" USING btree ("date");--> statement-breakpoint
CREATE INDEX "expenses_user_cat_date_idx" ON "expenses" USING btree ("userId","categoryId","date");--> statement-breakpoint
CREATE INDEX "incomes_user_id_idx" ON "incomes" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "incomes_category_id_idx" ON "incomes" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "incomes_date_idx" ON "incomes" USING btree ("date");--> statement-breakpoint
CREATE INDEX "incomes_user_cat_date_idx" ON "incomes" USING btree ("userId","categoryId","date");--> statement-breakpoint
CREATE INDEX "savings_goal_user_id_idx" ON "savings_goal" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");