import { motion, Variants, Transition } from "framer-motion";
import React from "react";

export function CinematicTitle() {
  const name = "BADIOR".split("");
  const surname = "OUATTARA".split("");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      }
    }
  };

  const item = {
    hidden: { y: 100, opacity: 0, rotateX: -90 },
    show: { y: 0, opacity: 1, rotateX: 0, transition: { type: "spring", stiffness: 100 } as Transition }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-2 sm:gap-4 perspective-1000"
      >
        {name.map((char, i) => (
          <motion.span 
            key={i} 
            variants={item}
            className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-2 sm:gap-4 -mt-4 sm:-mt-10 perspective-1000"
      >
        {surname.map((char, i) => (
          <motion.span 
            key={i} 
            variants={item}
            className="text-5xl sm:text-7xl md:text-[8rem] font-thin tracking-widest text-primary italic drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]"
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* Rhythmic Glow Line */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ delay: 1.5, duration: 2, ease: "circOut" }}
        className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mt-8 max-w-4xl"
      />
    </div>
  );
}
