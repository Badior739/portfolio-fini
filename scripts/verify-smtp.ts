import { createTransporter } from "./server/config/smtp";

async function testConnection() {
  const transporter = createTransporter();
  if (!transporter) {
    console.error("Transporter could not be created. Check your .env file.");
    return;
  }

  try {
    const result = await transporter.verify();
    console.log("SMTP Connection verified successfully:", result);
  } catch (error) {
    console.error("SMTP Connection failed:", error);
  }
}

testConnection();
