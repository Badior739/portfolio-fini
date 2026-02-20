
import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "../db";
import { storedFiles } from "../db/schema";
import { eq } from "drizzle-orm";

// Fix process.cwd access with any cast
const uploadDir = path.join((process as any).cwd(), "tmp", "uploads");
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.warn("Impossible de créer le répertoire d'upload (peut-être en lecture seule)", e);
  }
}

const USE_S3 = !!(process.env.S3_BUCKET);
const USE_DB = process.env.STORAGE_TYPE === "db";

// Configure storage
const storage = (USE_S3 || USE_DB)
  ? multer.memoryStorage() 
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadDir),
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
    });

// accept PDFs, Word docs, images
const allowedMime = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function fileFilter(_req: any, file: any, cb: multer.FileFilterCallback) {
  if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
  if (file.mimetype && allowedMime.includes(file.mimetype)) return cb(null, true);
  return cb(new Error('Type de fichier non autorisé'));
}

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

export const uploadHandler = upload.single("file");

async function uploadToS3(buffer: Buffer, filename: string, mimetype: string) {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION || "us-east-1";
  const endpoint = process.env.S3_ENDPOINT;
  
  if (!bucket) throw new Error("S3_BUCKET not configured");

  const client = new S3Client({ 
    region, 
    endpoint,
    credentials: process.env.AWS_ACCESS_KEY_ID ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    } : undefined,
    forcePathStyle: !!endpoint // Often needed for non-AWS S3 (MinIO, etc)
  });

  const key = `${Date.now()}-${filename.replace(/\s+/g, "-")}`;

  await client.send(new PutObjectCommand({ 
    Bucket: bucket, 
    Key: key, 
    Body: buffer, 
    ContentType: mimetype,
    ACL: 'public-read' 
  }));

  // Construct Public URL
  if (process.env.S3_PUBLIC_URL) {
    return `${process.env.S3_PUBLIC_URL}/${key}`;
  }
  
  if (endpoint) {
     // For R2 or others, it might be different, but let's try standard path style
     return `${endpoint}/${bucket}/${key}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;
}

async function uploadToDb(buffer: Buffer, filename: string, mimetype: string) {
  if (!db) throw new Error("Database not configured");
  
  const base64 = buffer.toString('base64');
  const result = await db.insert(storedFiles).values({
    filename,
    mimeType: mimetype,
    data: base64,
    size: buffer.length
  }).returning({ id: storedFiles.id });

  // Return a local API URL that serves this file
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  // Note: we can't easily guess the full domain here without configuration, 
  // but we can return a relative path or use SITE_URL if set.
  // For now, let's assume relative path which works for frontend
  return `/api/files/${result[0].id}`;
}

function runScanIfConfigured(filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const cmd = process.env.SCAN_COMMAND;
    if (!cmd) return resolve(true); // nothing to do
    // replace placeholder {file} in command if present
    const final = cmd.includes('{file}') ? cmd.replace(/\{file\}/g, `"${filePath.replace(/"/g, '\\"')}"`) : `${cmd} "${filePath.replace(/"/g, '\\"')}"`;
    exec(final, (err, _stdout, _stderr) => {
      if (err) {
        console.error('Scan command failed:', err);
        return resolve(false);
      }
      resolve(true);
    });
  });
}

export const handleUpload: RequestHandler = async (req, res) => {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ success: false, message: "Aucun fichier reçu" });

    if (USE_S3) {
      // Memory Storage -> S3
      if (!file.buffer) {
        return res.status(500).json({ success: false, message: "Erreur interne (buffer manquant)" });
      }
      try {
        const url = await uploadToS3(file.buffer, file.originalname, file.mimetype);
        return res.json({ success: true, url });
      } catch (e) {
        console.error("S3 Upload Error:", e);
        return res.status(500).json({ success: false, message: "Échec de l'upload vers S3" });
      }
    } else if (USE_DB) {
       // Memory Storage -> Postgres
       if (!file.buffer) {
        return res.status(500).json({ success: false, message: "Erreur interne (buffer manquant)" });
      }
      try {
        const url = await uploadToDb(file.buffer, file.originalname, file.mimetype);
        return res.json({ success: true, url });
      } catch (e) {
        console.error("DB Upload Error:", e);
        return res.status(500).json({ success: false, message: "Échec de l'upload vers la DB" });
      }
    } else {
      // Disk Storage
      if (!file.path) {
         return res.status(500).json({ success: false, message: "Erreur interne (path manquant)" });
      }
      
      const localPath = file.path;
      // optional scan
      const ok = await runScanIfConfigured(localPath);
      if (!ok) {
        try { fs.unlinkSync(localPath); } catch (e) {}
        return res.status(400).json({ success: false, message: 'Fichier rejeté par le scanner' });
      }

      const url = `/uploads/${file.filename}`;
      res.json({ success: true, url });
    }
  } catch (e) {
    console.error("Upload handler error:", e);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const handleGetFile: RequestHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).send("Invalid ID");

    if (!db) return res.status(500).send("DB not configured");

    const result = await db.select().from(storedFiles).where(eq(storedFiles.id, id));
    if (result.length === 0) return res.status(404).send("File not found");

    const file = result[0];
    const buffer = Buffer.from(file.data, 'base64');

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', file.size);
    // Optional: caching
    res.setHeader('Cache-Control', 'public, max-age=31536000'); 
    
    res.send(buffer);
  } catch (e) {
    console.error("Get file error:", e);
    res.status(500).send("Server Error");
  }
};
