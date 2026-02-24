import dotenv from "dotenv";
dotenv.config({ override: true });
import { sql } from "drizzle-orm";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { handleDemo } from "./routes/demo";
import { uploadHandler, handleRecruitPost } from "./routes/recruit";
import { handleResume } from "./routes/resume";
import { handleCurriculumPDF } from "./routes/curriculum";
import { registerSmtpRoutes } from "./routes/smtp";
import { handleGetStats, handleIncrementVisit, handleIncrementMessage, handleGetContent, handleGetPublicContent, handleSaveContent, handleResetStats, handleAdminLogin, handleAdminVerify2FA, handleSetAdminPassword, handleBroadcastEmail, handleContactSubmission, handleAppointmentSubmission, handleAdminReply, handleAdminSetup } from "./routes/admin";
import { handleSubscribe, handleGetSubscribers, handleRemoveSubscriber, handleConfirm } from "./routes/newsletter";
import { rateLimit } from './middleware/rateLimit';
import { authMiddleware } from './middleware/auth';
import { uploadHandler as uploadsUploadHandler, handleUpload, handleGetFile } from "./routes/uploads";
import { handleHealthCheck } from "../api/health";

export function createServer() {
  const app = express();

  // Middleware
  // Fix Express overload errors by casting middleware to any
  
  // Debug middleware to log origin
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log(`Request from origin: ${origin} | Method: ${req.method} | Path: ${req.path}`);
    if (req.method === 'POST') {
      console.log('Headers:', JSON.stringify(req.headers));
      // Body might not be parsed yet if this is before express.json()
    }
    next();
  });

  const corsOptions = {
    origin: [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://badiorportfolio.vercel.app',
      'https://portfolio-fini.vercel.app', 
      process.env.SITE_ORIGIN || '',
      process.env.RENDER_EXTERNAL_URL || '',
      /\.vercel\.app$/ // Allow all vercel subdomains for preview deployments
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.use(cors(corsOptions));
  
  // Handle preflight requests explicitly (Express 5 compatible wildcard)
  app.options(/.*/, cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root route for health check / reassurance
  // app.get("/", (_req, res) => {
  //   res.send("API Server is running 🚀 (v2). Use /api/ endpoints.");
  // });

  // Log parsed body for debugging
  app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log(`[BodyParser] ${req.method} ${req.path} Body:`, JSON.stringify(req.body).substring(0, 200));
    }
    next();
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/health", handleHealthCheck);

  // Fix RequestHandler mismatch errors by casting handlers to any
  app.get("/api/demo", handleDemo);

  // Recruit endpoint (multipart)
  try {
    app.post("/api/recruit", uploadHandler, handleRecruitPost);
  } catch (err) {
    console.error("Failed to register recruit route", err);
  }

  try {
    app.get("/api/resume", handleResume);
  } catch (err) {
    console.error("Failed to register resume route", err);
  }

  try {
    app.get("/api/curriculum", handleCurriculumPDF);
  } catch (err) {
    console.error("Failed to register curriculum route", err);
  }

  // Admin SMTP routes (expose masked config and allow a test email)
  try {
    registerSmtpRoutes(app);
  } catch (err) {
    console.error("Failed to register smtp admin routes", err);
  }

  // Admin stats and content routes
  app.get("/api/admin/stats", authMiddleware, handleGetStats);
  app.post("/api/admin/visit", handleIncrementVisit); // Public
  app.post("/api/admin/message", handleIncrementMessage); // Public
  app.post("/api/contact", handleContactSubmission); // Public
  app.post("/api/appointment", handleAppointmentSubmission); // Public
  
  // Content routes
  app.get("/api/content", handleGetPublicContent); // Public
  app.get("/api/admin/content", authMiddleware, handleGetContent);
  app.post("/api/admin/content", authMiddleware, handleSaveContent);
  
  app.post("/api/admin/reset", authMiddleware, handleResetStats);
  app.post('/api/admin/login', handleAdminLogin);
  app.post('/api/admin/setup', handleAdminSetup);
  app.post('/api/admin/verify-2fa', handleAdminVerify2FA);
  app.post('/api/admin/password', authMiddleware, handleSetAdminPassword);
  app.post('/api/admin/broadcast', authMiddleware, handleBroadcastEmail);
  app.post('/api/admin/reply', authMiddleware, handleAdminReply);

  // Newsletter routes (apply lightweight rate limiting for subscribe)
  app.post("/api/newsletter/subscribe", rateLimit({ windowMs: 60_000, max: 6 }), handleSubscribe);
  app.get("/api/newsletter/subscribers", authMiddleware, handleGetSubscribers);
  app.post("/api/newsletter/remove", authMiddleware, rateLimit({ windowMs: 60_000, max: 6 }), handleRemoveSubscriber);
  app.get('/api/newsletter/confirm', handleConfirm);
  
  // Uploads endpoint + static serve
  try {
    // Protect upload endpoint from excessive requests
    // Require auth for uploads as well to prevent spam
    app.post('/api/uploads', authMiddleware, rateLimit({ windowMs: 60_000, max: 12 }), uploadsUploadHandler, handleUpload);
    // Serve files from DB
    app.get('/api/files/:id', handleGetFile);
    
    // Serve uploaded files - Safely for Vercel
    try {
      const uploadDir = path.join(require('os').tmpdir(), 'uploads');
      // Only attempt to serve if directory exists, or just define it (express.static is safe if dir doesn't exist)
      app.use('/uploads', express.static(uploadDir));
    } catch (e) {
      console.warn("Could not setup static uploads serving:", e);
    }
  } catch (err) {
    console.error('Failed to register uploads route', err);
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message || 'Unknown error',
      path: req.path,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  // Catch-all route for SPA (MUST be after API routes)
  // Skip this if we are in BACKEND_ONLY mode (e.g., Vercel Serverless Backend)
  if (process.env.BACKEND_ONLY !== 'true') {
    app.get(/.*/, (req, res) => {
      // If it's an API call that wasn't handled, 404
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "Not Found" });
      }
      
      // Otherwise serve index.html
      const indexFile = path.join(process.cwd(), "dist", "spa", "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("App not built correctly (index.html missing)");
      }
    });
  } else {
    // In backend-only mode, any non-api route returns 404
    app.get(/.*/, (req, res) => {
      res.status(404).json({ 
        error: "Not Found", 
        message: "This is a backend-only server. Please use /api/ endpoints." 
      });
    });
  }

  return app;
}