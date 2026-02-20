import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, ShieldCheck, Briefcase, BarChart3, Clock, Layout, Mail } from "lucide-react";
import { ContactInfo } from "@shared/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function ContactForm({ data }: { data?: ContactInfo }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      toast({ title: "Champs requis", description: "Veuillez compléter tous les champs." });
      return;
    }

    setStatus("sending");
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "");
      formDataToSend.append("from_name", "Portfolio Cosmos");
      formDataToSend.append("subject", `Nouveau Message de ${formData.name}`);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 8000);
        setFormData({ 
          name: "", 
          email: "", 
          message: "" 
        });
      } else {
        setStatus("error");
        toast({ title: t('contact.toast.signalErrorTitle'), description: data.message || t('contact.toast.signalErrorDesc') });
      }
    } catch (err) {
      console.error("Contact Form Error:", err);
      setStatus("error");
      toast({ title: t('contact.toast.networkErrorTitle'), description: t('contact.toast.networkErrorDesc') });
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
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 md:mb-8 shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
              <CheckCircle2 size={32} className="text-primary animate-pulse md:w-12 md:h-12" />
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white mb-4 uppercase tracking-[0.2em]">{t('contact.title')}</h3>
            <p className="text-white/40 font-mono text-[10px] md:text-sm max-w-md mx-auto leading-relaxed mb-8 md:mb-10 px-4">
              {t('contact.successMessage')}
            </p>
            <Button 
              variant="outline" 
              className="px-8 md:px-10 h-12 md:h-14 rounded-full border-white/10 text-white/60 hover:text-white hover:border-primary/50 transition-all text-xs md:text-base"
              onClick={() => setStatus("idle")}
            >
              {t('contact.newSignal')}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput 
                label={t('contact.name')}
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder={t('contact.placeholders.name')}
                required 
                icon={<ShieldCheck size={14} />}
              />
              <FloatingInput 
                label={t('contact.email')}
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder={t('contact.placeholders.email')}
                required 
                icon={<Mail size={14} />}
              />
            </div>

            {/* 2. Message Area */}
            <div className="relative group">
              <label className="absolute -top-3 left-4 px-3 bg-[#050508] text-[10px] font-black uppercase tracking-[0.4em] text-white/30 z-10 transition-all group-focus-within:text-primary group-focus-within:scale-110 origin-left">
                {t('contact.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.placeholders.message')}
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
                className="group relative w-full h-16 md:h-20 rounded-xl md:rounded-[1.5rem] bg-foreground text-background hover:bg-white font-black uppercase tracking-widest md:tracking-[0.3em] overflow-hidden transition-all duration-500 active:scale-[0.97] hover:shadow-[0_0_60px_rgba(255,255,255,0.1)]"
              >
                <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4 text-sm md:text-lg">
                  {status === "sending" ? (
                    <span className="flex items-center gap-3 italic">{t('contact.sending')} <div className="w-2 h-2 rounded-full bg-background animate-ping" /></span>
                  ) : (
                    <>
                      <span className="truncate">{t('contact.submit')}</span>
                      <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 ease-out md:w-5 md:h-5" />
                    </>
                  )}
                </div>
                {/* Visual effects */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </Button>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
                {/* Removed technical filler text */}
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