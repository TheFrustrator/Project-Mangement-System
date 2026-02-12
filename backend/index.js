import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

// 1. Essential Security Headers
app.use(helmet());

// 2. Optimized CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://timedelay.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 3. Performance & Parsing Middleware
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" })); // Protects against large payload DoS attacks

// 4. Robust MongoDB Connection (Singleton Pattern)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("Critical: Failed to connect to DB:", err.message);
    // In serverless, we don't exit the process, we let the function retry
  }
};

// Ensure DB is connected before any request is processed
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// 5. Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to TaskHub API" });
});

app.use("/api-v1", routes);

// 6. Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message,
  });
});

// 7. 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Vercel handles the listening, but keep this for local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;