ALTER TABLE "user" ADD COLUMN "email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp NOT NULL;