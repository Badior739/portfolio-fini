import { motion } from "framer-motion";
import { Skill } from "@/data/skills";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Code, Cpu, Database, Layout, Globe, Server, 
  Layers, Terminal, Zap, Shield, Smartphone,
  PenTool, Monitor, Box, Command, Search,
  Award, Briefcase, GraduationCap, MapPin
} from "lucide-react";

// Fallback for missing icons
const Brain = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.48Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.48Z"/>
  </svg>
);

const iconMap: Record<string, any> = {
  Code, Cpu, Database, Layout, Globe, Server, 
  Layers, Terminal, Zap, Shield, Smartphone,
  PenTool, Monitor, Box, Command, Search,
  Award, Briefcase, GraduationCap, MapPin,
  "Photoshop": PenTool,
  "Illustrator": Box,
  "HTML": Code,
  "CSS": Layers,
  "JavaScript": Terminal,
  "Python": Command,
  "React": Cpu,
  "IA (Intelligence Artificielle)": Brain,
  "SQL": Database,
  "TypeScript": Shield
};

interface TechCardProps {
  skill: Skill;
  index: number;
}

export function TechCard({ skill, index }: TechCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Robust icon resolution
  const resolvedIcon = typeof skill.icon === 'string' ? iconMap[skill.icon] : null;
  const Icon = resolvedIcon || iconMap[skill.name] || Code;
  
  // Map expertise to percentage
  const percentage = 
    skill.expertise === 'Expert' ? 98 :
    skill.expertise === 'Avancé' ? 85 : 75;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative h-[280px] rounded-3xl bg-secondary/50 border border-border/50 overflow-hidden backdrop-blur-md transition-all duration-500 hover:scale-[1.02] shadow-premium"
    >
      {/* 1. Luminous Internal Glow (Permanent) */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(139,92,246,0.15)] rounded-3xl z-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

      {/* 2. Animated Border Gradient */}
      <div className="absolute inset-0 p-[1px] rounded-3xl bg-transparent mask-image:linear-gradient(black,black) pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>

      {/* 3. Splendid Ray Effect - Intensified Mouse Follower */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.25), transparent 40%)`
        }}
      />
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.05)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 group-hover:opacity-60 transition-opacity duration-500" 
      />

      <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:items-start group-hover:justify-start group-hover:text-left">
        
        {/* State 1: Default Center View - Pulsing Icon */}
        <div className={cn(
          "flex flex-col items-center transition-all duration-500 absolute w-full",
           hovered ? "-translate-y-20 opacity-0 scale-75 blur-sm" : "translate-y-0 opacity-100 scale-100 blur-0"
        )}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-secondary/50 to-secondary/20 border border-border/50 flex items-center justify-center mb-6 text-foreground shadow-premium backdrop-blur-xl relative z-10 group-hover:scale-110 transition-transform duration-500">
              <Icon size={40} strokeWidth={1} className="drop-shadow-glow text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">{skill.name}</h3>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
            {skill.expertise}
          </span>
        </div>

        {/* State 2: Hover Revealed Details */}
        <div className={cn(
          "w-full flex flex-col h-full transition-all duration-500 delay-75",
          hovered ? "opacity-100 translate-y-0 filter-none" : "opacity-0 translate-y-10 pointer-events-none blur-sm"
        )}>
          <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                   <h3 className="text-lg font-bold leading-none text-foreground">{skill.name}</h3>
                   <span className="text-[10px] text-primary uppercase tracking-widest font-bold">{skill.expertise}</span>
                </div>
             </div>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-auto drop-shadow-sm font-medium">
            {skill.description}
          </p>

          {/* Tech Progress Bar */}
          <div className="mt-4 pt-4 border-t border-border/50 w-full relative">
             <div className="flex justify-between text-xs mb-1.5 font-medium">
               <span className="text-gray-400">Maîtrise</span>
               <span className="text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">{percentage}%</span>
             </div>
             <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 box-content">
               <motion.div 
                 className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                 initial={{ width: 0 }}
                 animate={{ width: hovered ? `${percentage}%` : 0 }}
                 transition={{ duration: 1, ease: "circOut" }}
               />
             </div>
          </div>
        </div>

      </div>
      
      {/* Corner Accents - Brighter */}
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
      </div>
    </motion.div>
  );
}
