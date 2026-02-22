// Add missing React import
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL } from "@/config";

export function Footer() {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");

  // Fix React namespace error
  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: t('footer.invalidEmailTitle'), description: t('footer.invalidEmailDesc') });
      return;
    }
    
    try {
      console.log('Subscribing to:', `${API_BASE_URL}/api/newsletter/subscribe`);
      const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log('Newsletter subscription response:', res.status, JSON.stringify(data));
      if (res.ok) {
        toast({ title: t('footer.successTitle'), description: t('footer.successDesc') });
        setEmail("");
      } else {
        console.error('Newsletter error:', JSON.stringify(data));
        toast({ 
          title: data.message === 'Cet email est déjà inscrit' ? "Déjà inscrit" : t('footer.errorTitle'), 
          description: data.message || t('footer.errorDesc'),
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ title: t('footer.subscribeErrorTitle'), description: t('footer.subscribeErrorDesc') });
    }
  };

  return (
    <footer className="relative bg-background border-t border-border/50 pt-32 pb-16 overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-4 gap-16 mb-24">
          
          {/* Identity & Technical Root */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-xl bg-secondary border border-border/50 flex items-center justify-center">
                  <span className="text-xl font-black text-primary">B</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xl font-black text-foreground tracking-widest uppercase">Badior_Ouattara</span>
               </div>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-10">
               <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-foreground/60">{t('footer.location')} // 11.1772 N</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-foreground/60">{new Date().toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })} GMT+0</span>
               </div>
            </div>
          </div>

          {/* System Map (Sitemap) */}
          <div className="space-y-6">
            <nav className="flex flex-col gap-4">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors tracking-[0.2em] uppercase">
                  {t(`nav.${item.toLowerCase()}`)}
                </a>
              ))}
            </nav>
          </div>

          {/* Technical Newsletter */}
          <div className="space-y-6">
            <p className="text-muted-foreground text-xs">{t('footer.subscribeText')}</p>
            <form onSubmit={onSubscribe} className="relative group">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="w-full h-14 bg-secondary border border-border/50 rounded-xl px-6 outline-none focus:border-primary/50 text-sm text-foreground transition-all placeholder:text-muted-foreground/30"
              />
              <button type="submit" className="absolute right-2 top-2 h-10 px-4 bg-primary rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-glow">
                {t('footer.subscribeButton')}
              </button>
            </form>
          </div>

        </div>

        {/* Final Footer Row */}
        <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.5em]">
                © {new Date().getFullYear()} {t('footer.rights')} - {t('footer.allRightsReserved')}
              </span>
              <a href="/terms" className="text-[10px] font-mono text-muted-foreground/30 hover:text-primary transition-colors uppercase tracking-[0.3em] mt-1">
                {t('footer.termsOfUse')}
              </a>
           </div>

           <div className="flex items-center gap-8">
              {[
                { label: 'GitHub', url: 'https://github.com/Badior739' },
                { label: 'Threads', url: 'https://www.threads.com/@badior17' },
                { label: 'X', url: 'https://x.com/Badior01' },
                { label: 'Instagram', url: 'https://www.instagram.com/mindgraphixsolution' }
              ].map((social) => (
                <a key={social.label} href={social.url} className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 hover:text-primary transition-colors">
                  {social.label}
                </a>
              ))}
           </div>

           <a href="/api/curriculum" className="px-6 py-2 rounded-lg border border-border/50 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-foreground transition-all">
              {t('footer.downloadCV')}
           </a>
        </div>
      </div>

      {/* Finishing Crosshairs (Aesthetic) */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-border/50 pointer-events-none" />
      <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-border/50 pointer-events-none" />
    </footer>
  );
}