import { RequestHandler } from "express";
import crypto from "crypto";
import { createTransporter } from "../config/smtp";
import { Admin, ContactFormData, ReceivedMessage, SiteData, StatsEntry, Appointment } from "../../shared/api";
import { signToken } from "../middleware/auth";
import { 
  loadData, 
  updateContent, 
  incrementVisits, 
  incrementMessages, 
  addMessage, 
  addAppointment, 
  resetStats 
} from "../lib/storage";

function verifyAdminPassword(password: string, admin?: Admin): boolean {
  if (!admin || !admin.salt || !admin.hash) return false;
  const hash = crypto.pbkdf2Sync(password, admin.salt, 1000, 64, 'sha512').toString('hex');
  return hash === admin.hash;
}

function setAdminPassword(password: string): Admin {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export const handleGetStats: RequestHandler = async (req, res) => {
  const data = await loadData();
  res.json({
    visits: data.visits,
    messages: data.messages,
    subscribers: data.subscribers.length,
    history: data.statsHistory
  });
};

export const handleGetPublicContent: RequestHandler = async (req, res) => {
  const data = await loadData();
  const publicData = {
    hero: data.hero,
    about: data.about,
    bento: data.bento,
    skills: data.skills,
    projects: data.projects,
    testimonials: data.testimonials,
    experiences: data.experiences,
    contact: data.contact,
    settings: {
        siteTitle: data.settings?.siteTitle,
        siteDescription: data.settings?.siteDescription,
        siteKeywords: data.settings?.siteKeywords
    }
  };
  res.json(publicData);
};

export const handleIncrementVisit: RequestHandler = async (req, res) => {
  const visits = await incrementVisits();
  res.json({ success: true, visits });
};

export const handleIncrementMessage: RequestHandler = async (req, res) => {
  const messages = await incrementMessages();
  res.json({ success: true, messages });
};

import { EmailTemplates } from "../lib/email-templates";

export const handleContactSubmission: RequestHandler = async (req, res) => {
  const { name, email, message, company, projectType, budget, timeline, recruitment } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  const newMessage: ReceivedMessage = {
    id: Date.now(),
    date: new Date().toISOString(),
    name,
    email,
    message,
    status: 'unread',
    company,
    projectType,
    budget,
    timeline,
    recruitment: !!recruitment
  };

  await addMessage(newMessage);

  // Send email notification
  try {
    const transporter = await createTransporter();
    
    // Notify Admin
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `Nouveau message de ${name}`,
      text: `De: ${name} (${email})\nMessage: ${message}`, // Fallback text
      html: EmailTemplates.adminContactNotification({
        name,
        email,
        company,
        message,
        projectType,
        budget,
        timeline
      })
    });

    // Auto-reply to user
    await transporter.sendMail({
       from: `"BADIOR Ouattara" <${process.env.SMTP_USER}>`,
       to: email,
       subject: "Confirmation de réception - BADIOR Ouattara",
       text: `Bonjour ${name}, merci pour votre message. Je reviens vers vous très vite.`, // Fallback text
       html: EmailTemplates.contactConfirmation(name, projectType)
    });

  } catch (err) {
    console.error("Failed to send email notification", err);
  }

  res.json({ success: true });
};

export const handleGetContent: RequestHandler = async (req, res) => {
  const data = await loadData();
  // Filter out sensitive data if needed, but for now return full siteData as requested
  // except maybe admin credentials
  const safeData = { ...data };
  delete (safeData as any).admin;
  res.json(safeData);
};

export const handleSaveContent: RequestHandler = async (req, res) => {
  // Auth middleware handles verification
  const content = req.body;
  // Use updateContent to merge
  await updateContent(content);
  res.json({ success: true });
};

export const handleResetStats: RequestHandler = async (req, res) => {
  await resetStats();
  res.json({ success: true });
};

