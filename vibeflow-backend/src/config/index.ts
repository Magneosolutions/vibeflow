// Configuration loader for the backend
// This will load environment variables from .env and provide them to the app
import dotenv from 'dotenv';

dotenv.config(); // Load .env file contents into process.env

export const config = {
  port: process.env.PORT || '3001',
  mongoURI: process.env.MONGODB_URI_VIBEFLOW, // Corrected to use the actual env var name
  geminiApiKey: process.env.GEMINI_API_KEY,
};

// Basic validation
if (!config.mongoURI) {
  console.error("FATAL ERROR: MONGODB_URI_VIBEFLOW is not defined. Please check your .env file or Cloud Run service configuration."); // Updated error message
  process.exit(1);
}

if (!config.geminiApiKey) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined. Please check your .env file.");
  process.exit(1);
}
