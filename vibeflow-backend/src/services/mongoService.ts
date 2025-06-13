import { MongoClient, Db, Collection, Document } from 'mongodb'; // Added Document
import { config } from '../config';

let db: Db;
let client: MongoClient;
let isConnected = false; // Add a simple flag

const connectDB = async (): Promise<void> => {
  if (isConnected && db) { // Check our flag and if db is initialized
    console.log('MongoDB is already connected.');
    return;
  }

  if (!config.mongoURI) {
    // This case should ideally be caught by config/index.ts validation
    console.error('CRITICAL: MONGO_URI is not defined. Cannot connect to MongoDB.');
    throw new Error('MONGO_URI is not defined in the configuration.');
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    client = new MongoClient(config.mongoURI);
    
    // Optional: Add serverApi for strict mode if your Atlas cluster requires it
    // const client = new MongoClient(config.mongoURI, {
    //   serverApi: {
    //     version: ServerApiVersion.v1,
    //     strict: true,
    //     deprecationErrors: true,
    //   }
    // });

    await client.connect();
    
    // If your MONGO_URI includes the database name (e.g., ...mongodb.net/vibeflow_db?retryWrites...),
    // client.db() will use it. Otherwise, specify the database name here.
    // For VibeFlow, we decided on 'vibeflow_db' earlier.
    db = client.db("vibeflow_db"); 

    console.log('MongoDB connected successfully to database:', db.databaseName);

    isConnected = true; // Set flag on successful connection

    // Listeners for connection events
    client.on('close', () => {
      console.log('MongoDB connection closed.');
      isConnected = false; // Update flag
      // Potentially set db and client to null or undefined here if you want to allow re-connection attempts
    });
    client.on('error', (err) => {
      console.error('MongoDB connection error event:', err);
      isConnected = false; // Update flag on error too
    });

  } catch (error) {
    console.error('Could not connect to MongoDB during initial setup:', error);
    // Exit process on initial connection failure to prevent app from running without DB
    process.exit(1); 
  }
};

// Function to get the database instance
export const getDB = (): Db => {
  if (!db || !isConnected) { // Check our flag
    console.error('Database not initialized or connection lost. Call connectDB or ensure connection is stable.');
    throw new Error('Database not initialized or connection lost.');
  }
  return db;
};

// Function to get a specific collection, ensuring T extends MongoDB's Document type
export const getCollection = <T extends Document = Document>(collectionName: string): Collection<T> => {
  return getDB().collection<T>(collectionName);
};

// Export connectDB to be called from index.ts at server startup
export { connectDB };

// Optional: Graceful shutdown function
export const closeDB = async (): Promise<void> => {
  if (client && isConnected) { // Check our flag
    try {
      await client.close(); // client.close() handles disconnection
      // isConnected will be set to false by the 'close' event listener
      console.log('MongoDB connection closed gracefully.');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  } else {
    console.log('MongoDB client not connected or already closed.');
  }
};