export const handleAdminLogin: RequestHandler = async (req, res) => {
  const { password } = req.body;
  const data = await loadData();
  
  // First time setup: Auto-initialize if no admin exists
  if (!data.admin) {
    if (!password || password.length < 4) {
        return res.status(400).json({ error: "Mot de passe trop court pour l'initialisation" });
    }
    const admin = setAdminPassword(password);
    // Disable 2FA by default on first run to ensure access
    await updateContent({ 
        admin,
        settings: { ...data.settings, enable2FA: false }
    });
    
    const token = signToken({ role: 'admin' });
    return res.json({ success: true, token, message: "Admin initialisé avec succès" });
  }

  if (verifyAdminPassword(password, data.admin)) {
    // Check if 2FA is enabled
    if (data.settings?.enable2FA) {
       // Generate OTP
       const otp = crypto.randomInt(100000, 999999).toString();
       const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
       
       // Save OTP to admin data
       data.admin.otp = otp;
       data.admin.otpExpires = expires;
       await updateContent({ admin: data.admin });
       
       // Send OTP via email
       try {
         const transporter = await createTransporter();
         // If admin email is not set, use SMTP_USER or fallback to a default dev email for testing if env not set
         const adminEmail = data.contact?.email || process.env.SMTP_USER || "ouattarabadiori20@gmail.com";
         
         if (transporter) {
            console.log(`Sending OTP ${otp} to ${adminEmail}`);
            await transporter.sendMail({
              from: `"Security System" <${process.env.SMTP_USER}>`,
              to: adminEmail,
              subject: "Votre Code de Sécurité Admin",
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h2>Authentification Admin</h2>
                  <p>Voici votre code de vérification à usage unique :</p>
                  <h1 style="font-size: 32px; letter-spacing: 5px; color: #000;">${otp}</h1>
                  <p style="font-size: 12px; color: #666;">Ce code expire dans 5 minutes.</p>
                </div>
              `
            });
         } else {
            console.warn("SMTP Transporter not available. OTP logged to console:", otp);
         }
         return res.json({ success: true, requires2FA: true });
       } catch (e) {
         console.error("Failed to send OTP:", e);
         // Fallback if email fails? No, security first.
         return res.status(500).json({ error: "Echec de l'envoi du code 2FA" });
       }
    }
    
    // Generate real JWT token
    const token = signToken({ role: 'admin' });
    return res.json({ success: true, token });
  }
  
  return res.status(401).json({ error: "Mot de passe invalide" });
};

export const handleAdminVerify2FA: RequestHandler = async (req, res) => {
  const { code } = req.body;
  const data = await loadData();
  
  if (!data.admin || !data.admin.otp || !data.admin.otpExpires) {
    return res.status(400).json({ error: "Aucun code en attente" });
  }
  
  if (Date.now() > data.admin.otpExpires) {
    return res.status(400).json({ error: "Code expiré" });
  }
  
  if (data.admin.otp === code) {
    // Clear OTP
    delete data.admin.otp;
    delete data.admin.otpExpires;
    await updateContent({ admin: data.admin });
    
    // Generate real JWT token
    const token = signToken({ role: 'admin' });
    return res.json({ success: true, token });
  } else {
    return res.status(400).json({ error: "Code invalide" });
  }
};

export const handleSetAdminPassword: RequestHandler = async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 8) {
      return res.status(400).json({ error: "Mot de passe trop court" });
  }
  
  const admin = setAdminPassword(password);
  await updateContent({ admin });
  res.json({ success: true });
};

export const handleAdminSetup: RequestHandler = async (req, res) => {
  const data = await loadData();
  if (data.admin) {
    return res.status(403).json({ error: "L'administrateur existe déjà" });
  }

  const { password } = req.body;
  if (!password || password.length < 8) {
      return res.status(400).json({ error: "Mot de passe trop court (min 8 caractères)" });
  }
  
  const admin = setAdminPassword(password);
  // Disable 2FA by default on setup to avoid lockout if SMTP fails
  await updateContent({ 
    admin,
    settings: { ...data.settings, enable2FA: false } 
  });
  
  const token = signToken({ role: 'admin' });
  res.json({ success: true, token });
};

export const handleBroadcastEmail: RequestHandler = async (req, res) => {
  const { subject, message } = req.body;
  const data = await loadData();
  
  if (!subject || !message) return res.status(400).json({ error: "Sujet ou message manquant" });

  const subscribers = data.subscribers;
  let count = 0;

  try {
    const transporter = await createTransporter();
    for (const sub of subscribers) {
        await transporter.sendMail({
            from: `"BADIOR Ouattara" <${process.env.SMTP_USER}>`,
            to: sub.email,
            subject,
            html: message
        });
        count++;
    }
  } catch (err) {
      console.error("Broadcast error:", err);
      return res.status(500).json({ error: "Échec de l'envoi de la diffusion" });
  }
  
  res.json({ success: true, count });
};

export const handleAppointmentSubmission: RequestHandler = async (req, res) => {
  const { name, email, topic, date, time } = req.body;
  
  if (!name || !email || !topic || !date || !time) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  const newAppointment: Appointment = {
    id: crypto.randomBytes(8).toString('hex'),
    date,
    time,
    name,
    email,
    topic,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  await addAppointment(newAppointment);

  try {
     const transporter = await createTransporter();
     
     // Notify User
     await transporter.sendMail({
       from: `"BADIOR Ouattara" <${process.env.SMTP_USER}>`,
       to: email,
       subject: "Demande de rendez-vous reçue - BADIOR Ouattara",
       text: `Bonjour ${name}, votre demande de rendez-vous pour le ${date} à ${time} a bien été reçue.`,
       html: EmailTemplates.appointmentConfirmation(name, date, time, topic)
     });

     // Notify Admin
     await transporter.sendMail({
        from: `"Appointment System" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `Nouvelle demande de rendez-vous: ${name}`,
        text: `De: ${name}\nDate: ${date} ${time}\nSujet: ${topic}`,
        html: EmailTemplates.adminAppointmentNotification({
            name,
            email,
            date,
            time,
            topic
        })
     });

  } catch (err) {
     console.error("Failed to send confirmation email:", err);
  }

  res.json({ success: true, appointment: newAppointment });
};

export const handleAdminReply: RequestHandler = async (req, res) => {
  const { to, subject, message } = req.body;
  
  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Champs requis manquants (destinataire, sujet, message)" });
  }

  try {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: `"BADIOR Ouattara" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: EmailTemplates.generalReply(message)
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to send reply:", err);
    res.status(500).json({ error: "Échec de l'envoi de l'email" });
  }
};
