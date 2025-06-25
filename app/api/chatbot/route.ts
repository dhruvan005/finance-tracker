import { NextRequest } from 'next/server';
import { generateFinanceResponse } from '@/lib/ai';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    // Get authenticated user
    let currentUser;
    try {
      currentUser = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (authError) {
      console.error("Auth error:", authError);
      return new Response("Authentication required", { status: 401 });
    }

    if (!currentUser?.user?.id) {
      return new Response("User not authenticated", { status: 401 });
    }

    // Generate streaming response using the new RAG workflow
    const result = await generateFinanceResponse(
      question, 
      currentUser.user.id, 
      true // Enable streaming
    );

    // Convert to streaming response or return as JSON
    if (typeof (result as any).toDataStreamResponse === 'function') {
      return (result as any).toDataStreamResponse();
    } else {
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    console.error('Error in chatbot API:', error);
    
    // Fallback error response
    const encoder = new TextEncoder();
    const fallbackMessage = "I'm sorry, but I couldn't process your request at the moment. Here's some general financial advice: Consider saving at least 20% of your income, keep an emergency fund of 3-6 months of expenses, and try to pay off high-interest debt first.";

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallbackMessage));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}