import { RequestHandler } from "express";
import PDFDocument from "pdfkit";

export const handleResume: RequestHandler = (req, res) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=Badior_OUATTARA_CV.pdf");

  doc.fontSize(20).text("Badior OUATTARA", { align: "left" });
  doc.moveDown();
  doc.fontSize(12).text("Architecte logiciel & Designer", { align: "left" });
  doc.moveDown();
  doc.text("Contact: +226 57 14 24 44", { align: "left" });
  doc.moveDown();
  doc.text("Résumé rapide:\n- +30 ans d'expérience en développement Web & Mobile\n- Expert en architecture, design, performance\n- Portfolio: Plateforme E-commerce, Application Fintech, Design Print, Branding", { align: "left" });

  doc.end();
  doc.pipe(res);
};
