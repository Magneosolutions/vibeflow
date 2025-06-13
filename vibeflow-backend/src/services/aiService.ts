import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { config } from '../config';

if (!config.geminiApiKey) {
  // This should ideally be caught by config/index.ts, but good to double-check
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined in aiService. Cannot initialize AI service.");
  throw new Error("GEMINI_API_KEY is not defined."); 
}

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// For embedding, specify the model
// Models like 'embedding-001' or 'text-embedding-004' (or newer versions) are suitable.
// User has specified 'embedding-001'.
// Ensure the model chosen here matches the one you'll use for embedding your dataset descriptions.
const embeddingModelName = "embedding-001"; 
const embeddingModel = genAI.getGenerativeModel({ model: embeddingModelName });

// For chat/text generation (for Vibe Check later)
// const chatModelName = "gemini-pro"; // Or a newer/more specific model like "gemini-1.5-flash-latest"
// const chatModel = genAI.getGenerativeModel({ model: chatModelName });

/**
 * Generates a vector embedding for the given text.
 * @param text The text to embed.
 * @returns A Promise that resolves to an array of numbers (the embedding), or null if an error occurs.
 */
export const getTextEmbedding = async (text: string): Promise<number[] | null> => {
  if (!text || text.trim() === "") {
    console.warn("getTextEmbedding: Input text is empty.");
    return null;
  }
  try {
    console.log(`Requesting embedding for text (model: ${embeddingModelName}): "${text.substring(0, 50)}..."`);
    const result = await embeddingModel.embedContent(text);
    const embedding = result.embedding;
    if (embedding && embedding.values) {
      console.log(`Embedding generated successfully. Dimensions: ${embedding.values.length}`);
      return embedding.values;
    } else {
      console.error("Error generating text embedding: Embedding or values not found in result.", result);
      return null;
    }
  } catch (error) {
    console.error("Error generating text embedding:", error);
    return null; 
  }
};

// Placeholder for future Vibe Check functionality
export const getAIFeedback = async (vibe: string): Promise<string | null> => {
  // TODO: Implement logic to get AI feedback/insights using a chat model
  console.log(`getAIFeedback called with vibe: "${vibe.substring(0,50)}..." (Not yet implemented)`);
  // Example (conceptual - would use chatModel.generateContent or similar with safetySettings)
  // const generationConfig = {
  //   temperature: 0.7,
  //   topK: 1,
  //   topP: 1,
  //   maxOutputTokens: 2048,
  // };
  // const safetySettings = [ /* ... see below ... */ ];
  // const chat = chatModel.startChat({
  //   generationConfig,
  //   safetySettings,
  //   history: [],
  // });
  // const prompt = `Analyze the following application idea (vibe) and provide feedback on its feasibility, potential challenges, and suggest 2-3 relevant learning resources: "${vibe}"`;
  // const result = await chat.sendMessage(prompt);
  // const response = result.response;
  // return response.text();
  return "AI feedback functionality is not yet implemented.";
};

// Example safety settings for generative models (if using chatModel later for getAIFeedback)
const exampleSafetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
