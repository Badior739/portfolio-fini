import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

// Fix process.cwd access with any cast
const uploadDir = path.join((process as any).cwd(), "tmp", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
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

async function tryUploadToS3(localPath: string, filename: string) {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;
  if (!bucket || !region) return null;

  try {
    // Dynamically import aws-sdk v3 client only if available at runtime.
    // Use a runtime require/import and avoid TypeScript type errors if the package is not installed.
    // @ts-ignore
    const pkg: any = await import('@aws-sdk/client-s3');
    const S3Client = pkg.S3Client;
    const PutObjectCommand = pkg.PutObjectCommand;
    if (!S3Client || !PutObjectCommand) {
      console.warn('@aws-sdk/client-s3 appears missing or incompatible');
      return null;
    }
    const client = new S3Client({ region, credentials: process.env.AWS_ACCESS_KEY_ID ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    } : undefined });

    const body = fs.createReadStream(localPath);
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: filename, Body: body, ACL: 'public-read' }));
    // Return S3 url (best-effort)
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(filename)}`;
    return url;
  } catch (e) {
    console.warn('S3 upload failed or @aws-sdk/client-s3 not installed:', e);
    return null;
  }
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

    const localPath = path.join(uploadDir, file.filename);

    // optional scan
    const ok = await runScanIfConfigured(localPath);
    if (!ok) {
      // delete file
      try { fs.unlinkSync(localPath); } catch (e) {}
      return res.status(400).json({ success: false, message: 'Fichier rejeté par le scanner' });
    }

    // If S3 is configured attempt to upload; if it fails we still keep local file
    const s3Url = await tryUploadToS3(localPath, file.filename);
    const url = s3Url || `/uploads/${file.filename}`;
    res.json({ success: true, url });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};