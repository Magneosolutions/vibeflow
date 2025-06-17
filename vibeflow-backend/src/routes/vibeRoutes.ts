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
  enhanced_embedding?: number[];
  source_url?: string;
  category?: string[];
  keywords?: string[];
  sample_data_snippet?: any;
  potential_use_cases?: string[];
  core_features?: string[];
  target_audience?: string;
  complexity_rating?: string;
  monetization_ideas?: string[];
  generated_by_ai?: boolean;
  date_added_to_vibeflow?: Date;
  last_verified_by_vibeflow?: Date;
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

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Search datasets with corrected pipeline order
 */
const searchDatasetsWithFallbacks = async (vibeEmbedding: number[], datasetsCollection: any) => {
  console.log(`[vibeRoutes] Starting dataset search with embedding dimensions: ${vibeEmbedding.length}`);
  
  let searchResults: DatasetDocument[] = [];
  
  // Strategy 1: Try enhanced embeddings if available
  try {
    console.log(`[vibeRoutes] Checking for enhanced embeddings...`);
    
    const enhancedCount = await datasetsCollection.countDocuments({
      enhanced_embedding: { $exists: true, $ne: null, $not: { $size: 0 } },
      category: "Playground App Idea"
    });
    
    console.log(`[vibeRoutes] Playground App Ideas with enhanced embeddings: ${enhancedCount}`);
    
    if (enhancedCount > 0) {
      // FIXED: $vectorSearch must be FIRST, then filter with $match
      searchResults = await datasetsCollection.aggregate([
        {
          $vectorSearch: {
            index: 'vector_index_datasets_enhanced',
            path: 'enhanced_embedding',
            queryVector: vibeEmbedding,
            numCandidates: 150, // Increased to account for filtering
            limit: 20, // Get more results before filtering
          },
        },
        {
          $match: {
            enhanced_embedding: { $exists: true, $ne: null },
            category: "Playground App Idea" // Filter AFTER vector search
          }
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
            target_audience: 1,
            complexity_rating: 1,
            monetization_ideas: 1,
            score: { $meta: 'vectorSearchScore' }
          }
        },
        {
          $limit: 5 // Final limit after filtering
        }
      ]).toArray();
      
      console.log(`[vibeRoutes] Enhanced embedding search returned ${searchResults.length} results`);
      
      if (searchResults.length > 0) {
        console.log(`[vibeRoutes] Top enhanced result: "${searchResults[0].name}" with score: ${searchResults[0].score}`);
      }
    }
  } catch (enhancedError) {
    const errorMessage = enhancedError instanceof Error ? enhancedError.message : String(enhancedError);
    console.log(`[vibeRoutes] Enhanced embedding search failed, trying fallback:`, errorMessage);
    searchResults = [];
  }
  
  // Strategy 2: Fallback to description embeddings
  if (searchResults.length === 0 || (searchResults[0]?.score && searchResults[0].score < 0.6)) {
    try {
      console.log(`[vibeRoutes] Using description embedding search...`);
      
      // FIXED: $vectorSearch FIRST, then $match for filtering
      searchResults = await datasetsCollection.aggregate([
        {
          $vectorSearch: {
            index: 'vector_index_datasets_description',
            path: 'description_embedding',
            queryVector: vibeEmbedding,
            numCandidates: 150,
            limit: 20,
          },
        },
        {
          $match: {
            category: "Playground App Idea" // Filter AFTER vector search
          }
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
            target_audience: 1,
            complexity_rating: 1,
            monetization_ideas: 1,
            score: { $meta: 'vectorSearchScore' }
          }
        },
        {
          $limit: 5
        }
      ]).toArray();
      
      console.log(`[vibeRoutes] Description embedding search returned ${searchResults.length} results`);
      
      if (searchResults.length > 0) {
        console.log(`[vibeRoutes] Top description result: "${searchResults[0].name}" with score: ${searchResults[0].score}`);
      }
      
    } catch (descriptionError) {
      const errorMessage = descriptionError instanceof Error ? descriptionError.message : String(descriptionError);
      console.error(`[vibeRoutes] Description embedding search failed:`, errorMessage);
      searchResults = [];
    }
  }

  return searchResults;
};

