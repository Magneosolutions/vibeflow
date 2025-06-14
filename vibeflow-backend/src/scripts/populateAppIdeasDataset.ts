import { connectDB, getCollection, closeDB } from '../services/mongoService';
import { getTextEmbedding } from '../services/aiService';
import { ObjectId, Document as MongoDocument } from 'mongodb';

// Define an interface for our app idea dataset document for type safety
interface AppIdeaDatasetDocument extends MongoDocument {
  _id?: ObjectId; // Optional because it will be generated on insert
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

const SCRIPT_NAME = 'populateAppIdeasDataset';

const appIdeasData: Omit<AppIdeaDatasetDocument, '_id' | 'description_embedding' | 'date_added_to_vibeflow' | 'last_verified_by_vibeflow'>[] = [
  {
    name: "Community Skill Share",
    description: "A platform for neighbors to offer and find local services or share skills, from dog walking to language tutoring.",
    target_audience: "Local residents, community groups",
    core_features: ["User profiles", "Skill listings", "Search & filter", "In-app messaging", "Review system"],
    monetization_ideas: ["Optional premium listings", "Small commission on paid services"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Community", "Services", "Local"],
    keywords: ["skill share", "local services", "community app", "tutoring", "gig economy"],
    source_url: null,
    sample_data_snippet: { "skill_offered": "Gardening Help", "user": "Jane D.", "rate": "$15/hr", "availability": "Weekends" },
    potential_use_cases: ["Finding local help for small tasks.", "Connecting skilled individuals with those needing services.", "Building community engagement."]
  },
  {
    name: "Sustainable Eats Finder",
    description: "An app that helps users find restaurants and cafes committed to sustainable practices, like using local ingredients or reducing waste.",
    target_audience: "Eco-conscious consumers, foodies",
    core_features: ["Restaurant listings", "Sustainability criteria filter (e.g., local sourcing, vegan options, waste reduction)", "User reviews & ratings", "Map view", "Favorite spots"],
    monetization_ideas: ["Sponsored listings for certified sustainable restaurants", "Affiliate links for sustainable products"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Food & Drink", "Sustainability", "Local Guide"],
    keywords: ["sustainable restaurants", "eco-friendly food", "local food app", "green dining", "ethical eating"],
    source_url: null,
    sample_data_snippet: { "restaurant_name": "Green Leaf Cafe", "sustainability_features": ["Local ingredients", "Composts waste"], "rating": 4.5 },
    potential_use_cases: ["Helping users make sustainable dining choices.", "Promoting local businesses with green practices."]
  },
  {
    name: "Personal Reading Challenge Tracker",
    description: "A motivational app for users to set personal reading goals, track books read, discover new titles, and share progress with friends.",
    target_audience: "Book lovers, students, casual readers",
    core_features: ["Goal setting", "Book logging (manual & ISBN scan)", "Progress tracking", "Wishlist", "Friend activity feed (optional)", "Book recommendations (basic)"],
    monetization_ideas: ["Affiliate links to bookstores", "Premium themes or features"],
    complexity_rating: "Low",
    category: ["Playground App Idea", "Books & Reference", "Productivity", "Social (Light)"],
    keywords: ["reading tracker", "book log", "reading challenge", "goodreads alternative", "personal library"],
    source_url: null,
    sample_data_snippet: { "book_title": "The Midnight Library", "status": "Read", "rating": 5, "date_finished": "2025-05-20" },
    potential_use_cases: ["Encouraging users to read more.", "Helping users organize their reading life.", "Discovering new books through simple recommendations."]
  }
];

const main = async () => {
  console.log(`[${SCRIPT_NAME}] Starting script...`);

  try {
    await connectDB();
    console.log(`[${SCRIPT_NAME}] Connected to MongoDB.`);

    const datasetsCollection = getCollection<AppIdeaDatasetDocument>('datasets');

    for (const idea of appIdeasData) {
      console.log(`[${SCRIPT_NAME}] Processing app idea: "${idea.name}"`);

      // Check if already exists to prevent duplicates during re-runs (optional, but good practice)
      const existingDoc = await datasetsCollection.findOne({ name: idea.name });
      if (existingDoc) {
        console.log(`[${SCRIPT_NAME}] App idea "${idea.name}" already exists. Skipping.`);
        continue;
      }
      
      const embedding = await getTextEmbedding(idea.description);
      if (!embedding) {
        console.error(`[${SCRIPT_NAME}] ERROR: Failed to generate embedding for "${idea.name}". Skipping.`);
        continue;
      }

      // Explicitly construct the document to ensure all fields are present for TypeScript
      const documentToInsert: AppIdeaDatasetDocument = {
        name: idea.name,
        description: idea.description,
        target_audience: idea.target_audience,
        core_features: idea.core_features,
        monetization_ideas: idea.monetization_ideas,
        complexity_rating: idea.complexity_rating,
        category: idea.category,
        keywords: idea.keywords,
        source_url: idea.source_url,
        sample_data_snippet: idea.sample_data_snippet,
        potential_use_cases: idea.potential_use_cases,
        description_embedding: embedding,
        date_added_to_vibeflow: new Date(),
        last_verified_by_vibeflow: new Date()
      };

      const insertResult = await datasetsCollection.insertOne(documentToInsert);
      if (insertResult.insertedId) {
        console.log(`[${SCRIPT_NAME}] Successfully inserted "${idea.name}" with ID: ${insertResult.insertedId} and generated embedding.`);
      } else {
        console.error(`[${SCRIPT_NAME}] ERROR: Failed to insert "${idea.name}".`);
      }
    }

  } catch (error) {
    console.error(`[${SCRIPT_NAME}] An unexpected error occurred:`, error);
  } finally {
    console.log(`[${SCRIPT_NAME}] Closing database connection...`);
    await closeDB();
    console.log(`[${SCRIPT_NAME}] Database connection closed. Script finished.`);
  }
};

main();
