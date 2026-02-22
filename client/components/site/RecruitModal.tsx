// Add missing React import
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config";

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
      const res = await fetch(`${API_BASE_URL}/api/recruit`, { method: "POST", body: fd });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-zinc-900 border border-zinc-800 p-6 shadow-xl relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Me recruter</h3>
          <button onClick={onClose} aria-label="Fermer" className="text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Nom complet <span className="text-red-500">*</span></label>
              <input 
                required
                value={name} 
                onChange={(e)=>setName(e.target.value)} 
                placeholder="Votre nom" 
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Email <span className="text-red-500">*</span></label>
              <input 
                required
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                type="email" 
                placeholder="vous@exemple.com" 
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Entreprise / Organisation</label>
            <input 
              value={company} 
              onChange={(e)=>setCompany(e.target.value)} 
              placeholder="Nom de votre structure" 
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Détails du projet <span className="text-red-500">*</span></label>
            <textarea 
              required
              value={message} 
              onChange={(e)=>setMessage(e.target.value)} 
              placeholder="Décrivez votre besoin..." 
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 min-h-[120px]" 
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer group">
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="hidden" />
              <div className="flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-sm text-zinc-300 group-hover:bg-zinc-700 transition-colors border border-zinc-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                <span>{file ? "Modifier le fichier" : "Joindre un fichier (PDF/Doc)"}</span>
              </div>
            </label>
            {file && <span className="text-sm text-violet-400 font-medium truncate max-w-[200px]">{file.name}</span>}
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-zinc-800 mt-6">
            <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-zinc-400 hover:text-white transition-colors">Annuler</button>
            <button 
              type="submit" 
              disabled={sending} 
              className="rounded-md bg-violet-600 px-6 py-2 text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Envoi en cours...
                </>
              ) : 'Envoyer ma candidature'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}