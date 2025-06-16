export interface LocalEvent {
  id: string;
  eventName: string;
  eventType: string; // e.g., "Music", "Festival", "Workshop", "Community"
  description: string;
  date: string; // ISO Date string
  time?: string; // e.g., "7:00 PM - 10:00 PM"
  location: {
    address?: string;
    city: string;
    state: string;
    zip?: string;
    venueName?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  organizer?: string;
  tags: string[]; // e.g., ["live music", "family-friendly", "outdoor"]
  sourceUrl?: string;
  imageUrl?: string;
  // Fields to be combined for vector embedding
  vectorEmbeddingSourceFields: (keyof Omit<LocalEvent, 'id' | 'vectorEmbeddingSourceFields' | 'imageUrl' | 'sourceUrl' | 'coordinates' | 'embedding'>)[];
  embedding?: number[];
}

export interface LocationApi {
  id: string;
  apiName: string;
  description: string;
  useCases: string[];
  documentationUrl: string;
  endpointExample?: string;
  pricingModel?: string; // e.g., "Free", "Freemium", "Paid"
  tags: string[];
  // Fields to be combined for vector embedding
  vectorEmbeddingSourceFields: (keyof Omit<LocationApi, 'id' | 'vectorEmbeddingSourceFields' | 'endpointExample' | 'documentationUrl' | 'embedding'>)[];
  embedding?: number[];
}

export interface CommunityEngagementData {
  id: string;
  sourceName: string; // e.g., "City Park Activities Survey"
  description: string;
  dataType: string; // e.g., "Survey Results", "Social Media Sentiment", "Forum Discussion Analysis"
  locationFocus: string; // e.g., "Willow Creek Park", "Downtown District"
  keyInsights: string[];
  relevantTopics: string[];
  collectionDate?: string; // ISO Date string
  // Fields to be combined for vector embedding
  vectorEmbeddingSourceFields: (keyof Omit<CommunityEngagementData, 'id' | 'vectorEmbeddingSourceFields' | 'collectionDate' | 'embedding'>)[];
  embedding?: number[];
}

export const sampleLocalEvents: LocalEvent[] = [
  {
    id: 'evt_001',
    eventName: 'Summer Sounds Music Fest',
    eventType: 'Music Festival',
    description: 'Annual outdoor music festival featuring diverse local and regional bands. Food trucks and family activities available.',
    date: '2024-07-20T00:00:00.000Z',
    time: '2:00 PM - 10:00 PM',
    location: {
      venueName: 'Greenwood Park Amphitheater',
      city: 'Springfield',
      state: 'IL',
      coordinates: { lat: 39.7817, lon: -89.6501 },
    },
    organizer: 'Springfield City Council',
    tags: ['live music', 'outdoor', 'family-friendly', 'summer', 'festival'],
    imageUrl: 'https://example.com/images/summer_sounds.jpg',
    sourceUrl: 'https://example.com/events/summer-sounds',
    vectorEmbeddingSourceFields: ['eventName', 'eventType', 'description', 'tags', 'organizer'],
  },
  {
    id: 'evt_002',
    eventName: 'Downtown Art Walk',
    eventType: 'Art & Culture',
    description: 'Explore local art galleries and studios. Meet artists and enjoy live demonstrations.',
    date: '2024-08-05T00:00:00.000Z',
    time: '6:00 PM - 9:00 PM',
    location: {
      address: 'Main Street Corridor',
      city: 'Springfield',
      state: 'IL',
    },
    tags: ['art', 'gallery', 'local artists', 'culture', 'community'],
    vectorEmbeddingSourceFields: ['eventName', 'eventType', 'description', 'tags'],
  },
  {
    id: 'evt_003',
    eventName: 'Tech Meetup: AI in Everyday Life',
    eventType: 'Workshop & Networking',
    description: 'Monthly tech meetup discussing the latest trends in AI and its practical applications. Networking session included.',
    date: '2024-07-15T00:00:00.000Z',
    time: '7:00 PM - 9:00 PM',
    location: {
      venueName: 'Innovation Hub Springfield',
      address: '123 Tech Avenue',
      city: 'Springfield',
      state: 'IL',
    },
    organizer: 'Springfield Tech Community',
    tags: ['technology', 'ai', 'networking', 'workshop', 'innovation'],
    sourceUrl: 'https://example.com/meetups/ai-july',
    vectorEmbeddingSourceFields: ['eventName', 'eventType', 'description', 'tags', 'organizer'],
  }
];

export const sampleLocationApis: LocationApi[] = [
  {
    id: 'api_001',
    apiName: 'OpenStreetMap Nominatim API',
    description: 'Provides geocoding (address to coordinates) and reverse geocoding (coordinates to address) services based on OpenStreetMap data.',
    useCases: [
      'Converting user-entered addresses to map coordinates for event locations.',
      'Finding nearby points of interest for an event.',
      'Displaying events on a map.',
    ],
    documentationUrl: 'https://nominatim.org/release-docs/latest/',
    endpointExample: 'https://nominatim.openstreetmap.org/search?q=1600+Amphitheatre+Parkway,+Mountain+View,+CA&format=json',
    pricingModel: 'Free (rate limits apply)',
    tags: ['geocoding', 'reverse geocoding', 'maps', 'location', 'openstreetmap', 'free'],
    vectorEmbeddingSourceFields: ['apiName', 'description', 'useCases', 'tags', 'pricingModel'],
  },
  {
    id: 'api_002',
    apiName: 'WeatherAPI.com',
    description: 'Provides real-time and forecast weather data for locations worldwide.',
    useCases: [
      'Displaying current weather for an event location.',
      'Alerting users to potential weather impacts on outdoor events.',
      'Helping users plan based on weather forecasts.',
    ],
    documentationUrl: 'https://www.weatherapi.com/docs/',
    endpointExample: 'https://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London',
    pricingModel: 'Freemium (free tier available)',
    tags: ['weather', 'forecast', 'real-time data', 'location', 'events'],
    vectorEmbeddingSourceFields: ['apiName', 'description', 'useCases', 'tags', 'pricingModel'],
  },
];

export const sampleCommunityEngagementSources: CommunityEngagementData[] = [
  {
    id: 'ces_001',
    sourceName: 'Springfield Community Voice Survey 2023',
    description: 'Annual survey conducted by the city to gather resident feedback on local services, community needs, and future development.',
    dataType: 'Survey Results',
    locationFocus: 'Springfield (City-wide)',
    keyInsights: [
      'Increased demand for family-friendly outdoor events.',
      'Interest in more cultural festivals.',
      'Need for better promotion of local workshops.',
    ],
    relevantTopics: ['community events', 'public spaces', 'cultural activities', 'local government'],
    collectionDate: '2023-11-01T00:00:00.000Z',
    vectorEmbeddingSourceFields: ['sourceName', 'description', 'dataType', 'keyInsights', 'relevantTopics'],
  },
  {
    id: 'ces_002',
    sourceName: 'Local Park Usage Analysis Q2 2024',
    description: 'Analysis of visitor data and social media mentions related to major city parks to understand usage patterns and popular activities.',
    dataType: 'Usage Data & Social Media Analysis',
    locationFocus: 'Major City Parks in Springfield',
    keyInsights: [
      'Weekend mornings are peak times for park visits.',
      'Picnics and casual sports are popular activities.',
      'Positive sentiment around well-maintained green spaces.',
    ],
    relevantTopics: ['parks', 'recreation', 'public health', 'social media trends', 'urban planning'],
    vectorEmbeddingSourceFields: ['sourceName', 'description', 'dataType', 'keyInsights', 'relevantTopics'],
  },
];

import { MongoClient } from 'mongodb';
import { getTextEmbedding } from '../services/aiService'; // Assuming aiService is in src/services
import { config } from '../config'; // To access MONGODB_URI if needed

// Helper function to construct text for embedding
function constructEmbeddingText<T extends { vectorEmbeddingSourceFields: (keyof any)[] }>(
  item: T,
  fields: (keyof T)[]
): string {
  return fields
    .map(field => {
      const value = item[field];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      if (typeof value === 'object' && value !== null) {
        // For simple location objects, you might want to stringify them or pick specific sub-fields
        // For this generic helper, we'll stringify, but specific handling might be better
        return JSON.stringify(value);
      }
      return String(value);
    })
    .join('; ');
}


async function seedDatabase() {
  if (!config.mongoURI) {
    console.error("MONGODB_URI is not defined in environment variables. Exiting.");
    process.exit(1);
  }
  if (!config.geminiApiKey) {
    console.error("GEMINI_API_KEY is not defined in environment variables. Cannot generate embeddings. Exiting.");
    process.exit(1);
  }

  const client = new MongoClient(config.mongoURI);
  console.log("Attempting to connect to MongoDB...");

  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");
    const database = client.db('vibeflow_db'); // Changed to vibeflow_db

    const eventsCollection = database.collection<LocalEvent>('localEvents');
    const apisCollection = database.collection<LocationApi>('locationApis');
    const communityDataCollection = database.collection<CommunityEngagementData>('communityEngagementData');

    console.log("Preparing to seed localEvents...");
    for (const event of sampleLocalEvents) {
      const textToEmbed = constructEmbeddingText(event, event.vectorEmbeddingSourceFields as (keyof LocalEvent)[]);
      console.log(`LocalEvent: ${event.eventName} - Text to embed: "${textToEmbed.substring(0,100)}..."`);
      const embedding = await getTextEmbedding(textToEmbed);
      if (embedding) {
        event.embedding = embedding;
        // Use MongoDB's _id for the document ID, map your 'id' to another field if needed or ensure it's unique
        await eventsCollection.updateOne({ id: event.id }, { $set: event }, { upsert: true });
        console.log(`  Upserted event: ${event.eventName} with embedding.`);
      } else {
        console.warn(`  Could not generate embedding for event: ${event.eventName}. Skipping embedding for this item.`);
        await eventsCollection.updateOne({ id: event.id }, { $set: { ...event, embedding: undefined } }, { upsert: true });
      }
    }
    console.log(`${sampleLocalEvents.length} local events processed.`);

    console.log("Preparing to seed locationApis...");
    for (const api of sampleLocationApis) {
      const textToEmbed = constructEmbeddingText(api, api.vectorEmbeddingSourceFields as (keyof LocationApi)[]);
      console.log(`LocationApi: ${api.apiName} - Text to embed: "${textToEmbed.substring(0,100)}..."`);
      const embedding = await getTextEmbedding(textToEmbed);
      if (embedding) {
        api.embedding = embedding;
        await apisCollection.updateOne({ id: api.id }, { $set: api }, { upsert: true });
        console.log(`  Upserted API: ${api.apiName} with embedding.`);
      } else {
        console.warn(`  Could not generate embedding for API: ${api.apiName}. Skipping embedding for this item.`);
        await apisCollection.updateOne({ id: api.id }, { $set: { ...api, embedding: undefined } }, { upsert: true });
      }
    }
    console.log(`${sampleLocationApis.length} location APIs processed.`);

    console.log("Preparing to seed communityEngagementData...");
    for (const source of sampleCommunityEngagementSources) {
      const textToEmbed = constructEmbeddingText(source, source.vectorEmbeddingSourceFields as (keyof CommunityEngagementData)[]);
      console.log(`CommunityData: ${source.sourceName} - Text to embed: "${textToEmbed.substring(0,100)}..."`);
      const embedding = await getTextEmbedding(textToEmbed);
      if (embedding) {
        source.embedding = embedding;
        await communityDataCollection.updateOne({ id: source.id }, { $set: source }, { upsert: true });
        console.log(`  Upserted community source: ${source.sourceName} with embedding.`);
      } else {
        console.warn(`  Could not generate embedding for community source: ${source.sourceName}. Skipping embedding for this item.`);
        await communityDataCollection.updateOne({ id: source.id }, { $set: { ...source, embedding: undefined } }, { upsert: true });
      }
    }
    console.log(`${sampleCommunityEngagementSources.length} community engagement sources processed.`);

    console.log("Database seeding process completed.");

  } catch (err) {
    console.error('Error during database seeding:', err);
  } finally {
    console.log("Closing MongoDB connection.");
    await client.close();
  }
}

// To run this script directly (e.g., using ts-node):
// Ensure MONGODB_URI and GEMINI_API_KEY are set in your environment or .env file loaded by 'config'.
seedDatabase().catch(console.error);
