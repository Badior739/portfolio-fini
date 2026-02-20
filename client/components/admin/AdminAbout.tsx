import React from 'react';
import { AboutContent, BentoItem } from '@shared/api';
import { AdminHeader, CMSField, AdminCard, SaveBar } from './AdminShared';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Zap, Download, LayoutDashboard, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminAboutProps {
  about: AboutContent;
  setAbout: (about: AboutContent) => void;
  bento: BentoItem[];
  setBento: (bento: BentoItem[]) => void;
  onSave: () => void;
  loading: boolean;
  isDirty: boolean;
}

export function AdminAbout({ about, setAbout, bento, setBento, onSave, loading, isDirty }: AdminAboutProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader title="À Propos de l'Architecte" subtitle="Gestion de l'héritage et de la vision systémique." />
      
      <AdminCard className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <CMSField label="Titre Principal" value={about.titleMain} onChange={(v) => setAbout({...about, titleMain: v})} />
          <CMSField label="Titre Subsidiaire" value={about.titleSub} onChange={(v) => setAbout({...about, titleSub: v})} />
          <div className="md:col-span-2">
            <CMSField label="Citation Signature (En-tête)" isTextArea value={about.quote} onChange={(v) => setAbout({...about, quote: v})} />
          </div>
          <div className="md:col-span-2">
             <CMSField label="Narration Architecturale (Biographie Complète)" isTextArea value={about.description} onChange={(v) => setAbout({...about, description: v})} />
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <Label className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 block ml-1">Représentation Visuelle (Profile 3D)</Label>
            <div className="flex flex-col md:flex-row gap-10 items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10 group hover:border-primary/40 transition-all duration-700">
              <div className="relative h-44 w-44 rounded-[2rem] overflow-hidden border-4 border-white/10 group-hover:border-primary shadow-glow shadow-primary/20 flex-shrink-0 transition-all duration-700">
                 <img src={about.profileImage} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" alt="Preview"/>
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm" onClick={() => document.getElementById('profile-up-final')?.click()}>
                    <Zap size={32} className="text-white drop-shadow-glow"/>
                 </div>
              </div>
              <div className="flex-1 w-full space-y-6">
                <input className="w-full px-8 py-5 rounded-2xl bg-black/40 border border-white/10 text-sm font-black text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" value={about.profileImage} onChange={(e) => setAbout({...about, profileImage: e.target.value})} placeholder="URL Externe de l'image" />
                <div className="flex items-center gap-6">
                   <div className="h-[1px] flex-1 bg-white/5"/>
                   <span className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.3em]">Ou Procédure Locale</span>
                   <div className="h-[1px] flex-1 bg-white/5"/>
                </div>
                <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 border-white/10 hover:bg-primary hover:text-white transition-all shadow-premium" onClick={() => document.getElementById('profile-up-final')?.click()}>
                   <Download size={18}/> Charger depuis le terminal local
                </Button>
                <input id="profile-up-final" type="file" className="hidden" onChange={async (e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (data.success) {
                        setAbout({...about, profileImage: data.url});
                        toast({ title: "Image Uploadée", description: "Le système a synchronisé la nouvelle photo." });
                      }
                   }
                 }} />
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Module Bento (Grille Dynamique)" icon={LayoutDashboard}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bento.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-6 group hover:border-primary transition-all duration-500">
                 <CMSField label={`Bloc ${idx+1} - Titre`} value={item.title} onChange={(v) => {
                    const n = [...bento]; n[idx].title = v; setBento(n);
                 }} />
                 <CMSField label={`Bloc ${idx+1} - Contenu`} value={item.content} onChange={(v) => {
                    const n = [...bento]; n[idx].content = v; setBento(n);
                 }} />
                 <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-1">Icône</Label>
                   <select 
                      className="w-full px-8 py-5 rounded-2xl bg-black/40 border border-white/10 text-sm font-bold text-white outline-none focus:border-primary/50 transition-all"
                      value={item.icon}
                      onChange={(e) => {
                        const n = [...bento]; n[idx].icon = e.target.value; setBento(n);
                      }}
                   >
                      <option value="Briefcase">💼 EXPÉRIENCE</option>
                      <option value="GraduationCap">🎓 FORMATION</option>
                      <option value="Terminal">💻 VISION CODE</option>
                      <option value="MapPin">📍 RÉGION</option>
                      <option value="Award">🏆 DISTINCTION</option>
                   </select>
                 </div>
              </div>
            ))}
          </div>
       </AdminCard>

      <SaveBar isDirty={isDirty} loading={loading} onSave={onSave} />
    </div>
  );
}
