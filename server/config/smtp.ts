import nodemailer from "nodemailer";

export function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || null,
    port: Number(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null,
    to: process.env.TO_EMAIL || null,
    fromName: process.env.EMAIL_FROM_NAME || null,
  };
}

export function createTransporter() {
  const cfg = getSmtpConfig();
  if (!cfg.host || !cfg.user || !cfg.pass) return null;

  const user = cfg.user.trim();
  const pass = cfg.pass.trim().replace(/\s+/g, ''); // Remove all spaces from App Password
  
  // Use service shorthand for Gmail if detected
  if (cfg.host.includes("gmail.com")) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user, pass },
  });
}

export function mask(value: string | null) {
  if (!value) return null;
  if (value.length <= 4) return "****";
  const start = value.slice(0, 2);
  const end = value.slice(-2);
  return `${start}****${end}`;
}
