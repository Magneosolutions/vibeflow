// File: vibeflow-backend/src/scripts/addMusicEntertainmentApps.ts

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

const SCRIPT_NAME = 'addMusicEntertainmentApps';

// Music and Entertainment focused apps
const musicEntertainmentApps: Omit<AppIdeaDatasetDocument, '_id' | 'description_embedding' | 'enhanced_embedding' | 'date_added_to_vibeflow' | 'last_verified_by_vibeflow'>[] = [
  {
    name: "Melody Discovery Hub",
    description: "A music discovery platform where users create and share personalized playlists, discover new artists through AI recommendations, and connect with others who have similar musical tastes.",
    target_audience: "Music enthusiasts, playlist curators, social music lovers, indie music fans",
    core_features: ["AI music recommendations", "Playlist creation and sharing", "Social music feed", "Artist discovery tools", "Collaborative playlists", "Music taste matching", "Song mood tagging", "Friends' listening activity"],
    monetization_ideas: ["Premium recommendation algorithms", "Artist promotion partnerships", "Streaming service affiliate revenue", "Premium playlist features"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Music", "Entertainment & Media", "Social Media", "Discovery"],
    keywords: ["music discovery", "playlist sharing", "music social network", "song recommendations", "artist discovery", "music community", "playlist collaboration", "music taste"],
    source_url: null,
    sample_data_snippet: {
      "playlist_name": "Chill Indie Vibes",
      "creator": "MusicLover23",
      "track_count": 47,
      "followers": 1203,
      "featured_song": "Aurora - Runaway",
      "mood_tags": ["chill", "indie", "dreamy"],
      "last_updated": "2025-06-15"
    },
    potential_use_cases: ["Discovering new music based on mood", "Creating themed playlists for events", "Finding people with similar music taste", "Sharing favorite songs with friends", "Getting personalized music recommendations"]
  },
  {
    name: "Beat Creator Social",
    description: "A platform for music producers and beat makers to create, share, and collaborate on beats and instrumentals, with tools for sampling, remixing, and getting feedback from the community.",
    target_audience: "Music producers, beat makers, hip-hop artists, electronic music creators, aspiring musicians",
    core_features: ["Beat creation tools", "Sample library", "Collaboration workspace", "Community feedback system", "Beat marketplace", "Remix challenges", "Producer profiles", "Audio quality analysis"],
    monetization_ideas: ["Beat marketplace commissions", "Premium sound packs", "Advanced production tools", "Producer verification badges"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Music", "Creative", "Audio Production", "Community"],
    keywords: ["beat making", "music production", "audio collaboration", "sampling", "remix", "producer community", "instrumental creation", "music sharing"],
    source_url: null,
    sample_data_snippet: {
      "beat_title": "Urban Nights",
      "producer": "BeatMaster_X",
      "bpm": 140,
      "genre": "Trap",
      "duration": "3:42",
      "likes": 892,
      "downloads": 156,
      "collaboration_requests": 23
    },
    potential_use_cases: ["Creating beats for rap artists", "Collaborating on electronic music", "Learning production techniques", "Selling beats to musicians", "Getting feedback on musical creations"]
  },
  {
    name: "Live Music Finder",
    description: "An app that helps users discover local live music events, concerts, and performances, with features for following favorite artists, sharing concert experiences, and planning music event outings with friends.",
    target_audience: "Concert goers, live music enthusiasts, local music scene supporters, social event planners",
    core_features: ["Event discovery by location", "Artist following and notifications", "Concert check-ins and reviews", "Friends' concert activity", "Venue information and directions", "Ticket purchasing integration", "Concert photo sharing", "Music event calendar"],
    monetization_ideas: ["Ticket booking affiliate commissions", "Venue partnership fees", "Artist promotion opportunities", "Premium event notifications"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Music", "Events", "Local Discovery", "Social"],
    keywords: ["live music", "concerts", "local events", "music venues", "artist following", "concert discovery", "music events", "live performances"],
    source_url: null,
    sample_data_snippet: {
      "event_name": "Indie Rock Night at The Mercury Lounge",
      "artist": "The Midnight Echoes",
      "venue": "Mercury Lounge",
      "date": "2025-07-20",
      "time": "8:00 PM",
      "ticket_price": "$25",
      "attendees": 156,
      "genre": "Indie Rock"
    },
    potential_use_cases: ["Finding concerts in your city", "Following favorite bands' tour dates", "Discovering new local artists", "Planning music outings with friends", "Sharing concert experiences and photos"]
  },
  {
    name: "Audio Story Network",
    description: "A platform for creating, sharing, and discovering audio stories, podcasts, and narrative content, with tools for collaborative storytelling and community-driven audio content creation.",
    target_audience: "Podcast creators, storytellers, audio content listeners, creative writers, voice actors",
    core_features: ["Audio recording and editing", "Story collaboration tools", "Community discovery feed", "Episode series management", "Listener engagement features", "Audio story ratings", "Creator monetization tools", "Cross-platform sharing"],
    monetization_ideas: ["Creator revenue sharing", "Premium editing tools", "Sponsored content opportunities", "Listener subscription tiers"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Audio", "Entertainment & Media", "Storytelling", "Content Creation"],
    keywords: ["audio stories", "podcast creation", "storytelling platform", "audio content", "narrative sharing", "voice recording", "audio community", "podcast network"],
    source_url: null,
    sample_data_snippet: {
      "story_title": "Mysteries of the Old Library",
      "creator": "AudioTeller_Sarah",
      "episode_number": 5,
      "duration": "18:43",
      "listeners": 2847,
      "rating": 4.7,
      "genre": "Mystery",
      "release_date": "2025-06-10"
    },
    potential_use_cases: ["Creating episodic audio stories", "Collaborating on podcast series", "Discovering new audio content", "Building an audience for voice content", "Monetizing storytelling skills"]
  },
  {
    name: "Vinyl Collection Community",
    description: "A social platform for vinyl record collectors to catalog their collections, discover rare records, trade with other collectors, and share their passion for physical music media.",
    target_audience: "Vinyl record collectors, music enthusiasts, vintage music lovers, record store customers",
    core_features: ["Digital collection catalog", "Record marketplace", "Trade matching system", "Collection value tracking", "Collector community forums", "Record store finder", "Wishlist sharing", "Authentication tools"],
    monetization_ideas: ["Marketplace transaction fees", "Record store partnerships", "Premium collection tools", "Authentication services"],
    complexity_rating: "Medium",
    category: ["Playground App Idea", "Music", "Collecting", "Marketplace", "Community"],
    keywords: ["vinyl records", "record collecting", "music marketplace", "vinyl trading", "record community", "collection tracking", "rare records", "music memorabilia"],
    source_url: null,
    sample_data_snippet: {
      "album_title": "Dark Side of the Moon",
      "artist": "Pink Floyd",
      "pressing_year": 1973,
      "condition": "Near Mint",
      "estimated_value": "$85",
      "owner": "VinylVault42",
      "trade_interest": "Yes",
      "rarity_score": 8.5
    },
    potential_use_cases: ["Cataloging personal vinyl collection", "Finding rare records to complete collections", "Trading records with other collectors", "Tracking collection value over time", "Connecting with local record enthusiasts"]
  },
  {
    name: "Stream Party Sync",
    description: "An app that enables synchronized viewing and listening parties for streaming content, allowing friends to watch movies, listen to music, or experience content together virtually with real-time chat and reactions.",
    target_audience: "Remote friends and family, streaming content viewers, long-distance relationship couples, social media users",
    core_features: ["Synchronized playback", "Real-time chat during content", "Reaction emoji system", "Multi-platform streaming support", "Private party rooms", "Schedule watching parties", "Content recommendation sharing", "Voice chat integration"],
    monetization_ideas: ["Premium synchronization features", "Streaming service partnerships", "Custom emoji packs", "Enhanced party room features"],
    complexity_rating: "High",
    category: ["Playground App Idea", "Entertainment & Media", "Social", "Streaming", "Communication"],
    keywords: ["watch party", "synchronized streaming", "virtual viewing", "social streaming", "remote watching", "content sharing", "streaming together", "media synchronization"],
    source_url: null,
    sample_data_snippet: {
      "party_name": "Movie Night Crew",
      "current_content": "The Grand Budapest Hotel",
      "participants": 8,
      "host": "MovieBuff_Alex",
      "sync_timestamp": "1:23:45",
      "chat_messages": 156,
      "platform": "Netflix",
      "party_status": "Active"
    },
    potential_use_cases: ["Watching movies with long-distance friends", "Listening to albums together remotely", "Hosting virtual TV show viewing parties", "Sharing reactions to content in real-time", "Creating regular social viewing schedules"]
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
  console.log(`[${SCRIPT_NAME}] Adding music and entertainment apps...`);

  try {
    await connectDB();
    const datasetsCollection = getCollection<AppIdeaDatasetDocument>('datasets');
    
    let inserted = 0;
    let skipped = 0;

    for (const app of musicEntertainmentApps) {
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
        generated_by_ai: false // These are manually crafted
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

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${SCRIPT_NAME}] ❌ Error:`, errorMessage);
  } finally {
    await closeDB();
    console.log(`[${SCRIPT_NAME}] Script finished.`);
  }
};

main();
