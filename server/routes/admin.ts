import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createTransporter, getSmtpConfig } from "../config/smtp";
import { SiteData, Admin } from "@shared/api";

// Fix process.cwd access with any cast
const DATA_FILE = path.join((process as any).cwd(), "data", "site-data.json");

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Load data from JSON file
function loadData(): SiteData {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error loading site data:", e);
  }
  return {
    visits: 0,
    messages: 0,
    skills: [],
    projects: [],
    subscribers: [],
  };
}

// Save data to JSON file
function saveData(data: SiteData) {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error saving site data:", e);
  }
}

function verifyAdminPassword(candidate: string) {
  const data = loadData();
  const admin: Admin | undefined = data.admin;
  if (admin && admin.salt && admin.hash) {
    try {
      // Fix Buffer access with any cast
      const derived = crypto.scryptSync(candidate, (global as any).Buffer.from(admin.salt, 'hex'), 64).toString('hex');
      return derived === admin.hash;
    } catch (e) {
      return false;
    }
  }

  // Dynamic check for env var
  const envPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  // Also check the specific password the user requested as a hard fallback
  if (candidate === "MGS_Admin_2026!") return true;
  
  return candidate === envPassword;
}

// Temporary in-memory store for OTPs
// In a production environment, this should ideally be in a database or Redis
const otpStore: Record<string, { code: string; expires: number }> = {};

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

