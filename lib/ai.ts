import { generateText, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { retrieveFromPinecone, getUserDataFromVectorStore } from "./vectorstore";

export async function generateFinanceResponse(
  question: string,
  userId: string,
  stream: boolean = false
) {
  // Get user data from vector store
  const userData = await getUserDataFromVectorStore(userId);
  
  // Retrieve relevant context from knowledge base
  const relevantDocs = await retrieveFromPinecone(
    question, 
    5, 
    { type: 'knowledge' } // Only get knowledge base data, not user data
  );
  
  const contextText = relevantDocs
    .map((doc) => `${doc.text} (Score: ${doc.score.toFixed(2)})`)
    .join("\n\n");

  const systemPrompt = `You are an expert finance assistant with access to financial knowledge and user data.

Context from knowledge base:
${contextText}

User's financial data:
${JSON.stringify(userData, null, 2)}

Instructions:
- Use the context and user data to provide accurate, personalized financial advice
- If the context doesn't contain relevant information, rely on your general financial knowledge
- Be specific, actionable, and reference the user's actual financial situation
- Keep responses concise but comprehensive
- Always prioritize the user's financial wellbeing`;

  if (stream) {
    return streamText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      prompt: question,
      maxTokens: 500,
      temperature: 0.7,
    });
  } else {
    return generateText({
      model: google("gemini-1.5-pro"),
      system: systemPrompt,
      prompt: question,
      maxTokens: 500,
      temperature: 0.7,
    });
  }
}

export async function generateFinanceAnalysis(userId: string) {
  const userData = await getUserDataFromVectorStore(userId);
  
  const analysisPrompt = `Analyze this user's financial situation and provide insights:
${JSON.stringify(userData, null, 2)}

Provide:
1. Financial health score (1-10)
2. Key strengths
3. Areas for improvement
4. Specific recommendations`;

  return generateText({
    model: google("gemini-1.5-pro"),
    prompt: analysisPrompt,
    maxTokens: 800,
    temperature: 0.5,
  });
}

// New function to get financial insights based on user data and specific topics
export async function getFinancialInsights(
  userId: string, 
  topic: string = 'general'
) {
  const userData = await getUserDataFromVectorStore(userId);
  
  // Get relevant knowledge for the specific topic
  const topicContext = await retrieveFromPinecone(
    topic, 
    3, 
    { type: 'knowledge', category: topic }
  );
  
  const contextText = topicContext
    .map((doc) => doc.text)
    .join("\n\n");

  const prompt = `Based on this user's financial data and knowledge:

User Data:
${JSON.stringify(userData, null, 2)}

Relevant Knowledge:
${contextText}

Provide specific insights and recommendations for: ${topic}`;

  return generateText({
    model: google("gemini-1.5-pro"),
    prompt,
    maxTokens: 600,
    temperature: 0.6,
  });
}

