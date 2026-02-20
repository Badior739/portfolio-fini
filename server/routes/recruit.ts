import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createTransporter } from "../config/smtp";
import { addMessage } from "../lib/storage";
import { EmailTemplates } from "../lib/email-templates";

// Fix missing 'File' member in 'multer' by using any for MulterFile
type MulterFile = any;

// Fix process.cwd access with any cast
const upload = multer({ dest: path.join((process as any).cwd(), "tmp/uploads") });

export const handleRecruit: RequestHandler = (req, res) => {
  // multer will have populated req.file and req.body
  res.status(400).json({ message: "Utilisez POST multipart/form-data vers /api/recruit" });
};

export const uploadHandler = upload.single("file");

export const handleRecruitPost: RequestHandler = async (req, res) => {
  try {
    const body = req.body as any;
    const file = (req as any).file as MulterFile | undefined;

    // Ensure upload dir exists
    // Fix process.cwd access with any cast
    const uploadDir = path.join((process as any).cwd(), "tmp/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fromName = body.name || "Unknown";
    const fromEmail = body.email || "no-reply@example.com";
    const company = body.company || "";
    const message = body.message || "";

    // Prepare attachment info
    const attachments: any[] = [];
    if (file) {
      // move file to uploads with original name
      const target = path.join(uploadDir, `${Date.now()}-${file.originalname}`);
      fs.renameSync(file.path, target);
      attachments.push({ filename: file.originalname, path: target });
    }

    // If SMTP settings available, send email
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const TO_EMAIL = process.env.TO_EMAIL || "ouattarabadiori5@gmail.com"; // default to user provided email

    const ENABLE_EMAILS = (process.env.ENABLE_EMAILS || 'true').toLowerCase();

    if (ENABLE_EMAILS === 'false') {
      return res.status(202).json({ message: "Envoi d'emails désactivé (ENV). Fichier stocké.", attachments: attachments.map(a => a.path) });
    }

    const transporter = createTransporter();
    if (transporter) {
      // Save to storage (DB or JSON)
      try {
        await addMessage({
            id: Date.now(),
            date: new Date().toISOString(),
            name: fromName,
            email: fromEmail,
            company: company,
            projectType: "Recrutement / Poste: " + (body.position || "Non spécifié"),
            budget: "N/A",
            timeline: "Permanent / Mission",
            message: message,
            status: 'unread',
            recruitment: true
        });
      } catch (err) {
        console.error("Failed to store recruit message in DB:", err);
      }

      // 1. Send Notification to Admin
      const mail = await transporter.sendMail({
        from: `"BADIOR Ouattara" <${SMTP_USER}>`,
        replyTo: fromEmail,
        to: TO_EMAIL,
        subject: `[SYSTEM_SIGNAL] Candidature Reçue - ${fromName}`,
        text: `Candidature de ${fromName} pour le poste ${body.position || "Spontané"}.\n\nMessage: ${message}`,
        html: EmailTemplates.adminRecruitNotification({
            name: fromName,
            email: fromEmail,
            company: company,
            position: body.position,
            message: message,
            hasAttachment: !!file
        }),
        attachments,
      });

      // 2. Send Auto-Reply to Candidate
      try {
        await transporter.sendMail({
          from: `"BADIOR Ouattara" <${SMTP_USER}>`,
          to: fromEmail,
          subject: `Confirmation de réception - Candidature ${body.position || "Spontanée"}`,
          html: EmailTemplates.recruitConfirmation(fromName, body.position)
        });
        console.log(`Auto-reply sent to candidate: ${fromEmail}`);
      } catch (error) {
        console.error("Failed to send auto-reply to candidate:", error);
        // Don't fail the request if auto-reply fails
      }

      return res.status(200).json({ message: "Proposition transmise avec succès", info: mail });
    }

    // No SMTP -> store file and return data
    return res.status(202).json({ message: "Fichier reçu (stocké sur le serveur). Configurez SMTP pour envoi par email.", attachments: attachments.map(a => a.path) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
