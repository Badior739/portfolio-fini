import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "./AdminPanel";
import { useAdmin } from "@/context/AdminContext";
import { Home, User, Lightbulb, Briefcase, Mail, Menu, X, ArrowUpRight, Globe, Volume2, VolumeX } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

const navItems = [
  { id: "home", labelKey: "nav.home", icon: Home },
  { id: "about", labelKey: "nav.about", icon: User },
  { id: "skills", labelKey: "nav.skills", icon: Lightbulb },
  { id: "projects", labelKey: "nav.projects", icon: Briefcase },
  { id: "contact", labelKey: "nav.contact", icon: Mail },
];

export function Header({ onOpenRecruit }: { onOpenRecruit: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const { adminOpen, setAdminOpen } = useAdmin();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);

    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key.toLowerCase());
      if (keys.has('control') && keys.has('b') && keys.has('enter')) {
        e.preventDefault();
        setAdminOpen(prev => !prev);
        keys.clear();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    const headerOffset = 80;

    if (el) {
      const rect = el.getBoundingClientRect();
      const offsetTop = rect.top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      window.location.hash = `#${id}`;
    }
  };

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-[100] transition-all duration-700 pointer-events-none px-4 md:px-0">
      <div className="container mt-4 md:mt-6">
        <motion.div 
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className={cn(
            "relative mx-auto flex h-16 md:h-20 items-center justify-between rounded-[2rem] md:rounded-full border border-white/10 px-4 md:px-8 transition-all duration-500 pointer-events-auto shadow-premium overflow-hidden",
            scrolled 
              ? "bg-background/60 backdrop-blur-3xl border-white/10 shadow-2xl shadow-primary/5" 
              : "bg-background/30 backdrop-blur-xl border-white/5"
          )}
        >
          {/* Supreme Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50 pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-4 group cursor-pointer relative z-10">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-glow overflow-hidden group-hover:scale-110 transition-transform duration-500 backdrop-blur-md">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <span className="text-lg md:text-xl font-black text-white italic relative z-10 group-hover:text-primary transition-colors">B</span>
            </div>
            <div className="hidden lg:flex flex-col">
               <span className="text-sm font-black text-white uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-500">Badior</span>
               <span className="text-[9px] font-mono text-primary/80 uppercase tracking-[0.3em]">{t('header.role')}</span>
            </div>
          </div>

          {/* Main Navigation (Supreme) */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 bg-white/5 rounded-full p-1.5 border border-white/5 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                onClick={handleScrollTo(item.id)}
                className="relative px-4 py-2 rounded-full flex items-center gap-2 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all group overflow-hidden hover:bg-white/10"
              >
                <item.icon className="w-3 h-3 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="relative z-10">{t(item.labelKey)}</span>
                <motion.div 
                  className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId="nav-hover"
                />
              </Link>
            ))}
          </nav>

          {/* Action Systems */}
          <div className="flex items-center gap-3 relative z-10">
             {/* Sound Toggle Removed */}

             {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-black/40 border border-primary/50 text-primary shadow-[0_0_25px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_50px_hsl(var(--primary)/1)] hover:bg-primary hover:text-white transition-all active:scale-95 backdrop-blur-md"
              title={language === "fr" ? "Switch to English" : "Passer en Français"}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{language}</span>
            </button>

            <Button 
              variant="ghost" 
              onClick={onOpenRecruit}
              className="flex h-9 md:h-11 px-4 md:px-6 rounded-full bg-primary/20 hover:bg-primary hover:text-white text-primary border border-primary/80 hover:border-primary text-[10px] font-black uppercase tracking-widest transition-all duration-300 group shadow-[0_0_30px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_60px_hsl(var(--primary)/1)] backdrop-blur-md"
            >
              <span className="mr-2">{t('nav.recruit')}</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>

             {/* Mobile Menu Trigger (Hidden as replaced by MobileDock) */}
             <div className="hidden md:hidden w-10 h-10" /> 
          </div>
        </motion.div>
      </div>
    </header>
    {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </>
  );
}
