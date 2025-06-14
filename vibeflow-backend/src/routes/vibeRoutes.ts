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
  // Add other fields from your schema as needed for type safety
  source_url?: string;
  categories?: string[];
  keywords?: string[];
  sample_data_snippet?: any;
  potential_use_cases?: string[];
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
  
  // Actual vector search
  searchResults = await datasetsCollection.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index_datasets_description', // Actual Atlas Vector Search index name
        path: 'description_embedding', // Field containing the vector
        queryVector: vibeEmbedding,    // The embedding of the user's vibe text
        numCandidates: 100,            // Number of candidates to consider
        limit: 5,                      // Number of top results to return
      },
    },
    {
      $project: { // Define which fields to return
        _id: 0, // Exclude the _id field
        name: 1,
        description: 1,
        source_url: 1,
        category: 1, // Corrected from 'categories' to 'category'
        keywords: 1,
        sample_data_snippet: 1,
        potential_use_cases: 1,
        core_features: 1, // Added core_features to the projection
        score: { $meta: 'vectorSearchScore' } // Include the search score
      }
    }
  ]).toArray() as DatasetDocument[]; // Added type assertion
  console.log(`Found ${searchResults.length} datasets via vector search.`);

  // 3. Get AI Feedback (Vibe Check) - Placeholder
  const aiFeedback = await getAIFeedback(vibeText);

  // Use return
  return res.status(200).json({
    message: searchResults.length > 0 ? 'Vibe processed and matches found.' : 'Vibe processed, but no direct matches found.',
    vibeText,
    vibeEmbeddingDimensions: vibeEmbedding.length,
    searchResults,
    aiFeedback,
  });
  // No 'catch' block needed here if using asyncHandler, as it passes errors to Express's error handlers
  // The asyncHandler will pass errors to the global error handler in index.ts
}));

export default router;
