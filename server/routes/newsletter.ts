import { RequestHandler } from "express";
import crypto from "crypto";
import { createTransporter } from "../config/smtp";
import { EmailTemplates } from "../lib/email-templates";
import { 
  loadData, 
  addSubscriber, 
  confirmSubscriber, 
  removeSubscriber 
} from "../lib/storage";

async function sendWelcomeEmail(email: string) {
  const transporter = await createTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"BADIOR Ouattara" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Bienvenue dans mon univers architectural',
      text: "Merci de vous être inscrit à ma newsletter. Vous recevrez désormais mes dernières réalisations.",
      html: EmailTemplates.newsletterWelcome()
    });
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
}

export const handleSubscribe: RequestHandler = async (req, res) => {
  try {
    console.log('Subscribe request body:', req.body);
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      console.log('Subscribe failed: Email missing or not string');
      return res.status(400).json({ success: false, message: "Email requis" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Subscribe failed: Invalid email format');
      return res
        .status(400)
        .json({ success: false, message: "Email invalide" });
    }

    const data = await loadData();
    
    // Check if already subscribed (verified)
    const exists = data.subscribers.some(
      (sub) => sub.email.toLowerCase() === email.toLowerCase()
    );
    
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Cet email est déjà inscrit" });
    }

    // Check if pending
    const pendingExists = data.pendingSubscribers?.some(
      (sub) => sub.email.toLowerCase() === email.toLowerCase()
    );

    if (pendingExists) {
       return res
        .status(400)
        .json({ success: false, message: "Cet email est déjà en attente de confirmation. Vérifiez vos emails." });
    }

    const DOUBLE_OPTIN = (process.env.NEWSLETTER_DOUBLE_OPTIN || 'false').toLowerCase() === 'true';

    if (DOUBLE_OPTIN) {
      // create token and store in pending
      const token = crypto.randomBytes(20).toString('hex');
      const expires = Date.now() + 1000 * 60 * 60 * 24; // 24h
      
      await addSubscriber(email, token, expires);

      const confirmUrl = `${process.env.SITE_ORIGIN || 'http://localhost:8080'}/api/newsletter/confirm?token=${token}`;

      // If SMTP configured, send email; otherwise, return the confirmUrl for dev/testing
      const transporter = await createTransporter();
      if (transporter) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Confirmez votre inscription',
            text: `Veuillez confirmer votre inscription en cliquant sur ce lien: ${confirmUrl}`,
            html: EmailTemplates.newsletterConfirmation(confirmUrl)
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

    // Single opt-in
    await addSubscriber(email);
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

export const handleConfirm: RequestHandler = async (req, res) => {
  try {
    const token = req.query.token as string;
    if (!token) return res.status(400).send('Token requis');
    
    const email = await confirmSubscriber(token);
    
    if (!email) {
      return res.status(400).send('Token invalide ou expiré');
    }
    
    await sendWelcomeEmail(email);
    return res.send('Inscription confirmée. Merci !');
  } catch (e) {
    console.error('Confirm subscribe error', e);
    return res.status(500).send('Erreur serveur');
  }
};

export const handleGetSubscribers: RequestHandler = async (req, res) => {
  try {
    const data = await loadData();
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

export const handleRemoveSubscriber: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    // Auth handled by middleware
    
    await removeSubscriber(email);

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
