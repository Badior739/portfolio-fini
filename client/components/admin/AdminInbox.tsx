import React from 'react';
import { MailOpen, Trash2, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReceivedMessage } from '@shared/api';
import { AdminHeader } from './AdminShared';

interface AdminInboxProps {
  messages: ReceivedMessage[];
  onDelete: (id: number) => void;
}

export function AdminInbox({ messages, onDelete }: AdminInboxProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Intelligence Client" 
        subtitle="Flux de propositions stratégiques et signaux de collaboration." 
      />

      <div className="space-y-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <MailOpen size={64} className="text-white/5 mb-6" />
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">Signal Vide // Aucune Proposition</p>
          </div>
        ) : (
          [...messages].reverse().map((m) => (
            <div key={m.id} className="bg-card/30 border border-white/5 p-12 rounded-[3.5rem] group hover:border-primary/30 transition-all duration-700 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] pointer-events-none" />
              <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
                <div className="space-y-8 flex-1">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                      {m.projectType}
                    </div>
                    <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                      {m.budget}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground/40 tracking-widest ml-auto bg-black/40 px-4 py-2 rounded-full uppercase italic">
                      Received: {new Date(m.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-white flex items-center gap-4">
                      {m.name} 
                      {m.company && <span className="text-primary/60 font-medium text-lg tracking-tight bg-primary/5 px-4 py-1 rounded-xl">@{m.company}</span>}
                    </h4>
                    <div className="text-primary font-mono text-sm underline underline-offset-8 decoration-primary/20 hover:decoration-primary transition-all cursor-pointer inline-block">
                      {m.email}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-primary/10 to-transparent" />
                    <p className="text-xl text-muted-foreground leading-relaxed italic font-medium pl-4">"{m.message}"</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                      <Clock size={14} /> Échéancier: <span className="text-white/60">{m.timeline}</span>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-4 justify-end">
                  <Button 
                    variant="outline" 
                    className="rounded-3xl border-white/10 bg-white/5 hover:border-red-500/50 hover:text-red-500 h-20 w-20 p-0 shadow-premium group/del transition-all" 
                    onClick={() => onDelete(m.id)}
                  >
                    <Trash2 size={24} className="group-hover/del:scale-110 transition-transform" />
                  </Button>
                  <Button className="rounded-3xl bg-secondary hover:bg-white transition-all h-20 w-20 p-0 shadow-premium group/send scale-110">
                    <Send size={24} className="group-hover/send:translate-x-2 group-hover/send:-translate-y-2 transition-transform duration-500" />
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
