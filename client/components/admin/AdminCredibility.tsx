import React from 'react';
import { Quote, Plus, Trash2, Award, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AdminHeader, AdminCard, CMSField, SaveBar } from './AdminShared';
import { Testimonial, Experience } from '@shared/api';

interface AdminCredibilityProps {
  testimonials: Testimonial[];
  setTestimonials: (t: Testimonial[]) => void;
  experiences: Experience[];
  setExperiences: (e: Experience[]) => void;
  onSave: () => void;
  loading: boolean;
  isDirty: boolean;
}

export function AdminCredibility({ 
  testimonials, setTestimonials, 
  experiences, setExperiences,
  onSave, loading, isDirty 
}: AdminCredibilityProps) {

  const addTestimonial = () => {
    const newT: Testimonial = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Nouveau Client",
      role: "CEO",
      company: "Startup Inc",
      content: "Excellent travail sur notre plateforme."
    };
    setTestimonials([...testimonials, newT]);
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const addExperience = () => {
    const newE: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      year: new Date().getFullYear().toString(),
      role: "Nouveau Poste",
      company: "Entreprise",
      description: "Description des réalisations...",
      icon: "Briefcase"
    };
    setExperiences([...experiences, newE]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const icons = [
    { name: 'Briefcase', icon: Briefcase },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Award', icon: Award }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Preuve Sociale & Expérience" 
        subtitle="Gérez vos témoignages clients et votre parcours professionnel pour une crédibilité maximale." 
      />

      <div className="grid grid-cols-1 gap-16">
        {/* Témoignages */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Quote size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Témoignages Clients</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Social Proof & Trust</p>
              </div>
            </div>
            <Button onClick={addTestimonial} variant="outline" className="rounded-xl border-primary/20 hover:border-primary/50 text-xs font-bold gap-2 h-12 px-6">
              <Plus size={14} /> Ajouter un témoignage
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <AdminCard key={t.id} className="relative group p-8">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 z-20"
                  onClick={() => removeTestimonial(t.id)}
                >
                  <Trash2 size={16} />
                </Button>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CMSField label="Nom Complet" value={t.name} onChange={(v) => {
                      const updated = [...testimonials];
                      updated[idx].name = v;
                      setTestimonials(updated);
                    }} />
                    <CMSField label="Poste / Titre" value={t.role} onChange={(v) => {
                      const updated = [...testimonials];
                      updated[idx].role = v;
                      setTestimonials(updated);
                    }} />
                  </div>
                  <CMSField label="Entreprise" value={t.company} onChange={(v) => {
                    const updated = [...testimonials];
                    updated[idx].company = v;
                    setTestimonials(updated);
                  }} />
                  <CMSField label="Contenu du Témoignage" isTextArea value={t.content} onChange={(v) => {
                    const updated = [...testimonials];
                    updated[idx].content = v;
                    setTestimonials(updated);
                  }} />
                </div>
              </AdminCard>
            ))}
          </div>
        </div>

        {/* Expérience */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Parcours Professionnel</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Professional Timeline</p>
              </div>
            </div>
            <Button onClick={addExperience} variant="outline" className="rounded-xl border-primary/20 hover:border-primary/50 text-xs font-bold gap-2 h-12 px-6">
              <Plus size={14} /> Ajouter une expérience
            </Button>
          </div>

          <div className="space-y-6">
            {experiences.map((e, idx) => (
              <AdminCard key={e.id} className="relative group p-8">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 z-20"
                  onClick={() => removeExperience(e.id)}
                >
                  <Trash2 size={16} />
                </Button>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-2">
                    <CMSField label="Période" value={e.year} onChange={(v) => {
                      const updated = [...experiences];
                      updated[idx].year = v;
                      setExperiences(updated);
                    }} />
                  </div>
                  <div className="lg:col-span-3">
                    <CMSField label="Poste" value={e.role} onChange={(v) => {
                      const updated = [...experiences];
                      updated[idx].role = v;
                      setExperiences(updated);
                    }} />
                  </div>
                  <div className="lg:col-span-3">
                    <CMSField label="Entreprise" value={e.company} onChange={(v) => {
                      const updated = [...experiences];
                      updated[idx].company = v;
                      setExperiences(updated);
                    }} />
                  </div>
                  <div className="lg:col-span-4">
                    <CMSField label="Description" value={e.description || ''} onChange={(v) => {
                      const updated = [...experiences];
                      updated[idx].description = v;
                      setExperiences(updated);
                    }} />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Icône de Section :</span>
                  <div className="flex gap-2">
                    {icons.map((iconItem) => (
                      <button
                        key={iconItem.name}
                        onClick={() => {
                          const updated = [...experiences];
                          updated[idx].icon = iconItem.name;
                          setExperiences(updated);
                        }}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                          e.icon === iconItem.name 
                          ? 'bg-primary text-white shadow-glow' 
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        <iconItem.icon size={18} />
                      </button>
                    ))}
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        </div>
      </div>

      <SaveBar isDirty={isDirty} loading={loading} onSave={onSave} />
    </div>
  );
}
