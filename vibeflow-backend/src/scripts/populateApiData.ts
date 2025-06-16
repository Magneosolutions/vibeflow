import { MongoClient } from 'mongodb';
import { config } from '../config';
import { getTextEmbedding } from '../services/aiService';

const MONGODB_URI = config.mongoURI;
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

// Type guard to ensure a value is a non-empty string
function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

// MongoDB URI validation is already handled in config/index.ts

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
  {
    name: 'Awesome Public Datasets (GitHub)',
    description: 'A curated list of topic-centric public datasets. Discover high-quality open datasets from various domains like agriculture, biology, economics, education, finance, and more.',
    category: 'Dataset Directory',
    documentation_url: 'https://github.com/awesomedata/awesome-public-datasets',
    base_url: 'N/A (Directory)',
    authentication_type: 'N/A (Links to external datasets)',
    common_use_cases: ['Finding open datasets for data analysis', 'Discovering data for machine learning projects', 'Exploring publicly available information across diverse fields'],
    keywords: ['public datasets', 'open data', 'dataset catalog', 'data science resources', 'awesome list', 'curated datasets'],
    sample_endpoint: 'N/A (Directory of datasets)',
    sample_response_snippet: 'N/A (Directory of datasets)',
    // description_embedding will be generated
  },
];

async function populateApis() {
  const client = new MongoClient(MONGODB_URI!);

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
      // Use the type guard here
      if (!isNonEmptyString(api.description)) {
        console.error(`Description for API ${api.name} is missing, empty, or not a string. Skipping embedding generation.`);
        continue; // Skip this API if description is invalid
      }
      
      // At this point, api.description is guaranteed by the type guard to be a non-empty string.
      // TypeScript should now correctly infer its type.
      console.log(`Generating embedding for: ${api.name}`);
      const embedding = await getTextEmbedding(api.description); 
      
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