export const handleAdminLogin: RequestHandler = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });
  
  if (verifyAdminPassword(password)) {
    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    // For simplicity, we use a single key since there's only one admin
    otpStore['admin'] = { code: otp, expires };

    const transporter = createTransporter();
    if (transporter) {
      const cfg = getSmtpConfig();
      if (cfg.to) {
        try {
          await transporter.sendMail({
            from: `${cfg.fromName || "Portfolio Admin"} <${cfg.user}>`,
            to: cfg.to,
            subject: `Code de vérification Admin - ${otp}`,
            text: `Votre code de vérification est : ${otp}\nIl expirera dans 5 minutes.`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
                <h2 style="color: #8b5cf6;">Authentification Administrateur</h2>
                <p>Un accès a été tenté pour votre tableau de bord.</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="font-size: 12px; color: #666;">Ce code expire dans 5 minutes.</p>
              </div>
            `
          });
          
          // EMERGENCY LOG: Allows the developer to see the code in the terminal
          console.log(`[AUTH] 2FA Code for admin: ${otp}`);
          
          return res.json({ requires2FA: true });
        } catch (err) {
          console.error("Failed to send 2FA email:", err);
          return res.status(500).json({ error: "Failed to send verification code" });
        }
      }
    }
    
    // Fallback if SMTP is not configured: in a real app this is a security risk, 
    // but for this dev portfolio we might want to log it or handle it.
    // For now, we'll require SMTP for 2FA to work.
    return res.status(500).json({ error: "SMTP non configuré pour la 2FA" });
  }
  
  return res.status(401).json({ error: 'Invalid password' });
};

export const handleAdminVerify2FA: RequestHandler = (req, res) => {
  const { code } = req.body;
  const stored = otpStore['admin'];

  if (!stored) {
    return res.status(400).json({ error: "Aucune session 2FA en cours" });
  }

  if (Date.now() > stored.expires) {
    delete otpStore['admin'];
    return res.status(401).json({ error: "Code expiré" });
  }

  if (code === stored.code) {
    delete otpStore['admin'];
    return res.json({ success: true });
  }

  return res.status(401).json({ error: "Code incorrect" });
};

export const handleSetAdminPassword: RequestHandler = (req, res) => {
  const current = req.headers['x-admin-password'] as string || req.body.current;
  const next = req.body.next;
  if (!current || !next) return res.status(400).json({ error: 'current and next required' });
  if (!verifyAdminPassword(current)) return res.status(401).json({ error: 'Invalid current password' });
  const data = loadData();
  const salt = crypto.randomBytes(16).toString('hex');
  // Fix Buffer access with any cast
  const hash = crypto.scryptSync(next, (global as any).Buffer.from(salt, 'hex'), 64).toString('hex');
  data.admin = { salt, hash };
  saveData(data);
  return res.json({ success: true });
};

export const handleGetStats: RequestHandler = (req, res) => {
  const data = loadData();
  res.json({
    visits: data.visits || 0,
    messages: data.messages || 0,
    subscribers: data.subscribers?.length || 0,
    statsHistory: data.statsHistory || []
  });
};

function ensureCurrentDayStats(data: SiteData): StatsEntry {
  const today = new Date().toISOString().split('T')[0];
  if (!data.statsHistory) data.statsHistory = [];
  
  let entry = data.statsHistory.find((s: StatsEntry) => s.date === today);
  if (!entry) {
    // Keep only last 14 days
    if (data.statsHistory.length > 14) data.statsHistory.shift();
    
    entry = { date: today, visits: 0, subscribers: data.subscribers?.length || 0, messages: 0 };
    data.statsHistory.push(entry);
  }
  return entry;
}

export const handleIncrementVisit: RequestHandler = (req, res) => {
  const data = loadData();
  data.visits = (data.visits || 0) + 1;
  const entry = ensureCurrentDayStats(data);
  entry.visits++;
  saveData(data);
  res.json({ visits: data.visits, history: data.statsHistory });
};

export const handleIncrementMessage: RequestHandler = (req, res) => {
  const data = loadData();
  data.messages = (data.messages || 0) + 1;
  const entry = ensureCurrentDayStats(data);
  entry.messages++;
  saveData(data);
  res.json({ messages: data.messages, history: data.statsHistory });
};

export const handleGetContent: RequestHandler = (req, res) => {
  const data = loadData();
  res.json({
    hero: data.hero,
    about: data.about,
    bento: data.bento,
    skills: data.skills || [],
    projects: data.projects || [],
    contact: data.contact,
    receivedMessages: data.receivedMessages || []
  });
};

export const handleSaveContent: RequestHandler = (req, res) => {
  const { password, ...content }: { password?: string } & Partial<SiteData> = req.body;
  if (!verifyAdminPassword(password || "")) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const data = loadData();
  
  // Update only provided keys
  (Object.keys(content) as Array<keyof SiteData>).forEach(key => {
    if (key !== 'password') { // Exclude password from content update
      (data as any)[key] = content[key];
    }
  });
  
  saveData(data);

  res.json({ success: true });
};

const premiumEmailTemplate = (subject: string, body: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #050505; color: #ffffff; font-family: 'Inter', sans-serif; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #0a0a0c; border: 1px solid #1a1a1c; border-radius: 24px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .header { text-align: center; border-bottom: 1px solid #1a1a1c; padding-bottom: 30px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; color: #fff; }
    .content { line-height: 1.6; color: rgba(255,255,255,0.7); font-size: 16px; }
    .footer { margin-top: 40px; padding-top: 30px; border-top: 1px solid #1a1a1c; text-align: center; color: rgba(255,255,255,0.3); font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Cosmos <span style="color: #666;">Architecture</span></div>
    </div>
    <div class="content">
      <h1 style="color: #fff; margin-bottom: 20px;">${subject}</h1>
      <p>${body.replace(/\n/g, '<br>')}</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} BADIOR Ouattara • Architecte Digital & Strategist
    </div>
  </div>
</body>
</html>
`;

export const handleBroadcastEmail: RequestHandler = async (req, res) => {
  const { password, subject, body } = req.body;
  if (!verifyAdminPassword(password)) return res.status(401).json({ error: "Unauthorized" });

  const data = loadData();
  const subscribers = data.subscribers || [];
  if (subscribers.length === 0) return res.status(400).json({ error: "No subscribers found" });

  try {
    const transporter = await createTransporter();
    const html = premiumEmailTemplate(subject, body);
    
    // Sequential send to avoid rate limiting and allow better logging
    let successCount = 0;
    for (const sub of subscribers) {
      try {
        await transporter.sendMail({
          from: `"BADIOR Ouattara" <${process.env.SMTP_USER}>`,
          to: sub.email,
          subject: subject,
          html: html
        });
        successCount++;
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error(`Failed to broadcast to ${sub.email}:`, err);
      }
    }

    res.json({ success: true, count: successCount });
  } catch (error) {
    console.error("Broadcast error:", error);
    res.status(500).json({ error: "Failed to broadcast emails" });
  }
};

export const handleContactSubmission: RequestHandler = async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const data = loadData();
  const newMessage = {
    id: Date.now(),
    date: new Date().toISOString(),
    name,
    email,
    message,
    status: 'unread'
  };

  data.receivedMessages = data.receivedMessages || [];
  data.receivedMessages.push(newMessage);
  data.messages = (data.messages || 0) + 1;
  saveData(data);

  try {
     const transporter = await createTransporter();
     await transporter.sendMail({
       from: `\"BADIOR Ouattara\" <${process.env.SMTP_USER}>`,
       to: email,
       subject: "Message bien reçu - BADIOR Ouattara",
       html: `
         <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px; border-radius: 20px;">
           <h1 style="color: #fff; border-bottom: 1px solid #333; padding-bottom: 20px;">Merci pour votre message,</h1>
           <p style="color: #ccc; line-height: 1.6;">Bonjour ${name},</p>
           <p style="color: #ccc; line-height: 1.6;">J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.</p>
           <div style="background: #111; padding: 20px; border-radius: 10px; border-left: 3px solid #8b5cf6; margin: 20px 0;">
             <p style="color: #999; font-size: 13px; margin: 0;"><strong>Votre message :</strong></p>
             <p style="color: #ccc; margin-top: 10px;">${message}</p>
           </div>
           <br>
           <p style="color: #666; font-size: 11px;">BADIOR Ouattara • Architecte Digital</p>
         </div>
       `
     });
  } catch (err) {
     console.error("Failed to send confirmation email:", err);
  }

  res.json({ success: true });
};

export const handleResetStats: RequestHandler = (req, res) => {
  const { password } = req.body;

  // Use verifyAdminPassword to allow either hashed admin in data file or env var
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const data = loadData();
  data.visits = 0;
  data.messages = 0;
  saveData(data);

  res.json({ success: true });
};