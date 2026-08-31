// Write your code here
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

// Allow our React frontend to talk to this backend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://smart-code-translator.vercel.app", // Production Vercel
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));

// Convert incoming JSON requests to JavaScript objects
app.use(express.json());

// Mount all API routes under /api
app.use("/api", routes);

// Handle errors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;