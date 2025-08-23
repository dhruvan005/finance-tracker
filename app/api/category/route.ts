// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod/v4";
// import {
//     getAllCategories,
//     createCategory,
//     updateCategory,
//     getCategoriesWithExpenseCounts
// } from "@/lib/db-finance";

// export async function GET(req: NextRequest) {
//     try {
//         const currentUser = await auth.api.getSession({
//             headers: await headers(),
//         });

//         if (!currentUser?.user?.id) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         // Get query params
//         const url = new URL(req.url);
//         const type = url.searchParams.get("type") || undefined;
//         const withCounts = url.searchParams.get("withCounts") === "true";

//         let categories;
//         if (withCounts) {
//             categories = await getCategoriesWithExpenseCounts(currentUser.user.id);
//         } else {
//             categories = await getAllCategories(currentUser.user.id, type);
//         }

//         return NextResponse.json(categories);
//     } catch (error) {
//         console.error("Server Error:", error);
//         return NextResponse.json({ error: "Server Error - failed to load categories" }, { status: 500 });
//     }
// }

// const createCategorySchema = z.object({
//     name: z.string().min(1, "Category name is required"),
//     type: z.enum(["expense", "income"])
// });

// export async function POST(req: NextRequest) {
//     try {
//         const currentUser = await auth.api.getSession({
//             headers: await headers(),
//         });

//         if (!currentUser?.user?.id) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const body = await req.json();
//         const validatedData = createCategorySchema.parse(body);

//         const newCategory = await createCategory(
//             currentUser.user.id,
//             validatedData.name,
//             validatedData.type
//         );

//         return NextResponse.json(newCategory, { status: 201 });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             return NextResponse.json(
//                 { error: "Invalid data", details: error.message },
//                 { status: 400 }
//             );
//         }

//         console.error("Server Error:", error);
//         return NextResponse.json({ error: "Server Error - failed to create category" }, { status: 500 });
//     }
// }

// const updateCategorySchema = z.object({
//     id: z.string(),
//     name: z.string().min(1, "Category name is required").optional(),
//     type: z.enum(["expense", "income"]).optional()
// }).refine(data => data.name || data.type, {
//     message: "At least one field (name or type) must be provided",
// });

// export async function PUT(req: NextRequest) {
//     try {
//         const currentUser = await auth.api.getSession({
//             headers: await headers(),
//         });

//         if (!currentUser?.user?.id) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const body = await req.json();
//         const validatedData = updateCategorySchema.parse(body);

//         const { id, ...data } = validatedData;

//         const updatedCategory = await updateCategory(
//             id,
//             currentUser.user.id,
//             data
//         );

//         if (!updatedCategory) {
//             return NextResponse.json({ error: "Category not found" }, { status: 404 });
//         }

//         return NextResponse.json(updatedCategory);
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             return NextResponse.json(
//                 { error: "Invalid data", details: error.message },
//                 { status: 400 }
//             );
//         }

//         console.error("Server Error:", error);
//         return NextResponse.json({ error: "Server Error - failed to update category" }, { status: 500 });
//     }
// }
