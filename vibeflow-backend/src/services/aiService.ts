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
    // Adjust temperature for creativity vs. predictability.
    // We will set responseMimeType per-call where needed.
    temperature: 0.5 // A more general temperature
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

interface MatchedDatasetInfo {
  name: string;
  description: string;
}

export const getAIFeedback = async (vibe: string, matchedDataset?: MatchedDatasetInfo | null): Promise<string | null> => {
  const SCRIPT_NAME = 'getAIFeedback';
  
  let logMessage = `[${SCRIPT_NAME}] Generating AI feedback for vibe: "${vibe.substring(0, 100)}..."`;
  if (matchedDataset) {
    logMessage += ` with matched dataset: "${matchedDataset.name}"`;
  }
  console.log(logMessage);

  if (!vibe || vibe.trim() === "") {
    console.warn(`[${SCRIPT_NAME}] Input vibe is empty.`);
    return "Please provide a description of your app idea to get feedback.";
  }

  let promptContext = `The user's application idea (vibe) is: "${vibe}"`;
  if (matchedDataset) {
    promptContext += `\n\nWe found a potentially relevant dataset for this idea:
    Dataset Name: "${matchedDataset.name}"
    Dataset Description: "${matchedDataset.description}"
    
    Please tailor your feedback considering how this dataset might relate to the user's vibe.`;
  } else {
    promptContext += `\n\nNo specific dataset was matched, so provide general feedback on the vibe.`;
  }

  const prompt = `
    You are VibeFlow, an AI co-pilot helping users refine their application ideas.
    A user has described their app idea (vibe), and we may have found a relevant dataset.
    ${promptContext}

    Please provide constructive and actionable feedback structured as follows:

    **Vibe Check & Feasibility:**
    *   Start with an encouraging opening statement about their vibe.
    *   Briefly discuss its general feasibility. If a dataset was matched, comment on how it might be useful or relevant to their idea.
    *   What aspects seem straightforward?

    **Refine Your Vision (What If?):**
    *   Suggest one thought-provoking "what if" question or a potential way the user could expand or refine their current vision. For example, "What if you also considered X?" or "Have you thought about how users might Y?"

    **Potential Challenges:**
    *   Identify 1-2 key technical or conceptual hurdles they should consider. If a dataset is matched, mention any challenges related to using or integrating it.

    **Learn As You Go (Learning Suggestions):**
    *   Based on their vibe (and the matched dataset, if any), suggest 2-3 general technical areas or topics that would be beneficial to learn more about (e.g., "User Authentication", "Frontend UI/UX Design", "Working with [type of data, e.g., 'geospatial data' if a map dataset was found]"). Do not suggest specific URLs or courses.

    **Next Steps & Encouragement:**
    *   End with a brief, encouraging closing statement, perhaps suggesting they explore the suggested resources or refine their vibe further.

    Keep the entire feedback concise (aim for 200-300 words), actionable, and maintain a positive, supportive tone. Use markdown for light formatting like bolding for section headers.
  `;

  try {
    // For this text-based feedback, we don't strictly need responseMimeType: "application/json".
    // The model will default to a text response based on the prompt.
    // We can use the existing chatModel instance.
    const result = await chatModel.generateContent(prompt);
    const response = result.response;
    const feedbackText = response.text();
    
    console.log(`[${SCRIPT_NAME}] Successfully generated AI feedback.`);
    return feedbackText;

  } catch (error) {
    console.error(`[${SCRIPT_NAME}] ERROR generating AI feedback:`, error);
    // Log the prompt if there's an error, for debugging
    // console.error(`[${SCRIPT_NAME}] Prompt sent to AI for feedback:`, prompt); 
    return "Sorry, I encountered an issue while generating feedback. Please try again.";
  }
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
    // Explicitly request JSON output for this function
    const result = await chatModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3 // Keep lower temp for structured JSON
      }
    });
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
