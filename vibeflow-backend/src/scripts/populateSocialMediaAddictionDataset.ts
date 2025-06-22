import { MongoClient, ObjectId, Document as MongoDocument } from 'mongodb';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
import * as csv from 'csv-parser';

interface SocialMediaAddictionDocument extends MongoDocument {
  _id?: ObjectId;
  Student_ID: string;
  Age: string;
  Gender: string;
  Academic_Level: string;
  Country: string;
  Avg_Daily_Usage_Hours: string;
  Most_Used_Platform: string;
  Affects_Academic_Performance: string;
  Sleep_Hours_Per_Night: string;
  Mental_Health_Score: string;
  Relationship_Status: string;
  Conflicts_Over_Social_Media: string;
  Addicted_Score: string;
  description_embedding?: number[];
  date_added_to_vibeflow: Date;
  last_verified_by_vibeflow: Date;
}

const socialMediaAddictionData: Omit<SocialMediaAddictionDocument, '_id' | 'description_embedding' | 'date_added_to_vibeflow' | 'last_verified_by_vibeflow'>[] = [
  {
    Student_ID: "1",
    Age: "19",
    Gender: "Female",
    Academic_Level: "Undergraduate",
    Country: "Bangladesh",
    Avg_Daily_Usage_Hours: "5.2",
    Most_Used_Platform: "Instagram",
    Affects_Academic_Performance: "Yes",
    Sleep_Hours_Per_Night: "6.5",
    Mental_Health_Score: "6",
    Relationship_Status: "In Relationship",
    Conflicts_Over_Social_Media: "3",
    Addicted_Score: "8"
  },
  {
    Student_ID: "2",
    Age: "22",
    Gender: "Male",
    Academic_Level: "Graduate",
    Country: "India",
    Avg_Daily_Usage_Hours: "2.1",
    Most_Used_Platform: "Twitter",
    Affects_Academic_Performance: "No",
    Sleep_Hours_Per_Night: "7.5",
    Mental_Health_Score: "8",
    Relationship_Status: "Single",
    Conflicts_Over_Social_Media: "0",
    Addicted_Score: "3"
  }
];

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
    const collection = db.collection('datasets');

    // Insert the data into the MongoDB collection
    for (const data of socialMediaAddictionData) {
      const documentToInsert: SocialMediaAddictionDocument = {
        Student_ID: data.Student_ID,
        Age: data.Age,
        Gender: data.Gender,
        Academic_Level: data.Academic_Level,
        Country: data.Country,
        Avg_Daily_Usage_Hours: data.Avg_Daily_Usage_Hours,
        Most_Used_Platform: data.Most_Used_Platform,
        Affects_Academic_Performance: data.Affects_Academic_Performance,
        Sleep_Hours_Per_Night: data.Sleep_Hours_Per_Night,
        Mental_Health_Score: data.Mental_Health_Score,
        Relationship_Status: data.Relationship_Status,
        Conflicts_Over_Social_Media: data.Conflicts_Over_Social_Media,
        Addicted_Score: data.Addicted_Score,
        date_added_to_vibeflow: new Date(),
        last_verified_by_vibeflow: new Date()
      };
      const insertResult = await collection.insertOne(documentToInsert);
      console.log(`Inserted 1 document into datasets collection with id: ${insertResult.insertedId}`);
    }
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    await client.close();
  }
}

populateSocialMediaAddictionDataset();
