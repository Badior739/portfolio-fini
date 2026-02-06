import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, ShieldCheck, Briefcase, BarChart3, Clock, Layout, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "Web Ecosystem",
    budget: "5k€ - 10k€",
    timeline: "3 - 6 mois",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Champs requis", description: "Veuillez compléter les identifiants de base." });
      return;
    }

    setStatus("sending");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 8000);
        setFormData({ 
          name: "", 
          email: "", 
          company: "", 
          projectType: "Web Ecosystem", 
          budget: "5k€ - 10k€", 
          timeline: "3 - 6 mois", 
          message: "" 
        });
      } else {
        setStatus("error");
        toast({ title: "Signal Interrompu", description: data.error || "Impossible d'établir la liaison." });
      }
    } catch (err) {
      setStatus("error");
      toast({ title: "Liaison Échouée", description: "Erreur de protocole réseau." });
    }
  }

  return (
    <div className="relative group">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
              <CheckCircle2 size={48} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-[0.2em]">Transmission Finalisée</h3>
            <p className="text-white/40 font-mono text-sm max-w-md mx-auto leading-relaxed mb-10">
              Votre proposition a été injectée dans le système. Une itération stratégique sera générée prochainement.
            </p>
            <Button 
              variant="outline" 
              className="px-10 h-14 rounded-full border-white/10 text-white/60 hover:text-white hover:border-primary/50 transition-all"
              onClick={() => setStatus("idle")}
            >
              Nouveau Signal
            </Button>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* 1. Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FloatingInput 
                label="Structure / Identité" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Votre Nom Complet" 
                required 
                icon={<ShieldCheck size={14} />}
              />
              <FloatingInput 
                label="Canal de Communication" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="votre@email.com" 
                required 
                icon={<Mail size={14} />}
              />
              <FloatingInput 
                label="Organisation" 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                placeholder="Nom de l'entreprise (Opt.)" 
                icon={<Briefcase size={14} />}
              />
            </div>

            {/* 2. Project Architecture Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ArchitecturalSelect 
                label="Type de Structure"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                icon={<Layout size={14} />}
                options={["Web Ecosystem", "Mobile Suite", "Brand Identity", "Cloud Architecture", "E-Commerce", "Autre"]}
              />
              <ArchitecturalSelect 
                label="Allocation Budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                icon={<BarChart3 size={14} />}
                options={["< 5k€", "5k€ - 15k€", "15k€ - 50k€", "50k€ +"]}
              />
              <ArchitecturalSelect 
                label="Échéancier"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                icon={<Clock size={14} />}
                options={["< 1 mois", "1 - 3 mois", "3 - 6 mois", "Indéfini"]}
              />
            </div>

            {/* 3. Message Area */}
            <div className="relative group">
              <label className="absolute -top-3 left-4 px-3 bg-[#050508] text-[10px] font-black uppercase tracking-[0.4em] text-white/30 z-10 transition-all group-focus-within:text-primary group-focus-within:scale-110 origin-left">
                Vision_Architecture // Brief
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez les fondations de votre projet..."
                rows={6}
                className="w-full rounded-[2rem] border border-white/5 bg-white/[0.03] px-8 py-7 text-base text-white outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-700 backdrop-blur-3xl resize-none placeholder:text-white/10"
                required
              />
            </div>

            {/* 4. Action Button */}
            <div className="relative pt-4">
              <Button 
                type="submit" 
                disabled={status === "sending"}
                className="group relative w-full h-20 rounded-[1.5rem] bg-foreground text-background hover:bg-white font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 active:scale-[0.97] hover:shadow-[0_0_60px_rgba(255,255,255,0.1)]"
              >
                <div className="relative z-10 flex items-center justify-center gap-4 text-lg">
                  {status === "sending" ? (
                    <span className="flex items-center gap-3 italic">Calcul de Trajectoire... <div className="w-2 h-2 rounded-full bg-background animate-ping" /></span>
                  ) : (
                    <>Lancer la Transmission <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 ease-out" /></>
                  )}
                </div>
                {/* Visual effects */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </Button>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2"><ShieldCheck size={12} className="text-primary/50" /> End_to_End_Encryption</div>
                <div className="flex items-center gap-2"><Clock size={12} /> Response_Time &lt; 24h</div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingInput({ label, name, type = "text", value, onChange, placeholder, required = false, icon }: any) {
  return (
    <div className="relative group">
      <label className="absolute -top-2.5 left-4 px-2 bg-[#050508] text-[9px] font-black uppercase tracking-[0.3em] text-white/20 z-10 transition-all group-focus-within:text-primary group-focus-within:translate-x-1">
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

function ArchitecturalSelect({ label, name, value, onChange, icon, options }: any) {
  return (
    <div className="relative group">
      <label className="absolute -top-2.5 left-4 px-2 bg-[#050508] text-[9px] font-black uppercase tracking-[0.3em] text-white/20 z-10 transition-all group-focus-within:text-primary">
         <span className="flex items-center gap-2">{icon} {label}</span>
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-16 rounded-2xl border border-white/5 bg-white/[0.02] px-6 text-sm text-white outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all duration-500 backdrop-blur-3xl appearance-none cursor-pointer"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt} className="bg-[#0a0a0c] text-white">{opt}</option>
        ))}
      </select>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-focus-within:text-primary">
        <Clock size={14} className="rotate-90" />
      </div>
    </div>
  );
}