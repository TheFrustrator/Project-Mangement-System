import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

/*
  IMPORTANT:
  Allow your frontend domain explicitly
*/
const allowedOrigins = [
  "https://timedelay.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight
app.options("*", cors());

app.use(morgan("dev"));
app.use(express.json());

// Mongo connection (cached for serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to TaskHub API",
  });
});

app.use("/api-v1", routes);

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
