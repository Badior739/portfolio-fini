
import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "../db";
import { storedFiles } from "../db/schema";
import { eq } from "drizzle-orm";
import os from "os";

// Use OS temp dir for serverless safety
const uploadDir = path.join(os.tmpdir(), "uploads");

// Ensure upload directory exists - safely
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn("Impossible de créer le répertoire d'upload (peut-être en lecture seule)", e);
}

const USE_S3 = !!(process.env.S3_BUCKET);
// Force DB storage if configured, unless S3 is explicitly set
const USE_DB = process.env.STORAGE_TYPE === "db" || (!!process.env.DATABASE_URL && !USE_S3);

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
  
  return `/api/uploads/${result[0].id}`;
}

export const handleUpload: RequestHandler = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    let url: string;
    
    if (USE_S3) {
      url = await uploadToS3(file.buffer!, file.originalname, file.mimetype);
    } else if (USE_DB) {
      url = await uploadToDb(file.buffer!, file.originalname, file.mimetype);
    } else {
      // Local file storage
      url = `/uploads/${file.filename}`;
    }

    res.json({ 
      url,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Erreur lors de l'upload", error: error.message });
  }
};

export const handleGetFile: RequestHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    if (!db) {
      return res.status(500).json({ message: "Base de données non configurée" });
    }

    const file = await db.query.storedFiles.findFirst({
      where: eq(storedFiles.id, id)
    });

    if (!file) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    const buffer = Buffer.from(file.data, 'base64');

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', file.size);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    
    res.send(buffer);
  } catch (error: any) {
    console.error("Get file error:", error);
    res.status(500).json({ message: "Erreur lors de la récupération du fichier" });
  }
};
