import { motion } from "framer-motion";
import { MajesticTitle } from "./MajesticTitle";
import { SystemConsole } from "./SystemConsole";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, LayoutIcon, Sparkles } from "lucide-react";
import React, { Suspense, lazy } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Lazy load the heavy visual core
const SingularityCore = lazy(() => import('./SingularityCore').then(module => ({ default: module.SingularityCore })));

export function HeroArchitectural({ data }: { data?: any }) {
  const { t, language } = useLanguage();
  
  const hero = {
    badge: language === 'fr' ? (data?.badge || t('hero.badge')) : t('hero.badge'),
    title: data?.title || "BADIOR",
    subtitle: data?.subtitle || "Ouattara",
    description: language === 'fr' ? (data?.description || t('hero.description')) : t('hero.description'),
    primaryCTA: language === 'fr' ? (data?.primaryCTA || t('hero.primaryCTA')) : t('hero.primaryCTA'),
    secondaryCTA: language === 'fr' ? (data?.secondaryCTA || t('hero.secondaryCTA')) : t('hero.secondaryCTA')
  };

  return (
    <section id="home" className="relative min-h-screen h-svh flex flex-col items-center justify-center overflow-hidden bg-background">
      <Suspense fallback={<div className="absolute inset-0 bg-[#020205]" />}>
        <SingularityCore />
      </Suspense>
      <SystemConsole />
      
      <div className="container relative z-10 text-center perspective-2000 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="inline-flex items-center gap-2 md:gap-4 px-4 md:px-6 py-2.5 rounded-full border-premium backdrop-blur-3xl text-[9px] md:text-[10px] uppercase font-black tracking-[0.4em] text-white/70 mb-8 md:mb-12 group hover-confidence"
        >
          <Sparkles size={12} className="text-primary animate-pulse" />
          <span className="group-hover:text-primary transition-colors">{hero.badge}</span>
        </motion.div>

        <MajesticTitle title={hero.title} subtitle={hero.subtitle} />

        <motion.p 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.2, duration: 1.5 }}
          className="mt-6 md:mt-10 text-lg md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed font-medium tracking-tight px-4"
        >
          {hero.description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 md:mt-16 flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8 px-4"
        >
          <Button 
            size="lg" 
            className="group relative h-16 md:h-20 px-10 md:px-16 rounded-[2rem] bg-white text-black hover:bg-white/90 font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden"
            asChild
          >
            <a href="#projects">
               <span className="relative z-10 flex items-center gap-4">{hero.primaryCTA} <ArrowDownRight size={20} className="group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" /></span>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
            </a>
          </Button>
          
          <Button 
            variant="ghost"
            size="lg" 
            className="group h-16 md:h-20 px-10 md:px-16 rounded-[2rem] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:bg-white/5 transition-all border border-white/10 hover:border-white/20"
            asChild
          >
            <a href="#contact" className="flex items-center gap-4">
              {hero.secondaryCTA}
              <div className="h-2 w-2 rounded-full bg-primary shadow-glow animate-pulse" />
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Aesthetic Navigation Helpers */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8">
        {['Home', 'About', 'Work', 'Talk'].map((label, i) => (
          <div key={label} className="group flex items-center gap-4 cursor-pointer">
            <span className="text-[10px] font-mono text-white/20 group-hover:text-primary transition-colors tracking-widest uppercase">0{i+1}</span>
            <div className="h-[1px] w-0 group-hover:w-8 bg-primary transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* Scroll Indicator (Extreme) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3"
      >
        <div className="w-0.5 md:w-1 h-12 md:h-16 bg-gradient-to-b from-primary via-primary/20 to-transparent rounded-full relative overflow-hidden">
           <motion.div 
             animate={{ y: [0, 64, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-0 left-0 w-full h-1/2 bg-foreground"
           />
        </div>
        <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-[0.4em] md:tracking-[0.5em] text-muted-foreground/50">{t('hero.scroll')}</span>
      </motion.div>
    </section>
  );
}
