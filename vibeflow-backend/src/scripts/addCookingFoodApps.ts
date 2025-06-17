// File: vibeflow-backend/src/scripts/addCookingFoodApps.ts

import { connectDB, getCollection, closeDB } from '../services/mongoService';
import { getTextEmbedding } from '../services/aiService';
import { Document as MongoDocument } from 'mongodb';

interface AppIdeaDatasetDocument extends MongoDocument {
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
  generated_by_ai?: boolean;
}

const SCRIPT_NAME = 'addCookingFoodApps';

// Comprehensive cooking and food-focused apps
const cookingFoodApps: Omit<AppIdeaDatasetDocument, '_id' | 'description_embedding' | 'enhanced_embedding' | 'date_added_to_vibeflow' | 'last_verified_by_vibeflow'>[] = [
  {
    name: "Recipe Exchange Community",
    description: "A vibrant platform for home cooks to share original recipes, discover new dishes, rate and review cooking experiences, and connect with fellow food enthusiasts through recipe exchanges and cooking challenges.",
    target_audience: "Home cooks, recipe creators, food bloggers, cooking enthusiasts, family meal planners",
    core_features: ["Recipe creation and sharing", "Photo and video uploads", "Ingredient scaling calculator", "Cooking timer integration", "Recipe rating and reviews", "Social following system", "Recipe collections and favorites", "Cooking difficulty tags", "Dietary filter options"],
    monetization_ideas: ["Premium recipe organization tools", "Sponsored ingredient partnerships", "Cookbook publishing services", "Cooking class integrations"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Food & Cooking", "Social Media", "Recipe Sharing", "Community"],
    keywords: ["recipe sharing", "cooking community", "home cooking", "food sharing", "recipe exchange", "cooking social network", "culinary platform", "recipe discovery"],
    source_url: null,
    sample_data_snippet: {
      "recipe_title": "Grandmother's Italian Lasagna",
      "chef": "CookingNonna",
      "prep_time": "30 minutes",
      "cook_time": "45 minutes",
      "servings": 8,
      "difficulty": "Intermediate",
      "rating": 4.8,
      "reviews_count": 234,
      "main_ingredients": ["ground beef", "lasagna noodles", "ricotta cheese", "mozzarella"],
      "cuisine_type": "Italian"
    },
    potential_use_cases: ["Sharing family recipes with the community", "Discovering new dishes to try", "Getting cooking tips from experienced home cooks", "Building a personal recipe collection", "Participating in seasonal cooking challenges"]
  },
  {
    name: "Smart Meal Planner Pro",
    description: "An intelligent meal planning app that creates personalized weekly meal plans based on dietary preferences, automatically generates shopping lists, tracks nutrition, and suggests recipes using ingredients you already have.",
    target_audience: "Busy families, health-conscious individuals, meal prep enthusiasts, budget-conscious shoppers",
    core_features: ["AI-powered meal planning", "Automatic grocery list generation", "Pantry inventory tracking", "Nutrition analysis", "Budget tracking", "Recipe suggestions based on available ingredients", "Meal prep scheduling", "Family preference profiles"],
    monetization_ideas: ["Premium meal planning algorithms", "Grocery delivery service partnerships", "Nutrition consultation integrations", "Advanced dietary planning tools"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Food & Cooking", "Meal Planning", "Health", "Productivity"],
    keywords: ["meal planning", "grocery lists", "nutrition tracking", "meal prep", "food organization", "dietary planning", "kitchen management", "healthy eating"],
    source_url: null,
    sample_data_snippet: {
      "week_plan": "June 17-23, 2025",
      "total_meals": 21,
      "estimated_cost": "$127.50",
      "calories_per_day": 1850,
      "prep_time_saved": "3.5 hours",
      "monday_dinner": "Grilled Salmon with Asparagus",
      "grocery_items": 28,
      "dietary_preferences": ["Gluten-free", "Low-sodium"]
    },
    potential_use_cases: ["Planning healthy family meals for the week", "Reducing food waste by using existing ingredients", "Staying within grocery budget", "Meeting specific dietary requirements", "Saving time on meal decision-making"]
  },
  {
    name: "Local Farmer Connect",
    description: "A platform connecting home cooks directly with local farmers and producers, featuring seasonal ingredient discovery, farm-to-table recipe suggestions, and a marketplace for fresh, local produce and artisanal food products.",
    target_audience: "Farm-to-table enthusiasts, local food supporters, sustainable living advocates, gourmet home cooks",
    core_features: ["Local farmer marketplace", "Seasonal ingredient calendar", "Farm-to-table recipes", "Producer profiles and stories", "Ingredient traceability", "Community supported agriculture (CSA) integration", "Local food event listings", "Sustainable cooking tips"],
    monetization_ideas: ["Marketplace transaction fees", "Premium farmer partnerships", "Sponsored local food content", "CSA subscription management"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Food & Cooking", "Local Business", "Sustainability", "Marketplace"],
    keywords: ["local farmers", "farm to table", "local produce", "sustainable cooking", "farmer marketplace", "seasonal ingredients", "local food", "artisanal products"],
    source_url: null,
    sample_data_snippet: {
      "farmer_name": "Green Valley Organic Farm",
      "distance": "8.2 miles",
      "featured_product": "Heirloom Tomatoes",
      "price_per_pound": "$4.50",
      "harvest_date": "2025-06-15",
      "farm_story": "Third generation family farm specializing in organic vegetables",
      "available_items": 12,
      "customer_rating": 4.9
    },
    potential_use_cases: ["Finding fresh, local ingredients for cooking", "Supporting local farming communities", "Learning about seasonal ingredient availability", "Discovering artisanal food products", "Reducing environmental impact of food choices"]
  },
  {
    name: "Cooking Skill Academy",
    description: "An interactive cooking education platform where users learn culinary techniques through step-by-step video tutorials, practice with guided cooking sessions, earn skill badges, and connect with mentors and fellow cooking students.",
    target_audience: "Cooking beginners, culinary students, skill-building enthusiasts, aspiring chefs, cooking hobbyists",
    core_features: ["Interactive video tutorials", "Step-by-step cooking guidance", "Skill progression tracking", "Achievement badges and certificates", "Live cooking sessions", "Mentor matching system", "Recipe difficulty progression", "Technique-focused lessons"],
    monetization_ideas: ["Premium cooking courses", "One-on-one chef mentoring", "Advanced technique workshops", "Cooking equipment partnerships"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Food & Cooking", "Education", "Skill Development", "Video Learning"],
    keywords: ["cooking lessons", "culinary education", "cooking techniques", "chef training", "cooking skills", "culinary tutorials", "cooking academy", "food education"],
    source_url: null,
    sample_data_snippet: {
      "current_course": "Knife Skills Mastery",
      "progress": "65%",
      "lessons_completed": 13,
      "skill_level": "Intermediate",
      "badges_earned": ["Basic Knife Cuts", "Proper Chopping Form", "Speed Cutting"],
      "mentor": "Chef Maria Rodriguez",
      "next_lesson": "Advanced Julienne Techniques",
      "practice_recipes": 8
    },
    potential_use_cases: ["Learning fundamental cooking techniques", "Improving knife skills and food preparation", "Building confidence in the kitchen", "Advancing from beginner to intermediate cooking", "Connecting with experienced cooking mentors"]
  },
  {
    name: "Dietary Lifestyle Hub",
    description: "A comprehensive app for people following specific dietary lifestyles (vegan, keto, paleo, etc.) featuring recipe discovery, meal tracking, community support, restaurant finding, and nutritional guidance tailored to their chosen lifestyle.",
    target_audience: "People with specific dietary needs, health-conscious individuals, lifestyle diet followers, food allergy sufferers",
    core_features: ["Diet-specific recipe filtering", "Nutritional macro tracking", "Restaurant and menu scanning", "Community support groups", "Meal logging with dietary compliance", "Ingredient substitution suggestions", "Progress tracking", "Expert nutritionist content"],
    monetization_ideas: ["Premium dietary plans", "Nutritionist consultations", "Specialized food product partnerships", "Advanced tracking features"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Food & Cooking", "Health", "Lifestyle", "Nutrition"],
    keywords: ["dietary lifestyles", "nutrition tracking", "vegan recipes", "keto diet", "paleo cooking", "food allergies", "healthy eating", "diet compliance"],
    source_url: null,
    sample_data_snippet: {
      "dietary_lifestyle": "Plant-based Vegan",
      "daily_calories": 1680,
      "protein_goal": "met (52g)",
      "b12_reminder": "Take supplement",
      "streak_days": 87,
      "favorite_recipe": "Chickpea Buddha Bowl",
      "community_posts": 23,
      "restaurant_recommendations": 8
    },
    potential_use_cases: ["Following a vegan or vegetarian lifestyle", "Managing food allergies and intolerances", "Tracking macros for keto or paleo diets", "Finding compliant restaurants and meals", "Connecting with others following similar diets"]
  },
  {
    name: "Global Cuisine Explorer",
    description: "An immersive app for discovering authentic recipes from around the world, learning about food cultures, connecting with home cooks from different countries, and experiencing global cuisine through guided cooking adventures.",
    target_audience: "Cultural food enthusiasts, travel lovers, international cuisine fans, cultural learning enthusiasts",
    core_features: ["Country-specific recipe collections", "Cultural food history and stories", "Virtual cooking exchanges with international cooks", "Ingredient sourcing guides", "Traditional technique videos", "Cultural celebration menus", "Language pronunciation guides for dishes", "Global food festival calendar"],
    monetization_ideas: ["Premium cultural content", "International ingredient marketplace", "Virtual cooking classes with global chefs", "Cultural food travel experiences"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Food & Cooking", "Cultural Exchange", "International", "Education"],
    keywords: ["global cuisine", "international recipes", "cultural cooking", "world food", "ethnic recipes", "traditional cooking", "food culture", "authentic recipes"],
    source_url: null,
    sample_data_snippet: {
      "featured_country": "Morocco",
      "signature_dish": "Traditional Tagine",
      "cultural_host": "Amina from Marrakech",
      "cooking_time": "2 hours",
      "authentic_ingredients": ["preserved lemons", "ras el hanout", "dried apricots"],
      "cultural_significance": "Family gathering centerpiece",
      "difficulty": "Intermediate",
      "countries_explored": 24
    },
    potential_use_cases: ["Learning authentic recipes from different cultures", "Exploring international flavors at home", "Understanding the cultural significance of dishes", "Connecting with home cooks worldwide", "Planning themed dinner parties with authentic cuisines"]
  },
  {
    name: "Food Waste Warrior",
    description: "An eco-conscious cooking app focused on reducing food waste by suggesting recipes based on leftover ingredients, tracking food expiration dates, providing preservation tips, and connecting users with food sharing communities.",
    target_audience: "Environmentally conscious cooks, budget-minded families, sustainability advocates, zero-waste lifestyle followers",
    core_features: ["Leftover ingredient recipe suggestions", "Food expiration tracking", "Preservation and storage tips", "Food waste tracking and goals", "Community food sharing network", "Meal planning to minimize waste", "Composting guidance", "Food rescue event listings"],
    monetization_ideas: ["Premium waste reduction tools", "Sustainable food product partnerships", "Food preservation equipment affiliate sales", "Zero-waste lifestyle courses"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Food & Cooking", "Sustainability", "Environmental", "Waste Reduction"],
    keywords: ["food waste reduction", "leftover recipes", "sustainable cooking", "food preservation", "zero waste", "eco-friendly cooking", "food sharing", "environmental impact"],
    source_url: null,
    sample_data_snippet: {
      "leftover_ingredients": ["half bell pepper", "2 cups cooked rice", "3 eggs"],
      "suggested_recipe": "Veggie Fried Rice",
      "waste_saved_this_month": "4.2 lbs",
      "money_saved": "$31.80",
      "expiring_soon": ["bananas (2 days)", "spinach (1 day)"],
      "preservation_tip": "Freeze overripe bananas for smoothies",
      "community_shares": 7
    },
    potential_use_cases: ["Using up leftover ingredients creatively", "Reducing household food waste", "Saving money by using what you have", "Learning food preservation techniques", "Sharing excess food with neighbors"]
  },
  {
    name: "Family Recipe Vault",
    description: "A digital platform for preserving and sharing family recipes across generations, featuring recipe digitization tools, family cooking story collection, collaborative recipe testing, and creating beautiful digital cookbooks for family legacy.",
    target_audience: "Families wanting to preserve traditions, elder family members, genealogy enthusiasts, tradition keepers",
    core_features: ["Recipe digitization and preservation", "Family story and photo integration", "Multi-generation collaboration", "Digital cookbook creation", "Recipe version tracking", "Family tree recipe connections", "Voice note recipe instructions", "Print-ready formatting"],
    monetization_ideas: ["Premium digital cookbook designs", "Professional recipe digitization services", "Physical cookbook printing", "Family recipe backup services"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Food & Cooking", "Family", "Heritage", "Digital Preservation"],
    keywords: ["family recipes", "recipe preservation", "cooking heritage", "family traditions", "digital cookbook", "generational cooking", "recipe legacy", "family history"],
    source_url: null,
    sample_data_snippet: {
      "recipe_title": "Great Grandma's Apple Pie",
      "family_origin": "1892, Nebraska",
      "shared_by": "Grandma Eleanor",
      "family_generations": 5,
      "story": "Made every Thanksgiving since 1952",
      "modifications": ["Added cinnamon (1975)", "Less sugar (2010)"],
      "family_rating": "★★★★★",
      "times_made": 127
    },
    potential_use_cases: ["Preserving grandmother's secret recipes", "Creating a family cookbook for reunions", "Teaching young family members traditional dishes", "Documenting the history behind family recipes", "Sharing recipes with distant relatives"]
  }
];

/**
 * Generate embeddings for an app idea
 */
const generateEmbeddings = async (idea: AppIdeaDatasetDocument) => {
  console.log(`[${SCRIPT_NAME}] Generating embeddings for: "${idea.name}"`);
  
  // Standard description embedding
  const descriptionEmbedding = await getTextEmbedding(idea.description);
  
  // Enhanced embedding combining multiple fields
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

const main = async () => {
  console.log(`[${SCRIPT_NAME}] Adding cooking and food apps...`);

  try {
    await connectDB();
    const datasetsCollection = getCollection<AppIdeaDatasetDocument>('datasets');
    
    let inserted = 0;
    let skipped = 0;

    for (const app of cookingFoodApps) {
      console.log(`[${SCRIPT_NAME}] Processing: "${app.name}"`);
      
      // Check for duplicates
      const existing = await datasetsCollection.findOne({ name: app.name });
      if (existing) {
        console.log(`[${SCRIPT_NAME}] 🔄 Already exists: "${app.name}". Skipping.`);
        skipped++;
        continue;
      }
      
      // Generate embeddings
      const embeddings = await generateEmbeddings(app as AppIdeaDatasetDocument);
      if (!embeddings) {
        skipped++;
        continue;
      }
      
      // Insert into database
      const finalApp: AppIdeaDatasetDocument = {
        name: app.name,
        description: app.description,
        target_audience: app.target_audience,
        core_features: app.core_features,
        monetization_ideas: app.monetization_ideas,
        complexity_rating: app.complexity_rating,
        category: app.category,
        keywords: app.keywords,
        source_url: app.source_url,
        sample_data_snippet: app.sample_data_snippet,
        potential_use_cases: app.potential_use_cases,
        description_embedding: embeddings.description_embedding,
        enhanced_embedding: embeddings.enhanced_embedding,
        date_added_to_vibeflow: new Date(),
        last_verified_by_vibeflow: new Date(),
        generated_by_ai: false // These are manually crafted for quality
      };
      
      const result = await datasetsCollection.insertOne(finalApp);
      if (result.insertedId) {
        console.log(`[${SCRIPT_NAME}] ✅ Inserted: "${app.name}"`);
        inserted++;
      } else {
        console.error(`[${SCRIPT_NAME}] ❌ Failed to insert: "${app.name}"`);
        skipped++;
      }
    }
    
    console.log(`\n[${SCRIPT_NAME}] ✅ Complete!`);
    console.log(`[${SCRIPT_NAME}] Inserted: ${inserted} apps`);
    console.log(`[${SCRIPT_NAME}] Skipped: ${skipped} apps`);

    // Show final category count
    const foodCookingCount = await datasetsCollection.countDocuments({
      category: { $in: ["Food & Cooking", "Recipe Sharing", "Meal Planning"] }
    });
    console.log(`[${SCRIPT_NAME}] Total Food & Cooking apps now: ${foodCookingCount}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${SCRIPT_NAME}] ❌ Error:`, errorMessage);
  } finally {
    await closeDB();
    console.log(`[${SCRIPT_NAME}] Script finished.`);
  }
};

main();
