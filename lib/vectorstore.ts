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
  let lastError: Error | null = null;

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
    // Upsert vectors to Pinecone with timeout
    await Promise.race([
      index.upsert(vectors),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Upsert timeout after 15 seconds')), 15000)
      )
    ]);

    console.log(`Successfully stored ${vectors.length} vectors in Pinecone`);
    return true;

  } catch (error: any) {
    lastError = error;
    console.error(`Attempt failed Error :`, error.message);
  }


  console.error("All retry attempts failed:", lastError);
  return false;
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
  let lastError: Error | null = null;
  try {
    // Generate embedding for the query
    const { embedding } = await embed({
      model: google.textEmbeddingModel(EMBEDDING_MODEL),
      value: query,
    });
    console.log(`Generated embedding for query: ${query}`);
    // Query Pinecone for similar vectors with timeout
    const queryResponse = await Promise.race([
      index.query({
        vector: embedding,
        topK,
        includeMetadata: true,
        filter,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
      )
    ]) as {
      matches?: Array<{
        id: string;
        score?: number;
        metadata?: Record<string, any>;
      }>;
    };

    // Format results
    const results = queryResponse.matches?.map((match) => ({
      id: match.id,
      score: match.score || 0,
      text: match.metadata?.text as string || "",
      metadata: match.metadata,
    })) || [];

    return results;

  } catch (error: any) {
    lastError = error;
    console.error("Error retrieving data from Pinecone:", error.message);
  }

  console.error("All retry attempts failed. Returning empty results.");
  return [];
}

// New function to get user-specific data from vector store
// Define the structure of user financial data
interface UserFinanceData {
  income: Array<{ source: string; amount: number; date: string }>;
  expenses: Array<{ category: string; amount: number; date: string }>;
  savings: number;
  debts: Array<{ type: string; amount: number; interestRate?: number }>;
  investments: Array<{ type: string; value: number; performance?: number }>;
  message?: string;
}

// Define input financial data interface
interface FinancialDataInput {
  income?: Array<{ source: string; amount: number; date: string }>;
  expenses?: Array<{ category: string; amount: number; date: string }>;
  savings?: number;
  debts?: Array<{ type: string; amount: number; interestRate?: number }>;
  investments?: Array<{ type: string; value: number; performance?: number }>;
}

// get the user financial data from vector store
export async function getUserDataFromVectorStore(userId: string): Promise<UserFinanceData> {
  try {
    console.log(`Fetching data for user: ${userId}`);

    // First check if user has any data at all
    const userFinanceData = await retrieveFromPinecone(
      `user ${userId} financial data`,
      20,
      { userId: userId, type: 'user_data' }
    );

    if (userFinanceData.length === 0) {
      console.log(`No data found for user ${userId}`);

      return {
        income: [],
        expenses: [],
        savings: 0,
        debts: [],
        investments: [],
        message: 'No financial data found for this user. Please add your financial information.'
      };
    }
    
    const aggregatedData: UserFinanceData = {
      income: [],
      expenses: [],
      savings: 0,
      debts: [],
      investments: [],
    };

    userFinanceData.forEach(doc => {
      const metadata = doc.metadata;

      if (metadata?.dataType === 'income') {
        aggregatedData.income.push({
          source: metadata.source || 'unknown',
          amount: metadata.amount || 0,
          date: metadata.date || new Date().toISOString()
        });
      } else if (metadata?.dataType === 'expense') {
        aggregatedData.expenses.push({
          category: metadata.category || 'unknown',
          amount: metadata.amount || 0,
          date: metadata.date || new Date().toISOString()
        });
      } else if (metadata?.dataType === 'savings') {
        aggregatedData.savings += metadata.amount || 0;
      } else if (metadata?.dataType === 'debt') {
        aggregatedData.debts.push({
          type: metadata.debtType || 'unknown',
          amount: metadata.amount || 0,
          interestRate: metadata.interestRate
        });
      } else if (metadata?.dataType === 'investment') {
        aggregatedData.investments.push({
          type: metadata.investmentType || 'unknown',
          value: metadata.value || 0,
          performance: metadata.performance
        });
      }
    });

    return aggregatedData;

  } catch (error) {
    console.error('Error fetching user data from vector store:', error);
    return {
      income: [],
      expenses: [],
      savings: 0,
      debts: [],
      investments: [],
      message: 'Error fetching user financial data'
    };
  }
}

