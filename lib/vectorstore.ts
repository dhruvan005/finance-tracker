import { Pinecone } from "@pinecone-database/pinecone";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);
const EMBEDDING_MODEL = "text-embedding-004";

/**
 * Store data in Pinecone vector database
 * @param data Array of objects containing id, text, and optional metadata
 * @returns Promise<boolean> Success status
 */
export async function storeInPinecone(
  data: Array<{
    id: string;
    text: string;
    metadata?: Record<string, any>;
  }>
): Promise<boolean> {
  try {
    // Generate embeddings for all texts
    const embeddings = await Promise.all(
      data.map(async (item) => {
        const { embedding } = await embed({
          model: google.textEmbeddingModel(EMBEDDING_MODEL),
          value: item.text,
        });
        return embedding;
      })
    );

    // Prepare vectors for upsert
    const vectors = data.map((item, index) => ({
      id: item.id,
      values: embeddings[index],
      metadata: {
        text: item.text,
        ...item.metadata,
      },
    }));

    // Upsert vectors to Pinecone
    await index.upsert(vectors);

    console.log(`Successfully stored ${vectors.length} vectors in Pinecone`);
    return true;
  } catch (error) {
    console.error("Error storing data in Pinecone:", error);
    return false;
  }
}

/**
 * Retrieve similar matches from Pinecone vector database
 * @param query Search query text
 * @param topK Number of top matches to return (default: 5)
 * @param filter Optional metadata filter
 * @returns Promise<Array> Array of matching results with scores
 */
export async function retrieveFromPinecone(
  query: string,
  topK: number = 5,
  filter?: Record<string, any>
): Promise<Array<{
  id: string;
  score: number;
  text: string;
  metadata?: Record<string, any>;
}>> {
  try {
    // Generate embedding for the query
    const { embedding } = await embed({
      model: google.textEmbeddingModel(EMBEDDING_MODEL),
      value: query,
    });

    // Query Pinecone for similar vectors
    const queryResponse = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
      filter,
    });

    // Format results
    const results = queryResponse.matches?.map((match) => ({
      id: match.id,
      score: match.score || 0,
      text: match.metadata?.text as string || "",
      metadata: match.metadata,
    })) || [];

    console.log(`Retrieved ${results.length} matches from Pinecone`);
    return results;
  } catch (error) {
    console.error("Error retrieving data from Pinecone:", error);
    return [];
  }
}

// New function to get user-specific data from vector store
interface UserFinanceData {
  income: number;
  expenses: Array<{ category: string; amount: number; date: string }>;
  savings: number;
  debts: Array<{ type: string; amount: number; interestRate?: number }>;
  investments: Array<{ type: string; value: number; performance?: number }>;
  message?: string;
}

export async function getUserDataFromVectorStore(userId: string): Promise<UserFinanceData> {
  try {
    const userFinanceData = await retrieveFromPinecone(
      `user financial data transactions expenses income savings investments debts`,
      20,
      { userId: userId, type: 'user_data' }
    );

    if (userFinanceData.length === 0) {
      return {
        income: 0,
        expenses: [],
        savings: 0,
        debts: [],
        investments: [],
        message: 'No financial data found for user'
      };
    }

    const aggregatedData: UserFinanceData = {
      income: 0,
      expenses: [],
      savings: 0,
      debts: [],
      investments: [],
    };

    userFinanceData.forEach(doc => {
      const metadata = doc.metadata;

      if (metadata?.dataType === 'income') {
        aggregatedData.income += metadata.amount || 0;
      } else if (metadata?.dataType === 'expense') {
        aggregatedData.expenses.push({
          category: metadata.category,
          amount: metadata.amount,
          date: metadata.date
        });
      } else if (metadata?.dataType === 'savings') {
        aggregatedData.savings += metadata.amount || 0;
      } else if (metadata?.dataType === 'debt') {
        aggregatedData.debts.push({
          type: metadata.debtType,
          amount: metadata.amount,
          interestRate: metadata.interestRate
        });
      } else if (metadata?.dataType === 'investment') {
        aggregatedData.investments.push({
          type: metadata.investmentType,
          value: metadata.value,
          performance: metadata.performance
        });
      }
    });

    return aggregatedData;

  } catch (error) {
    console.error('Error fetching user data from vector store:', error);
    return {
      income: 0,
      expenses: [],
      savings: 0,
      debts: [],
      investments: [],
      message: 'Error fetching user financial data'
    };
  }
}

// Function to store user financial data
export async function storeUserFinancialData(userId: string, financialData: any): Promise<boolean> {
  try {
    const vectorData = [];

    if (financialData.income) {
      vectorData.push({
        id: `${userId}-income-${Date.now()}`,
        text: `User has monthly income of $${financialData.income}`,
        metadata: {
          userId,
          type: 'user_data',
          dataType: 'income',
          amount: financialData.income,
          timestamp: new Date().toISOString()
        }
      });
    }

    financialData.expenses?.forEach((expense: any, index: number) => {
      vectorData.push({
        id: `${userId}-expense-${Date.now()}-${index}`,
        text: `User ${userId} spent $${expense.amount} on ${expense.category}`,
        metadata: {
          userId,
          type: 'user_data',
          dataType: 'expense',
          category: expense.category,
          amount: expense.amount,
          date: expense.date,
          timestamp: new Date().toISOString()
        }
      });
    });

    if (financialData.savings) {
      vectorData.push({
        id: `${userId}-savings-${Date.now()}`,
        text: `User ${userId} has total savings of $${financialData.savings}`,
        metadata: {
          userId,
          type: 'user_data',
          dataType: 'savings',
          amount: financialData.savings,
          timestamp: new Date().toISOString()
        }
      });
    }

    financialData.debts?.forEach((debt: any, index: number) => {
      vectorData.push({
        id: `${userId}-debt-${Date.now()}-${index}`,
        text: `User ${userId} has ${debt.type} debt of $${debt.amount}`,
        metadata: {
          userId,
          type: 'user_data',
          dataType: 'debt',
          debtType: debt.type,
          amount: debt.amount,
          interestRate: debt.interestRate,
          timestamp: new Date().toISOString()
        }
      });
    });

    financialData.investments?.forEach((investment: any, index: number) => {
      vectorData.push({
        id: `${userId}-investment-${Date.now()}-${index}`,
        text: `User ${userId} has ${investment.type} investment worth $${investment.value}`,
        metadata: {
          userId,
          type: 'user_data',
          dataType: 'investment',
          investmentType: investment.type,
          value: investment.value,
          performance: investment.performance,
          timestamp: new Date().toISOString()
        }
      });
    });

    return await storeInPinecone(vectorData);

  } catch (error) {
    console.error('Error storing user financial data:', error);
    return false;
  }
}

/**
 * Delete vectors from Pinecone by IDs
 * @param ids Array of vector IDs to delete
 * @returns Promise<boolean> Success status
 */
export async function deleteFromPinecone(ids: string[]): Promise<boolean> {
  try {
    await index.deleteMany(ids);
    console.log(`Successfully deleted ${ids.length} vectors from Pinecone`);
    return true;
  } catch (error) {
    console.error("Error deleting data from Pinecone:", error);
    return false;
  }
}

/**
 * Get index statistics
 * @returns Promise<object> Index statistics
 */
export async function getPineconeStats() {
  try {
    const stats = await index.describeIndexStats();
    return stats;
  } catch (error) {
    console.error("Error getting Pinecone stats:", error);
    return null;
  }
}

