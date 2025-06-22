// File: vibeflow-backend/src/scripts/aiDatasetGenerator.ts

import { connectDB, getCollection, closeDB } from '../services/mongoService';
import { getTextEmbedding } from '../services/aiService';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { Document as MongoDocument } from 'mongodb';

interface AppIdeaDatasetDocument extends MongoDocument {
  _id?: any;
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
  enhanced_embedding?: number[];
  date_added_to_vibeflow: Date;
  last_verified_by_vibeflow: Date;
  generated_by_ai: boolean; // Flag to identify AI-generated content
}

const SCRIPT_NAME = 'aiDatasetGenerator';

// Initialize Gemini for content generation
const genAI = new GoogleGenerativeAI(config.geminiApiKey!);
const chatModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.8 // Higher creativity for diverse ideas
  }
});

/**
 * Comprehensive app categories to ensure complete coverage
 * Each domain has specific themes to guide AI generation
 */
const APP_CATEGORIES = [
  { 
    domain: "Social Media & Communication", 
    themes: ["photo sharing", "video sharing", "messaging", "community building", "networking", "dating"] 
  },
  { 
    domain: "Health & Fitness", 
    themes: ["workout tracking", "nutrition", "mental health", "medical records", "fitness challenges", "wellness"] 
  },
  { 
    domain: "Productivity & Utilities", 
    themes: ["task management", "note taking", "calendar", "file management", "automation", "time tracking"] 
  },
  { 
    domain: "Entertainment & Media", 
    themes: ["music streaming", "video content", "gaming", "reading", "podcasts", "live streaming"] 
  },
  { 
    domain: "Travel & Navigation", 
    themes: ["trip planning", "local discovery", "transportation", "accommodation", "travel guides", "navigation"] 
  },
  { 
    domain: "Shopping & E-commerce", 
    themes: ["marketplace", "price comparison", "reviews", "local business", "fashion", "groceries"] 
  },
  { 
    domain: "Education & Learning", 
    themes: ["skill development", "language learning", "test prep", "tutorials", "courses", "study tools"] 
  },
  { 
    domain: "Finance & Banking", 
    themes: ["budgeting", "investing", "payments", "expense tracking", "crypto", "financial planning"] 
  },
  { 
    domain: "Food & Cooking", 
    themes: ["recipe sharing", "restaurant discovery", "meal planning", "dietary tracking", "food delivery", "cooking tutorials"] 
  },
  { 
    domain: "Outdoor & Sports", 
    themes: ["fitness tracking", "adventure planning", "sports community", "equipment", "hiking", "team sports"] 
  },
  {
    domain: "Selfcare & Mental Health",
    themes: ["meditation", "mindfulness", "therapy", "journaling", "mood tracking", "stress management"]
  }
];

/**
 * Generate diverse app ideas using AI for a specific domain and theme
 */
