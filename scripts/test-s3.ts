
import { S3Client, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

async function testS3() {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION || "us-east-1";
  const endpoint = process.env.S3_ENDPOINT;
  
  console.log("⚙️  Testing S3 Configuration...");
  console.log(`   Bucket: ${bucket}`);
  console.log(`   Region: ${region}`);
  console.log(`   Endpoint: ${endpoint || "AWS Standard"}`);

  if (!bucket) {
    console.error("❌ S3_BUCKET is missing in .env");
    process.exit(1);
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("❌ AWS credentials missing in .env");
    process.exit(1);
  }

  const client = new S3Client({ 
    region, 
    endpoint,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    forcePathStyle: !!endpoint
  });

  try {
    // 1. List objects (Check permissions)
    console.log("📡 Listing objects...");
    await client.send(new ListObjectsCommand({ Bucket: bucket, MaxKeys: 1 }));
    console.log("✅ List objects successful (Connection OK)");

    // 2. Upload test file
    console.log("Hz Uploading test file...");
    const key = `test-${Date.now()}.txt`;
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: "Hello from Cosmos Portfolio Test!",
      ContentType: "text/plain",
      ACL: "public-read"
    }));
    console.log(`✅ Upload successful: ${key}`);

    console.log("🎉 S3 Configuration is VALID!");
    
  } catch (error) {
    console.error("❌ S3 Test Failed:", error);
    process.exit(1);
  }
}

testS3();
