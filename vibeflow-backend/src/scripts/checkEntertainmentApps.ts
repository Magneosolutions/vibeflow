// File: vibeflow-backend/src/scripts/checkEntertainmentApps.ts

import { connectDB, getCollection, closeDB } from '../services/mongoService';

const SCRIPT_NAME = 'checkEntertainmentApps';

const main = async () => {
  console.log(`[${SCRIPT_NAME}] Checking entertainment and music apps...`);

  try {
    await connectDB();
    const datasetsCollection = getCollection('datasets');

    // Check for music-related apps
    console.log('\n=== MUSIC & ENTERTAINMENT APPS ===');
    const musicApps = await datasetsCollection.find({
      category: "Playground App Idea",
      $or: [
        { name: { $regex: /music|audio|song|playlist|sound/i } },
        { description: { $regex: /music|audio|song|playlist|sound|streaming/i } },
        { keywords: { $in: [/music/i, /audio/i, /playlist/i, /streaming/i] } },
        { category: { $in: [/music/i, /audio/i, /entertainment/i, /media/i] } }
      ]
    }).toArray();

    console.log(`Found ${musicApps.length} music-related apps:`);
    musicApps.forEach((app, index) => {
      console.log(`${index + 1}. "${app.name}"`);
      console.log(`   Description: ${app.description?.substring(0, 100)}...`);
      console.log(`   Categories: ${app.category?.join(', ')}`);
      console.log('');
    });

    // Check all entertainment apps
    console.log('\n=== ALL ENTERTAINMENT & MEDIA APPS ===');
    const entertainmentApps = await datasetsCollection.find({
      category: "Playground App Idea",
      $or: [
        { category: { $in: [/entertainment/i, /media/i] } },
        { description: { $regex: /entertainment|media|video|streaming|content/i } }
      ]
    }).toArray();

    console.log(`Found ${entertainmentApps.length} entertainment apps:`);
    entertainmentApps.forEach((app, index) => {
      console.log(`${index + 1}. "${app.name}"`);
      console.log(`   Categories: ${app.category?.join(', ')}`);
      console.log('');
    });

    // Check what categories exist
    console.log('\n=== ALL UNIQUE CATEGORIES ===');
    const allCategories = await datasetsCollection.aggregate([
      { $match: { category: "Playground App Idea" } },
      { $unwind: "$category" },
      { $match: { category: { $ne: "Playground App Idea" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    allCategories.forEach(cat => {
      console.log(`• ${cat._id}: ${cat.count} apps`);
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${SCRIPT_NAME}] Error:`, errorMessage);
  } finally {
    await closeDB();
    console.log(`[${SCRIPT_NAME}] Check complete.`);
  }
};

main();
