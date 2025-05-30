CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"userId" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budget" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"amount" numeric NOT NULL,
	"period" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"categoryId" text NOT NULL,
	"description" text,
	"date" timestamp DEFAULT now() NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incomes" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"amount" numeric NOT NULL,
	"categoryId" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_goal" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"target_amount" numeric NOT NULL,
	"current_amount" numeric DEFAULT '0' NOT NULL,
	"target_date" timestamp NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_goal" ADD CONSTRAINT "savings_goal_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;