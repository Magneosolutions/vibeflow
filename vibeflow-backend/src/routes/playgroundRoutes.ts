import express, { Router, Request, Response, NextFunction } from 'express';
import { generateSampleMongoQueries } from '../services/aiService';
import { getCollection } from '../services/mongoService';
import { Document as MongoDocument, Filter } from 'mongodb'; // Added Filter type

const router: Router = express.Router();

// Async error handling middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

interface GenerateQueriesRequestBody {
  ideaName: string;
  ideaDescription: string;
  coreFeatures: string[];
}

interface ExecuteQueryRequestBody {
  query: Filter<MongoDocument>; // Use MongoDB's Filter type for the query object
}

// Interface for our app idea dataset document for type safety when querying
interface AppIdeaDatasetDocument extends MongoDocument {
    name: string;
    description: string;
    target_audience: string;
    core_features: string[];
    monetization_ideas: string[];
    complexity_rating: string;
    category: string[];
    keywords: string[];
    source_url: string | null;
    sample_data_snippet: any;
    potential_use_cases: string[];
    description_embedding?: number[];
    date_added_to_vibeflow: Date;
    last_verified_by_vibeflow: Date;
  }

// Endpoint to generate sample queries for a given app idea
router.post('/generate-queries', asyncHandler(async (req: Request<{}, any, GenerateQueriesRequestBody>, res: Response) => {
  const { ideaName, ideaDescription, coreFeatures } = req.body;

  if (!ideaName || !ideaDescription || !coreFeatures || !Array.isArray(coreFeatures)) {
    return res.status(400).json({ error: 'Missing required fields: ideaName, ideaDescription, coreFeatures (must be an array).' });
  }

  const sampleQueries = await generateSampleMongoQueries(ideaName, ideaDescription, coreFeatures);

  if (sampleQueries) {
    return res.status(200).json(sampleQueries);
  } else {
    return res.status(500).json({ error: 'Failed to generate sample queries from AI service.' });
  }
}));

// Endpoint to execute a chosen query against the "Playground App Idea" datasets
router.post('/execute-query', asyncHandler(async (req: Request<{}, any, ExecuteQueryRequestBody>, res: Response) => {
    const { query } = req.body;
  
    if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
      return res.status(400).json({ error: 'A valid query object is required.' });
    }
  
    try {
      const datasetsCollection = getCollection<AppIdeaDatasetDocument>('datasets');
      
      // Ensure we only query against our playground app ideas
      const playgroundQuery: Filter<AppIdeaDatasetDocument> = {
        ...query, // The user's chosen query
        category: "Playground App Idea" // Filter to only playground ideas
      };
      
      console.log("Executing playground query:", JSON.stringify(playgroundQuery, null, 2));

      // For simplicity, limit results and project only a few fields. Adjust as needed.
      const results = await datasetsCollection.find(playgroundQuery)
        .limit(10) // Limit the number of results from the playground query
        .project({ name: 1, description: 1, core_features: 1, complexity_rating: 1, _id: 0 })
        .toArray();
  
      return res.status(200).json(results);
    } catch (error: any) {
      console.error("Error executing playground query:", error);
      return res.status(500).json({ error: 'Failed to execute playground query.', details: error.message });
    }
  }));

export default router;
