import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function Profile3DLayered({ image }: { image?: string }) {
  const { t } = useLanguage();
  const profileImage = image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative w-full aspect-square max-w-[500px] perspective-2000 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full group"
      >
        {/* Layer 1: Back Glow (Increased Intensity) */}
        <div className="absolute inset-0 bg-primary/25 blur-[120px] rounded-full translate-z-[-100px] group-hover:bg-primary/40 transition-colors duration-500" />

        {/* Layer 2: Rear Glass Frame with Luminous Border */}
        <div 
          style={{ transform: "translateZ(-50px)" }}
          className="absolute inset-0 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.1)]"
        />

        {/* Layer 3: Main Image Wrapper with Internal Scanner */}
        <div 
          style={{ transform: "translateZ(0px)" }}
          className="absolute inset-4 rounded-[2.5rem] overflow-hidden border-4 border-white/10 bg-card shadow-2xl transition-all duration-500 group-hover:border-primary/40"
        >
          <img 
            src={profileImage} 
            alt="Badior" 
            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay" />
          
          {/* 19. Holographic Scanner Line (New) */}
          <motion.div 
            className="absolute inset-y-0 w-[2px] bg-primary shadow-[0_0_15px_rgba(139,92,246,1)] z-20 pointer-events-none"
            initial={{ left: "-10%" }}
            animate={{ left: "110%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Layer 4: Floating Glass Accents (Top) - Fixed Luminous Edge */}
        <motion.div 
          style={{ transform: "translateZ(80px)" }}
          className="absolute top-4 right-4 md:top-10 md:-right-5 w-24 h-24 md:w-32 md:h-32 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.2)] flex items-center justify-center p-4 group-hover:border-primary/50 transition-colors"
        >
           <div className="text-center group-hover:scale-110 transition-transform">
             <div className="text-xl md:text-2xl font-black text-white drop-shadow-glow">5+</div>
             <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-white/70">{t('about.yearsXP')}</div>
           </div>
        </motion.div>

        {/* Layer 5: Floating Glass Accents (Bottom) */}
        <motion.div 
          style={{ transform: "translateZ(120px)" }}
          className="absolute bottom-4 left-4 md:-bottom-10 md:-left-10 px-4 py-3 md:px-6 md:py-4 rounded-2xl border border-white/30 bg-primary/20 backdrop-blur-xl shadow-[0_0_40px_rgba(139,92,246,0.3)] group-hover:border-white transition-colors"
        >
           <div className="flex items-center gap-3">
             <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80] animate-pulse" />
             <span className="text-xs md:text-sm font-bold text-white tracking-tight drop-shadow-sm">{t('about.focus')}</span>
           </div>
        </motion.div>

        {/* Outer Light Ray (Intensified) */}
        <div 
          className="absolute -inset-px rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30"
          style={{ 
            background: "radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, transparent 60%)",
            transform: "translateZ(150px)" 
          }}
        />
      </motion.div>
    </div>
  );
}
