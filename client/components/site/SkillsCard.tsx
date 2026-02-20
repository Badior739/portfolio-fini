'use client';

import React, { useMemo, useState } from 'react';
import { Skill } from '@shared/api';
import { Button } from '@/components/ui/button';
import { useLanguage } from "@/context/LanguageContext";
import { 
  Code, Cpu, Database, Palette, PenTool, Zap, 
  Globe, Server, Terminal, Shield, Blocks, Brain,
  Layout, Smartphone, Cloud, Lock, Atom, Container, type LucideIcon 
} from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const iconMap: Record<string, LucideIcon> = {
    Code,
    Cpu,
    Database,
    Palette,
    PenTool,
    Zap,
    Globe,
    Server,
    Terminal,
    Shield,
    Blocks,
    Brain,
    Layout,
    Smartphone,
    Cloud,
    Lock,
    Atom,
    Container
  };
  const Icon = iconMap[skill.icon] || Code;
  const delay = index * 0.08;

  const expertiseValue = useMemo(() => {
    // Si une valeur numérique précise est fournie dans l'objet skill, on l'utilise
    if (typeof skill.level === 'number') {
      return skill.level;
    }
    
    // Sinon, fallback sur les valeurs par défaut basées sur l'expertise textuelle
    switch (skill.expertise) {
      case 'Expert': return 95;
      case 'Avancé': 
      case 'Advanced': return 85;
      case 'Maîtrisé': 
      case 'Mastered': return 75;
      default: return 60;
    }
  }, [skill.expertise, skill.level]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="h-full perspective-1000"
      style={{
        animation: `slideInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s backwards`,
      }}
    >
      <div
        className={`group relative h-full overflow-hidden rounded-[2.5rem] border transition-all duration-700 cursor-pointer flex flex-col border-premium hover-confidence bg-secondary/30 backdrop-blur-md`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'rotateX(2deg) rotateY(2deg) scale(1.02)' : 'rotateX(0) rotateY(0) scale(1)',
        }}
      >
        {/* Tech Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />
        </div>

        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full flex-1">
          <div className="flex justify-center mb-8">
            <div className={`relative transition-all duration-700 ${isHovered ? 'scale-110 rotate-[360deg]' : 'scale-100'}`}>
              <div 
                className={`absolute inset-0 blur-3xl transition-opacity duration-700 ${isHovered ? 'opacity-80' : 'opacity-20'}`} 
                style={{ backgroundColor: skill.color?.accent ? `var(--${skill.color.accent})` : 'hsl(var(--primary))' }} 
              />
              <div className="relative z-10 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl group-hover:shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] transition-shadow duration-700">
                <Icon size={52} className={`transition-all duration-700 ${isHovered ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'text-white/70'}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h3 className={`text-2xl font-black text-center mb-6 tracking-tight transition-all duration-500 ${isHovered ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 scale-105' : 'text-white/90'}`}>
            {skill.name}
          </h3>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <span className={`px-2 py-1 rounded border border-white/5 bg-white/5 transition-colors ${isHovered ? 'text-white border-white/20' : ''}`}>{skill.expertise}</span>
              <span className="font-mono text-white/50">{expertiseValue}%</span>
            </div>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-[2px]">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(var(--primary),0.5)] relative overflow-hidden"
                style={{ 
                  width: isHovered ? `${expertiseValue}%` : '0%',
                  backgroundColor: skill.color?.accent ? `var(--${skill.color.accent})` : 'hsl(var(--primary))'
                }} 
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground/80 text-center leading-relaxed line-clamp-4 mb-8 flex-1 font-medium px-2 group-hover:text-white/70 transition-colors">
            {skill.description}
          </p>

          <Button
            onClick={handleContactClick}
            variant="ghost"
            className="w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white rounded-xl border border-white/5 hover:border-white/20 transition-all group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100"
          >
            {t('skills.explore')}
          </Button>
        </div>

        {/* Dynamic Light Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
