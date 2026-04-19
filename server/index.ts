import dotenv from "dotenv";
dotenv.config({ override: true });
import os from "os";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { db } from "./db"; // Import direct pour s'assurer qu'il est chargé
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

  // Forcer une vérification rapide de la DB
  try {
      if (db) console.log("✅ Database initialized successfully.");
  } catch (e) {
      console.error("❌ Database initialization failed:", e);
  }

  const corsOptions = {
    origin: '*', // Plus permissif temporairement pour déboguer le 500
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes API
  app.get("/api/health", handleHealthCheck);
  app.post("/api/recruit", uploadHandler, handleRecruitPost);
  app.post("/api/contact", handleContactSubmission);
  app.post("/api/appointment", handleAppointmentSubmission);
  app.post("/api/newsletter/subscribe", rateLimit({ windowMs: 60_000, max: 6 }), handleSubscribe);

  // Routes protégées ou spécifiques
  app.get('/api/files/:id', handleGetFile);
  app.post('/api/uploads', authMiddleware, uploadsUploadHandler, handleUpload);

  // Fallback global pour éviter les erreurs 500 brutales
  app.use((req, res, next) => {
      try {
          next();
      } catch (err) {
          console.error("Global catch:", err);
          res.status(500).json({ error: "Server error" });
      }
  });

  // Static files
  if (process.env.BACKEND_ONLY !== 'true') {
    app.use(express.static(path.join(process.cwd(), "dist", "spa")));
    app.get(/.*/, (req, res) => {
      if (req.path.startsWith("/api")) return res.status(404).json({ error: "Not Found" });
      res.sendFile(path.join(process.cwd(), "dist", "spa", "index.html"));
    });
  }

  return app;
}