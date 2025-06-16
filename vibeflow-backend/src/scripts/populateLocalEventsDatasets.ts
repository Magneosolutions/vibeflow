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
  vectorEmbeddingSourceFields: (keyof Omit<LocalEvent, 'id' | 'vectorEmbeddingSourceFields' | 'imageUrl' | 'sourceUrl' | 'coordinates'>)[];
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
  vectorEmbeddingSourceFields: (keyof Omit<LocationApi, 'id' | 'vectorEmbeddingSourceFields' | 'endpointExample' | 'documentationUrl'>)[];
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
  vectorEmbeddingSourceFields: (keyof Omit<CommunityEngagementData, 'id' | 'vectorEmbeddingSourceFields' | 'collectionDate'>)[];
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

// Example of how you might use this data in a seeding script:
// import { MongoClient } from 'mongodb';
// import { sampleLocalEvents, sampleLocationApis, sampleCommunityEngagementSources } from './populateLocalEventsDatasets';

// async function seedDatabase() {
//   const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibeflow';
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const database = client.db('vibeflow_data'); // Or your specific DB name

//     const eventsCollection = database.collection('localEvents');
//     const apisCollection = database.collection('locationApis');
//     const communityDataCollection = database.collection('communityEngagementData');

//     // Clear existing data (optional)
//     // await eventsCollection.deleteMany({});
//     // await apisCollection.deleteMany({});
//     // await communityDataCollection.deleteMany({});

//     // Insert new data
//     // Note: In a real scenario, you'd generate vector embeddings here before insertion
//     // For now, we're just inserting the data as is.
//     if (sampleLocalEvents.length > 0) {
//       await eventsCollection.insertMany(sampleLocalEvents.map(e => ({ ...e, _id: e.id })));
//       console.log(`${sampleLocalEvents.length} local events seeded.`);
//     }
//     if (sampleLocationApis.length > 0) {
//       await apisCollection.insertMany(sampleLocationApis.map(a => ({ ...a, _id: a.id })));
//       console.log(`${sampleLocationApis.length} location APIs seeded.`);
//     }
//     if (sampleCommunityEngagementSources.length > 0) {
//       await communityDataCollection.insertMany(sampleCommunityEngagementSources.map(c => ({ ...c, _id: c.id })));
//       console.log(`${sampleCommunityEngagementSources.length} community engagement sources seeded.`);
//     }

//   } catch (err) {
//     console.error('Error seeding database:', err);
//   } finally {
//     await client.close();
//   }
// }

// // seedDatabase(); // Uncomment to run directly