const generateAppIdeas = async (domain: string, theme: string, count: number = 2): Promise<any[]> => {
  const prompt = `Generate ${count} unique and innovative mobile app ideas for the domain "${domain}" with the specific theme "${theme}".

IMPORTANT REQUIREMENTS:
1. Each app must be DIFFERENT from major existing apps (don't create "another Instagram" or "another Uber")
2. Focus on solving specific, real problems within the theme
3. Make each app unique with a clear value proposition
4. Ensure realistic technical feasibility

For each app idea, provide a JSON object with these exact fields:
{
  "name": "Creative but professional app name (avoid generic names)",
  "description": "Detailed 2-3 sentence description explaining what the app does and its unique value",
  "target_audience": "Specific user demographics (be precise, not generic)",
  "core_features": ["feature1", "feature2", ...] (5-8 specific, implementable features),
  "monetization_ideas": ["strategy1", "strategy2", ...] (3-4 realistic revenue strategies),
  "complexity_rating": "Low" | "Medium" | "High" (based on technical requirements),
  "category": ["Playground App Idea", "${domain}", "${theme}", "other_relevant_categories"] (3-5 categories),
  "keywords": ["keyword1", "keyword2", ...] (8-12 relevant search terms and tags),
  "sample_data_snippet": { realistic sample data object that this app would handle },
  "potential_use_cases": ["use_case1", "use_case2", ...] (4-6 specific scenarios where users would use this app)
}

Examples of what makes a GOOD app idea:
- "Trail Safety Network" (outdoor theme) - hikers share real-time trail conditions and safety alerts
- "Micro-Learning Challenges" (education theme) - 5-minute daily learning challenges in any skill
- "Local Ingredient Finder" (food theme) - connects home cooks with local farmers and specialty ingredients

Examples of what to AVOID:
- Generic social media apps
- Basic copy of existing major apps
- Overly complex or unrealistic concepts

Return ONLY a valid JSON array with ${count} objects, no other text.`;

  try {
    console.log(`[${SCRIPT_NAME}] Generating ideas for ${domain} - ${theme}...`);
    
    const result = await chatModel.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up JSON response (remove code blocks if present)
    let jsonString = responseText.trim();
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    }
    
    const ideas = JSON.parse(jsonString);
    
    if (!Array.isArray(ideas)) {
      console.error(`[${SCRIPT_NAME}] Generated content is not an array for ${domain} - ${theme}`);
      return [];
    }
    
    console.log(`[${SCRIPT_NAME}] ✅ Generated ${ideas.length} app ideas for ${domain} - ${theme}`);
    return ideas;
    
  } catch (error) {
    console.error(`[${SCRIPT_NAME}] ❌ Error generating ideas for ${domain} - ${theme}:`, error);
    // console.error(`[${SCRIPT_NAME}] Response preview:`, result?.response?.text()?.substring(0, 200)); // result might be undefined here
    return [];
  }
};

/**
 * Validate and enhance AI-generated app ideas
 */
const enhanceAppIdea = (idea: any, domain: string): AppIdeaDatasetDocument | null => {
  // Validate required fields
  if (!idea.name || !idea.description) {
    console.warn(`[${SCRIPT_NAME}] Skipping invalid idea: missing name or description`);
    return null;
  }

  return {
    name: idea.name,
    description: idea.description,
    target_audience: idea.target_audience || "General users",
    core_features: Array.isArray(idea.core_features) ? idea.core_features : [],
    monetization_ideas: Array.isArray(idea.monetization_ideas) ? idea.monetization_ideas : [],
    complexity_rating: ["Low", "Medium", "High"].includes(idea.complexity_rating) ? idea.complexity_rating : "Medium",
    category: Array.isArray(idea.category) ? idea.category : ["Playground App Idea", domain],
    keywords: Array.isArray(idea.keywords) ? idea.keywords : [],
    source_url: null,
    sample_data_snippet: idea.sample_data_snippet || {},
    potential_use_cases: Array.isArray(idea.potential_use_cases) ? idea.potential_use_cases : [],
    generated_by_ai: true,
    date_added_to_vibeflow: new Date(),
    last_verified_by_vibeflow: new Date()
  };
};

/**
 * Generate both standard and enhanced embeddings for an app idea
 */
const generateEmbeddings = async (idea: AppIdeaDatasetDocument) => {
  console.log(`[${SCRIPT_NAME}] Generating embeddings for: "${idea.name}"`);
  
  // Standard description embedding
  const descriptionEmbedding = await getTextEmbedding(idea.description);
  
  // Enhanced embedding combining multiple fields for better semantic matching
  const enhancedText = [
    `App Name: ${idea.name}`,
    `Description: ${idea.description}`,
    `Target Users: ${idea.target_audience}`,
    `Key Features: ${idea.core_features.join(', ')}`,
    `Categories: ${idea.category.join(', ')}`,
    `Keywords: ${idea.keywords.join(', ')}`,
    `Use Cases: ${idea.potential_use_cases.join(', ')}`
  ].join('. ');
  
  const enhancedEmbedding = await getTextEmbedding(enhancedText);
  
  if (!descriptionEmbedding || !enhancedEmbedding) {
    console.error(`[${SCRIPT_NAME}] ❌ Failed to generate embeddings for: "${idea.name}"`);
    return null;
  }
  
  return {
    description_embedding: descriptionEmbedding,
    enhanced_embedding: enhancedEmbedding
  };
};

