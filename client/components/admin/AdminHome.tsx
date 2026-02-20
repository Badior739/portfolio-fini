import React from 'react';
import { HeroContent } from '@shared/api';
import { AdminHeader, CMSField, AdminCard, SaveBar } from './AdminShared';

interface AdminHomeProps {
  hero: HeroContent;
  setHero: (hero: HeroContent) => void;
  onSave: () => void;
  loading: boolean;
  isDirty: boolean;
}

export function AdminHome({ hero, setHero, onSave, loading, isDirty }: AdminHomeProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Section Accueil" 
        subtitle="Configurateur de l'interface d'entrée monumentale." 
      />
      
      <AdminCard>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <CMSField label="Badge Opérationnel (Top)" value={hero.badge} onChange={(v) => setHero({...hero, badge: v})} />
          <CMSField label="Identifiant Système (Titre Bold)" value={hero.title} onChange={(v) => setHero({...hero, title: v})} />
          <CMSField label="Sous-identifiant (Nom Italic)" value={hero.subtitle} onChange={(v) => setHero({...hero, subtitle: v})} />
          <div className="lg:col-span-2">
            <CMSField label="Annonce Mission (Description)" isTextArea value={hero.description} onChange={(v) => setHero({...hero, description: v})} />
          </div>
          <CMSField label="Directive Alpha (CTA 1)" value={hero.primaryCTA} onChange={(v) => setHero({...hero, primaryCTA: v})} />
          <CMSField label="Directive Beta (CTA 2)" value={hero.secondaryCTA} onChange={(v) => setHero({...hero, secondaryCTA: v})} />
        </div>
      </AdminCard>

      <SaveBar isDirty={isDirty} loading={loading} onSave={onSave} />
    </div>
  );
}
