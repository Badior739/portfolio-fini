import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

export function MajesticTitle({ title = "BADIOR", subtitle = "Ouattara" }: { title?: string, subtitle?: string }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const displayTitle = title || "BADIOR";
  const displaySubtitle = subtitle || "Ouattara";

  return (
    <motion.div 
      style={{ opacity, scale }}
      className="relative flex flex-col items-center justify-center py-12 md:py-24 perspective-3000"
    >
      {/* 1. The Background Shadow Layer (Ghost) */}
      <motion.h1 
        style={{ y: y1 }}
        className="absolute text-[12rem] md:text-[24rem] font-black italic text-white/[0.03] pointer-events-none select-none tracking-tighter"
      >
        {displayTitle}
      </motion.h1>

      {/* 2. The Main Foreground Layer */}
      <div className="relative z-10 flex flex-col items-center">
         <motion.div 
           initial={{ y: 100, opacity: 0, rotateX: -60 }}
           animate={{ y: 0, opacity: 1, rotateX: 0 }}
           transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
           className="relative group"
         >
           <h1 className="text-8xl md:text-[13rem] font-black tracking-tighter leading-none text-white flex items-baseline uppercase select-none">
             {displayTitle}
             <span className="text-primary text-5xl md:text-8xl animate-pulse ml-4 drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.8)]">.</span>
           </h1>
           
           {/* Enhanced Premium Shadows */}
           <h1 className="absolute inset-0 text-8xl md:text-[13rem] font-black tracking-tighter leading-none text-red-500/10 mix-blend-screen translate-x-2 translate-y-1 -z-10 blur-md uppercase pointer-events-none">{displayTitle}</h1>
           <h1 className="absolute inset-0 text-8xl md:text-[13rem] font-black tracking-tighter leading-none text-blue-500/10 mix-blend-screen -translate-x-2 -translate-y-1 -z-10 blur-md uppercase pointer-events-none">{displayTitle}</h1>
           
           {/* Animated Shine Effect */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500 ease-in-out pointer-events-none" />
         </motion.div>

         <motion.div
           initial={{ x: -150, opacity: 0, letterSpacing: "1em" }}
           animate={{ x: 0, opacity: 1, letterSpacing: "0.2em" }}
           transition={{ delay: 0.8, duration: 1.2, ease: "circOut" }}
           className="flex items-center gap-8 mt-4 md:-mt-6"
         >
           <div className="h-[2px] w-20 md:w-48 bg-gradient-to-r from-transparent via-primary/50 to-primary" />
           <h2 className="text-4xl md:text-8xl font-thin italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary uppercase">
             {displaySubtitle}
           </h2>
           <div className="h-[2px] w-20 md:w-48 bg-gradient-to-l from-transparent via-primary/50 to-primary" />
         </motion.div>
      </div>
    </motion.div>
  );
}
