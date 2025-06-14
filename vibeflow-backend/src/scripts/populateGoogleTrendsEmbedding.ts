import { connectDB, getCollection, closeDB } from '../services/mongoService';
import { getTextEmbedding } from '../services/aiService';
import { ObjectId } from 'mongodb';

// Define an interface for the dataset document for type safety
interface DatasetDocument {
  _id: ObjectId;
  name: string; // Corrected from title to name based on playground-1.mongodb.js
  description: string;
  source_url: string; // Corrected from source to source_url
  categories: string[]; // Corrected from category to categories
  keywords: string[];
  // other fields as defined in your schema
  description_embedding?: number[]; // Optional because it might not exist yet
}

const SCRIPT_NAME = 'populateGoogleTrendsEmbedding';

const main = async () => {
  console.log(`[${SCRIPT_NAME}] Starting script...`);

  try {
    await connectDB();
    console.log(`[${SCRIPT_NAME}] Connected to MongoDB.`);

    const datasetsCollection = getCollection<DatasetDocument>('datasets');
    // The document was inserted with "name" field, not "title"
    const datasetName = "Google Trends - Daily Top Rising Terms (US)";

    console.log(`[${SCRIPT_NAME}] Searching for dataset: "${datasetName}"`);
    // Query by "name" field
    const dataset = await datasetsCollection.findOne({ name: datasetName });

    if (!dataset) {
      console.error(`[${SCRIPT_NAME}] ERROR: Dataset "${datasetName}" not found.`);
      return;
    }

    if (!dataset.description) {
      console.error(`[${SCRIPT_NAME}] ERROR: Dataset "${datasetName}" (ID: ${dataset._id}) has no description field.`);
      return;
    }

    console.log(`[${SCRIPT_NAME}] Found dataset (ID: ${dataset._id}). Generating embedding for its description...`);
    const embedding = await getTextEmbedding(dataset.description);

    if (!embedding) {
      console.error(`[${SCRIPT_NAME}] ERROR: Failed to generate embedding for dataset "${datasetName}" (ID: ${dataset._id}).`);
      return;
    }

    console.log(`[${SCRIPT_NAME}] Embedding generated successfully. Updating document in MongoDB...`);
    const updateResult = await datasetsCollection.updateOne(
      { _id: dataset._id },
      { $set: { description_embedding: embedding } }
    );

    if (updateResult.modifiedCount === 1) {
      console.log(`[${SCRIPT_NAME}] Successfully updated dataset "${datasetName}" (ID: ${dataset._id}) with the new embedding.`);
    } else {
      console.error(`[${SCRIPT_NAME}] ERROR: Failed to update dataset "${datasetName}" (ID: ${dataset._id}) in MongoDB. Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);
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
