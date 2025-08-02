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
    metadata?: Record<string, unknown>;
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

  } catch (error: unknown) {
    lastError = error as Error;
    console.error(`Attempt failed Error :`, (error as Error).message);
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
  filter?: Record<string, unknown>
): Promise<Array<{
  id: string;
  score: number;
  text: string;
  metadata?: Record<string, unknown>;
}>> {
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
        metadata?: Record<string, unknown>;
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

  } catch (error: unknown) {
    console.error("Error retrieving data from Pinecone:", (error as Error).message);
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

// Dynamic mapping configuration for data types
interface DataTypeConfig {
  propertyName: keyof FinancialDataInput;
  isArray: boolean;
  matchingFields: Record<string, string>; // Maps dataIdentifier field to metadata field
}

const DATA_TYPE_MAPPING: Record<string, DataTypeConfig> = {
  income: {
    propertyName: 'income',
    isArray: true,
    matchingFields: { 
      source: 'source',
      amount: 'amount'
    }
  },
  expense: {
    propertyName: 'expenses',
    isArray: true,
    matchingFields: { 
      category: 'category',
      amount: 'amount'
    }
  },
  debt: {
    propertyName: 'debts',
    isArray: true,
    matchingFields: { 
      type: 'debtType',
      amount: 'amount'
    }
  },
  investment: {
    propertyName: 'investments',
    isArray: true,
    matchingFields: { 
      type: 'investmentType',
      value: 'value'
    }
  },
  savings: {
    propertyName: 'savings',
    isArray: false,
    matchingFields: { 
      amount: 'amount'
    }
  }
};

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
      const metadata = doc.metadata as Record<string, unknown>;

      if (metadata?.dataType === 'income') {
        aggregatedData.income.push({
          source: (metadata.source as string) || 'unknown',
          amount: (metadata.amount as number) || 0,
          date: (metadata.date as string) || new Date().toISOString()
        });
      } else if (metadata?.dataType === 'expense') {
        aggregatedData.expenses.push({
          category: (metadata.category as string) || 'unknown',
          amount: (metadata.amount as number) || 0,
          date: (metadata.date as string) || new Date().toISOString()
        });
      } else if (metadata?.dataType === 'savings') {
        aggregatedData.savings += (metadata.amount as number) || 0;
      } else if (metadata?.dataType === 'debt') {
        aggregatedData.debts.push({
          type: (metadata.debtType as string) || 'unknown',
          amount: (metadata.amount as number) || 0,
          interestRate: metadata.interestRate as number | undefined
        });
      } else if (metadata?.dataType === 'investment') {
        aggregatedData.investments.push({
          type: (metadata.investmentType as string) || 'unknown',
          value: (metadata.value as number) || 0,
          performance: metadata.performance as number | undefined
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
      metadata?: Record<string, unknown>;
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
 * Update user financial data in Pinecone (Dynamic Implementation)
 * 
 * This function dynamically handles different data types based on the DATA_TYPE_MAPPING configuration.
 * To add a new data type, simply add it to the DATA_TYPE_MAPPING object.
 * 
 * @param userId User ID
 * @param dataType Type of data (must be one of: income, expense, debt, investment, savings)
 * @param oldData Previous data to identify and delete old vectors
 * @param newData New data to store
 * @returns Promise<boolean> Success status
 * 
 * @example
 * // Update income data
 * await updateUserFinancialData(
 *   "user123",
 *   "income",
 *   { source: "Job", amount: 5000 },
 *   { source: "Job", amount: 5500, date: "2025-01-01" }
 * );
 * 
 * // Update expense data
 * await updateUserFinancialData(
 *   "user123",
 *   "expense", 
 *   { category: "Food", amount: 100 },
 *   { category: "Food", amount: 120, date: "2025-01-01" }
 * );
 */
export async function updateUserFinancialData(
  userId: string, 
  dataType: string,
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>
): Promise<boolean> {
  try {
    console.log(`Updating user financial data for user ${userId}, type: ${dataType}`);
    console.log('Old data:', oldData);
    console.log('New data:', newData);

    // Validate data type
    const config = DATA_TYPE_MAPPING[dataType];
    if (!config) {
      throw new Error(`Unsupported data type: ${dataType}. Supported types: ${Object.keys(DATA_TYPE_MAPPING).join(', ')}`);
    }

    // First, find and delete old vectors
    const oldVectorIds = await findUserDataVectors(userId, dataType, oldData);
    
    if (oldVectorIds.length > 0) {
      console.log(`Found ${oldVectorIds.length} old vectors to delete`);
      await deleteFromPinecone(oldVectorIds);
    } else {
      console.log('No old vectors found to delete');
    }

    // Then store the new data using dynamic mapping
    const dataToStore: FinancialDataInput = {};
    
    if (config.isArray) {
      // For array-based data types
      (dataToStore as Record<string, unknown>)[config.propertyName] = [newData];
    } else {
      // For single value data types
      (dataToStore as Record<string, unknown>)[config.propertyName] = newData;
    }
    
    console.log('Data to store:', dataToStore);
    const result = await storeUserFinancialData(userId, dataToStore);
    console.log(`Store operation result: ${result}`);
    
    return result;
    
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
  dataIdentifier: Record<string, unknown>
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
  dataIdentifier: Record<string, unknown>
): Promise<string[]> {
  try {
    console.log(`Finding vectors for user ${userId}, type: ${dataType}, identifier:`, dataIdentifier);
    
    // Validate data type
    const config = DATA_TYPE_MAPPING[dataType];
    if (!config) {
      console.warn(`Unsupported data type for deletion: ${dataType}`);
      return [];
    }
    
    // Query for user's data of specific type
    const searchQuery = `user ${userId} ${dataType}`;
    const results = await retrieveFromPinecone(
      searchQuery,
      50, // Get more results to find exact matches
      { userId, type: 'user_data', dataType }
    );

    console.log(`Found ${results.length} potential vectors to check`);
    
    const vectorIds: string[] = [];

    // Filter based on data identifier using dynamic matching
    results.forEach(result => {
      const metadata = result.metadata;
      let shouldDelete = true;

      // Dynamic matching based on configuration
      for (const [identifierField, metadataField] of Object.entries(config.matchingFields)) {
        if (metadata?.[metadataField] !== dataIdentifier[identifierField]) {
          shouldDelete = false;
          break;
        }
      }

      if (shouldDelete) {
        console.log(`Found matching vector: ${result.id}`);
        vectorIds.push(result.id);
      }
    });

    console.log(`Returning ${vectorIds.length} vector IDs for deletion`);
    return vectorIds;
  } catch (error) {
    console.error('Error finding user data vectors:', error);
    return [];
  }
}

/**
 * Get all supported data types
 * @returns Array of supported data type names
 */
export function getSupportedDataTypes(): string[] {
  return Object.keys(DATA_TYPE_MAPPING);
}

/**
 * Check if a data type is supported
 * @param dataType Data type to check
 * @returns Boolean indicating if the data type is supported
 */
export function isDataTypeSupported(dataType: string): boolean {
  return dataType in DATA_TYPE_MAPPING;
}

/**
 * Get configuration for a specific data type
 * @param dataType Data type to get configuration for
 * @returns Configuration object or null if not supported
 */
export function getDataTypeConfig(dataType: string): DataTypeConfig | null {
  return DATA_TYPE_MAPPING[dataType] || null;
}