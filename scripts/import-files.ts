
import fs from "fs";
import path from "path";
import { db } from "../server/db";
import { storedFiles } from "../server/db/schema";
import dotenv from "dotenv";

dotenv.config();

async function importFiles() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("❌ Usage: npm run files:import <path-to-file-or-directory>");
    process.exit(1);
  }

  const targetPath = args[0];
  
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Path not found: ${targetPath}`);
    process.exit(1);
  }

  const stats = fs.statSync(targetPath);
  
  if (stats.isDirectory()) {
    // Import all files in directory
    const files = fs.readdirSync(targetPath);
    console.log(`📂 Importing directory: ${targetPath} (${files.length} files)`);
    for (const file of files) {
      await uploadFile(path.join(targetPath, file));
    }
  } else {
    // Import single file
    await uploadFile(targetPath);
  }

  console.log("✅ Import process finished.");
  process.exit(0);
}

async function uploadFile(filePath: string) {
  try {
    const filename = path.basename(filePath);
    console.log(`Processing ${filename}...`);

    const buffer = fs.readFileSync(filePath);
    const size = buffer.length;
    
    // Simple mime type detection
    const ext = path.extname(filename).toLowerCase();
    let mimeType = "application/octet-stream";
    if (ext === ".png") mimeType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    if (ext === ".pdf") mimeType = "application/pdf";
    if (ext === ".txt") mimeType = "text/plain";

    const base64 = buffer.toString('base64');

    if (!db) {
        throw new Error("Database connection not initialized");
    }

    const result = await db.insert(storedFiles).values({
      filename,
      mimeType,
      data: base64,
      size
    }).returning({ id: storedFiles.id });

    console.log(`✅ Uploaded: ${filename} (ID: ${result[0].id})`);
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error);
  }
}

importFiles();