/**
 * Main vibe processing endpoint
 */
router.post('/process-vibe', asyncHandler(async (req: Request<{}, any, ProcessVibeRequestBody>, res: Response, next: NextFunction) => {
  const { vibeText } = req.body;

  if (!vibeText || typeof vibeText !== 'string' || vibeText.trim() === "") {
    return res.status(400).json({ error: 'vibeText is required and must be a non-empty string.' });
  }

  console.log(`[vibeRoutes] Processing vibe: "${vibeText.substring(0, 100)}..."`);

  // 1. Generate embedding for user's vibe
  const vibeEmbedding = await getTextEmbedding(vibeText);

  if (!vibeEmbedding) {
    console.error(`[vibeRoutes] Failed to generate embedding for vibe text`);
    return res.status(500).json({ error: 'Failed to generate embedding for the vibe text.' });
  }

  console.log(`[vibeRoutes] Generated embedding with ${vibeEmbedding.length} dimensions`);

  // 2. Search datasets (Playground App Ideas)
  const datasetsCollection = getCollection<DatasetDocument>('datasets');
  
  let searchResults: DatasetDocument[] = [];
  try {
    searchResults = await searchDatasetsWithFallbacks(vibeEmbedding, datasetsCollection);
  } catch (searchError) {
    const errorMessage = searchError instanceof Error ? searchError.message : String(searchError);
    console.error(`[vibeRoutes] Dataset search failed:`, errorMessage);
  }

  console.log(`[vibeRoutes] Final dataset search results: ${searchResults.length} datasets found`);

  // 3. Search APIs
  let apiResults: ApiDocument[] = [];
  try {
    console.log(`[vibeRoutes] Searching APIs...`);
    
    const apisCollection = getCollection<ApiDocument>('apis');
    apiResults = await apisCollection.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index_apis_description',
          path: 'description_embedding',
          queryVector: vibeEmbedding,
          numCandidates: 50,
          limit: 3,
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

    console.log(`[vibeRoutes] API search returned ${apiResults.length} results`);
    
  } catch (apiError) {
    const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
    console.error(`[vibeRoutes] API search failed:`, errorMessage);
  }

  // 4. Generate AI feedback based on top dataset match
  let matchedDatasetInfo: { name: string, description: string } | null = null;
  if (searchResults.length > 0 && searchResults[0]) {
    const description = typeof searchResults[0].description === 'string' ? searchResults[0].description : 'No description available.';
    matchedDatasetInfo = { 
      name: searchResults[0].name, 
      description: description
    };
  }

  console.log(`[vibeRoutes] Generating AI feedback...`);
  const aiFeedback = await getAIFeedback(vibeText, matchedDatasetInfo);

  // 5. Construct response
  const messageBase = "Vibe processed.";
  let messageDetail = "";

  if (searchResults.length > 0 && apiResults.length > 0) {
    messageDetail = "Dataset and API matches found.";
  } else if (searchResults.length > 0) {
    messageDetail = "Dataset matches found.";
  } else if (apiResults.length > 0) {
    messageDetail = "API matches found.";
  } else {
    messageDetail = "No matches found.";
  }

  // Return response with proper data structure for frontend
  const response = {
    message: `${messageBase} ${messageDetail}`,
    vibeText,
    vibeEmbeddingDimensions: vibeEmbedding.length,
    searchResults: searchResults.slice(0, 3), // Top 3 app ideas
    apiResults: apiResults.slice(0, 3), // Top 3 APIs
    aiFeedback,
    debug: {
      totalDatasetsFound: searchResults.length,
      totalApisFound: apiResults.length,
      topDatasetScore: searchResults[0]?.score || 0,
      topApiScore: apiResults[0]?.score || 0,
    }
  };

  return res.status(200).json(response);
}));

export default router;