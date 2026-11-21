import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

// Routes
import aboutRoutes from "./routes/about.js";
import officialAccountRoutes from "./routes/officialAccount.js";
import announcementRoutes from "./routes/announcement.js";
import fileRoutes from "./routes/file.js";
import citizenRoutes from "./routes/citizen.js";
import concernRoutes from "./routes/concern.js";
import messageDetectionRoutes from "./routes/messageDetection.js";
import residentRoutes from "./routes/resident.js";
import officialRoutes from "./routes/official.js";
import historyRoutes from "./routes/history.js";
import authRoutes from "./routes/authentication.js";
import householdRoutes from "./routes/household.js";
import loginRoutes from "./routes/login.js";
import postRoutes from "./routes/post.js";
import portRoutes from "./routes/port.js";
import reportRoutes from "./routes/report.js";
import brgyInfoRoutes from "./routes/brgyInfo.js";
import otherInfoRoutes from "./routes/otherInfo.js";
import { alarm } from "./services/alarm.js";
import { cookieMiddleware } from "./utils/authCookies.js";

dotenv.config();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);

// Security: Hide server signature (OWASP Server Leaks via X-Powered-By)
app.disable("x-powered-by");

// Security Headers Middleware (OWASP A05 Security Misconfiguration)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Protect API endpoints with strict CSP
app.use("/api", (req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none';");
  next();
});

// Configure CORS with allowed origins
const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://brgy415-management.vercel.app",
  ...configuredOrigins,
];

const isAllowedVercelPreview = (origin) =>
  /^https:\/\/brgy415-management-[a-z0-9-]+\.vercel\.app$/i.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || isAllowedVercelPreview(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Blocked by CORS policy"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieMiddleware);

// Serve static files with absolute path and cross-origin resource policy
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Root route (just to test if server runs)
app.get("/", (req, res) => {
  res.send("Product Management API is running ✅");
});

// Routes
app.use("/api/about", aboutRoutes);
app.use("/api/officialAccounts", officialAccountRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/citizens", citizenRoutes);
app.use("/api/concerns", concernRoutes);
app.use("/api/messageDetection", messageDetectionRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/households", householdRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/officials", officialRoutes);
app.use("/api/post", postRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/authentication", authRoutes);
app.use("/api/ports", portRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/brgyinfo", brgyInfoRoutes);
app.use("/api/otherinfo", otherInfoRoutes);

// Handle 404 (unknown routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
alarm.start();
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
