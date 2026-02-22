import React from 'react';
import { Search, Download, Trash2, Send, MailOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Subscriber } from '@shared/api';
import { AdminHeader, AdminCard, CMSField } from './AdminShared';

interface AdminNewsletterProps {
  subscribers: Subscriber[];
  onDelete: (email: string) => void;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  emailBody: string;
  setEmailBody: (body: string) => void;
  onSendBroadcast: () => void;
  loading: boolean;
  activeTab: 'newsletter' | 'emailing';
}

export function AdminNewsletter({ 
  subscribers, 
  onDelete, 
  emailSubject, 
  setEmailSubject, 
  emailBody, 
  setEmailBody, 
  onSendBroadcast,
  loading,
  activeTab 
}: AdminNewsletterProps) {
  const [search, setSearch] = React.useState('');

  const filteredSubscribers = subscribers.filter(sub => 
    (sub.email || '').toLowerCase().includes((search || '').toLowerCase())
  );

  const exportSubscribers = () => {
    const blob = new Blob([JSON.stringify(subscribers, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers_export.json';
    a.click();
  };

  if (activeTab === 'newsletter') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
        <AdminHeader 
          title="Newsletter Database" 
          subtitle="Liste des entités abonnées au flux d'information Cosmos." 
        />

        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-6 top-5 text-muted-foreground/60" size={20} />
            <input 
              placeholder="Rechercher une entité (email)..." 
              className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-black/40 border border-white/10 outline-none focus:border-primary/50 transition-all font-bold text-sm text-white" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <Button 
            variant="outline" 
            className="gap-3 rounded-2xl h-14 font-black px-10 border-white/10 hover:bg-white/5" 
            onClick={exportSubscribers}
          >
            <Download size={18} /> Exporter la Base
          </Button>
        </div>

        <AdminCard className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
              <tr>
                <th className="px-10 py-6">Entité Email</th>
                <th className="px-10 py-6">Date Inscription</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-medium">
              {filteredSubscribers.reverse().map((sub, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-10 py-6 font-bold text-white">{sub.email}</td>
                  <td className="px-10 py-6 text-muted-foreground uppercase text-[10px] font-mono tracking-tighter">
                    {new Date(sub.date).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => onDelete(sub.email)}
                      className="text-red-500/30 hover:text-red-500 hover:scale-125 transition-all outline-none"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSubscribers.length === 0 && (
            <div className="p-20 text-center text-muted-foreground italic uppercase tracking-widest text-[10px]">
              Aucune donnée disponible dans le pool.
            </div>
          )}
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Campagnes Emailing Elite" 
        subtitle="Émission groupée ou individuelle via protocole SMTP sécurisé." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <AdminCard className="space-y-8">
            <CMSField 
              label="Objet de la Transmission" 
              value={emailSubject} 
              onChange={setEmailSubject} 
            />
            <CMSField 
              label="Corps du Message (HTML Supporté)" 
              isTextArea 
              value={emailBody} 
              onChange={setEmailBody} 
            />
            <div className="flex gap-4">
              <Button 
                className="flex-1 h-16 rounded-[2rem] font-black uppercase tracking-widest gap-3 shadow-glow" 
                onClick={onSendBroadcast} 
                disabled={loading || !emailSubject}
              >
                <Send size={20} /> Diffuser au Pool Global ({subscribers.length})
              </Button>
              <Button variant="outline" className="h-16 rounded-[2rem] font-bold px-8 border-white/10" title="Aperçu">
                <MailOpen size={20} />
              </Button>
            </div>
          </AdminCard>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 h-full">
            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 block mb-6">
              Informations Protocolaires
            </Label>
            <div className="space-y-6 text-xs text-muted-foreground/70 leading-relaxed italic">
              <p>• L'envoi groupé utilise le serveur SMTP configuré dans vos variables .env.</p>
              <p>• Les e-mails sont formatés avec une charte graphique dark-premium par défaut.</p>
              <p>• Un délai de 500ms est appliqué entre chaque envoi pour éviter les flags de spam.</p>
              <p className="text-primary font-black mt-4 uppercase tracking-widest text-[9px]">Status: Système Prêt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
