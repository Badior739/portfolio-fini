
import { getSmtpConfig } from "../config/smtp";

const THEME = {
  bg: "#09090b", // zinc-950
  card: "#18181b", // zinc-900
  border: "#27272a", // zinc-800
  text: "#e4e4e7", // zinc-200
  muted: "#a1a1aa", // zinc-400
  accent: "#8b5cf6", // violet-500
  font: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
};

const BASE_STYLES = `
  background-color: ${THEME.bg};
  color: ${THEME.text};
  font-family: ${THEME.font};
  padding: 40px 20px;
  line-height: 1.6;
`;

const CONTAINER_STYLES = `
  max-width: 600px;
  margin: 0 auto;
  background-color: ${THEME.bg};
  border-radius: 12px;
  overflow: hidden;
`;

const HEADER_STYLES = `
  padding: 30px 40px;
  border-bottom: 1px solid ${THEME.border};
`;

const TITLE_STYLES = `
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.5px;
`;

const CONTENT_STYLES = `
  padding: 40px;
`;

const FOOTER_STYLES = `
  padding: 30px 40px;
  border-top: 1px solid ${THEME.border};
  text-align: center;
  font-size: 12px;
  color: ${THEME.muted};
`;

const BUTTON_STYLES = `
  display: inline-block;
  background-color: ${THEME.accent};
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 20px;
`;

const INFO_BOX_STYLES = `
  background-color: ${THEME.card};
  border: 1px solid ${THEME.border};
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
`;

const LABEL_STYLES = `
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  color: ${THEME.muted};
  letter-spacing: 1px;
  margin-bottom: 4px;
`;

const VALUE_STYLES = `
  display: block;
  font-size: 15px;
  color: #ffffff;
  margin-bottom: 12px;
`;

