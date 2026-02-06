import { motion } from "framer-motion";
import { SingularityCore } from "./SingularityCore";
import { MajesticTitle } from "./MajesticTitle";
import { SystemConsole } from "./SystemConsole";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, LayoutIcon, Sparkles } from "lucide-react";
import React from "react";

export function HeroArchitectural({ data }: { data?: any }) {
  const hero = {
    badge: data?.badge || "Ingénierie de Précision & Esthétique Future",
    title: data?.title || "BADIOR",
    subtitle: data?.subtitle || "Ouattara",
    description: data?.description || "Architecte Digital spécialisé dans la conception d'écosystèmes numériques monumentaux.",
    primaryCTA: data?.primaryCTA || "Explorer les Réalisations",
    secondaryCTA: data?.secondaryCTA || "Consultation"
  };

  return (
    <section id="home" className="relative h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-background">
      <SingularityCore />
      <SystemConsole />
      
      <div className="container relative z-10 text-center perspective-2000">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="inline-flex items-center gap-4 px-5 py-2 rounded-xl bg-secondary border border-border/50 backdrop-blur-2xl text-[9px] uppercase font-black tracking-[0.4em] text-muted-foreground mb-8 group hover:border-primary/50 transition-all duration-500 shadow-premium"
        >
          <Sparkles size={12} className="text-primary animate-pulse" />
          {hero.badge}
        </motion.div>

        <MajesticTitle title={hero.title} subtitle={hero.subtitle} />

        <motion.p 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.2, duration: 1.5 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light tracking-wide px-4"
        >
          {hero.description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1, type: "spring" }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-6 px-6"
        >
          <Button 
            size="lg" 
            className="group relative h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)] overflow-hidden"
            asChild
          >
            <a href="#projects">
               <span className="relative z-10 flex items-center gap-3">Explorer mes Œuvres <ArrowDownRight size={20} className="group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" /></span>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
            </a>
          </Button>
          
          <Button 
            variant="outline"
            size="lg" 
            className="h-16 px-12 rounded-2xl border-border/50 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-base backdrop-blur-3xl transition-all hover:scale-105 active:scale-95 shadow-premium"
            asChild
          >
            <a href="#contact">Consultation</a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator (Extreme) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div className="w-1 h-16 bg-gradient-to-b from-primary via-primary/20 to-transparent rounded-full relative overflow-hidden">
           <motion.div 
             animate={{ y: [0, 64, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-0 left-0 w-full h-1/2 bg-foreground"
           />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-muted-foreground/50">Scroll_Initiate</span>
      </motion.div>
    </section>
  );
}
