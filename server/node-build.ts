import path from "path";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
// Fix import.meta.dirname access with any cast
const __dirname = (import.meta as any).dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
// Fix Express middleware overload error by casting static middleware to any
app.use(express.static(distPath) as any);

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
// Fix process usage with any cast
(process as any).on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  (process as any).exit(0);
});

(process as any).on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  (process as any).exit(0);
});