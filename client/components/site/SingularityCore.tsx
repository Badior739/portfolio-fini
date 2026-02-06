import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import React, { useEffect, useState } from "react";

export function SingularityCore() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020205]">
      {/* 1. The Singularity Hole */}
      <motion.div 
        style={{
          x: useTransform(mouseXSpring, (v) => (v - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.05),
          y: useTransform(mouseYSpring, (v) => (v - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.05),
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020205_70%)] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.15)_0%,_transparent_50%)] animate-pulse" />
        
        {/* 2. Fluid Debris Field */}
        {[...Array(20)].map((_, i) => (
          <GlassFragment key={i} mouseX={mouseXSpring} mouseY={mouseYSpring} index={i} />
        ))}
      </motion.div>

      {/* 3. Deep Technical Grid with Parallax */}
      <motion.div 
         style={{
           x: useTransform(mouseXSpring, (v) => (v - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * -0.02),
           y: useTransform(mouseYSpring, (v) => (v - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * -0.02),
         }}
         className="absolute inset-[-10%] opacity-[0.07] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:100px_100px]" 
      />

      {/* 4. Chromatic Aberration Orbs */}
      <div className="absolute top-0 left-0 w-full h-full mix-blend-screen opacity-20">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px] animate-float-slow" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-[150px] animate-float-slow" style={{ animationDelay: '-2s' }} />
      </div>
    </div>
  );
}

function GlassFragment({ mouseX, mouseY, index }: { mouseX: MotionValue<number>, mouseY: MotionValue<number>, index: number }) {
  const initialX = Math.random() * 2000 - 1000;
  const initialY = Math.random() * 2000 - 1000;
  
  const x = useTransform(mouseX, (v) => initialX + (v - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * (0.1 + index * 0.01));
  const y = useTransform(mouseY, (v) => initialY + (v - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * (0.1 + index * 0.01));
  const rotate = useTransform(mouseX, (v) => (v * 0.1) + (index * 45));

  return (
    <motion.div
      style={{ x, y, rotate }}
      className="absolute w-24 h-40 border border-white/5 bg-white/[0.02] backdrop-blur-[3px] rounded-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute top-2 left-2 text-[6px] font-mono text-white/20 select-none">Fragment_Ref_{index}</div>
    </motion.div>
  );
}
