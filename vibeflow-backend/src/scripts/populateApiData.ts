import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { getTextEmbedding } from '../services/aiService'; // Assuming aiService is in the parent directory

dotenv.config({ path: '../../.env' }); // Adjust path to .env if necessary

const MONGODB_URI = process.env.MONGODB_URI_VIBEFLOW;
const DB_NAME = 'vibeflow_db';
const COLLECTION_NAME = 'apis';

// Interface for the data structure stored in MongoDB
interface ApiDocument {
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
  description_embedding: number[]; // Embedding is required in the DB document
}

// Interface for the initial seed data (before embedding is generated)
interface ApiSeedData {
  name: string;
  description: string; // Explicitly string
  category: string;
  documentation_url: string;
  base_url?: string;
  authentication_type?: string;
  common_use_cases?: string[];
  keywords?: string[];
  sample_endpoint?: string;
  sample_response_snippet?: string;
}

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI_VIBEFLOW is not defined in the .env file');
}

const apisToInsert: ApiSeedData[] = [
  {
    name: 'Google Maps JavaScript API',
    description: 'Allows embedding customizable maps, adding markers, drawing shapes, and accessing location-based services like directions and places.',
    category: 'Mapping / Geolocation',
    documentation_url: 'https://developers.google.com/maps/documentation/javascript/overview',
    base_url: 'https://maps.googleapis.com/maps/api/', // Base for related REST APIs, JS API is client-side
    authentication_type: 'API Key',
    common_use_cases: ['Displaying maps on a website', 'Showing business locations', 'Calculating routes', 'Geocoding addresses'],
    keywords: ['maps', 'google maps', 'geolocation', 'directions', 'places', 'mapping'],
    sample_endpoint: 'Client-side JavaScript library, not a direct REST endpoint for this specific API.',
    sample_response_snippet: 'N/A (Client-side library)',
    // description_embedding will be generated
  },
  {
    name: 'Public APIs (GitHub Project)',
    description: 'A collective list of free APIs for use in software and web development. A community-driven catalog of publicly available APIs.',
    category: 'Developer Tools / API Directory',
    documentation_url: 'https://github.com/public-apis/public-apis', // Link to the GitHub project
    base_url: 'N/A (Directory)',
    authentication_type: 'Varies per API listed',
    common_use_cases: ['Discovering free APIs for projects', 'Finding APIs for specific categories like weather, finance, etc.'],
    keywords: ['public apis', 'free apis', 'api directory', 'developer resources', 'open apis'],
    sample_endpoint: 'N/A (Directory)',
    sample_response_snippet: 'N/A (Directory)',
    // description_embedding will be generated
  },
];

async function populateApis() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Optional: Clear existing documents in the collection
    // await collection.deleteMany({});
    // console.log('Cleared existing documents in the apis collection.');

    const operations = [];

    for (const api of apisToInsert) {
      // The 'api' object conforms to ApiSeedData, where 'description' is a required string.
      // This runtime check is primarily for empty strings.
      if (!api.description || api.description.trim() === '') {
        console.error(`Description for API ${api.name} is missing or empty. Skipping embedding generation.`);
        continue; // Skip this API if description is invalid
      }
      
      // At this point, api.description is guaranteed by the check above and the ApiSeedData interface
      // to be a non-empty string.
      const descriptionToEmbed = api.description; // Assign to a new variable

      console.log(`Generating embedding for: ${api.name}`);
      const embedding = await getTextEmbedding(descriptionToEmbed); 
      
      if (embedding) {
        operations.push({
          insertOne: {
            document: {
              ...api, // Spreads properties from ApiSeedData
              description_embedding: embedding, // Adds the generated embedding
            } as ApiDocument, // Asserts that the final object matches ApiDocument
          },
        });
        console.log(`Embedding generated for: ${api.name}`);
      } else {
        console.error(`Could not generate embedding for ${api.name}. Skipping.`);
      }
    }

    if (operations.length > 0) {
      const result = await collection.bulkWrite(operations);
      console.log(`${result.insertedCount} documents inserted successfully into ${COLLECTION_NAME}.`);
    } else {
      console.log('No new API documents to insert.');
    }

  } catch (error) {
    console.error('Error populating API data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

populateApis();
