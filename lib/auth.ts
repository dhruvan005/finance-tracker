// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { db } from "@/db";
// import { account, session, user, verification } from "@/db/schema";


// export const auth = betterAuth({
//     database: drizzleAdapter(db, {
//         provider: "pg",
//         schema: {
//             user: user,
//             account: account,
//             session: session,
//             verification: verification,
//         },
//     }),
//     emailAndPassword: {
//         enabled: true,
//         autoSignIn: true,
//     },
//     socialProviders: {
//         google: {
//             clientId: process.env.GOOGLE_CLIENT_ID as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//         },
//     },
//     trustedOrigins: ["http://localhost:3000"],
// });
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { ensureUserHasDefaultCategories } from "@/handlers/createDefaultCategory";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
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
    lifecycleEvents: {
        onUserCreated: async ({ user }: { user: any }) => {
            // This will run only when a new user is created, regardless of the authentication method
            if (user?.id) {
                try {
                    await ensureUserHasDefaultCategories(user.id);
                    console.log(`Default categories created for new user: ${user.id}`);
                } catch (error) {
                    console.error(`Failed to create default categories for new user ${user.id}:`, error);
                }
            }
        }
    },
});

export type Session = typeof auth.$Infer.Session;
// Define User type manually since $Infer.User might not be available
export type User = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
};