import express, { Express, Request, Response } from 'express';
// import dotenv from 'dotenv'; // dotenv is initialized in ./config
import cors from 'cors';
import { config } from './config'; // Import our centralized config
import { connectDB, closeDB } from './services/mongoService'; // Import DB connection functions

const app: Express = express();
const port = config.port;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Simple root route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('VibeFlow Backend is Alive!');
});

// TODO: Import and use vibeRoutes
// import vibeRoutes from './routes/vibeRoutes';
// app.use('/api', vibeRoutes);

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB before starting the server
    app.listen(port, () => {
      console.log(`[server]: VibeFlow Backend is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    // connectDB already handles process.exit(1) on initial failure,
    // but this catch is good for other potential startup errors.
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(signal => {
  process.on(signal, async () => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    try {
      await closeDB();
      console.log("MongoDB connection closed.");
    } catch (error) {
      console.error("Error during DB cleanup:", error);
    } finally {
      console.log("Exiting.");
      process.exit(0);
    }
  });
});
