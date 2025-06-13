import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { config } from './config'; // Import our centralized config

// dotenv.config(); // Already called in config/index.ts, but doesn't hurt to call again if modules are loaded in different orders.
                  // However, it's cleaner to rely on the one in config/index.ts

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

app.listen(port, () => {
  console.log(`[server]: VibeFlow Backend is running at http://localhost:${port}`);
});
