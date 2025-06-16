import express, { Router, Request, Response, NextFunction } from 'express';
import { getTextEmbedding, getAIFeedback } from '../services/aiService';
import { getCollection } from '../services/mongoService';
import { Document as MongoDocument, ObjectId } from 'mongodb'; // Added ObjectId

const router: Router = express.Router();

interface ProcessVibeRequestBody {
  vibeText: string;
}

// This interface should now mirror DatasetResource from populateLocalEventsDatasets.ts
interface DatasetDocument extends MongoDocument {
  _id?: ObjectId; // Keep MongoDB ObjectId if it's part of your retrieval
  id: string; // Custom unique ID
  name: string;
  description: string;
  resourceType: 'Local Event' | 'API' | 'Community Data Source' | 'Public Dataset' | 'Other';

  sourceUrl?: string;
  originalSourceName?: string;
  categories: string[]; // Note: 'categories' (plural)
  keywords?: string[];
  dataFormat?: string[];
  updateFrequency?: string;
  license?: string;
  potentialUseCases?: string[];
  sampleDataSnippet?: any;

  eventDetails?: {
    type: string;
    date: string;
    time?: string;
    location: {
      address?: string;
      city: string;
      state: string;
      zip?: string;
      venueName?: string;
      coordinates?: { lat: number; lon: number; };
    };
    organizer?: string;
    imageUrl?: string;
  };

  apiDetails?: {
    documentationUrl: string;
    endpointExample?: string;
    pricingModel?: string;
  };

  communityDataDetails?: {
    dataType: string;
    locationFocus?: string;
    keyInsights?: string[];
    collectionDate?: string;
  };
  
  dateAddedToVibeflow?: Date;
  lastVerifiedByVibeflow?: Date;
  notesForVibeflowAdmin?: string;
  
  description_embedding?: number[];
  score?: number; // For vectorSearchScore
  core_features?: string[]; // If still used for some 'Public Dataset' types like app ideas
}

// Async error handling middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/process-vibe', asyncHandler(async (req: Request<{}, any, ProcessVibeRequestBody>, res: Response, next: NextFunction) => {
  const { vibeText } = req.body;

  if (!vibeText || typeof vibeText !== 'string' || vibeText.trim() === "") {
    return res.status(400).json({ error: 'vibeText is required and must be a non-empty string.' });
  }

  console.log(`Processing vibe: "${vibeText.substring(0, 100)}..."`);

  const vibeEmbedding = await getTextEmbedding(vibeText);

  if (!vibeEmbedding) {
    return res.status(500).json({ error: 'Failed to generate embedding for the vibe text.' });
  }

  const datasetsCollection = getCollection<DatasetDocument>('datasets'); // Target the consolidated 'datasets' collection
  
  const searchResults = await datasetsCollection.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index_datasets_description', // Ensure this index exists on vibeflow_db.datasets
        path: 'description_embedding', 
        queryVector: vibeEmbedding,    
        numCandidates: 150,
        limit: 5, // Get top 5 diverse resources
      },
    },
    {
      $project: { 
        _id: 0, // Exclude MongoDB's _id from the direct response if you use your custom 'id'
        id: 1,
        name: 1,
        description: 1,
        resourceType: 1,
        sourceUrl: 1,
        originalSourceName: 1,
        categories: 1,
        keywords: 1,
        dataFormat: 1,
        updateFrequency: 1,
        license: 1,
        potentialUseCases: 1,
        sampleDataSnippet: 1,
        eventDetails: 1,
        apiDetails: 1,
        communityDataDetails: 1,
        core_features: 1, // Include if some datasets (like app ideas) still use this
        score: { $meta: 'vectorSearchScore' } 
      }
    }
  ]).toArray() as DatasetDocument[]; 
  console.log(`Found ${searchResults.length} resources from 'datasets' collection via vector search.`);

  let topMatchForAI: { name: string, description: string } | null = null;
  if (searchResults.length > 0 && searchResults[0]) {
    const topHit = searchResults[0];
    // Construct a simple object for getAIFeedback, which expects name and description
    topMatchForAI = { 
      name: topHit.name, 
      description: typeof topHit.description === 'string' ? topHit.description : 'No description available.'
    };
  }
  const aiFeedback = await getAIFeedback(vibeText, topMatchForAI);

  const messageBase = "Vibe processed.";
  const messageDetail = searchResults.length > 0 ? "Resources found." : "No direct resource matches found.";

  return res.status(200).json({
    message: `${messageBase} ${messageDetail}`,
    vibeText,
    vibeEmbeddingDimensions: vibeEmbedding.length,
    results: searchResults, // Consolidated results
    aiFeedback,
  });
}));

export default router;