function wrapHtml(title: string, content: string): string {
  const config = getSmtpConfig();
  const year = new Date().getFullYear();
  const siteName = config.fromName || "BADIOR Ouattara";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; ${BASE_STYLES}">
        <div style="${CONTAINER_STYLES}">
          <div style="${HEADER_STYLES}">
            <h1 style="${TITLE_STYLES}">${title}</h1>
          </div>
          <div style="${CONTENT_STYLES}">
            ${content}
          </div>
          <div style="${FOOTER_STYLES}">
            <p style="margin: 0;">&copy; ${year} ${siteName}. Tous droits réservés.</p>
            <p style="margin: 5px 0 0;">Architecte Digital & Creative Developer</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export const EmailTemplates = {
  // 1. Contact Confirmation (To User)
  contactConfirmation: (name: string, projectType?: string) => {
    return wrapHtml(
      "Message bien reçu",
      `
        <p style="margin-bottom: 20px;">Bonjour <strong>${name}</strong>,</p>
        <p style="color: ${THEME.muted};">Merci de m'avoir contacté via mon portfolio.</p>
        <p>J'ai bien reçu votre message concernant votre projet <strong>${projectType || "de collaboration"}</strong>.</p>
        <p>Je l'analyse actuellement avec attention et je reviendrai vers vous très prochainement pour en discuter de vive voix.</p>
        <div style="${INFO_BOX_STYLES}">
          <p style="margin: 0; font-size: 14px; color: ${THEME.muted};">
            Délai de réponse moyen : <span style="color: #fff;">24-48 heures</span>
          </p>
        </div>
        <p style="margin-top: 30px; font-style: italic; color: ${THEME.muted};">Cordialement,<br>BADIOR Ouattara</p>
      `
    );
  },

  // 2. Admin Notification (To Admin) - Contact
  adminContactNotification: (data: { name: string; email: string; company?: string; message: string; projectType?: string; budget?: string; timeline?: string }) => {
    return wrapHtml(
      "Nouveau Contact",
      `
        <p style="color: ${THEME.accent}; font-weight: 600;">Un nouveau message a été reçu via le formulaire de contact.</p>
        
        <div style="${INFO_BOX_STYLES}">
          <span style="${LABEL_STYLES}">Expéditeur</span>
          <span style="${VALUE_STYLES}">${data.name}</span>
          
          <span style="${LABEL_STYLES}">Email</span>
          <span style="${VALUE_STYLES}"><a href="mailto:${data.email}" style="color: #fff; text-decoration: none;">${data.email}</a></span>
          
          <span style="${LABEL_STYLES}">Entreprise</span>
          <span style="${VALUE_STYLES}">${data.company || "Non spécifié"}</span>
          
          <span style="${LABEL_STYLES}">Type de Projet</span>
          <span style="${VALUE_STYLES}">${data.projectType || "Non spécifié"}</span>
          
          <span style="${LABEL_STYLES}">Budget / Délai</span>
          <span style="${VALUE_STYLES}">${data.budget || "N/A"} / ${data.timeline || "N/A"}</span>
        </div>

        <div style="background-color: ${THEME.card}; padding: 20px; border-radius: 8px; border-left: 3px solid ${THEME.accent};">
          <span style="${LABEL_STYLES}">Message</span>
          <p style="margin: 10px 0 0; white-space: pre-wrap; color: ${THEME.text};">${data.message}</p>
        </div>
      `
    );
  },

  // 3. Admin Notification (To Admin) - Recruitment
  adminRecruitNotification: (data: { name: string; email: string; company?: string; position?: string; message: string; hasAttachment: boolean }) => {
    return wrapHtml(
      "Candidature Reçue",
      `
        <p style="color: ${THEME.accent}; font-weight: 600;">Une nouvelle candidature spontanée a été soumise.</p>
        
        <div style="${INFO_BOX_STYLES}">
          <span style="${LABEL_STYLES}">Candidat</span>
          <span style="${VALUE_STYLES}">${data.name}</span>
          
          <span style="${LABEL_STYLES}">Email</span>
          <span style="${VALUE_STYLES}"><a href="mailto:${data.email}" style="color: #fff; text-decoration: none;">${data.email}</a></span>
          
          <span style="${LABEL_STYLES}">Poste Cible</span>
          <span style="${VALUE_STYLES}">${data.position || "Spontané"}</span>

          <span style="${LABEL_STYLES}">CV Joint</span>
          <span style="${VALUE_STYLES}">${data.hasAttachment ? "✅ Oui (voir pièce jointe)" : "❌ Non"}</span>
        </div>

        <div style="background-color: ${THEME.card}; padding: 20px; border-radius: 8px; border-left: 3px solid ${THEME.accent};">
          <span style="${LABEL_STYLES}">Message de motivation</span>
          <p style="margin: 10px 0 0; white-space: pre-wrap; color: ${THEME.text};">${data.message}</p>
        </div>
      `
    );
  },

  // 4. Candidate Confirmation (To Candidate) - Recruitment
  recruitConfirmation: (name: string, position?: string) => {
    return wrapHtml(
      "Candidature enregistrée",
      `
        <p style="margin-bottom: 20px;">Bonjour <strong>${name}</strong>,</p>
        <p style="color: ${THEME.muted};">Nous accusons bonne réception de votre candidature.</p>
        <p>Votre profil pour le poste de <strong>${position || "candidature spontanée"}</strong> a bien été intégré à notre base de talents.</p>
        <p>Notre équipe va étudier votre dossier avec attention. Si votre profil correspond à nos besoins actuels, nous vous contacterons pour un premier échange.</p>
        
        <div style="${INFO_BOX_STYLES}">
          <p style="margin: 0; font-size: 14px; color: ${THEME.muted};">
            Délai de traitement moyen : <span style="color: #fff;">1 à 2 semaines</span>
          </p>
        </div>

        <p style="margin-top: 30px; font-style: italic; color: ${THEME.muted};">
          Merci de l'intérêt que vous portez à nos projets.<br>
          L'équipe Recrutement
        </p>
      `
    );
  },

  // 4. Appointment Confirmation (To User)
  appointmentConfirmation: (name: string, date: string, time: string, topic: string) => {
    return wrapHtml(
      "Rendez-vous Confirmé",
      `
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Votre demande de rendez-vous a bien été enregistrée.</p>
        
        <div style="${INFO_BOX_STYLES}; text-align: center;">
          <span style="${LABEL_STYLES}">Date & Heure</span>
          <span style="font-size: 24px; font-weight: bold; color: #fff; display: block; margin: 10px 0;">
            ${new Date(date).toLocaleDateString()} à ${time}
          </span>
          <span style="${LABEL_STYLES}">Sujet</span>
          <span style="${VALUE_STYLES}">${topic}</span>
        </div>

        <p style="text-align: center; color: ${THEME.muted};">
          Un lien Google Meet vous sera envoyé peu avant la réunion si nécessaire.
        </p>
      `
    );
  },

  // 5. Admin Notification (To Admin) - Appointment
  adminAppointmentNotification: (data: { name: string; email: string; date: string; time: string; topic: string }) => {
    return wrapHtml(
      "Nouveau Rendez-vous",
      `
        <p style="color: ${THEME.accent}; font-weight: 600;">Une nouvelle demande de rendez-vous a été planifiée.</p>
        
        <div style="${INFO_BOX_STYLES}">
          <span style="${LABEL_STYLES}">Demandeur</span>
          <span style="${VALUE_STYLES}">${data.name}</span>
          
          <span style="${LABEL_STYLES}">Email</span>
          <span style="${VALUE_STYLES}"><a href="mailto:${data.email}" style="color: #fff; text-decoration: none;">${data.email}</a></span>
          
          <span style="${LABEL_STYLES}">Date</span>
          <span style="${VALUE_STYLES}">${data.date}</span>
          
          <span style="${LABEL_STYLES}">Heure</span>
          <span style="${VALUE_STYLES}">${data.time}</span>
          
          <span style="${LABEL_STYLES}">Sujet</span>
          <span style="${VALUE_STYLES}">${data.topic}</span>
        </div>
      `
    );
  },

  // 6. Security OTP (To Admin)
  securityOtp: (code: string) => {
    return wrapHtml(
      "Code de Sécurité",
      `
        <p style="text-align: center;">Voici votre code de vérification pour l'accès administrateur :</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <span style="font-size: 42px; font-family: monospace; font-weight: bold; letter-spacing: 8px; color: ${THEME.accent}; background: ${THEME.card}; padding: 20px 40px; border-radius: 12px; border: 1px solid ${THEME.border}; box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);">
            ${code}
          </span>
        </div>
        
        <p style="text-align: center; color: ${THEME.muted}; font-size: 13px;">
          Ce code expire dans 5 minutes. Ne le partagez avec personne.
        </p>
      `
    );
  },

  // 7. Newsletter Welcome (To Subscriber)
  newsletterWelcome: () => {
    return wrapHtml(
      "Bienvenue dans l'univers",
      `
        <p>Merci de rejoindre ma liste de diffusion privée.</p>
        <p>Vous faites maintenant partie du cercle restreint qui recevra :</p>
        <ul style="color: ${THEME.muted}; padding-left: 20px; margin-bottom: 30px;">
          <li style="margin-bottom: 10px;">Des avant-premières de mes projets</li>
          <li style="margin-bottom: 10px;">Des réflexions sur le design et l'architecture</li>
          <li style="margin-bottom: 10px;">Des ressources exclusives</li>
        </ul>
        <p>Promis, pas de spam. Juste de la qualité.</p>
      `
    );
  },

  // 8. General Reply (From Admin)
  generalReply: (messageHtml: string) => {
    return wrapHtml(
      "Réponse de BADIOR Ouattara",
      `
        <div style="font-size: 16px;">
          ${messageHtml}
        </div>
      `
    );
  },

  // 9. Broadcast (Newsletter/Announcements)
  broadcast: (subject: string, content: string) => {
    return wrapHtml(subject, content);
  },

  // 10. Newsletter Confirmation (Double Opt-in)
  newsletterConfirmation: (link: string) => {
    return wrapHtml(
      "Confirmez votre inscription",
      `
        <p>Merci de votre intérêt pour ma newsletter.</p>
        <p>Pour valider votre inscription et recevoir mes prochains contenus, veuillez cliquer sur le bouton ci-dessous :</p>
        
        <div style="text-align: center;">
          <a href="${link}" style="${BUTTON_STYLES}">Confirmer mon email</a>
        </div>
        
        <p style="margin-top: 30px; font-size: 13px; color: ${THEME.muted}; text-align: center;">
          Si le bouton ne fonctionne pas, copiez ce lien :<br>
          <a href="${link}" style="color: ${THEME.accent}; word-break: break-all;">${link}</a>
        </p>
      `
    );
  }
};
