import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ override: true });

async function testSMTP() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || "587");

  console.log(`Connecting to ${host}:${port} as ${user}...`);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.verify();
    console.log("✅ Success: SMTP connection is active!");
    
    // Attempt to send a test email
    const info = await transporter.sendMail({
      from: user,
      to: user,
      subject: "Test Diagnostic SMTP",
      text: "Si vous lisez ceci, l'envoi d'email fonctionne parfaitement."
    });
    console.log("✅ Success: Test email sent!", info.messageId);
  } catch (err: any) {
    console.error("❌ Error: SMTP failed");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    
    if (err.message.includes("Invalid login")) {
      console.log("\n💡 SUGGESTION: Gmail nécessite souvent un 'Mot de passe d'application'.");
      console.log("Suivez ce lien : https://myaccount.google.com/apppasswords");
    }
  }
}

testSMTP();
