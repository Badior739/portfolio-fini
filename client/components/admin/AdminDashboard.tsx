import React from 'react';
import { RefreshCw, Eye, Users, MessageSquare, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminHeader, StatCard } from './AdminShared';
import { StatsEntry, Subscriber } from '@shared/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

interface AdminDashboardProps {
  stats: { visits: number; messages: number };
  subscribersCount: number;
  history: StatsEntry[];
  loading: boolean;
  onRefresh: () => void;
}

export function AdminDashboard({ stats, subscribersCount, history, loading, onRefresh }: AdminDashboardProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <AdminHeader 
          title="Centre de Commande" 
          subtitle="Analyse temps-réel et métriques de performance systémique." 
        />
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onRefresh} 
          className="gap-3 rounded-2xl border-white/10 bg-white/5 font-bold px-8 h-14 hover:bg-white/10 transition-all shadow-premium"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Rafraîchir
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard icon={<Eye size={24}/>} label="Vues Totales" value={stats.visits.toLocaleString()} trend="+12.5%" />
        <StatCard icon={<Users size={24}/>} label="Abonnés" value={subscribersCount.toString()} trend="+5.2%" />
        <StatCard icon={<MessageSquare size={24}/>} label="Interactions" value={stats.messages.toString()} trend="+22.1%" />
      </div>

      {/* Advanced Analytics Chart */}
      <div className="bg-card/30 border border-white/5 p-10 rounded-[3rem] shadow-premium relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-1000"/>
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
            <Activity className="text-primary animate-pulse" size={24}/> Flux de Trafic & Engagement 
            <span className="text-[10px] font-mono text-muted-foreground/40 bg-white/5 px-3 py-1 rounded-full ml-2">DATA_STREAM_ACTIVE</span>
          </h3>
          <div className="flex gap-4">
             <div className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">Historique</div>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.2)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                }}
              />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                itemStyle={{ color: 'hsl(var(--primary))', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="visits" 
                stroke="hsl(var(--primary))" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorVisits)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
