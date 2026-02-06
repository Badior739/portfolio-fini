// Add missing React import
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function RecruitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  // Fix React namespace error
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({ title: "Champs requis", description: "Veuillez compléter les champs obligatoires." });
      return;
    }
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("company", company);
    fd.append("message", message);
    if (file) fd.append("file", file, (file as File).name);

    setSending(true);
    try {
      const res = await fetch("/api/recruit", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok || res.status === 202) {
        toast({ title: "Message envoyé", description: json.message || "Merci, fichier reçu." });
        onClose();
      } else {
        toast({ title: "Erreur", description: json.message || "Impossible d'envoyer." });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Erreur réseau." });
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Me recruter</h3>
          <button onClick={onClose} aria-label="Fermer" className="text-muted-foreground">✕</button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Votre nom*" className="w-full rounded-md border border-input bg-background px-3 py-2" />
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Votre email*" className="w-full rounded-md border border-input bg-background px-3 py-2" />
          </div>

          <input value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="Entreprise / Organisation" className="w-full rounded-md border border-input bg-background px-3 py-2" />

          <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Détails du projet / message*" className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[120px]" />

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="hidden" />
              <span className="rounded-md bg-background/50 px-3 py-2 text-sm">Joindre un fichier (PDF/Doc)</span>
              {file ? <span className="text-sm text-muted-foreground">{file.name}</span> : null}
            </label>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button type="button" onClick={onClose} className="rounded-md px-4 py-2">Annuler</button>
            <button type="submit" disabled={sending} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{sending? 'Envoi...' : 'Envoyer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}