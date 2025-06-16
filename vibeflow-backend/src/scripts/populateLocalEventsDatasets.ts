import { MongoClient, ObjectId } from 'mongodb';
import { getTextEmbedding } from '../services/aiService';
import { config } from '../config';

export interface DatasetResource {
  _id?: ObjectId; // MongoDB ObjectId
  id: string; // Custom unique ID for our reference, e.g., 'evt_001', 'api_001'
  name: string;
  description: string;
  resourceType: 'Local Event' | 'API' | 'Community Data Source' | 'Public Dataset' | 'Other';

  // Common metadata fields
  sourceUrl?: string;
  originalSourceName?: string;
  categories: string[];
  keywords: string[];
  dataFormat?: string[];
  updateFrequency?: string;
  license?: string;
  potentialUseCases?: string[];
  sampleDataSnippet?: any;

  // Fields specific to 'Local Event' type
  eventDetails?: {
    type: string;
    date: string; // ISO Date string
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

  // Fields specific to 'API' type
  apiDetails?: {
    documentationUrl: string;
    endpointExample?: string;
    pricingModel?: string;
  };

  // Fields specific to 'Community Data Source' type
  communityDataDetails?: {
    dataType: string;
    locationFocus?: string;
    keyInsights?: string[];
    collectionDate?: string; // ISO Date string
  };
  
  // VibeFlow specific admin fields
  dateAddedToVibeflow?: Date;
  lastVerifiedByVibeflow?: Date;
  notesForVibeflowAdmin?: string;

  // Embedding
  vectorEmbeddingSourceFields: Array<keyof Omit<DatasetResource, '_id' | 'id' | 'description_embedding' | 'dateAddedToVibeflow' | 'lastVerifiedByVibeflow' | 'notesForVibeflowAdmin' | 'sampleDataSnippet' | 'eventDetails' | 'apiDetails' | 'communityDataDetails' | 'vectorEmbeddingSourceFields'>>;
  description_embedding?: number[];
}

// Transformed Sample Data (using the new DatasetResource interface)
// Please transform your other existing samples (evt_002, evt_003, api_002, ces_002) similarly.

const sampleResources: DatasetResource[] = [
  // Example Local Event
  {
    id: 'evt_001',
    name: 'Summer Sounds Music Fest',
    description: 'Annual outdoor music festival featuring diverse local and regional bands. Food trucks and family activities available.',
    resourceType: 'Local Event',
    sourceUrl: 'https://example.com/events/summer-sounds',
    originalSourceName: 'Springfield City Events Portal',
    categories: ['Events', 'Music', 'Community', 'Family', 'Outdoor Activities'],
    keywords: ['live music', 'outdoor', 'family-friendly', 'summer', 'festival', 'Springfield IL', 'concert'],
    dataFormat: ['Website Listing'],
    updateFrequency: 'Annually (for this specific event), Varies (for portal)',
    license: 'Information Purpose Only',
    potentialUseCases: ["Finding local music events", "Planning family outings in Springfield"],
    sampleDataSnippet: { eventName: 'Summer Sounds Music Fest', date: '2024-07-20', city: 'Springfield' },
    eventDetails: {
      type: 'Music Festival',
      date: '2024-07-20T00:00:00.000Z',
      time: '2:00 PM - 10:00 PM',
      location: { venueName: 'Greenwood Park Amphitheater', city: 'Springfield', state: 'IL', coordinates: { lat: 39.7817, lon: -89.6501 } },
      organizer: 'Springfield City Council',
      imageUrl: 'https://example.com/images/summer_sounds.jpg',
    },
    vectorEmbeddingSourceFields: ['name', 'description', 'resourceType', 'categories', 'keywords', 'potentialUseCases'],
  },
  // Example API
  {
    id: 'api_001',
    name: 'OpenStreetMap Nominatim API',
    description: 'Provides geocoding (address to coordinates) and reverse geocoding (coordinates to address) services based on OpenStreetMap data.',
    resourceType: 'API',
    sourceUrl: 'https://nominatim.org/release-docs/latest/', // This is more of a documentation URL
    originalSourceName: 'OpenStreetMap',
    categories: ['Location', 'Mapping', 'Geocoding', 'Technology', 'Open Data'],
    keywords: ['geocoding', 'reverse geocoding', 'maps', 'location', 'openstreetmap', 'free api', 'address lookup'],
    dataFormat: ['JSON API', 'XML API'],
    updateFrequency: 'Continuously Updated (OSM data)',
    license: 'Open Data Commons Open Database License (ODbL)',
    potentialUseCases: [
      'Converting user-entered addresses to map coordinates for event locations.',
      'Finding nearby points of interest for an event.',
      'Displaying events on a map.',
      'Powering location-aware features in apps.',
    ],
    sampleDataSnippet: { query: '1600 Amphitheatre Parkway, Mountain View, CA', result_type: 'address' },
    apiDetails: {
      documentationUrl: 'https://nominatim.org/release-docs/latest/',
      endpointExample: 'https://nominatim.openstreetmap.org/search?q=1600+Amphitheatre+Parkway,+Mountain+View,+CA&format=json',
      pricingModel: 'Free (rate limits apply)',
    },
    vectorEmbeddingSourceFields: ['name', 'description', 'resourceType', 'categories', 'keywords', 'potentialUseCases'],
  },
  // Example Community Data Source
  {
    id: 'ces_001',
    name: 'Springfield Community Voice Survey 2023',
    description: 'Annual survey conducted by the city to gather resident feedback on local services, community needs, and future development.',
    resourceType: 'Community Data Source',
    originalSourceName: 'City of Springfield',
    categories: ['Community', 'Government', 'Surveys', 'Demographics', 'Civic Engagement'],
    keywords: ['community feedback', 'resident survey', 'Springfield IL', 'local government', 'public services', 'civic data'],
    dataFormat: ['Survey Report (PDF)', 'Aggregated Data Tables'],
    updateFrequency: 'Annually',
    license: 'Public Record',
    potentialUseCases: [
        "Understanding local needs for event planning", 
        "Identifying community interests for new programs",
        "Gauging public opinion on city initiatives"
    ],
    sampleDataSnippet: { surveyTopic: 'Public Spaces', keyFinding: 'Demand for more parks' },
    communityDataDetails: {
      dataType: 'Survey Results',
      locationFocus: 'Springfield (City-wide)',
      keyInsights: [
        'Increased demand for family-friendly outdoor events.',
        'Interest in more cultural festivals.',
        'Need for better promotion of local workshops.',
      ],
      collectionDate: '2023-11-01T00:00:00.000Z',
    },
    vectorEmbeddingSourceFields: ['name', 'description', 'resourceType', 'categories', 'keywords', 'potentialUseCases'],
  },
  // TODO: Add your other transformed samples here (evt_002, evt_003, api_002, ces_002)
];

// Helper function to construct text for embedding
function constructEmbeddingTextFromResource(item: DatasetResource): string {
  const textParts: string[] = [];

  // Add fields specified in vectorEmbeddingSourceFields
  item.vectorEmbeddingSourceFields.forEach(fieldKey => {
    const value = item[fieldKey as keyof DatasetResource];
    if (value) {
      if (Array.isArray(value)) {
        textParts.push((value as string[]).join(', '));
      } else {
        textParts.push(String(value));
      }
    }
  });

  // Optionally, add specific details from nested objects if not covered or need special formatting
  if (item.resourceType === 'Local Event' && item.eventDetails) {
    textParts.push(`Event Type: ${item.eventDetails.type}`);
    textParts.push(`Location: ${item.eventDetails.location.venueName || item.eventDetails.location.address}, ${item.eventDetails.location.city}`);
    if (item.eventDetails.organizer) textParts.push(`Organizer: ${item.eventDetails.organizer}`);
  }
  if (item.resourceType === 'API' && item.apiDetails) {
    if (item.apiDetails.pricingModel) textParts.push(`Pricing: ${item.apiDetails.pricingModel}`);
  }
  if (item.resourceType === 'Community Data Source' && item.communityDataDetails) {
    textParts.push(`Data Type: ${item.communityDataDetails.dataType}`);
    if (item.communityDataDetails.keyInsights) textParts.push(`Key Insights: ${item.communityDataDetails.keyInsights.join(', ')}`);
  }

  return textParts.filter(part => part && part.trim() !== '').join('; ');
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
    const database = client.db('vibeflow_db'); 
    const datasetsCollection = database.collection<DatasetResource>('datasets');

    console.log(`Preparing to seed ${sampleResources.length} resources into 'vibeflow_db.datasets' collection...`);

    for (const resource of sampleResources) {
      const textToEmbed = constructEmbeddingTextFromResource(resource);
      console.log(`Resource: ${resource.name} (Type: ${resource.resourceType}) - Text to embed (first 100 chars): "${textToEmbed.substring(0,100)}..."`);
      
      const embedding = await getTextEmbedding(textToEmbed);
      
      const documentToUpsert: DatasetResource = {
        ...resource, // Spread the initial resource data
        _id: new ObjectId(), // Generate new ObjectId for each insert if not managing them via 'id' for upsert
        dateAddedToVibeflow: new Date(),
        lastVerifiedByVibeflow: new Date(),
      };

      if (embedding) {
        documentToUpsert.description_embedding = embedding;
        console.log(`  Generated embedding for: ${resource.name}`);
      } else {
        console.warn(`  Could not generate embedding for: ${resource.name}. Skipping embedding for this item.`);
      }
      
      // Upsert based on the custom 'id' field to avoid duplicates if script is run multiple times
      // This assumes 'id' is a unique business key for your resources.
      await datasetsCollection.updateOne(
        { id: resource.id }, // Filter by your custom 'id'
        { $set: documentToUpsert }, // Set all fields, including the new/updated ones
        { upsert: true } // Create if not exists, update if exists
      );
      console.log(`  Upserted resource: ${resource.name} (ID: ${resource.id})`);
    }

    console.log("Database seeding process completed for 'datasets' collection.");

  } catch (err) {
    console.error('Error during database seeding:', err);
  } finally {
    console.log("Closing MongoDB connection.");
    await client.close();
  }
}

// To run this script directly (e.g., using ts-node):
// 1. Ensure MONGODB_URI and GEMINI_API_KEY are set in your environment or .env file loaded by 'config'.
// 2. Transform ALL your original sample data (evt_002, evt_003, api_002, ces_002) into the new DatasetResource format and add them to the `sampleResources` array.
// 3. Run from the vibeflow-backend directory: `ts-node src/scripts/populateLocalEventsDatasets.ts`
seedDatabase().catch(console.error);


/*
// Original Sample Data (for your reference to transform into DatasetResource format)

export const originalSampleLocalEvents = [
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
  },
  {
    id: 'evt_002',
    eventName: 'Downtown Art Walk',
    // ... other fields
  },
  {
    id: 'evt_003',
    eventName: 'Tech Meetup: AI in Everyday Life',
    // ... other fields
  }
];

export const originalSampleLocationApis = [
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
  },
  {
    id: 'api_002',
    apiName: 'WeatherAPI.com',
    // ... other fields
  },
];

export const originalSampleCommunityEngagementSources = [
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
  },
  {
    id: 'ces_002',
    sourceName: 'Local Park Usage Analysis Q2 2024',
    // ... other fields
  },
];
*/
