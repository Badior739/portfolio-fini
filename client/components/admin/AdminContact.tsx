import React from 'react';
import { Button } from '@/components/ui/button';
import { ContactInfo } from '@shared/api';
import { AdminHeader, AdminCard, CMSField, SaveBar } from './AdminShared';

interface AdminContactProps {
  contact: ContactInfo;
  setContact: (contact: ContactInfo) => void;
  onSave: () => void;
  loading: boolean;
  isDirty: boolean;
}

export function AdminContact({ contact, setContact, onSave, loading, isDirty }: AdminContactProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Canaux de Communication" 
        subtitle="Maintenance des protocoles de transmission et contacts." 
      />

      <AdminCard className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <CMSField 
            label="Email Principal" 
            value={contact.email} 
            onChange={(v) => setContact({ ...contact, email: v })} 
          />
          <CMSField 
            label="Localisation Opérationnelle" 
            value={contact.location} 
            onChange={(v) => setContact({ ...contact, location: v })} 
          />
          <CMSField 
            label="LinkedIn Signal" 
            value={contact.linkedin} 
            onChange={(v) => setContact({ ...contact, linkedin: v })} 
          />
          <CMSField 
            label="GitHub Repository" 
            value={contact.github} 
            onChange={(v) => setContact({ ...contact, github: v })} 
          />
        </div>
        
        <div className="pt-8 border-t border-white/5 flex items-center justify-between opacity-50 italic">
          <p className="text-xs">Note: Certains champs de contact sont liés à vos variables d'environnement globales.</p>
          <Button variant="link" className="text-primary text-[10px] font-black uppercase tracking-widest p-0 h-auto">
            Voir Configuration
          </Button>
        </div>
      </AdminCard>

      <SaveBar onSave={onSave} loading={loading} isDirty={isDirty} />
    </div>
  );
}
