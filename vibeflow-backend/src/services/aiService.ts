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
const chatModelName = "gemini-1.5-flash-latest"; // Using a capable and fast model
const chatModel = genAI.getGenerativeModel({ 
  model: chatModelName,
  // It's good practice to include safety settings, even if default
  safetySettings: [ 
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
  generationConfig: {
    // Ensure the model can output JSON
    responseMimeType: "application/json", 
    // Adjust temperature for creativity vs. predictability. Lower for structured JSON.
    temperature: 0.3 
  }
});

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

interface SampleQuery {
  description: string; // e.g., "Find app ideas with 'Map View' as a feature"
  query: object;       // The MongoDB query filter object, e.g., { core_features: 'Map View' }
}

/**
 * Generates sample MongoDB queries for a given app idea.
 * @param ideaName The name of the app idea.
 * @param ideaDescription The description of the app idea.
 * @param coreFeatures An array of core features for the app idea.
 * @returns A Promise that resolves to an array of SampleQuery objects, or null if an error occurs.
 */
export const generateSampleMongoQueries = async (
  ideaName: string, 
  ideaDescription: string, 
  coreFeatures: string[]
): Promise<SampleQuery[] | null> => {
  const SCRIPT_NAME = 'generateSampleMongoQueries';
  console.log(`[${SCRIPT_NAME}] Generating sample queries for app idea: "${ideaName}"`);

  const prompt = `
    You are an expert MongoDB query generator.
    Given the following application idea:
    Name: "${ideaName}"
    Description: "${ideaDescription}"
    Core Features: ${coreFeatures.join(', ')}

    The collection these queries will run against is named 'datasets' and contains documents representing various app ideas. Each document has the following relevant fields for querying:
    - name: string (e.g., "Community Skill Share")
    - description: string
    - target_audience: string (e.g., "Students, Young Professionals")
    - core_features: array of strings (e.g., ["Map View", "Event Filtering"])
    - monetization_ideas: array of strings
    - complexity_rating: string (e.g., "Low", "Medium", "High")
    - category: array of strings (e.g., ["Playground App Idea", "Community"])
    - keywords: array of strings

    Generate exactly 3 distinct sample MongoDB query filter objects that a user might find interesting to explore related app ideas.
    For each query, also provide a short, user-friendly description of what the query does.
    
    Return your response as a VALID JSON array of objects, where each object has two keys: "description" (string) and "query" (the MongoDB query filter object).
    Example of a single object in the array:
    {
      "description": "Find app ideas that include 'User Profiles' as a core feature and are rated 'Medium' complexity.",
      "query": { "core_features": "User profiles", "complexity_rating": "Medium" }
    }

    Ensure the output is ONLY the JSON array, with no other text before or after it.
    Make the queries diverse and insightful. For example, one query could search by a core feature, another by target audience and complexity, and another by keywords or category.
  `;

  try {
    const result = await chatModel.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    
    console.log(`[${SCRIPT_NAME}] Raw AI response for sample queries:`, responseText);

    // Attempt to parse the JSON response
    // The response might be wrapped in markdown ```json ... ```, so try to extract it.
    let jsonString = responseText;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }
    
    const queries = JSON.parse(jsonString) as SampleQuery[];
    
    // Basic validation
    if (Array.isArray(queries) && queries.every(q => typeof q.description === 'string' && typeof q.query === 'object')) {
      console.log(`[${SCRIPT_NAME}] Successfully generated and parsed ${queries.length} sample queries.`);
      return queries;
    } else {
      console.error(`[${SCRIPT_NAME}] ERROR: Parsed JSON is not in the expected format of SampleQuery[]. Parsed:`, queries);
      return null;
    }

  } catch (error) {
    console.error(`[${SCRIPT_NAME}] ERROR generating or parsing sample queries:`, error);
    console.error(`[${SCRIPT_NAME}] Prompt sent to AI:`, prompt); // Log the prompt on error
    return null;
  }
};
