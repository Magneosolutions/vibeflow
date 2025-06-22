import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
import * as csv from 'csv-parser';

async function populateSocialMediaAddictionDataset() {
  const uri = process.env.MONGODB_URI_VIBEFLOW;

  if (!uri) {
    console.error('MONGODB_URI_VIBEFLOW is not defined in the environment variables.');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db();
    const collection = db.collection('socialmediaaddiction');

    // Read the CSV file
    const results: any[] = [];
    fs.createReadStream('/home/grace/Desktop/Vibeflow/Students Social Media Addiction.csv')
      .pipe(csv.default())
      .on('data', (data: any) => results.push(data))
      .on('end', async () => {
        try {
          // Insert the data into the MongoDB collection
          await collection.insertMany(results);
          console.log(`Inserted ${results.length} documents into socialmediaaddiction collection`);
        } catch (err) {
          console.error('Error inserting documents:', err);
        } finally {
          await client.close();
        }
      });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

populateSocialMediaAddictionDataset();
