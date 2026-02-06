import { RequestHandler } from "express";
import path from "path";
import fs from "fs";

export const handleCurriculumPDF: RequestHandler = (req, res) => {
  // Fix process.cwd access with any cast
  const filePath = path.join((process as any).cwd(), "public", "curriculum.pdf");
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "CV not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="curriculum.pdf"');
  res.sendFile(filePath);
};