import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

// DB (serverless safe)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  const db = await mongoose.connect(process.env.MONGODB_URI);
  isConnected = db.connections[0].readyState;
};
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// routes
app.get("/", (req, res) => res.json({ message: "Welcome to TaskHub API" }));
app.use("/api-v1", routes);

// errors
app.use((err, req, res, next) =>
  res.status(500).json({ message: "Internal server error" }),
);
app.use((req, res) => res.status(404).json({ message: "Not found" }));

export default app;
