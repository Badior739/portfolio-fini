import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Code2, Layers, Cpu, Globe, Database, Smartphone, Zap } from "lucide-react";
import React, { useRef, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface ProjectCardProps {
  project: any;
  index: number;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  isFocused?: boolean;
}

const ToolIcon = ({ name }: { name: string }) => {
  const n = name.toLowerCase();
  if (n.includes("react") || n.includes("next")) return <Code2 size={12} />;
  if (n.includes("node") || n.includes("express")) return <Cpu size={12} />;
  if (n.includes("data") || n.includes("sql") || n.includes("mongo")) return <Database size={12} />;
  if (n.includes("mobile") || n.includes("native")) return <Smartphone size={12} />;
  if (n.includes("design") || n.includes("figma")) return <Layers size={12} />;
  return <Zap size={12} />;
};

export function ProjectCard3D({ project, index, onHoverStart, onHoverEnd, isFocused = false }: ProjectCardProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { playHover } = useSound();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current || window.matchMedia("(pointer: coarse)").matches) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverStart?.();
    playHover();
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    onHoverEnd?.();
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
        zIndex: isHovered ? 50 : 10, // Elevate when hovered
      }}
      className={cn(
        "relative h-[480px] md:h-[600px] w-full rounded-[2rem] md:rounded-[3rem] p-[1px] group perspective-3000 overflow-visible transition-all duration-500",
        // If focused (meaning THIS card is the one being hovered), it stays bright.
        // If NOT focused but we are in a "focus mode" (implied by parent handling), we might want to do something?
        // Actually the parent handles the dimming of OTHERS via the overlay.
        // So here we just need to ensure we pop out.
      )}
    >
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-100 transition-all duration-700" />
      <motion.div 
        className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-r from-primary/50 via-indigo-500/50 to-primary/50 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative h-full w-full rounded-[calc(2rem-1px)] md:rounded-[calc(3rem-1px)] bg-[#050505] overflow-hidden z-10 shadow-2xl">
        
        {/* Background Image with Parallax Scale */}
        <div className="absolute inset-0 transition-all duration-1000 ease-[0.22,1,0.36,1] group-hover:scale-105">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
          
          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          
          {/* Default State: Title & Category */}
          <motion.div 
            className="relative z-20"
            animate={{ y: isHovered ? -20 : 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md uppercase tracking-[0.2em] font-bold text-[9px] px-3 py-1 rounded-full">
                {project.category || t('projects.category')}
              </Badge>
              <div className="h-[1px] flex-1 bg-white/10 group-hover:bg-white/30 transition-colors" />
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-white/50 transition-all duration-500">
              {project.title}
            </h3>
          </motion.div>

          {/* Hover State: Detailed Info & Actions */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2">
              <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium mb-6 line-clamp-3">
                {project.description}
              </p>

              {/* Tech Stack with Icons */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tools?.map((tool: string, i: number) => (
                  <motion.div 
                    key={tool}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ToolIcon name={tool} />
                    {tool}
                  </motion.div>
                ))}
              </div>

              {/* Action Button */}
              <Link to="/case-study" className="inline-block w-full">
                <div className="group/btn relative w-full h-14 bg-white text-black rounded-2xl flex items-center justify-between px-6 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                  <span className="relative z-10 font-black uppercase tracking-[0.2em] text-xs">{t('projects.explore')}</span>
                  <div className="relative z-10 h-8 w-8 rounded-full bg-black text-white flex items-center justify-center group-hover/btn:rotate-45 transition-transform duration-500">
                    <ArrowUpRight size={16} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-400 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