/**
 * Main execution function
 */
const main = async () => {
  console.log(`[${SCRIPT_NAME}] 🚀 Starting AI-powered comprehensive dataset generation...`);
  console.log(`[${SCRIPT_NAME}] This will generate ~80+ diverse app ideas across ${APP_CATEGORIES.length} domains`);

  try {
    await connectDB();
    const datasetsCollection = getCollection<AppIdeaDatasetDocument>('datasets');
    
    let totalGenerated = 0;
    let totalInserted = 0;
    let totalSkipped = 0;

    // Generate ideas for each category and theme
    for (let i = 0; i < APP_CATEGORIES.length; i++) {
      const categoryInfo = APP_CATEGORIES[i];
      console.log(`\n[${SCRIPT_NAME}] 📂 Processing domain ${i + 1}/${APP_CATEGORIES.length}: ${categoryInfo.domain}`);
      
      for (let j = 0; j < categoryInfo.themes.length; j++) {
        const theme = categoryInfo.themes[j];
        console.log(`[${SCRIPT_NAME}] 🎯 Theme ${j + 1}/${categoryInfo.themes.length}: ${theme}`);
        
        // Generate 2 app ideas per theme (2 * 6 themes * 10 domains = 120 apps)
        const generatedIdeas = await generateAppIdeas(categoryInfo.domain, theme, 2);
        totalGenerated += generatedIdeas.length;
        
        for (const rawIdea of generatedIdeas) {
          const idea = enhanceAppIdea(rawIdea, categoryInfo.domain);
          if (!idea) {
            totalSkipped++;
            continue;
          }
          
          // Check for duplicates by name
          const existing = await datasetsCollection.findOne({ name: idea.name });
          if (existing) {
            console.log(`[${SCRIPT_NAME}] 🔄 Duplicate found: "${idea.name}". Skipping.`);
            totalSkipped++;
            continue;
          }
          
          // Generate embeddings
          const embeddings = await generateEmbeddings(idea);
          if (!embeddings) {
            totalSkipped++;
            continue;
          }
          
          // Insert into database
          const finalIdea = {
            ...idea,
            ...embeddings
          };
          
          try {
            const result = await datasetsCollection.insertOne(finalIdea);
            if (result.insertedId) {
              console.log(`[${SCRIPT_NAME}] ✅ Inserted: "${idea.name}" (${idea.complexity_rating} complexity)`);
              totalInserted++;
            } else {
              console.error(`[${SCRIPT_NAME}] ❌ Failed to insert: "${idea.name}"`);
              totalSkipped++;
            }
          } catch (insertError) {
            console.error(`[${SCRIPT_NAME}] ❌ Database insert error for "${idea.name}":`, insertError);
            totalSkipped++;
          }
        }
        
        // Rate limiting: Small delay between API calls to avoid hitting limits
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Longer delay between domains
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log(`\n[${SCRIPT_NAME}] 🎉 GENERATION COMPLETE!`);
    console.log(`[${SCRIPT_NAME}] 📊 FINAL STATISTICS:`);
    console.log(`[${SCRIPT_NAME}]   • Total ideas generated by AI: ${totalGenerated}`);
    console.log(`[${SCRIPT_NAME}]   • Successfully inserted: ${totalInserted}`);
    console.log(`[${SCRIPT_NAME}]   • Skipped (duplicates/errors): ${totalSkipped}`);
    console.log(`[${SCRIPT_NAME}]   • Success rate: ${((totalInserted / totalGenerated) * 100).toFixed(1)}%`);
    
    // Verify final dataset size
    const finalCount = await datasetsCollection.countDocuments({ category: "Playground App Idea" });
    console.log(`[${SCRIPT_NAME}]   • Total datasets in collection: ${finalCount}`);

  } catch (error) {
    console.error(`[${SCRIPT_NAME}] ❌ An unexpected error occurred:`, error);
  } finally {
    await closeDB();
    console.log(`[${SCRIPT_NAME}] 🔌 Database connection closed. Script finished.`);
  }
};

// Add error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${SCRIPT_NAME}] Unhandled Rejection at:`, promise, 'reason:', reason);
  process.exit(1);
});

main();
