import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Briefcase, User, Mail, Phone, FileText, Send, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecruitForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Champs requis", description: "Veuillez compléter les informations de base." });
      return;
    }

    setSending(true);
    
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone || "");
      fd.append("company", formData.company || "");
      fd.append("position", formData.position || "");
      fd.append("message", formData.message);
      if (file) fd.append("file", file);

      const response = await fetch("/api/recruit", {
        method: "POST",
        body: fd,
      });

      const data = await response.json();

      if (response.ok) {
        toast({ 
          title: "Proposition de Recrutement Reçue", 
          description: "Votre canal a été sécurisé. J'analyserai votre structure dans les plus brefs délais." 
        });
        setFormData({ name: "", email: "", phone: "", company: "", position: "", message: "" });
        setFile(null);
        setTimeout(onClose, 1000);
      } else {
        toast({ title: "Signal Interrompu", description: data.message || "Échec de la transmission locale." });
      }
    } catch (err) {
      toast({ title: "Erreur Système", description: "La liaison avec le serveur a été perdue." });
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="relative w-full max-w-2xl bg-card border border-white/10 rounded-[3rem] shadow-premium overflow-hidden"
      >
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="p-10 md:p-14">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Protocole Recrutement</h3>
              <p className="text-xs font-mono text-white/30 uppercase tracking-[0.3em] mt-2">Access_Level: Professional_Collaboration</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArchitecturalInput 
                label="Identité" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Votre Nom" 
                required 
                icon={<User size={14} />}
              />
              <ArchitecturalInput 
                label="Canal Email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="votre@email.com" 
                required 
                icon={<Mail size={14} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArchitecturalInput 
                label="Signal Téléphonique" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+XX ... (Opt.)" 
                icon={<Phone size={14} />}
              />
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-2 bg-card text-[9px] font-black uppercase tracking-[0.3em] text-white/20 z-10">
                   <span className="flex items-center gap-2"><FileText size={14}/> Dossier / CV (PDF)</span>
                </label>
                <div className="relative w-full h-16 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center px-6 overflow-hidden">
                   <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,image/*" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                   />
                   <span className="text-sm font-medium text-white/40 truncate">
                      {file ? file.name : "Sélectionner un fichier..."}
                   </span>
                   <div className="ml-auto w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                      <Send size={14} className="rotate-90"/>
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArchitecturalInput 
                label="Organisation" 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                placeholder="Nom Structure" 
                icon={<Briefcase size={14} />}
              />
              <ArchitecturalInput 
                label="Mission Proposée" 
                name="position" 
                value={formData.position} 
                onChange={handleChange} 
                placeholder="Titre du Poste" 
                icon={<ShieldCheck size={14} />}
              />
            </div>

            <div className="relative group">
              <label className="absolute -top-3 left-4 px-3 bg-card text-[10px] font-black uppercase tracking-[0.4em] text-white/30 z-10 transition-all group-focus-within:text-primary">
                Détails Stratégiques // Opportunité
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez les fondations de cette synergie..."
                rows={4}
                className="w-full rounded-[1.5rem] border border-white/5 bg-white/[0.03] px-8 py-6 text-base text-white outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-700 backdrop-blur-3xl resize-none placeholder:text-white/5"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={sending}
                className="group relative flex-1 h-20 rounded-3xl bg-white text-black hover:bg-primary hover:text-white font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 shadow-glow"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {sending ? "Initialisation..." : (
                    <>Envoyer le Signal <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-[10px] font-mono text-white/10 uppercase tracking-[0.3em]">
               <div className="flex items-center gap-2"><Clock size={12}/> Analysis_Wait: 48h</div>
               <div className="flex items-center gap-2"><ShieldCheck size={12}/> Secure_Protocol</div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function ArchitecturalInput({ label, name, type = "text", value, onChange, placeholder, required = false, icon }: any) {
  return (
    <div className="relative group">
      <label className="absolute -top-2.5 left-4 px-2 bg-card text-[9px] font-black uppercase tracking-[0.3em] text-white/20 z-10 transition-all group-focus-within:text-primary">
        <span className="flex items-center gap-2">{icon} {label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full h-16 rounded-2xl border border-white/5 bg-white/[0.02] px-6 text-sm text-white outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all duration-500 backdrop-blur-3xl placeholder:text-white/5"
      />
    </div>
  );
}