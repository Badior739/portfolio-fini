import { RequestHandler } from "express";
import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";

interface SiteData {
  visits: number;
  messages: number;
  skills: any[];
  projects: any[];
  subscribers: Array<{ email: string; date: string }>;
}

// Fix process.cwd access with any cast
const DATA_FILE = path.join((process as any).cwd(), "data", "site-data.json");

function loadData(): SiteData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {}
  return {
    visits: 0,
    messages: 0,
    skills: [],
    projects: [],
    subscribers: [],
  };
}

async function sendWelcomeEmail(email: string) {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return;

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(process.env.SMTP_PORT || '587'),
      secure: Number(process.env.SMTP_PORT || '587') === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    await transporter.sendMail({
      from: `"BADIOR Ouattara" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Bienvenue dans mon univers architectural',
      html: `
        <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px; border-radius: 20px;">
          <h1 style="color: #fff; border-bottom: 1px solid #333; padding-bottom: 20px;">Bienvenue,</h1>
          <p style="color: #ccc; line-height: 1.6;">Merci de vous être inscrit à ma newsletter. Vous recevrez désormais mes dernières réalisations, réflexions sur l'architecture logicielle et innovations technologiques en avant-première.</p>
          <p style="color: #ccc;">Au plaisir d'échanger avec vous.</p>
          <br>
          <p style="color: #666; font-size: 12px;">BADIOR Ouattara • Architecte Digital</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
}

function saveData(data: SiteData): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export const handleSubscribe: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Email requis" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email invalide" });
    }

    const data = loadData();
    // defensive: ensure subscribers array exists
    if (!Array.isArray((data as any).subscribers)) (data as any).subscribers = [];
    if (!Array.isArray((data as any).pendingSubscribers)) (data as any).pendingSubscribers = [];

    const exists = (data.subscribers || []).some(
      (sub) => sub.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Cet email est déjà inscrit" });
    }

    const DOUBLE_OPTIN = (process.env.NEWSLETTER_DOUBLE_OPTIN || 'false').toLowerCase() === 'true';
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (DOUBLE_OPTIN) {
      // create token and store in pending
      const token = crypto.randomBytes(20).toString('hex');
      const expires = Date.now() + 1000 * 60 * 60 * 24; // 24h
      (data as any).pendingSubscribers.push({ email, token, date: new Date().toISOString(), expires });
      saveData(data);

      const confirmUrl = `${process.env.SITE_ORIGIN || 'http://localhost:8080'}/api/newsletter/confirm?token=${token}`;

      // If SMTP configured, send email; otherwise, return the confirmUrl for dev/testing
      if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(process.env.SMTP_PORT || '587'),
            secure: Number(process.env.SMTP_PORT || '587') === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS }
          });
          await transporter.sendMail({
            from: process.env.SMTP_FROM || SMTP_USER,
            to: email,
            subject: 'Confirmez votre inscription',
            text: `Veuillez confirmer votre inscription en cliquant sur ce lien: ${confirmUrl}`
          });
          return res.json({ success: true, message: 'Email de confirmation envoyé (double opt-in).' });
        } catch (err) {
          console.error('Failed to send confirmation email, falling back to dev URL:', err);
          // fallthrough to return confirmUrl
        }
      }

      // Dev fallback: return confirmation URL so dev/test can confirm without SMTP
      console.log(`Newsletter confirmation URL for ${email}: ${confirmUrl}`);
      return res.json({ success: true, message: 'Confirmation URL générée (mode dev).', confirmUrl });
    }

    data.subscribers.push({
      email,
      date: new Date().toISOString(),
    });

    saveData(data);
    await sendWelcomeEmail(email);

    res.json({
      success: true,
      message: "Inscription réussie",
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur" });
  }
};

export const handleConfirm: RequestHandler = (req, res) => {
  try {
    const token = req.query.token as string;
    if (!token) return res.status(400).send('Token requis');
    const data = loadData();
    (data as any).pendingSubscribers = (data as any).pendingSubscribers || [];
    const idx = (data as any).pendingSubscribers.findIndex((p: any) => p.token === token);
    if (idx === -1) return res.status(400).send('Token invalide ou expiré');
    const pending = (data as any).pendingSubscribers[idx];
    if (pending.expires && Date.now() > pending.expires) {
      // remove
      (data as any).pendingSubscribers.splice(idx, 1);
      saveData(data);
      return res.status(400).send('Token expiré');
    }
    (data as any).subscribers.push({ email: pending.email, date: new Date().toISOString() });
    (data as any).pendingSubscribers.splice(idx, 1);
    saveData(data);
    sendWelcomeEmail(pending.email); // Background trigger
    return res.send('Inscription confirmée. Merci !');
  } catch (e) {
    console.error('Confirm subscribe error', e);
    return res.status(500).send('Erreur serveur');
  }
};

export const handleGetSubscribers: RequestHandler = (req, res) => {
  try {
    const data = loadData();
    res.json({
      success: true,
      subscribers: data.subscribers || [],
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur" });
  }
};

export const handleRemoveSubscriber: RequestHandler = (req, res) => {
  try {
    const { email } = req.body;
    const password = (req.headers["x-admin-password"] as string) || "";

    const data = loadData();
    // support hashed admin password stored in data.admin: { salt, hash }
    const adminInfo: any = (data as any).admin;
    let ok = false;
    if (adminInfo && adminInfo.salt && adminInfo.hash) {
      try {
        // Fix Buffer access with any cast
        const derived = crypto.scryptSync(password, (global as any).Buffer.from(adminInfo.salt, 'hex'), 64).toString('hex');
        ok = derived === adminInfo.hash;
      } catch (e) {
        ok = false;
      }
    } else {
      // fallback to env var
      ok = password === (process.env.ADMIN_PASSWORD || 'admin123');
    }

    if (!ok) {
      return res.status(401).json({ success: false, message: "Authentification échouée" });
    }

    (data as any).subscribers = (data as any).subscribers || [];
    (data as any).subscribers = (data as any).subscribers.filter(
      (sub: any) => sub.email.toLowerCase() !== email.toLowerCase()
    );
    saveData(data);

    res.json({
      success: true,
      message: "Abonné supprimé",
    });
  } catch (error) {
    console.error("Remove subscriber error:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur" });
  }
};