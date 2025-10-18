// backend/index.js (or your main server file)
import express from "express";
import cors from "cors";

import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import assessmentRouter from "./routes/assessmentRoute.js";
import testimonialRouter from "./routes/testimonialRoute.js";
import blogPostRouter from "./routes/blogPostRoute.js";
import uploadRouter from "./routes/uploadRoute.js";
import moodTrackingRouter from "./routes/moodTrackingRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import notificationService from "./services/notificationService.js";
import analyticsRouter from "./routes/userAnalyticsRoute.js";
import chatRouter from "./routes/chatRoute.js";
// -------- app config ----------
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// -------- middlewares ---------
app.use(express.json({ limit: "400mb" }));

// CORS: allow production frontends and optional overrides via env
const defaultAllowedOrigins = [
  "https://moodmantra.com",
  "https://www.moodmantra.com",
  "https://admin.moodmantra.com",
  "https://moodmantra.netlify.app",
  "https://moodmantraadmin.netlify.app",
  // local dev fallbacks
  "https://localhost:5173",
  "https://localhost:5174",
];
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const corsOrigins = allowedOrigins.length
  ? allowedOrigins
  : defaultAllowedOrigins;

// For now, use this simpler configuration to test:
app.use(
  cors({
    origin: true, // Allow all origins (for testing)
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "token",
      "atoken",
      "dtoken",
    ],
  })
);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ------ api endpoints ------
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/assessments", assessmentRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/blog-posts", blogPostRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/mood-tracking", moodTrackingRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("API WORKING...");
});

app.get("/test", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

// -------- error handler (must be last) --------
app.use((err, req, res, next) => {
  console.error("💥 Error caught:", err.stack || err.message);
  res.status(500).json({ error: "Internal server error" });
});

// -------- port listen -------
app.listen(port, () => {
  console.log("Server Running on port", port);

  // Start notification service
  notificationService.start();
  console.log("Notification service started");
});
