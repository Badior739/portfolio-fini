import React from 'react';
import { LucideIcon, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export { Label };

// --- Types ---
export type AdminTab = 'dashboard' | 'home' | 'about' | 'skills' | 'projects' | 'contact' | 'messages' | 'newsletter' | 'emailing' | 'settings' | 'credibility' | 'appointments';

// --- UI Components ---

export function AdminHeader({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
            {title}
          </h2>
          {badge && (
            <span className="text-[10px] font-mono text-muted-foreground/40 bg-white/5 px-3 py-1 rounded-full uppercase">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-muted-foreground font-medium text-lg tracking-tight">{subtitle}</p>}
      </div>
    </div>
  );
}

export function CMSField({ 
  label, 
  value, 
  onChange, 
  isTextArea = false, 
  placeholder = "" 
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  isTextArea?: boolean; 
  placeholder?: string;
}) {
  return (
    <div className="space-y-3 group">
      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-focus-within:text-primary transition-colors ml-1">
        {label}
      </Label>
      {isTextArea ? (
        <textarea 
          className="w-full min-h-[120px] px-8 py-5 rounded-[2rem] bg-black/40 border border-white/10 text-sm font-medium text-white/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-white/10"
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input 
          className="w-full px-8 py-5 rounded-2xl bg-black/40 border border-white/10 text-sm font-bold text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-white/10"
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export function AdminCard({ children, className, title, icon: Icon }: { children: React.ReactNode; className?: string; title?: string; icon?: LucideIcon }) {
  return (
    <div className={cn("bg-card/20 border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-premium relative overflow-hidden group transition-all duration-500 hover:border-white/10", className)}>
      {title && (
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
            {Icon && <Icon size={24} className="text-primary"/>} {title}
          </h4>
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend?: string }) {
  return (
    <div className="bg-card/30 border border-white/5 p-10 rounded-[3rem] group hover:border-primary/30 transition-all duration-500 shadow-premium relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
         {icon}
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</p>
          <div className="flex items-center gap-3">
             <h4 className="text-4xl font-black tracking-tighter text-white">{value}</h4>
             {trend && <span className="text-[10px] font-mono text-green-400/60">{trend}</span>}
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
        <div className="h-full bg-primary/40 w-[65%] group-hover:w-full transition-all duration-1000"/>
      </div>
    </div>
  );
}

export function NavBtn({ active, icon, label, onClick, badge }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
        active 
          ? "bg-primary text-white shadow-glow translate-x-2" 
          : "text-muted-foreground hover:bg-white/5 hover:text-white"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <span className={cn("transition-transform duration-500", active ? "scale-110" : "group-hover:scale-110")}>{icon}</span>
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-black relative z-10",
          active ? "bg-white text-primary" : "bg-primary/20 text-primary"
        )}>
          {badge}
        </span>
      )}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary-foreground/20 opacity-90"/>
      )}
    </button>
  );
}

export function SaveBar({ isDirty, loading, onSave }: { isDirty: boolean; loading: boolean; onSave: () => void }) {
  if (!isDirty) return null;
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-black/80 backdrop-blur-2xl border border-primary/30 p-4 px-10 rounded-full shadow-glow flex items-center gap-10">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary animate-pulse">Modifications non enregistrées</p>
        <Button 
          onClick={onSave} 
          disabled={loading}
          className="rounded-full px-12 h-12 font-black uppercase tracking-widest text-xs shadow-premium bg-primary hover:bg-primary/90"
        >
          {loading ? "Synchronisation..." : "Déployer les changements"}
        </Button>
      </div>
    </div>
  );
}
