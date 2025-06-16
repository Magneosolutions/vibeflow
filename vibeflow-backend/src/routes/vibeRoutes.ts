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
  _id?: ObjectId; 
  id: string; 
  name: string;
  description: string;
  resourceType: 'Local Event' | 'API' | 'Community Data Source' | 'Public Dataset' | 'Other';

  sourceUrl?: string;
  originalSourceName?: string;
  categories: string[]; 
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
  score?: number; 
  core_features?: string[]; 
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

  const datasetsCollection = getCollection<DatasetDocument>('datasets');
  
  const initialLimit = 10; // Fetch a slightly larger pool for potential filtering
  const searchResults = await datasetsCollection.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index_datasets_description', 
        path: 'description_embedding', 
        queryVector: vibeEmbedding,    
        numCandidates: 150, 
        limit: initialLimit, 
      },
    },
    {
      $project: { 
        _id: 0, 
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
        core_features: 1,
        score: { $meta: 'vectorSearchScore' } 
      }
    }
  ]).toArray() as DatasetDocument[]; 
  console.log(`Found ${searchResults.length} initial resources from 'datasets' collection via vector search.`);

  let finalResults: DatasetDocument[] = [];
  const desiredResultCount = 5;

  if (vibeText.toLowerCase().includes('event')) {
    console.log("Query indicates interest in events. Prioritizing 'Local Event' type.");
    const eventResults = searchResults.filter(r => r.resourceType === 'Local Event');
    const otherResults = searchResults.filter(r => r.resourceType !== 'Local Event');
    
    finalResults = [...eventResults, ...otherResults].slice(0, desiredResultCount);
    
    if (eventResults.length > 0) {
      console.log(`Prioritized event results. Showing ${eventResults.filter(r => r.resourceType === 'Local Event').length} local events out of ${finalResults.length} total results.`);
    } else {
      console.log("No 'Local Event' type found in initial results, showing top vector search results based on score.");
    }
  } else {
    finalResults = searchResults.slice(0, desiredResultCount);
  }
  
  console.log(`Final result count: ${finalResults.length}`);

  let topMatchForAI: { name: string, description: string } | null = null;
  const feedbackCandidate = finalResults.length > 0 ? finalResults[0] : (searchResults.length > 0 ? searchResults[0] : null);

  if (feedbackCandidate) {
    topMatchForAI = { 
      name: feedbackCandidate.name, 
      description: typeof feedbackCandidate.description === 'string' ? feedbackCandidate.description : 'No description available.'
    };
  }
  const aiFeedback = await getAIFeedback(vibeText, topMatchForAI);

  const messageBase = "Vibe processed.";
  const messageDetail = finalResults.length > 0 ? "Resources found." : "No direct resource matches found.";

  return res.status(200).json({
    message: `${messageBase} ${messageDetail}`,
    vibeText,
    vibeEmbeddingDimensions: vibeEmbedding.length,
    results: finalResults,
    aiFeedback,
  });
}));

export default router;
