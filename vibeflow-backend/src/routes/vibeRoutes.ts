import express, { Router, Request, Response, NextFunction } from 'express';
import { getTextEmbedding, getAIFeedback } from '../services/aiService';
import { getCollection } from '../services/mongoService';
import { Document as MongoDocument } from 'mongodb';

const router: Router = express.Router();

interface ProcessVibeRequestBody {
  vibeText: string;
}

interface DatasetDocument extends MongoDocument {
  name: string;
  description: string;
  description_embedding?: number[];
  source_url?: string;
  category?: string[]; // Changed from categories
  keywords?: string[];
  sample_data_snippet?: any;
  potential_use_cases?: string[];
  core_features?: string[]; // Added for playground
}

interface ApiDocument extends MongoDocument {
  name: string;
  description: string;
  category: string;
  documentation_url: string;
  base_url?: string;
  authentication_type?: string;
  common_use_cases?: string[];
  keywords?: string[];
  sample_endpoint?: string;
  sample_response_snippet?: string;
  description_embedding?: number[];
}

// Async error handling middleware (optional, but good practice for Express async routes)
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/process-vibe', asyncHandler(async (req: Request<{}, any, ProcessVibeRequestBody>, res: Response, next: NextFunction) => {
  const { vibeText } = req.body;

  if (!vibeText || typeof vibeText !== 'string' || vibeText.trim() === "") {
    // Use return to ensure no further code in this handler executes
    return res.status(400).json({ error: 'vibeText is required and must be a non-empty string.' });
  }

  console.log(`Processing vibe: "${vibeText.substring(0, 100)}..."`);

  // 1. Get embedding for the user's vibe text
  const vibeEmbedding = await getTextEmbedding(vibeText);

  if (!vibeEmbedding) {
    // Use return
    return res.status(500).json({ error: 'Failed to generate embedding for the vibe text.' });
  }

  // 2. Perform Vector Search in MongoDB using vibeEmbedding
  let searchResults: DatasetDocument[] = [];
  const datasetsCollection = getCollection<DatasetDocument>('datasets');
  
  // Actual vector search for datasets
  searchResults = await datasetsCollection.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index_datasets_description', 
        path: 'description_embedding', 
        queryVector: vibeEmbedding,    
        numCandidates: 100,            
        limit: 1, // Keep dataset results to 1 for focused AI feedback for now
      },
    },
    {
      $project: { 
        _id: 0, 
        name: 1,
        description: 1,
        source_url: 1,
        category: 1, 
        keywords: 1,
        sample_data_snippet: 1,
        potential_use_cases: 1,
        core_features: 1, 
        score: { $meta: 'vectorSearchScore' } 
      }
    }
  ]).toArray() as DatasetDocument[]; 
  console.log(`Found ${searchResults.length} datasets via vector search.`);

  // 3. Perform Vector Search for APIs
  let apiResults: ApiDocument[] = [];
  const apisCollection = getCollection<ApiDocument>('apis');
  apiResults = await apisCollection.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index_apis_description', // Ensure this is your API vector index name
        path: 'description_embedding',    // Field containing the vector in 'apis' collection
        queryVector: vibeEmbedding,
        numCandidates: 50,               // Can be different from datasets
        limit: 3,                        // Return top 3 API matches
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        description: 1,
        category: 1,
        documentation_url: 1,
        base_url: 1,
        authentication_type: 1,
        common_use_cases: 1,
        keywords: 1,
        score: { $meta: 'vectorSearchScore' }
      }
    }
  ]).toArray() as ApiDocument[];
  console.log(`Found ${apiResults.length} APIs via vector search.`);

  // 4. Get AI Feedback (Vibe Check)
  // Pass the matched dataset (if any) to getAIFeedback. API results are not used for feedback yet.
  let matchedDatasetInfo: { name: string, description: string } | null = null;
  if (searchResults.length > 0 && searchResults[0]) {
    // Ensure description is a string, provide a fallback if not (though it should be)
    const description = typeof searchResults[0].description === 'string' ? searchResults[0].description : 'No description available.';
    matchedDatasetInfo = { 
      name: searchResults[0].name, 
      description: description
    };
  }
  const aiFeedback = await getAIFeedback(vibeText, matchedDatasetInfo);

  // Use return
  const messageBase = "Vibe processed.";
  let messageDetail = "";
  if (searchResults.length > 0 && apiResults.length > 0) {
    messageDetail = "Dataset and API matches found.";
  } else if (searchResults.length > 0) {
    messageDetail = "Dataset matches found, no direct API matches.";
  } else if (apiResults.length > 0) {
    messageDetail = "API matches found, no direct dataset matches.";
  } else {
    messageDetail = "No direct dataset or API matches found.";
  }

  return res.status(200).json({
    message: `${messageBase} ${messageDetail}`,
    vibeText,
    vibeEmbeddingDimensions: vibeEmbedding.length,
    searchResults,
    apiResults, // Add apiResults to the response
    aiFeedback,
  });
  // No 'catch' block needed here if using asyncHandler, as it passes errors to Express's error handlers
  // The asyncHandler will pass errors to the global error handler in index.ts
}));

export default router;
