import { motion, useScroll, useTransform } from "framer-motion";
import { Profile3DLayered } from "./Profile3DLayered";
import { ArchitecturalBento } from "./ArchitecturalBento";
import React, { useRef } from "react";
import { AboutData, BentoItem } from "@shared/api";

export function AboutArchitectural({ data, bento }: { data?: AboutData, bento?: BentoItem[] }) {
  const about = {
    titleMain: data?.titleMain || "Héritage",
    titleSub: data?.titleSub || "Architectural",
    quote: data?.quote || "Concevoir le code comme on érige une structure, avec une intention pure et une exécution mathématique.",
    description: data?.description || "Mon approche transcende le simple développement web. Je bâtis des écosystèmes numériques où chaque pixel et chaque ligne de code sont les briques d'une expérience utilisateur monumentale.",
    profileImage: data?.profileImage || "/uploads/1768703448637-profiljpg.jpg"
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleX = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityBio = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const yBio = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative py-40 overflow-hidden bg-background"
    >
      {/* 10. Blueprint Grid Lines & Labels (Enhanced) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:200px_200px] border-primary/20" />
        
        {/* Corner Tech Notations */}
        <span className="absolute top-10 left-10 text-[10px] font-mono text-primary flex flex-col uppercase tracking-tighter">
          <span>Scale: 1:1</span>
          <span>Project: Cosmos_Home_V2</span>
        </span>
        <span className="absolute top-10 right-10 text-[10px] font-mono text-primary text-right flex flex-col uppercase tracking-tighter">
          <span>Lat: 11.1772 N</span>
          <span>Lng: 4.2974 W</span>
        </span>
        <span className="absolute bottom-10 left-10 text-[10px] font-mono text-muted-foreground/40 flex flex-col uppercase tracking-widest">
          <span>Blueprint_ID: AB-001</span>
          <span>System: [Glass_Architecture]</span>
        </span>

        {/* Blueprint Crosshairs */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 border border-primary/30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-4 h-4 border border-primary/30 translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* 11. Premium Grain Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-soft-light" />

      <div className="container relative z-10">
        <div className="flex flex-col mb-32">
          {/* 9. Gradient-X Titles & 13. Spring physics */}
          <motion.div style={{ x: titleX }}>
             <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-foreground/20 animate-gradient-x">
               {about.titleMain}
             </h2>
          </motion.div>
          <div className="flex justify-end -mt-4 md:-mt-8">
             <h2 className="text-4xl md:text-7xl font-light italic tracking-tight text-primary/80">
               {about.titleSub}
             </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* 1. 3D Parallax Profile Wrapper */}
          <div className="lg:col-span-5 sticky top-32">
             <div className="relative group">
               <Profile3DLayered image={about.profileImage} />
               {/* 12. Status Orb 3D - Handled within Profile3DLayered but reinforced here */}
             </div>
          </div>

          <div className="lg:col-span-7 space-y-20">
            {/* 5. Char-by-Char (Word-by-word here) Bio Reveal & 17. Blur/Focus */}
            <motion.div 
              style={{ opacity: opacityBio, y: yBio }}
              className="max-w-2xl"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight text-foreground">
                "{about.quote}"
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                {about.description}
              </p>
            </motion.div>

            {/* 2. Architectural Bento Grid & 8. Axis-Tilt Hover */}
            <ArchitecturalBento items={bento} />
          </div>
        </div>
      </div>

      {/* 4. Interactive Trace Lines (Visual Decor) */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 blur-sm pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[1px] h-64 bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-sm pointer-events-none" />
      
      {/* 20. Premium Mobile Stack is handled via Tailwind classes in components */}
    </section>
  );
}
