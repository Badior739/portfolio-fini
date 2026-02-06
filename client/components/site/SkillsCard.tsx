'use client';

import React, { useState, useMemo } from 'react';
import { Skill } from '@/data/skills';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = skill.icon;
  const delay = index * 0.08;

  const expertiseValue = useMemo(() => {
    switch (skill.expertise) {
      case 'Expert': return 100;
      case 'Avancé': return 85;
      case 'Maîtrisé': return 70;
      default: return 75;
    }
  }, [skill.expertise]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="h-full"
      style={{
        animation: `slideInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s backwards`,
      }}
    >
      <div
        className={`group relative h-full overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer flex flex-col glass-card hover:-translate-y-2 hover:shadow-glow`}
        style={{ borderColor: isHovered ? ( 'hsl(var(--primary))' ) : 'hsl(var(--border))' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative z-10 p-8 flex flex-col h-full flex-1">
          <div className="flex justify-center mb-6">
            <div className={`relative transition-all duration-500 ${isHovered ? 'scale-110 -rotate-3' : 'scale-100'}`}>
              {Icon ? (
                <Icon size={48} className={`transition-colors duration-500 ${isHovered ? `text-primary` : `text-muted-foreground`}`} strokeWidth={1.5} />
              ) : (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold bg-primary`}>{skill.name?.charAt(0)}</div>
              )}
            </div>
          </div>

          <h3 className={`text-xl font-bold text-center mb-4 transition-colors ${isHovered ? 'text-primary' : ''}`}>
            {skill.name}
          </h3>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>{skill.expertise}</span>
              <span>{expertiseValue}%</span>
            </div>
            <Progress value={expertiseValue} className={`h-1.5 bg-muted transition-all duration-1000 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
          </div>

          <p className="text-sm text-muted-foreground text-center line-clamp-3 mb-6 flex-1">
            {skill.description}
          </p>

          <Button
            onClick={handleContactClick}
            variant="ghost"
            className="w-full text-xs font-semibold hover:bg-primary/10 hover:text-primary rounded-xl"
          >
            Plus d'informations
          </Button>
        </div>

        {/* Ambient background accents */}
        <div
          className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-30' : 'opacity-5'}`}
          style={{ background: `hsl(var(--primary))` }}
        />
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}