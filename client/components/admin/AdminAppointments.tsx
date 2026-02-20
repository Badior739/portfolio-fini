import React, { useState } from 'react';
import { Calendar, Trash2, Send, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Appointment } from '@shared/api';
import { AdminHeader, CMSField } from './AdminShared';
import { toast } from '@/hooks/use-toast';

interface AdminAppointmentsProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
  onReply: (to: string, subject: string, message: string) => Promise<void>;
}

export function AdminAppointments({ appointments, onDelete, onReply }: AdminAppointmentsProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReply = async (email: string) => {
    if (!subject || !message) {
      toast({ title: "Erreur", description: "Sujet et message requis", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await onReply(email, subject, message);
      toast({ title: "Réponse envoyée", description: `Réponse envoyée à ${email}` });
      setReplyingTo(null);
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Échec de l'envoi", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const startReply = (appt: Appointment) => {
    if (replyingTo === appt.id) {
      setReplyingTo(null);
    } else {
      setReplyingTo(appt.id);
      setSubject(`RE: Votre demande de rendez-vous - ${appt.topic}`);
      setMessage(`Bonjour ${appt.name},\n\nMerci pour votre demande de rendez-vous concernant "${appt.topic}".\n\nCordialement,\n`);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Agenda Stratégique" 
        subtitle="Gestion des demandes de rendez-vous et consultations." 
      />

      <div className="space-y-8">
        {(!appointments || appointments.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <Calendar size={64} className="text-white/5 mb-6" />
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">Agenda Vide // Aucun Rendez-vous</p>
          </div>
        ) : (
          [...appointments].reverse().map((appt) => (
            <div key={appt.id} className="bg-card/30 border border-white/5 p-12 rounded-[3.5rem] group hover:border-primary/30 transition-all duration-700 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
                <div className="space-y-8 flex-1">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                      <Calendar size={12} /> {new Date(appt.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                      <Clock size={12} /> {appt.time}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground/40 tracking-widest ml-auto bg-black/40 px-4 py-2 rounded-full uppercase italic">
                      Reçu le: {new Date(appt.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-white flex items-center gap-4">
                      {appt.name} 
                    </h4>
                    <div className="text-primary font-mono text-sm flex items-center gap-2 cursor-pointer hover:underline" onClick={() => startReply(appt)}>
                      <Mail size={14}/> {appt.email}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-primary/10 to-transparent" />
                    <p className="text-xl text-muted-foreground leading-relaxed italic font-medium pl-4">"{appt.topic}"</p>
                  </div>

                  {replyingTo === appt.id && (
                    <div className="mt-8 space-y-6 bg-black/20 p-8 rounded-[2rem] border border-white/10 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                          <Send size={20} />
                        </div>
                        <h5 className="text-lg font-bold text-white">Répondre à {appt.name}</h5>
                      </div>
                      
                      <CMSField 
                        label="Sujet" 
                        value={subject} 
                        onChange={setSubject} 
                        placeholder="Sujet de l'email..." 
                      />
                      <CMSField 
                        label="Message" 
                        value={message} 
                        onChange={setMessage} 
                        isTextArea 
                        placeholder="Votre message..." 
                      />
                      
                      <div className="flex gap-4 pt-4">
                        <Button 
                          onClick={() => handleReply(appt.email)} 
                          disabled={loading} 
                          className="rounded-full px-8 bg-primary text-white hover:bg-primary/80 h-12 font-bold uppercase tracking-widest text-xs"
                        >
                          {loading ? "Envoi en cours..." : "Envoyer la réponse"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => setReplyingTo(null)} 
                          className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs hover:bg-white/5"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col gap-4 justify-start lg:justify-end items-end">
                  <Button 
                    variant="outline" 
                    className="rounded-3xl border-white/10 bg-white/5 hover:border-red-500/50 hover:text-red-500 h-20 w-20 p-0 shadow-premium group/del transition-all" 
                    onClick={() => onDelete(appt.id)}
                  >
                    <Trash2 size={24} className="group-hover/del:scale-110 transition-transform" />
                  </Button>
                  <Button 
                    className={`rounded-3xl transition-all h-20 w-20 p-0 shadow-premium group/send scale-110 ${replyingTo === appt.id ? 'bg-primary text-white' : 'bg-secondary hover:bg-white'}`}
                    onClick={() => startReply(appt)}
                  >
                    <Send size={24} className={`transition-transform duration-500 ${replyingTo !== appt.id ? 'group-hover/send:translate-x-2 group-hover/send:-translate-y-2' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
