import { connectDB, getCollection, closeDB } from '../services/mongoService';
import { getTextEmbedding } from '../services/aiService';
import { ObjectId, Document as MongoDocument } from 'mongodb';

interface AppIdeaDatasetDocument extends MongoDocument {
  _id?: ObjectId;
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

const SCRIPT_NAME = 'populateOutdoorSportsApps';

// Expanded dataset focusing on outdoor, sports, and social apps
const outdoorSportsAppIdeas: Omit<AppIdeaDatasetDocument, '_id' | 'description_embedding' | 'date_added_to_vibeflow' | 'last_verified_by_vibeflow'>[] = [
  {
    name: "Trail Explorer Social",
    description: "A social media platform specifically for hikers and outdoor enthusiasts to share trail photos, rate hiking difficulty, log completed hikes, and discover new trails through community recommendations.",
    target_audience: "Hikers, outdoor enthusiasts, nature photographers, adventure seekers",
    core_features: ["Photo sharing with GPS tagging", "Trail difficulty rating system", "Hike logging and statistics", "Social feed and following", "Trail discovery and search", "Offline map downloads", "Weather integration", "Safety check-ins"],
    monetization_ideas: ["Premium trail maps and guides", "Gear affiliate partnerships", "Sponsored outdoor brand content", "Premium weather and safety features"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Social Media", "Outdoor Recreation", "Photography", "Fitness"],
    keywords: ["hiking app", "trail sharing", "outdoor social media", "hiking photos", "trail ratings", "GPS tracking", "nature photography", "outdoor community"],
    source_url: null,
    sample_data_snippet: { 
      "trail_name": "Angel's Landing Trail", 
      "difficulty_rating": 4.2, 
      "photo_count": 156, 
      "user_rating": 5, 
      "elevation_gain": "1488 ft",
      "location": "Zion National Park, Utah",
      "completion_time": "4.5 hours"
    },
    potential_use_cases: ["Sharing hiking experiences with photos and reviews", "Finding new trails based on difficulty preferences", "Building a hiking community", "Tracking personal hiking achievements", "Getting real-time trail conditions from other hikers"]
  },
  {
    name: "Fitness Challenge Hub",
    description: "A social fitness app where users create and join fitness challenges, track workouts, share progress photos, and compete with friends across various activities like running, cycling, weightlifting, and yoga.",
    target_audience: "Fitness enthusiasts, athletes, people starting fitness journeys, competitive individuals",
    core_features: ["Custom challenge creation", "Activity tracking integration", "Progress photo sharing", "Leaderboards and rankings", "Social feed", "Achievement badges", "Workout logging", "Friend connections"],
    monetization_ideas: ["Premium challenge templates", "Fitness coach partnerships", "Equipment affiliate sales", "Premium analytics and insights"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Fitness", "Social Media", "Competition", "Health"],
    keywords: ["fitness challenges", "workout tracking", "social fitness", "exercise app", "fitness competition", "health community", "workout sharing"],
    source_url: null,
    sample_data_snippet: {
      "challenge_name": "30-Day Push-up Challenge",
      "participants": 1247,
      "current_leader": "FitMike92",
      "user_progress": "Day 15/30",
      "today_target": "25 push-ups",
      "personal_best": 28
    },
    potential_use_cases: ["Staying motivated through social accountability", "Discovering new workout routines", "Competing with friends in fitness goals", "Tracking long-term fitness progress", "Joining community-driven fitness events"]
  },
  {
    name: "Local Adventure Finder",
    description: "An app that helps users discover outdoor activities and adventures near their location, from hiking trails and rock climbing spots to kayaking routes and camping sites, with user-generated content and reviews.",
    target_audience: "Outdoor enthusiasts, weekend adventurers, families seeking outdoor activities, tourists",
    core_features: ["Location-based activity discovery", "User reviews and photos", "Activity categorization", "Difficulty and skill level filters", "Booking integration for guided tours", "Offline access", "Weather conditions", "Equipment recommendations"],
    monetization_ideas: ["Tour operator partnerships", "Camping and outdoor gear affiliate sales", "Premium location guides", "Featured listing fees for businesses"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Outdoor Recreation", "Travel", "Local Discovery", "Tourism"],
    keywords: ["outdoor activities", "adventure finder", "local exploration", "outdoor discovery", "recreation app", "adventure tourism", "outdoor guides"],
    source_url: null,
    sample_data_snippet: {
      "activity_name": "Emerald Lake Kayaking",
      "activity_type": "Kayaking",
      "distance_from_user": "12.3 miles",
      "difficulty": "Beginner",
      "average_rating": 4.6,
      "estimated_duration": "2-3 hours",
      "cost": "Free (bring own kayak) or $45 rental"
    },
    potential_use_cases: ["Finding weekend outdoor activities", "Planning adventure trips", "Discovering hidden local gems", "Reading authentic reviews from fellow adventurers", "Booking guided outdoor experiences"]
  },
  {
    name: "Photo Contest Community",
    description: "A photography-focused social app where users participate in themed photo contests, vote on submissions, share photography tips, and build portfolios while connecting with other photographers.",
    target_audience: "Photography enthusiasts, amateur photographers, social media users, creative individuals",
    core_features: ["Weekly/monthly photo contests", "Voting and ranking system", "Photography portfolio building", "Tips and tutorial sharing", "Camera settings sharing", "Location tagging", "Photo editing tools", "Photographer following"],
    monetization_ideas: ["Premium photo editing tools", "Photography course partnerships", "Camera gear affiliate sales", "Contest sponsorships from photography brands"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Photography", "Social Media", "Competition", "Creative"],
    keywords: ["photography contests", "photo sharing", "photography community", "photo competitions", "camera app", "photography social network", "creative challenges"],
    source_url: null,
    sample_data_snippet: {
      "contest_theme": "Golden Hour Landscapes",
      "submission_count": 892,
      "voting_ends": "2025-06-20",
      "current_leader": "NatureLens_Pro",
      "user_submission": "sunset_mountain_view.jpg",
      "votes_received": 73
    },
    potential_use_cases: ["Improving photography skills through challenges", "Getting feedback on photos from community", "Discovering new photography techniques", "Building a photography portfolio", "Connecting with local photographers"]
  },
  {
    name: "Outdoor Group Organizer",
    description: "A platform for organizing and joining outdoor group activities like group hikes, cycling meetups, camping trips, and adventure sports, with event planning tools and safety features.",
    target_audience: "Outdoor enthusiasts seeking group activities, solo adventurers, outdoor clubs, event organizers",
    core_features: ["Event creation and management", "RSVP and attendance tracking", "Group messaging", "Skill level matching", "Safety check-in features", "Carpool coordination", "Equipment sharing lists", "Weather monitoring"],
    monetization_ideas: ["Premium event organization tools", "Outdoor gear rental partnerships", "Guide and instructor marketplace", "Group insurance options"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Outdoor Recreation", "Social Networking", "Event Planning", "Safety"],
    keywords: ["outdoor groups", "hiking meetups", "adventure planning", "outdoor events", "group activities", "outdoor community", "adventure safety"],
    source_url: null,
    sample_data_snippet: {
      "event_name": "Weekend Camping at Blue Ridge",
      "organizer": "OutdoorMike",
      "participants": "8/12",
      "skill_level": "Intermediate",
      "date": "2025-07-15",
      "equipment_needed": ["Tent", "Sleeping bag", "Hiking boots"],
      "meeting_point": "Blue Ridge Visitor Center"
    },
    potential_use_cases: ["Finding hiking partners for group safety", "Organizing regular outdoor meetups", "Joining guided group adventures", "Sharing transportation to remote locations", "Building local outdoor communities"]
  },
  {
    name: "Peak Achievement Tracker",
    description: "A gamified outdoor achievement app where users log outdoor activities, earn badges for completing challenges, track elevation gained, trails completed, and compete on leaderboards with friends and the community.",
    target_audience: "Competitive outdoor enthusiasts, goal-oriented hikers, fitness trackers, achievement collectors",
    core_features: ["Activity logging with GPS", "Achievement badge system", "Personal statistics tracking", "Challenge creation", "Friend competitions", "Progress visualization", "Goal setting", "Integration with fitness devices"],
    monetization_ideas: ["Premium badge packs and themes", "Advanced analytics", "Custom challenge creation", "Partnership with outdoor brands for real prizes"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Fitness", "Gamification", "Outdoor Recreation", "Achievement"],
    keywords: ["outdoor achievements", "hiking badges", "fitness gamification", "outdoor challenges", "peak tracking", "adventure goals", "outdoor fitness"],
    source_url: null,
    sample_data_snippet: {
      "total_peaks_climbed": 23,
      "elevation_this_month": "5,420 ft",
      "current_streak": "12 days",
      "latest_badge": "Early Bird Hiker",
      "rank_among_friends": "2nd place",
      "next_challenge": "Climb 5 peaks over 3,000ft"
    },
    potential_use_cases: ["Gamifying outdoor activities for motivation", "Setting and tracking outdoor fitness goals", "Competing with friends in outdoor challenges", "Visualizing outdoor activity progress over time", "Discovering new outdoor goals and achievements"]
  }
];

const main = async () => {
  console.log(`[${SCRIPT_NAME}] Starting enhanced outdoor & sports dataset population...`);

  try {
    await connectDB();
    console.log(`[${SCRIPT_NAME}] Connected to MongoDB.`);

    const datasetsCollection = getCollection<AppIdeaDatasetDocument>('datasets');

    for (const idea of outdoorSportsAppIdeas) {
      console.log(`[${SCRIPT_NAME}] Processing app idea: "${idea.name}"`);

      // Check if already exists
      const existingDoc = await datasetsCollection.findOne({ name: idea.name });
      if (existingDoc) {
        console.log(`[${SCRIPT_NAME}] App idea "${idea.name}" already exists. Skipping.`);
        continue;
      }
      
      console.log(`[${SCRIPT_NAME}] Generating embedding for: "${idea.name}"`);
      const embedding = await getTextEmbedding(idea.description);
      if (!embedding) {
        console.error(`[${SCRIPT_NAME}] ERROR: Failed to generate embedding for "${idea.name}". Skipping.`);
        continue;
      }

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
        console.log(`[${SCRIPT_NAME}] ✅ Successfully inserted "${idea.name}" with ID: ${insertResult.insertedId}`);
      } else {
        console.error(`[${SCRIPT_NAME}] ❌ Failed to insert "${idea.name}".`);
      }
    }

    console.log(`[${SCRIPT_NAME}] ✅ Finished processing all outdoor & sports app ideas.`);

  } catch (error) {
    console.error(`[${SCRIPT_NAME}] An unexpected error occurred:`, error);
  } finally {
    console.log(`[${SCRIPT_NAME}] Closing database connection...`);
    await closeDB();
    console.log(`[${SCRIPT_NAME}] Database connection closed. Script finished.`);
  }
};

main();
