import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Code2, Layers } from 'lucide-react';

export function LabDemo() {
  const [activeMode, setActiveMode] = useState<'glow' | 'minimal' | 'architect'>('glow');

  const modes = {
    glow: { title: "Mode Glow", color: "from-primary/20 via-primary/10 to-transparent" },
    minimal: { title: "Mode Minimal", color: "from-white/5 via-transparent to-transparent" },
    architect: { title: "Mode Architect", color: "from-blue-500/20 via-transparent to-transparent" }
  };

  return (
    <section className="py-24 container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Laboratoire R&D</h2>
        <p className="text-muted-foreground">Expérimentez avec les composants du système.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(modes).map(([key, mode]) => (
          <Card 
            key={key} 
            className={`cursor-pointer border-white/10 transition-all hover:border-primary/50 bg-gradient-to-br ${mode.color}`}
            onClick={() => setActiveMode(key as any)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {key === 'glow' && <Sparkles size={20} />}
                {key === 'minimal' && <Code2 size={20} />}
                {key === 'architect' && <Layers size={20} />}
                {mode.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Appliquer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <motion.div 
        className="mt-16 p-12 rounded-3xl border border-white/5 bg-white/[0.02]"
        animate={{ opacity: activeMode ? 1 : 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Aperçu : {modes[activeMode].title}</h3>
        <p className="text-muted-foreground">Ce composant interactif démontre la capacité du système à s'adapter dynamiquement aux préférences visuelles.</p>
      </motion.div>
    </section>
  );
}