// Function to store user financial data
export async function storeUserFinancialData(userId: string, financialData: FinancialDataInput): Promise<boolean> {
  try {
    const vectorData: Array<{
      id: string;
      text: string;
      metadata?: Record<string, any>;
    }> = [];

    financialData.income?.forEach((income, index: number) => {
      vectorData.push({
        id: `${userId}-income-${Date.now()}-${index}`,
        text: `User has income of $${income.amount} from ${income.source}`,
        metadata: {
          userId,
          type: 'user_data',
          dataType: 'income',
          source: income.source,
          amount: income.amount,
          date: income.date,
          timestamp: new Date().toISOString()
        }
      });
    });

    financialData.expenses?.forEach((expense, index: number) => {
      vectorData.push({
        id: `${userId}-expense-${Date.now()}-${index}`,
        text: `User spent $${expense.amount} on ${expense.category}`,
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
        text: `User has total savings of $${financialData.savings}`,
        metadata: {
          userId,
          type: 'user_data',
          dataType: 'savings',
          amount: financialData.savings,
          timestamp: new Date().toISOString()
        }
      });
    }

    financialData.debts?.forEach((debt, index: number) => {
      vectorData.push({
        id: `${userId}-debt-${Date.now()}-${index}`,
        text: `User has ${debt.type} debt of $${debt.amount}`,
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

    financialData.investments?.forEach((investment, index: number) => {
      vectorData.push({
        id: `${userId}-investment-${Date.now()}-${index}`,
        text: `User has ${investment.type} investment worth $${investment.value}`,
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

/**
 * Update user financial data in Pinecone
 * @param userId User ID
 * @param dataType Type of data ('income', 'expense', 'savings', etc.)
 * @param oldData Previous data to identify and delete old vectors
 * @param newData New data to store
 * @returns Promise<boolean> Success status
 */
export async function updateUserFinancialData(
  userId: string, 
  dataType: string,
  oldData: any,
  newData: any
): Promise<boolean> {
  try {
    // First, find and delete old vectors
    const oldVectorIds = await findUserDataVectors(userId, dataType, oldData);
    
    if (oldVectorIds.length > 0) {
      await deleteFromPinecone(oldVectorIds);
    }

    // Then store the new data
    let dataToStore: FinancialDataInput = {};
    
    // Handle array-based data types (income, expenses, debts, investments)
    if (dataType === 'income' || dataType === 'expenses' || dataType === 'debts' || dataType === 'investments') {
      dataToStore = { [dataType]: [newData] };
    } else {
      // Handle single value data types (savings)
      dataToStore = { [dataType]: newData };
    }
    
    return await storeUserFinancialData(userId, dataToStore);
    
  } catch (error) {
    console.error('Error updating user financial data:', error);
    return false;
  }
}

/**
 * Delete specific user financial data from Pinecone
 * @param userId User ID
 * @param dataType Type of data to delete
 * @param dataIdentifier Specific data to delete (e.g., income record)
 * @returns Promise<boolean> Success status
 */
export async function deleteUserFinancialData(
  userId: string,
  dataType: string,
  dataIdentifier: any
): Promise<boolean> {
  try {
    const vectorIds = await findUserDataVectors(userId, dataType, dataIdentifier);
    
    if (vectorIds.length > 0) {
      return await deleteFromPinecone(vectorIds);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user financial data:', error);
    return false;
  }
}

/**
 * Find vector IDs for specific user data
 * @param userId User ID
 * @param dataType Type of data
 * @param dataIdentifier Data to identify vectors
 * @returns Promise<string[]> Array of vector IDs
 */
async function findUserDataVectors(
  userId: string,
  dataType: string,
  dataIdentifier: any
): Promise<string[]> {
  try {
    // Query for user's data of specific type
    const searchQuery = `user ${userId} ${dataType}`;
    const results = await retrieveFromPinecone(
      searchQuery,
      50, // Get more results to find exact matches
      { userId, type: 'user_data', dataType }
    );

    const vectorIds: string[] = [];

    // Filter based on data identifier
    results.forEach(result => {
      const metadata = result.metadata;
      let shouldDelete = false;

      switch (dataType) {
        case 'income':
          // Match by source and amount for income
          if (metadata?.source === dataIdentifier.source && 
              metadata?.amount === dataIdentifier.amount) {
            shouldDelete = true;
          }
          break;
          
        case 'expense':
          // Match by category and amount for expenses
          if (metadata?.category === dataIdentifier.category && 
              metadata?.amount === dataIdentifier.amount) {
            shouldDelete = true;
          }
          break;
          
        case 'savings':
          // For savings, match by amount
          if (metadata?.amount === dataIdentifier.amount) {
            shouldDelete = true;
          }
          break;
          
        default:
          // For other types, you can add more specific matching logic
          break;
      }

      if (shouldDelete) {
        vectorIds.push(result.id);
      }
    });

    return vectorIds;
  } catch (error) {
    console.error('Error finding user data vectors:', error);
    return [];
  }
}