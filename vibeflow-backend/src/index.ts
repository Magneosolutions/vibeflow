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

// Import and use vibeRoutes
import vibeRoutes from './routes/vibeRoutes';
app.use('/api', vibeRoutes); // All routes in vibeRoutes will be prefixed with /api

// Import and use playgroundRoutes
import playgroundRoutes from './routes/playgroundRoutes';
app.use('/api/playground', playgroundRoutes);

// Global error handling middleware (should be defined after all other app.use() and routes calls)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Global Error Handler]:", err.stack);
  if (!res.headersSent) {
    res.status(500).json({ 
      error: 'An internal server error occurred.', 
      // Optionally include details in development, but not production
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  } else {
    next(err); // Delegate to default Express error handler if headers already sent
  }
});

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
