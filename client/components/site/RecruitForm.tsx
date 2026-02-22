import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
import { ShieldCheck, Briefcase, User, Mail, Phone, FileText, Send, X, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL } from "@/config";

// Temporary inline components due to file corruption issues
const toast = ({ title, description }: { title?: string; description?: string }) => {
  console.log("Toast:", title, description);
  // In a real deployment, this would use a proper toast system.
  // For now, we use alert for visibility if needed, or just log.
  // alert(`${title}\n${description}`);
};

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; asChild?: boolean }>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
          variant === "link" && "text-primary underline-offset-4 hover:underline",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export function RecruitForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    projectType: "Collaboration",
    budget: "À discuter",
    timeline: "Indéfini",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: t('recruit.toast.requiredTitle'), description: t('recruit.toast.requiredDesc') });
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
      fd.append("projectType", formData.projectType);
      fd.append("budget", formData.budget);
      fd.append("timeline", formData.timeline);
      fd.append("message", formData.message);
      if (file) fd.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/recruit`, {
        method: "POST",
        body: fd,
      });

      const data = await response.json();

      if (response.ok || response.status === 202) {
        toast({ 
          title: t('recruit.toast.signalReceivedTitle'), 
          description: t('recruit.toast.signalReceivedDesc') 
        });
        setFormData({ 
          name: "", 
          email: "", 
          phone: "", 
          company: "", 
          position: "", 
          projectType: "Collaboration",
          budget: "À discuter",
          timeline: "Indéfini",
          message: "" 
        });
        setFile(null);
        setTimeout(onClose, 2000);
      } else {
        toast({ title: t('recruit.toast.signalInterruptedTitle'), description: data.message || t('recruit.toast.signalInterruptedDesc') });
      }
    } catch (err) {
      console.error("Recruit Form Error:", err);
      toast({ title: t('recruit.toast.systemErrorTitle'), description: t('recruit.toast.systemErrorDesc') });
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-start md:items-center justify-center p-4 pt-8 md:pt-4 pb-10">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <div
        className="relative w-full max-w-5xl bg-background/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:h-[600px]"
      >
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="p-6 md:p-14 overflow-y-auto custom-scrollbar pb-32">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white">{t('recruit.title')}</h3>
              <p className="text-[10px] md:text-xs font-mono text-white/30 uppercase tracking-[0.3em] mt-2">{t('recruit.accessLevel')}</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all hover:rotate-90 flex-shrink-0"
            >
              <X size={18} className="md:w-5 md:h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArchitecturalInput 
                label={t('recruit.name')} 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder={t('recruit.placeholders.name')} 
                required 
                icon={<User size={14} />}
              />
              <ArchitecturalInput 
                label={t('recruit.email')} 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder={t('recruit.placeholders.email')} 
                required 
                icon={<Mail size={14} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArchitecturalInput 
                label={t('recruit.phone')} 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder={t('recruit.placeholders.phone')} 
                icon={<Phone size={14} />}
              />
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-2 bg-card text-[9px] font-black uppercase tracking-[0.3em] text-white/20 z-10">
                   <span className="flex items-center gap-2"><FileText size={14}/> {t('recruit.cv')}</span>
                </label>
                <div className="relative w-full h-14 md:h-16 rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.02] flex items-center px-6 overflow-hidden">
                   <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,image/*" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                   />
                  <span className="text-xs md:text-sm font-medium text-white/40 truncate">
                     {file ? file.name : t('recruit.selectFile')}
                  </span>
                   <div className="ml-auto w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                      <Send size={14} className="rotate-90"/>
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArchitecturalInput 
                label={t('recruit.company')} 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                placeholder={t('recruit.placeholders.company')} 
                icon={<Briefcase size={14} />}
              />
              <ArchitecturalInput 
                label={t('recruit.position')} 
                name="position" 
                value={formData.position} 
                onChange={handleChange} 
                placeholder={t('recruit.placeholders.position')} 
                icon={<ShieldCheck size={14} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ArchitecturalSelect 
                label={t('recruit.projectType')}
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                icon={<Briefcase size={14} />}
                options={t('recruit.options.projectType') || ["Collaboration", "CDI/CDD", "Freelance", "Audit", "Autre"]}
              />
              <ArchitecturalSelect 
                label={t('recruit.budget')}
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                icon={<BarChart3 size={14} />}
                options={t('recruit.options.budget') || ["À discuter", "< 5k€", "5k€ - 10k€", "10k€ - 20k€", "> 20k€"]}
              />
              <ArchitecturalSelect 
                label={t('recruit.timeline')}
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                icon={<Clock size={14} />}
                options={t('recruit.options.timeline') || ["Indéfini", "Urgent (< 1 mois)", "1 - 3 mois", "3 - 6 mois", "Long terme"]}
              />
            </div>

            <div className="relative group">
              <label className="absolute -top-3 left-4 px-3 bg-card text-[10px] font-black uppercase tracking-[0.4em] text-white/30 z-10 transition-all group-focus-within:text-primary group-focus-within:scale-110 origin-left">
                {t('recruit.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('recruit.placeholders.message')}
                rows={4}
                className="w-full rounded-xl md:rounded-[1.5rem] border border-white/5 bg-white/[0.03] px-6 py-4 md:px-8 md:py-6 text-sm md:text-base text-white outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-700 backdrop-blur-3xl resize-none placeholder:text-white/5"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
              <Button 
                type="submit" 
                disabled={sending}
                className="group relative flex-1 h-16 md:h-20 rounded-2xl md:rounded-3xl bg-white text-black hover:bg-primary hover:text-white font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 shadow-glow"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {sending ? t('recruit.init') : (
                    <>{t('recruit.submit')} <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </Button>
              
              <div className="hidden md:flex flex-col gap-2 text-[9px] font-mono text-white/20 uppercase tracking-widest text-right">
                <span>{t('recruit.analysisWait')}</span>
                <span className="flex items-center justify-end gap-2 text-primary/60"><ShieldCheck size={10} /> {t('recruit.secureProtocol')}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ArchitecturalSelect({ label, name, value, onChange, icon, options }: any) {
  return (
    <div className="relative group">
      <label className="absolute -top-2.5 left-4 px-2 bg-card text-[9px] font-black uppercase tracking-[0.3em] text-white/20 z-10 transition-all group-focus-within:text-primary">
         <span className="flex items-center gap-2">{icon} {label}</span>
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.02] px-6 text-xs md:text-sm text-white outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all duration-500 backdrop-blur-3xl appearance-none cursor-pointer"
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
        className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.02] px-6 text-xs md:text-sm text-white outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all duration-500 backdrop-blur-3xl placeholder:text-white/5"
      />
    </div>
  );
}
