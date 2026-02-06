import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export function SystemConsole() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
      {/* Top Left: Terminal Info (Simplified) */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-10 left-10 flex flex-col gap-1"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow animate-pulse" />
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.4em]">Active_Nexus</span>
        </div>
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest pl-4">Badior_Architecture</span>
      </motion.div>

      {/* Top Right: Clock & Coordinates (Polished) */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute top-10 right-10 text-right font-mono"
      >
        <div className="text-lg font-light text-white/70 tracking-tighter">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="text-[9px] text-primary/60 uppercase tracking-widest mt-1">48.8566 N // 2.3522 E</div>
      </motion.div>

      {/* Bottom Left: Architectural Metrics (Cleaned) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-10 flex flex-col gap-6"
      >
         <div className="flex flex-col">
            <span className="text-[7px] text-white/30 uppercase tracking-[0.5em] mb-2">Structural_Integrity</span>
            <div className="w-40 h-[1px] bg-white/5 relative">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "92%" }}
                 transition={{ delay: 2, duration: 2, ease: "circOut" }}
                 className="h-full bg-primary/40 shadow-glow" 
               />
            </div>
         </div>
      </motion.div>

      {/* Bottom Right: Meta Stream (Minimalist) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 right-10 text-right"
      >
        <div className="text-[8px] font-mono text-white/10 uppercase tracking-[0.3em]">
          Core_Studio // Edition_2026
        </div>
      </motion.div>

      {/* Grid Border Accents */}
      <div className="absolute inset-4 border border-white/[0.03] pointer-events-none" />
      <div className="absolute inset-10 border border-white/[0.01] pointer-events-none" />
    </div>
  );
}
