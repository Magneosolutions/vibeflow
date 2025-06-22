// File: vibeflow-backend/src/scripts/diagnosticCheck.ts

import { connectDB, getCollection, closeDB } from '../services/mongoService';
import { getTextEmbedding } from '../services/aiService';

const SCRIPT_NAME = 'diagnosticCheck';

const main = async () => {
  console.log(`[${SCRIPT_NAME}] Starting MongoDB diagnostic check...`);

  try {
    await connectDB();
    const datasetsCollection = getCollection('datasets');

    // 1. Check total dataset count
    const totalCount = await datasetsCollection.countDocuments();
    console.log(`[${SCRIPT_NAME}] ✅ Total documents in datasets collection: ${totalCount}`);

    // 2. Check documents with playground category
    const playgroundCount = await datasetsCollection.countDocuments({
      category: "Playground App Idea"
    });
    console.log(`[${SCRIPT_NAME}] ✅ Playground App Ideas: ${playgroundCount}`);

    // 3. Check embedding fields
    const withDescriptionEmbedding = await datasetsCollection.countDocuments({
      description_embedding: { $exists: true, $ne: null }
    });
    console.log(`[${SCRIPT_NAME}] ✅ Documents with description_embedding: ${withDescriptionEmbedding}`);

    const withEnhancedEmbedding = await datasetsCollection.countDocuments({
      enhanced_embedding: { $exists: true, $ne: null }
    });
    console.log(`[${SCRIPT_NAME}] ✅ Documents with enhanced_embedding: ${withEnhancedEmbedding}`);

    // 4. Check sample documents
    const sampleDocs = await datasetsCollection.find({
      category: "Playground App Idea"
    }).limit(3).toArray();
    
    console.log(`[${SCRIPT_NAME}] ✅ Sample documents:`);
    sampleDocs.forEach((doc, index) => {
      console.log(`  ${index + 1}. "${doc.name}"`);
      console.log(`     Description: "${doc.description?.substring(0, 100)}..."`);
      console.log(`     Has description_embedding: ${!!doc.description_embedding}`);
      console.log(`     Has enhanced_embedding: ${!!doc.enhanced_embedding}`);
      console.log(`     Categories: ${doc.category?.join(', ')}`);
      console.log('');
    });

    // 5. Test embedding generation
    console.log(`[${SCRIPT_NAME}] Testing embedding generation...`);
    const testText = "I want to create a social media app for hikers";
    const testEmbedding = await getTextEmbedding(testText);
    
    if (testEmbedding) {
      console.log(`[${SCRIPT_NAME}] ✅ Embedding generation works. Dimensions: ${testEmbedding.length}`);
    } else {
      console.log(`[${SCRIPT_NAME}] ❌ Embedding generation failed`);
    }

    // 6. Test a simple vector search
    if (testEmbedding && withDescriptionEmbedding > 0) {
      console.log(`[${SCRIPT_NAME}] Testing vector search...`);
      
      try {
        const searchResults = await datasetsCollection.aggregate([
          {
            $match: {
              category: "Playground App Idea",
              description_embedding: { $exists: true, $ne: null }
            }
          },
          {
            $vectorSearch: {
              index: 'vector_index_datasets_description',
              path: 'description_embedding',
              queryVector: testEmbedding,
              numCandidates: 10,
              limit: 3,
            },
          },
          {
            $project: { 
              name: 1,
              description: 1,
              score: { $meta: 'vectorSearchScore' }
            }
          }
        ]).toArray();

        console.log(`[${SCRIPT_NAME}] ✅ Vector search works! Found ${searchResults.length} results`);
        searchResults.forEach((result, index) => {
          console.log(`  ${index + 1}. "${result.name}" (score: ${result.score?.toFixed(3)})`);
        });

      } catch (searchError) {
        // Fixed TypeScript error by properly typing the error
        const errorMessage = searchError instanceof Error ? searchError.message : String(searchError);
        console.log(`[${SCRIPT_NAME}] ❌ Vector search failed:`, errorMessage);
      }
    } else {
      console.log(`[${SCRIPT_NAME}] ⚠️ Skipping vector search test (no test embedding or no documents with embeddings)`);
    }

    // 7. Check categories distribution
    const categoryPipeline = await datasetsCollection.aggregate([
      { $match: { category: "Playground App Idea" } },
      { $unwind: "$category" },
      { $match: { category: { $ne: "Playground App Idea" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    console.log(`[${SCRIPT_NAME}] ✅ Top categories:`);
    if (categoryPipeline.length > 0) {
      categoryPipeline.forEach(cat => {
        console.log(`  • ${cat._id}: ${cat.count} apps`);
      });
    } else {
      console.log(`  No category data found`);
    }

    // 8. Additional debugging - check actual document structure
    console.log(`[${SCRIPT_NAME}] ✅ Sample document structure:`);
    const sampleDoc = await datasetsCollection.findOne({ category: "Playground App Idea" });
    if (sampleDoc) {
      console.log(`  Fields present: ${Object.keys(sampleDoc).join(', ')}`);
      console.log(`  Sample name: ${sampleDoc.name}`);
      console.log(`  Sample categories: ${sampleDoc.category}`);
    } else {
      console.log(`  No Playground App Ideas found!`);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${SCRIPT_NAME}] ❌ Diagnostic failed:`, errorMessage);
  } finally {
    await closeDB();
    console.log(`[${SCRIPT_NAME}] Diagnostic complete.`);
  }
};

main();