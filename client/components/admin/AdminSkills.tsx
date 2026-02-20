import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skill } from '@shared/api';
import { AdminHeader, AdminCard, CMSField, SaveBar } from './AdminShared';

interface AdminSkillsProps {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  onSave: () => void;
  loading: boolean;
  isDirty: boolean;
}

export function AdminSkills({ skills, setSkills, onSave, loading, isDirty }: AdminSkillsProps) {
  const addSkill = () => {
    setSkills([
      ...skills,
      {
        name: 'Nouveau',
        description: '',
        expertise: 'Maîtrisé',
        icon: 'Code',
        color: { from: 'blue-500', to: 'cyan-500', accent: 'blue-400' }
      }
    ]);
  };

  const removeSkill = (index: number) => {
    if (!window.confirm(`Supprimer la compétence "${skills[index].name}" ?`)) return;
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const updateSkill = (index: number, updates: Partial<Skill>) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], ...updates };
    setSkills(newSkills);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Compétences & Expertise" 
        subtitle="Gestion dynamique du pool technologique." 
      />

      <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/5 mb-8">
        <p className="text-muted-foreground text-sm font-medium italic">
          Ajoutez ou modifiez vos briques technologiques pour mettre en valeur votre stack.
        </p>
        <Button onClick={addSkill} className="gap-2 rounded-xl h-12 font-bold px-6 shadow-glow">
          <Plus size={18} /> Nouveau Module
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(skills || []).map((skill, idx) => (
          <AdminCard key={idx} className="relative group">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-muted-foreground/30 hover:text-red-500 transition-colors" 
              onClick={() => removeSkill(idx)}
            >
              <Trash2 size={16} />
            </Button>

            <div className="space-y-6 pt-4">
              <CMSField 
                label="Nom de la compétence" 
                value={skill.name} 
                onChange={(v) => updateSkill(idx, { name: v })} 
              />
              
              <div className="space-y-3 group">
                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-focus-within:text-primary transition-colors ml-1">
                  Niveau d'Expertise
                </Label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl text-sm p-5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white font-bold"
                  value={skill.expertise}
                  onChange={(e) => updateSkill(idx, { expertise: e.target.value as any })}
                >
                  <option value="Maîtrisé">Maîtrisé</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <CMSField 
                label="Description / Stack" 
                value={skill.description} 
                onChange={(v) => updateSkill(idx, { description: v })} 
              />
            </div>
          </AdminCard>
        ))}
      </div>

      <SaveBar onSave={onSave} loading={loading} isDirty={isDirty} />
    </div>
  );
}
