
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { ensureUserHasDefaultCategories } from "@/handlers/createDefaultCategory";
import { eq } from "drizzle-orm";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: user,
            account: account,
            session: session,
            verification: verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    }, trustedOrigins: ["http://localhost:3000"],

});

export type Session = typeof auth.$Infer.Session;
export type User = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
};