
import { motion } from "framer-motion";
import { Home, User, Briefcase, Mail, Cpu, Rocket } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useSound } from "@/context/SoundContext";
import { useLanguage } from "@/context/LanguageContext";

export function MobileDock({ onOpenRecruit }: { onOpenRecruit: () => void }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const { playClick } = useSound();

  const dockItems = [
    { id: "home", label: t('nav.home'), icon: Home },
    { id: "about", label: t('nav.about'), icon: User },
    { id: "skills", label: t('nav.skills'), icon: Cpu },
    { id: "projects", label: t('nav.projects'), icon: Briefcase },
    { id: "contact", label: t('nav.contact'), icon: Mail },
  ];

  const handleRecruitClick = () => {
    playClick();
    onOpenRecruit();
  };

  // Update active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Only active on home page
      if (location.pathname !== "/") return;

      const sections = dockItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200; // Offset

      for (const section of sections) {
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
             setActiveTab(section.id);
             break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    playClick();
    setActiveTab(id);
    
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] md:hidden w-auto max-w-[95vw]">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.5 }}
        className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-[#050505]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50"
      >
        {dockItems.map((item) => {
          const isActive = activeTab === item.id && location.pathname === "/";
          return (
            <Link
              key={item.id}
              to={`/#${item.id}`}
              onClick={handleScrollTo(item.id)}
              className="relative flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-all"
              title={item.label}
              aria-label={item.label}
            >
              <div className={cn(
                "relative z-10 flex items-center justify-center w-full h-full rounded-xl transition-all duration-300",
                isActive ? "bg-primary text-white shadow-[0_0_20px_hsl(var(--primary)/0.4)] scale-105" : "text-white/40 hover:text-white hover:bg-white/5"
              )}>
                <item.icon size={20} strokeWidth={1.5} />
              </div>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-glow" />
              )}
            </Link>
          );
        })}
        
        {/* Recruit Button (Mobile Dock) */}
        <button
          onClick={handleRecruitClick}
          className="relative flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-all group"
          title={t('nav.recruit')}
        >
          <div className="relative z-10 flex items-center justify-center w-full h-full rounded-xl bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.5)] group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.8)] transition-all duration-300">
            <Rocket size={20} strokeWidth={1.5} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </motion.div>
    </div>
  );
}
