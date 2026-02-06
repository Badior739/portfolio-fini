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
      className="relative flex flex-col items-center justify-center py-12 md:py-20 perspective-2000"
    >
      {/* 1. The Background Shadow Layer (Ghost) */}
      <motion.h1 
        style={{ y: y1 }}
        className="absolute text-[10rem] md:text-[20rem] font-black italic text-white/[0.02] pointer-events-none select-none tracking-tighter"
      >
        {displayTitle}
      </motion.h1>

      {/* 2. The Main Foreground Layer */}
      <div className="relative z-10 flex flex-col items-center">
         <motion.div 
           initial={{ y: 80, opacity: 0, rotateX: -45 }}
           animate={{ y: 0, opacity: 1, rotateX: 0 }}
           transition={{ duration: 1.2, ease: "circOut" }}
           className="relative"
         >
           <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter leading-none text-white flex items-baseline uppercase">
             {displayTitle}
             <span className="text-primary text-4xl md:text-6xl animate-pulse ml-2">.</span>
           </h1>
           {/* Chromatic Shadow */}
           <h1 className="absolute inset-0 text-7xl md:text-[11rem] font-black tracking-tighter leading-none text-red-500/20 mix-blend-screen translate-x-1 -z-10 blur-sm uppercase">{displayTitle}</h1>
           <h1 className="absolute inset-0 text-7xl md:text-[11rem] font-black tracking-tighter leading-none text-blue-500/20 mix-blend-screen -translate-x-1 -z-10 blur-sm uppercase">{displayTitle}</h1>
         </motion.div>

         <motion.div
           initial={{ x: -100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ delay: 0.6, duration: 1, ease: "circOut" }}
           className="flex items-center gap-6 mt-2 md:-mt-4"
         >
           <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent to-primary" />
           <h2 className="text-3xl md:text-7xl font-thin italic tracking-[0.2em] text-primary/80 uppercase">
             {displaySubtitle}
           </h2>
           <div className="h-[1px] w-16 md:w-32 bg-gradient-to-l from-transparent to-primary" />
         </motion.div>
      </div>
    </motion.div>
  );
}
