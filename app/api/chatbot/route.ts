// /app/api/chatbot/route.ts
import 'groq-sdk/shims/web';
import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const userData = await fetchUserFinance();

  const systemPrompt = `
You are a finance assistant. 
be clear, concise, and actionable in your responses.
Use this user data:
${JSON.stringify(userData)}

Answer clearly and conversationally.
`;
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-70b-8192', // Change to a model that doesn't require terms acceptance
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      temperature: 0.6,
      max_tokens: 500, // Increased max tokens to allow for longer responses
      stream: true, // Enable streaming
    });

    // Create a readable stream from the completion
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Error processing stream chunk:', error);
          controller.error(error);
        }
      }
    });

    // Return the response
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Error calling Groq API:', error.message);

    // For streaming errors, return a ReadableStream with an error message
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

async function fetchUserFinance() {
  // Example: Replace with actual DB call
  // Simulate user finance data
  return {
    income: 1000,
    expenses: [
      { category: 'Rent', amount: 1500 },
      { category: 'Groceries', amount: 400 },
      { category: 'Utilities', amount: 200 },
      { category: 'Entertainment', amount: 150 },
    ],
    savings: 12000,
    debts: [
      { type: 'Credit Card', amount: 2000 },
      { type: 'Student Loan', amount: 8000 },
    ],
    investments: [
      { type: 'Stocks', value: 5000 },
      { type: 'Crypto', value: 1000 },
    ],
  };
}
