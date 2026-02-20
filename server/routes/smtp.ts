import express from "express";
import { getSmtpConfig, createTransporter, mask } from "../config/smtp";

export function registerSmtpRoutes(app: express.Application) {
  // Return a non-sensitive view of current SMTP configuration
  // Fix RequestHandler mismatch errors by casting to any
  app.get("/api/admin/smtp", ((_req: any, res: any) => {
    const cfg = getSmtpConfig();
    res.json({
      host: cfg.host ? mask(cfg.host) : null,
      port: cfg.port,
      user: cfg.user ? mask(cfg.user) : null,
      to: cfg.to || null,
      fromName: cfg.fromName || null,
      configured: !!(cfg.host && cfg.user && cfg.pass),
    });
  }) as any);

  // Send a test email using current SMTP environment variables
  // Fix Express overload errors by casting middleware and handler to any
  app.post("/api/admin/smtp/test", express.json() as any, (async (req: any, res: any) => {
    const { to, subject, text } = req.body as { to?: string; subject?: string; text?: string };
    const transporter = createTransporter();
    if (!transporter) return res.status(400).json({ message: "SMTP non configuré" });

    const target = to || process.env.TO_EMAIL;
    if (!target) return res.status(400).json({ message: "Aucun destinataire spécifié et TO_EMAIL non défini" });

    try {
      const info = await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME || "Website"} <${process.env.SMTP_USER}>`,
        to: target,
        subject: subject || "[Test] Configuration SMTP",
        text: text || "Ceci est un email de test du système SMTP de l'application.",
      });

      res.json({ message: "Test email envoyé", info });
    } catch (err: any) {
      console.error("SMTP test failed:", err);
      res.status(500).json({ message: "Échec de l'envoi du test", error: String(err) });
    }
  }) as any);

  // Handle contact form submissions
  app.post("/api/contact", express.json() as any, (async (req: any, res: any) => {
    const { name, email, message } = req.body as { name: string; email: string; message: string };

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Tous les champs sont requis." });
    }

    const transporter = createTransporter();
    if (!transporter) {
      return res.status(500).json({ success: false, message: "Configuration SMTP manquante." });
    }

    const cfg = getSmtpConfig();
    if (!cfg.to) {
      return res.status(500).json({ success: false, message: "Adresse email destinataire non configurée." });
    }

    try {
      await transporter.sendMail({
        from: `${cfg.fromName || "Portfolio Contact"} <${cfg.user}>`,
        to: cfg.to,
        subject: `Nouveau message de contact depuis le portfolio - ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      res.json({ success: true, message: "Message envoyé avec succès !" });
    } catch (err: any) {
      console.error("Contact form submission failed:", err);
      res.status(500).json({ success: false, message: "Échec de l'envoi du message." });
    }
  }) as any);
}