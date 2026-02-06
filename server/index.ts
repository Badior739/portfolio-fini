import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { uploadHandler, handleRecruitPost } from "./routes/recruit";
import { handleResume } from "./routes/resume";
import { handleCurriculumPDF } from "./routes/curriculum";
import { registerSmtpRoutes } from "./routes/smtp";
import { handleGetStats, handleIncrementVisit, handleIncrementMessage, handleGetContent, handleSaveContent, handleResetStats, handleAdminLogin, handleAdminVerify2FA, handleSetAdminPassword, handleBroadcastEmail, handleContactSubmission } from "./routes/admin";
import { handleSubscribe, handleGetSubscribers, handleRemoveSubscriber, handleConfirm } from "./routes/newsletter";
import { rateLimit } from './middleware/rateLimit';
import { uploadHandler as uploadsUploadHandler, handleUpload } from "./routes/uploads";
import path from "path";

export function createServer() {
  const app = express();

  // Middleware
  // Fix Express overload errors by casting middleware to any
  app.use(cors() as any);
  app.use(express.json() as any);
  app.use(express.urlencoded({ extended: true }) as any);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Fix RequestHandler mismatch errors by casting handlers to any
  app.get("/api/demo", handleDemo as any);

  // Recruit endpoint (multipart)
  try {
    app.post("/api/recruit", uploadHandler as any, handleRecruitPost as any);
  } catch (err) {
    console.error("Failed to register recruit route", err);
  }

  try {
    app.get("/api/resume", handleResume as any);
  } catch (err) {
    console.error("Failed to register resume route", err);
  }

  try {
    app.get("/api/curriculum", handleCurriculumPDF as any);
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
  app.get("/api/admin/stats", handleGetStats as any);
  app.post("/api/admin/visit", handleIncrementVisit as any);
  app.post("/api/admin/message", handleIncrementMessage as any);
  app.post("/api/contact", handleContactSubmission as any);
  app.get("/api/admin/content", handleGetContent as any);
  app.post("/api/admin/content", handleSaveContent as any);
  app.post("/api/admin/reset", handleResetStats as any);
  app.post('/api/admin/login', handleAdminLogin as any);
  app.post('/api/admin/verify-2fa', handleAdminVerify2FA as any);
  app.post('/api/admin/password', handleSetAdminPassword as any);
  app.post('/api/admin/broadcast', handleBroadcastEmail as any);

  // Newsletter routes (apply lightweight rate limiting for subscribe)
  app.post("/api/newsletter/subscribe", rateLimit({ windowMs: 60_000, max: 6 }) as any, handleSubscribe as any);
  app.get("/api/newsletter/subscribers", handleGetSubscribers as any);
  app.post("/api/newsletter/remove", rateLimit({ windowMs: 60_000, max: 6 }) as any, handleRemoveSubscriber as any);
  app.get('/api/newsletter/confirm', handleConfirm as any);

  // Uploads endpoint + static serve
  try {
    // Protect upload endpoint from excessive requests
    app.post('/api/uploads', rateLimit({ windowMs: 60_000, max: 12 }) as any, uploadsUploadHandler as any, handleUpload as any);
    // Fix process.cwd access with any cast and static middleware cast
    app.use('/uploads', express.static(path.join((process as any).cwd(), 'tmp', 'uploads')) as any);
  } catch (err) {
    console.error('Failed to register uploads route', err);
  }

  return app;
}