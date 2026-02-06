import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
// Fix missing 'File' member in 'multer' by using any for MulterFile
type MulterFile = any;

const DATA_FILE = path.join((process as any).cwd(), "data", "site-data.json");

// Fix process.cwd access with any cast
const upload = multer({ dest: path.join((process as any).cwd(), "tmp/uploads") });

export const handleRecruit: RequestHandler = (req, res) => {
  // multer will have populated req.file and req.body
  res.status(400).json({ message: "Use POST multipart/form-data to /api/recruit" });
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

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      // Save to site-data.json for Admin View
      try {
        if (fs.existsSync(DATA_FILE)) {
          const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
          data.receivedMessages = data.receivedMessages || [];
          data.receivedMessages.push({
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
          data.messages = (data.messages || 0) + 1;
          fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        }
      } catch (err) {
        console.error("Failed to store recruit message in DB:", err);
      }

      const mail = await transporter.sendMail({
        from: `"BADIOR Ouattara" <${SMTP_USER}>`,
        replyTo: fromEmail,
        to: TO_EMAIL,
        subject: `[SYSTEM_SIGNAL] Candidature Reçue - ${fromName}`,
        html: `
          <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px; border-radius: 20px;">
            <h1 style="color: #fff; border-bottom: 1px solid #333; padding-bottom: 20px; font-size: 20px; text-transform: uppercase; letter-spacing: 2px;">Vibration Recrutement Détectée,</h1>
            <p style="color: #ccc; line-height: 1.6;">Un nouveau signal de type <strong>Candidature</strong> a été intercepté.</p>
            <div style="background: #111; padding: 25px; border-radius: 15px; border: 1px solid #222; margin: 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #666; letter-spacing: 1px; text-transform: uppercase;">MÉTA-DONNÉES DU CANDIDAT :</p>
              <p style="margin: 10px 0 5px; font-size: 15px;"><strong>Identité :</strong> ${fromName}</p>
              <p style="margin: 5px 0; font-size: 15px;"><strong>Structure :</strong> ${company || "Particulier"}</p>
              <p style="margin: 5px 0; font-size: 15px;"><strong>Poste Cible :</strong> ${body.position || "Non défini"}</p>
              <p style="margin: 5px 0; font-size: 15px;"><strong>Contact :</strong> ${fromEmail} / ${body.phone || "N/A"}</p>
            </div>
            <p style="color: #ccc; background: #000; padding: 15px; border-radius: 10px; border-left: 3px solid #8b5cf6;">
              <strong>Brief :</strong> ${message}
            </p>
            <br>
            <p style="color: #666; font-size: 11px; text-transform: uppercase;">BADIOR Ouattara • Architecte Digital System</p>
          </div>
        `,
        attachments,
      });

      return res.status(200).json({ message: "Proposition transmise avec succès", info: mail });
    }

    // No SMTP -> store file and return data
    return res.status(202).json({ message: "Fichier reçu (stocké sur le serveur). Configurez SMTP pour envoi par email.", attachments: attachments.map(a => a.path) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};