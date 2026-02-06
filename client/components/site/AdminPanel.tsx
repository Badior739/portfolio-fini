'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Search, Trash2, Users, LayoutDashboard, Briefcase, Settings, MessageSquare, Send, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { skills as defaultSkills } from '@/data/skills';
import { projects as defaultProjects } from '@/data/projects';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShieldCheck, ArrowLeft, Plus, Save, Download, Globe, User, Zap, MailOpen, Activity, Lock, RefreshCw, Clock } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from 'recharts';

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [stats, setStats] = useState({ visits: 0, messages: 0 });
  const [localSkills, setLocalSkills] = useState<any[]>([]);
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'home' | 'about' | 'skills' | 'projects' | 'contact' | 'messages' | 'newsletter' | 'emailing' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [statsHistory, setStatsHistory] = useState<any[]>([]);

  // New CMS State
  const [hero, setHero] = useState<any>({
    badge: "", title: "", subtitle: "", description: "", primaryCTA: "", secondaryCTA: ""
  });
  const [about, setAbout] = useState<any>({
    titleMain: "", titleSub: "", quote: "", description: "", profileImage: ""
  });
  const [bento, setBento] = useState<any[]>([]);
  const [contact, setContact] = useState<any>({
    email: "ouattarabadiori20@gmail.com",
    location: "France",
    linkedin: "linkedin.com/in/badior-o",
    github: "github.com/badior-o"
  });

  // Formulaire Emailing
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);

  useEffect(() => {
    if (authenticated) {
      loadStats();
      loadContent();
      loadSubscribers();
    }
  }, [authenticated]);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats({ visits: data.visits || 0, messages: data.messages || 0 });
      setStatsHistory(data.statsHistory || []);
    } catch (e) { console.error(e); }
  };

  const loadContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      setLocalSkills(data.skills || []);
      setLocalProjects(data.projects || []);
      
      if (data.hero) setHero(data.hero);
      if (data.about) setAbout(data.about);
      if (data.bento) setBento(data.bento);
      if (data.contact) setContact(data.contact);
      if (data.receivedMessages) setReceivedMessages(data.receivedMessages);
    } catch (e) { console.error(e); }
  };

  const loadSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter/subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (e) { console.error(e); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ password }) 
      });
      const data = await res.json();
      if (res.ok) {
        if (data.requires2FA) {
          setRequires2FA(true);
          toast({ title: "Code envoyé", description: "Veuillez vérifier votre email pour le code de sécurité." });
        } else {
          // Normal success if 2FA is somehow bypassed or not needed
          setAuthenticated(true);
          setAdminPassword(password);
          setPassword('');
        }
      } else {
        toast({ title: "Erreur", description: data.error || "Mot de passe incorrect", variant: "destructive" });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleVerify2FA = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpCode.length !== 6) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthenticated(true);
        setAdminPassword(password);
        setPassword('');
        toast({ title: "Accès autorisé", description: "Bienvenue, Badior." });
      } else {
        toast({ title: "Erreur 2FA", description: data.error || "Code invalide", variant: "destructive" });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveContent = async (updatedSkills = localSkills, updatedProjects = localProjects) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: adminPassword, 
          skills: updatedSkills.map((s: any) => ({ ...s, icon: typeof s.icon === 'string' ? s.icon : (s.name || 'Code') })), 
          projects: updatedProjects,
          hero,
          about,
          bento,
          contact
        }),
      });
      if (res.ok) {
        toast({ title: "Succès", description: "Modifications enregistrées." });
        window.dispatchEvent(new CustomEvent('site-data-updated'));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const deleteMessage = async (id: number) => {
    const updatedMessages = receivedMessages.filter(m => m.id !== id);
    setReceivedMessages(updatedMessages);
    // Silent save to server
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, receivedMessages: updatedMessages })
      });
    } catch(e) {}
  };

  const sendBroadcastEmail = async () => {
    if (!emailSubject || !emailBody) return toast({ title: "Erreur", description: "Champs vides", variant: "destructive" });
    setLoading(true);
    try {
       const res = await fetch('/api/admin/broadcast', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ 
           password: adminPassword,
           subject: emailSubject, 
           body: emailBody 
         })
       });
       const data = await res.json();
       if (res.ok) {
         toast({ title: "Email envoyé", description: `Envoyé à ${data.count} abonnés avec succès.` });
         setEmailSubject(''); setEmailBody('');
       } else {
         toast({ title: "Erreur", description: data.error || "Échec de l'envoi", variant: "destructive" });
       }
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-md">
        <div className="w-[92%] max-w-sm rounded-[2.5rem] bg-card p-10 shadow-premium border border-border/50 transition-all duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 animate-pulse">
               <ShieldCheck size={32} />
            </div>
            <h3 className="text-3xl font-black tracking-tight text-foreground">Badior Admin</h3>
            <p className="text-sm text-muted-foreground mt-2">Authentification Sécurisée 2FA</p>
          </div>

          {!requires2FA ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Mot de passe système" 
                  className="w-full rounded-2xl border border-border bg-secondary/50 px-6 py-4 outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/40" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-6 top-4 text-muted-foreground/60 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button type="submit" disabled={loading} className="w-full py-7 rounded-2xl font-black uppercase tracking-widest bg-primary shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all">
                {loading ? "Chargement..." : "Initialiser la session"}
              </Button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex items-center gap-2 mb-2">
                 <button onClick={() => setRequires2FA(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                   <ArrowLeft size={16} />
                 </button>
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Saisir le Code OTP</span>
               </div>
               
               <div className="flex justify-center">
                 <InputOTP 
                   maxLength={6} 
                   value={otpCode} 
                   onChange={(val) => {
                     setOtpCode(val);
                     if (val.length === 6) {
                        // We set it but let user click button or we could auto-submit
                     }
                   }}
                 >
                   <InputOTPGroup className="gap-2">
                     {[0,1,2,3,4,5].map(i => (
                       <InputOTPSlot key={i} index={i} className="rounded-xl border-border bg-secondary/50 h-14 w-12 text-lg font-bold" />
                     ))}
                   </InputOTPGroup>
                 </InputOTP>
               </div>

               <Button 
                onClick={() => handleVerify2FA()} 
                disabled={loading || otpCode.length !== 6}
                className="w-full py-7 rounded-2xl font-black uppercase tracking-widest bg-primary shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
               >
                 {loading ? "Vérification..." : "Vérifier le Code"}
               </Button>
               
               <p className="text-[10px] text-center text-muted-foreground/60 uppercase tracking-widest">
                 Code envoyé à votre adresse sécurisée
               </p>
            </div>
          )}
          
          <Button variant="ghost" onClick={onClose} className="w-full mt-6 text-muted-foreground hover:text-foreground">Fermer la console</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/95">
      <div className="w-full max-w-7xl h-[90vh] rounded-[3rem] bg-card/40 backdrop-blur-3xl shadow-premium border border-white/10 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-72 border-r border-white/5 p-8 flex flex-col gap-1 overflow-y-auto bg-black/20">
          <div className="mb-10 px-2 text-center md:text-left">
            <h3 className="text-2xl font-black flex items-center gap-3 text-primary uppercase tracking-tighter">
              <Activity className="animate-pulse" size={26}/> CMS Elite
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono mt-2 opacity-50 uppercase tracking-[0.2em] leading-tight">Architectural Command Pool CC-V2</p>
          </div>
          
          <div className="space-y-8">
            <div>
              <Label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 ml-3 mb-4 block">Flux Analytique</Label>
              <NavBtn active={activeTab === 'dashboard'} icon={<LayoutDashboard size={18}/>} label="Tableau de bord" onClick={() => setActiveTab('dashboard')} />
            </div>

            <div>
              <Label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 ml-3 mb-4 block">Architecture Site</Label>
              <NavBtn active={activeTab === 'home'} icon={<Globe size={18}/>} label="Section Accueil" onClick={() => setActiveTab('home')} />
              <NavBtn active={activeTab === 'about'} icon={<User size={18}/>} label="Section À Propos" onClick={() => setActiveTab('about')} />
              <NavBtn active={activeTab === 'skills'} icon={<Zap size={18}/>} label="Compétences" onClick={() => setActiveTab('skills')} />
              <NavBtn active={activeTab === 'projects'} icon={<Briefcase size={18}/>} label="Portfolio Projets" onClick={() => setActiveTab('projects')} />
              <NavBtn active={activeTab === 'contact'} icon={<Mail size={18}/>} label="Configuration Contact" onClick={() => setActiveTab('contact')} />
              <NavBtn active={activeTab === 'messages'} icon={<MessageSquare size={18}/>} label="Propositions Client" onClick={() => setActiveTab('messages')} badge={receivedMessages.length} />
            </div>

            <div>
              <Label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 ml-3 mb-4 block">Engagement Pool</Label>
              <NavBtn active={activeTab === 'newsletter'} icon={<Users size={18}/>} label="Newsletter DB" onClick={() => setActiveTab('newsletter')} />
              <NavBtn active={activeTab === 'emailing'} icon={<Send size={18}/>} label="Campagnes Email" onClick={() => setActiveTab('emailing')} />
            </div>

            <div>
              <Label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 ml-3 mb-4 block">Config Système</Label>
              <NavBtn active={activeTab === 'settings'} icon={<Settings size={18}/>} label="Paramètres CMS" onClick={() => setActiveTab('settings')} />
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-3">
            <Button variant="ghost" className="justify-start gap-4 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-2xl h-12 font-bold px-4" onClick={() => setAuthenticated(false)}>
              <Lock size={16}/> Déconnexion
            </Button>
            <Button variant="secondary" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow" onClick={onClose}>Fermer la console</Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-card/20 to-transparent p-10 md:p-16 custom-scrollbar relative">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter mb-3 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                    Centre de Commande
                  </h2>
                  <p className="text-muted-foreground font-medium text-lg tracking-tight">Analyse temps-réel et métriques de performance systémique.</p>
                </div>
                <Button variant="outline" size="lg" onClick={loadStats} className="gap-3 rounded-2xl border-white/10 bg-white/5 font-bold px-8 h-14 hover:bg-white/10 transition-all shadow-premium">
                  <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Rafraîchir
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard icon={<Eye size={24}/>} label="Vues Totales" value={stats.visits.toLocaleString()} trend="+12.5%" />
                <StatCard icon={<Users size={24}/>} label="Abonnés" value={subscribers.length.toString()} trend="+5.2%" />
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
                     <div className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">7 Derniers Jours</div>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsHistory}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 900 }} 
                        dy={20}
                        tickFormatter={(v) => new Date(v).toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}
                      />
                      <YAxis hide />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(10,10,12,0.9)', 
                          border: '1px solid rgba(255,255,255,0.2)', 
                          borderRadius: '24px', 
                          fontSize: '13px',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: 'white', fontWeight: 900, textTransform: 'uppercase' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={6}
                        fillOpacity={1} 
                        fill="url(#colorVisits)" 
                        animationDuration={2500}
                        activeDot={{ r: 8, fill: 'white', stroke: 'hsl(var(--primary))', strokeWidth: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
              <HeaderSection title="Section Accueil" subtitle="Configurateur de l'interface d'entrée monumentale." />
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
              <SaveBar onSave={() => saveContent()} loading={loading} />
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
              <HeaderSection title="À Propos de l'Architecte" subtitle="Gestion de l'héritage et de la vision systémique." />
              <div className="bg-card/20 border border-white/5 p-12 rounded-[3.5rem] space-y-12 shadow-premium">
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

                <div className="pt-12 border-t border-white/5 space-y-10">
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                      <LayoutDashboard size={24} className="text-primary"/> Structure Bento Grid
                    </h4>
                    <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-4 py-2 rounded-full uppercase">GRID_SYSTEM_V4</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {bento.map((item, idx) => (
                       <div key={idx} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 group hover:border-primary/30 transition-all duration-500 relative overflow-hidden shadow-premium">
                          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000 rotate-12">
                             <Activity size={80} className="text-primary"/>
                          </div>
                          <div className="flex justify-between items-start mb-10 relative z-10">
                            <CMSField label={`Bloc ${idx + 1}: Titre Module`} value={item.title} onChange={(v) => {
                              const newBento = [...bento];
                              newBento[idx] = {...item, title: v};
                              setBento(newBento);
                            }} />
                            <select 
                              className="bg-black/40 border border-white/10 rounded-xl text-[10px] font-black uppercase p-3 outline-none hover:border-primary transition-all text-white/60 focus:text-primary"
                              value={item.icon}
                              onChange={(e) => {
                                const newBento = [...bento];
                                newBento[idx] = {...item, icon: e.target.value};
                                setBento(newBento);
                              }}
                            >
                              <option value="Briefcase">💼 EXPÉRIENCE</option>
                              <option value="GraduationCap">🎓 FORMATION</option>
                              <option value="Terminal">💻 VISION CODE</option>
                              <option value="MapPin">📍 RÉGION</option>
                              <option value="Award">🏆 DISTINCTION</option>
                            </select>
                          </div>
                          <div className="relative z-10">
                             <CMSField label="Détails de l'implémentation" isTextArea value={item.content} onChange={(v) => {
                               const newBento = [...bento];
                               newBento[idx] = {...item, content: v};
                               setBento(newBento);
                             }} />
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
              <SaveBar onSave={() => saveContent()} loading={loading} />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
              <HeaderSection title="Compétences & Expertise" subtitle="Gestion dynamique du pool technologique." />
              <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/5 mb-8">
                 <p className="text-muted-foreground text-sm font-medium italic">Ajoutez ou modifiez vos briques technologiques pour mettre en valeur votre stack.</p>
                 <Button onClick={() => setLocalSkills([...localSkills, { name: 'Nouveau', level: 80, category: 'Frontend', icon: 'Code' }])} className="gap-2 rounded-xl h-12 font-bold px-6">
                    <Plus size={18}/> Nouveau Module
                 </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(localSkills || []).map((s, idx) => (
                  <div key={idx} className="bg-card border border-border p-8 rounded-[2rem] group hover:border-primary/50 transition-all shadow-premium relative overflow-hidden">
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground/30 hover:text-red-500 transition-colors" onClick={() => {
                        const newSkills = [...localSkills];
                        newSkills.splice(idx, 1);
                        setLocalSkills(newSkills);
                    }}><Trash2 size={16}/></Button>
                    <div className="space-y-6">
                      <CMSField label="Nom de la compétence" value={s.name} onChange={(v) => {
                         const newSkills = [...localSkills];
                         newSkills[idx] = {...s, name: v};
                         setLocalSkills(newSkills);
                      }} />
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Niveau de Maîtrise (%)</Label>
                        <input type="range" className="w-full accent-primary h-2 rounded-full cursor-pointer" value={s.level} onChange={(e) => {
                           const newSkills = [...localSkills];
                           newSkills[idx] = {...s, level: parseInt(e.target.value)};
                           setLocalSkills(newSkills);
                        }} />
                        <div className="flex justify-between text-[10px] font-mono text-primary/60 px-1 uppercase"><span>Initial</span><span>{s.level}%</span><span>Expert</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <SaveBar onSave={() => saveContent()} loading={loading} />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
              <HeaderSection title="Portfolio Projets" subtitle="Curateur de vos réalisations monumentales." />
              <div className="flex justify-between items-center mb-8">
                 <Button onClick={() => setLocalProjects([{ id: Date.now(), title: 'Nouveau Projet', category: 'Web Architecture', description: '', tools: [], image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', year: new Date().getFullYear() }, ...localProjects])} className="gap-3 rounded-2xl h-14 font-black px-10 shadow-glow">
                    <Plus size={20}/> Déployer un Projet
                 </Button>
              </div>
              <div className="grid grid-cols-1 gap-10">
                {(localProjects || []).map((p, idx) => (
                  <div key={p.id} className="bg-card/20 border border-white/5 p-10 rounded-[3rem] group hover:border-primary/30 transition-all duration-700 shadow-premium flex flex-col lg:flex-row gap-12 relative overflow-hidden">
                    <div className="w-full lg:w-72 h-48 rounded-[2rem] overflow-hidden border border-white/10 shadow-glow flex-shrink-0 relative group/img">
                       <img src={p.image} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" alt={p.title}/>
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm" onClick={() => document.getElementById(`project-up-${p.id}`)?.click()}>
                          <Download size={24} className="text-white"/>
                       </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <CMSField label="Identifiant Projet (Titre)" value={p.title} onChange={(v) => { const c = [...localProjects]; c[idx].title = v; setLocalProjects(c); }} />
                      <CMSField label="Catégorie Système" value={p.category} onChange={(v) => { const c = [...localProjects]; c[idx].category = v; setLocalProjects(c); }} />
                      <CMSField label="Rôle / Position" value={p.role || ""} onChange={(v) => { const c = [...localProjects]; c[idx].role = v; setLocalProjects(c); }} />
                      <CMSField label="Année de Livraison" value={p.year?.toString() || ""} onChange={(v) => { const c = [...localProjects]; c[idx].year = parseInt(v); setLocalProjects(c); }} />
                      <div className="md:col-span-2">
                        <CMSField label="Narration Techniques (Description)" isTextArea value={p.description} onChange={(v) => { const c = [...localProjects]; c[idx].description = v; setLocalProjects(c); }} />
                      </div>
                      <div className="md:col-span-2">
                         <CMSField label="Outils & Technologies (Séparés par des virgules)" value={p.tools?.join(', ') || ""} onChange={(v) => { 
                           const c = [...localProjects]; 
                           c[idx].tools = v.split(',').map(t => t.trim()).filter(t => t !== ""); 
                           setLocalProjects(c); 
                         }} />
                      </div>
                      <div className="md:col-span-2">
                         <CMSField label="Image Source (URL ou Upload)" value={p.image} onChange={(v) => { const c = [...localProjects]; c[idx].image = v; setLocalProjects(c); }} />
                      </div>
                      <input id={`project-up-${p.id}`} type="file" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                           const formData = new FormData();
                           formData.append('file', file);
                           const res = await fetch('/api/uploads', { method: 'POST', body: formData });
                           const data = await res.json();
                           if (data.success) {
                             const c = [...localProjects];
                             c[idx].image = data.url;
                             setLocalProjects(c);
                             toast({ title: "Image Projet Uploadée", description: "Le système a synchronisé l'aperçu." });
                           }
                        }
                      }} />
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-6 right-6 text-muted-foreground/20 hover:text-red-500 transition-colors" onClick={() => { const c = [...localProjects]; c.splice(idx, 1); setLocalProjects(c); }}><Trash2 size={24}/></Button>
                  </div>
                ))}
              </div>
              <SaveBar onSave={() => saveContent()} loading={loading} />
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
              <HeaderSection title="Canaux de Communication" subtitle="Maintenance des protocoles de transmission et contacts." />
              <div className="bg-card border border-border p-12 rounded-[3rem] space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <CMSField label="Email Principal" value={contact.email} onChange={(v) => setContact({...contact, email: v})} />
            <CMSField label="Localisation Opérationnelle" value={contact.location} onChange={(v) => setContact({...contact, location: v})} />
            <CMSField label="LinkedIn Signal" value={contact.linkedin} onChange={(v) => setContact({...contact, linkedin: v})} />
            <CMSField label="GitHub Repository" value={contact.github} onChange={(v) => setContact({...contact, github: v})} />
          </div>
                <div className="pt-8 border-t border-border flex items-center justify-between opacity-50 italic">
                  <p className="text-xs">Note: Certains champs de contact sont liés à vos variables d'environnement globales.</p>
                  <Button variant="link" className="text-primary text-[10px] font-black uppercase tracking-widest">Voir Configuration</Button>
                </div>
              </div>
              <SaveBar onSave={() => saveContent()} loading={loading} />
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
              <HeaderSection title="Newsletter Database" subtitle="Liste des entités abonnées au flux d'information Cosmos." />
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
                <div className="relative w-full md:w-[400px]">
                  <Search className="absolute left-6 top-5 text-muted-foreground/60" size={20} />
                  <input placeholder="Rechercher une entité (email)..." className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-card p-10 border border-white/5 outline-none focus:border-primary/50 transition-all font-bold text-sm" value={subscriberSearch} onChange={e => setSubscriberSearch(e.target.value)} />
                </div>
                <Button variant="outline" className="gap-3 rounded-2xl h-14 font-black px-10 border-white/10 hover:bg-white/5" onClick={() => {
                   const blob = new Blob([JSON.stringify(subscribers, null, 2)], { type: 'application/json' });
                   const url = URL.createObjectURL(blob);
                   const a = document.createElement('a'); a.href = url; a.download = 'subscribers_export.json'; a.click();
                }}>
                  <Download size={18}/> Exporter la Base
                </Button>
              </div>
              <div className="bg-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-premium">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                    <tr><th className="px-10 py-6">Entité Email</th><th className="px-10 py-6">Date Inscription</th><th className="px-10 py-6 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-medium">
                    {filteredSubscribers.reverse().map((sub, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-6 font-bold">{sub.email}</td>
                        <td className="px-10 py-6 text-muted-foreground uppercase text-[10px] font-mono tracking-tighter">{new Date(sub.date).toLocaleString('fr-FR')}</td>
                        <td className="px-10 py-6 text-right">
                          <button className="text-red-500/30 hover:text-red-500 hover:scale-125 transition-all outline-none"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredSubscribers.length === 0 && (
                   <div className="p-20 text-center text-muted-foreground italic uppercase tracking-widest text-[10px]">Aucune donnée disponible dans le pool.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'emailing' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
              <HeaderSection title="Campagnes Emailing Elite" subtitle="Émission groupée ou individuelle via protocole SMTP sécurisé." />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="bg-card border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-premium">
                     <CMSField label="Objet de la Transmission" value={emailSubject} onChange={setEmailSubject} />
                     <CMSField label="Corps du Message (HTML Supporté)" isTextArea value={emailBody} onChange={setEmailBody} />
                     <div className="flex gap-4">
                        <Button className="flex-1 h-16 rounded-[2rem] font-black uppercase tracking-widest gap-3 shadow-glow" onClick={sendBroadcastEmail} disabled={loading || !emailSubject}>
                           <Send size={20}/> Diffuser au Pool Global ({subscribers.length})
                        </Button>
                        <Button variant="outline" className="h-16 rounded-[2rem] font-bold px-8 border-white/10" title="Aperçu">
                           <MailOpen size={20}/>
                        </Button>
                     </div>
                  </div>
                </div>
                <div className="lg:col-span-4 space-y-6">
                   <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 h-full">
                      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 block mb-6">Informations Protocolaires</Label>
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
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
              <HeaderSection title="Paramètres Système" subtitle="Backups, protocoles de sécurité et maintenance de la base." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="bg-card border border-white/5 p-10 rounded-[2.5rem] shadow-premium group">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
                       <ShieldCheck className="text-primary" size={24}/> Sécurité & Accès
                    </h3>
                    <div className="space-y-6">
                       <Button variant="outline" className="w-full h-14 rounded-2xl font-bold gap-3 border-white/10 hover:border-primary/40 transition-all justify-start px-6">
                          <Lock size={18}/> Changer le mot de passe Admin
                       </Button>
                       <Button variant="outline" className="w-full h-14 rounded-2xl font-bold gap-3 border-white/10 hover:border-primary/40 transition-all justify-start px-6">
                          <ShieldCheck size={18}/> Réinitialiser la clé 2FA
                       </Button>
                    </div>
                 </div>

                 <div className="bg-card border border-white/5 p-10 rounded-[2.5rem] shadow-premium group">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
                       <RefreshCw className="text-primary" size={24}/> Maintenance Base de Données
                    </h3>
                    <div className="space-y-6">
                       <Button variant="outline" className="w-full h-14 rounded-2xl font-bold gap-3 border-white/10 hover:border-green-500/40 transition-all justify-start px-6" onClick={() => {
                          const data = { hero, about, bento, skills: localSkills, projects: localProjects, subscribers, stats };
                          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a'); a.href = url; a.download = `backup_cosmos_${new Date().toISOString().split('T')[0]}.json`; a.click();
                          toast({ title: "Backup Créé", description: "Votre base de données locale a été téléchargée." });
                       }}>
                          <Download size={18}/> Sauvegarder la Base (.json)
                       </Button>
                       <Button variant="outline" className="w-full h-14 rounded-2xl font-bold gap-3 border-white/10 hover:border-red-500/40 transition-all justify-start px-6">
                          <RefreshCw size={18}/> Nettoyer le cache & Stats
                       </Button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// 📐 SPECIALIZED HELPER COMPONENTS
function HeaderSection({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-5xl font-black uppercase tracking-tighter mb-3 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
        {title}
      </h2>
      <p className="text-muted-foreground font-medium text-lg tracking-tight">{subtitle}</p>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: any, label: string, value: string, trend?: string }) {
  return (
    <div className="bg-card border border-white/5 p-10 rounded-[3rem] hover:border-primary/50 transition-all duration-700 shadow-premium group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-glow">
           {icon}
        </div>
        {trend && (
          <div className="px-5 py-2 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black tracking-widest animate-pulse border border-green-500/20">{trend}</div>
        )}
      </div>
      <div className="relative z-10">
        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-3 block opacity-60">{label}</span>
        <div className="text-6xl font-black tracking-tighter text-white group-hover:translate-x-1 transition-transform duration-500">{value}</div>
      </div>
    </div>
  );
}

function CMSField({ label, value, onChange, isTextArea = false }: { label: string, value: string, onChange: (v: string) => void, isTextArea?: boolean }) {
  return (
    <div className="space-y-4 group">
      <label className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 group-focus-within:text-primary transition-colors block ml-1">{label}</label>
      {isTextArea ? (
        <textarea 
          className="w-full px-8 py-7 rounded-[2.5rem] bg-black/40 border border-white/5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none text-sm leading-relaxed font-medium text-white/80 placeholder:text-white/10" 
          rows={6}
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={`Input data for ${label.toLowerCase()}...`}
        />
      ) : (
        <input 
          className="w-full px-8 py-6 rounded-[2rem] bg-black/40 border border-white/5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm font-black text-white/90 placeholder:text-white/10" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={`Input data for ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );
}

function SaveBar({ onSave, loading }: { onSave: () => void, loading: boolean }) {
  return (
    <div className="fixed bottom-12 left-[50%] -translate-x-1/2 md:left-auto md:right-16 md:translate-x-0 w-[90%] max-w-xl z-[100] animate-in slide-in-from-bottom-20 duration-1000">
      <div className="bg-[#0a0a0c]/80 backdrop-blur-3xl p-8 border border-white/10 rounded-[3rem] shadow-glow flex flex-col sm:flex-row items-center justify-between gap-8 group">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
             <div className="h-2 w-2 rounded-full bg-primary animate-ping"/>
             <p className="text-white font-black text-sm uppercase tracking-[0.2em]">Flux Prêt pour Synchronisation</p>
          </div>
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-tighter mt-1">Écrase les données de production avec les nouvelles configurations.</p>
        </div>
        <Button className="px-12 h-16 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-glow bg-primary hover:scale-[1.05] active:scale-[0.95] transition-all w-full sm:w-auto" onClick={onSave} disabled={loading}>
          {loading ? <RefreshCw className="animate-spin mr-3"/> : <Save className="mr-3" size={20}/>}
          {loading ? "Sync..." : "Mettre à jour"}
        </Button>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={className}>{children}</span>;
}

function NavBtn({ active, icon, label, onClick, badge }: { active: boolean, icon: any, label: string, onClick: () => void, badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 font-bold text-sm outline-none ${
        active 
          ? 'bg-primary text-white shadow-glow translate-x-2' 
          : 'text-muted-foreground hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className={`${active ? 'scale-125' : 'opacity-40'} transition-all duration-500`}>{icon}</div>
      <span className={`tracking-tight ${active ? 'font-black' : ''}`}>{label}</span>
      {badge && badge > 0 ? (
        <div className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-[10px] font-black flex items-center justify-center text-white shadow-lg border border-white/20">
          {badge}
        </div>
      ) : (
        active && <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_15px_white]" />
      )}
    </button>
  );
}

function MessagesView({ messages, onDelete }: { messages: any[], onDelete: (id: number) => void }) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
             <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">Intelligence Client</h2>
             <p className="text-muted-foreground font-medium">Flux de propositions stratégiques et signaux de collaboration.</p>
          </div>
       </div>
       <div className="space-y-8">
         {messages.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <MailOpen size={64} className="text-white/5 mb-6" />
              <p className="text-white/20 font-black uppercase tracking-widest text-sm">Signal Vide // Aucune Proposition</p>
           </div>
         ) : (
           [...messages].reverse().map((m) => (
             <div key={m.id} className="bg-card/30 border border-white/5 p-12 rounded-[3.5rem] group hover:border-primary/30 transition-all duration-700 shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] pointer-events-none"/>
                <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
                   <div className="space-y-8 flex-1">
                      <div className="flex flex-wrap items-center gap-4">
                         <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">{m.projectType}</div>
                         <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{m.budget}</div>
                         <div className="text-[10px] font-mono text-muted-foreground/40 tracking-widest ml-auto bg-black/40 px-4 py-2 rounded-full uppercase italic">Received: {new Date(m.date).toLocaleDateString()}</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-3xl font-black text-white flex items-center gap-4">
                          {m.name} 
                          {m.company && <span className="text-primary/60 font-medium text-lg tracking-tight bg-primary/5 px-4 py-1 rounded-xl">@{m.company}</span>}
                        </h4>
                        <div className="text-primary font-mono text-sm underline underline-offset-8 decoration-primary/20 hover:decoration-primary transition-all cursor-pointer inline-block">{m.email}</div>
                      </div>
                      <div className="relative">
                         <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-primary/10 to-transparent"/>
                         <p className="text-xl text-muted-foreground leading-relaxed italic font-medium pl-4">"{m.message}"</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-10">
                         <div className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]"><Clock size={14}/> Échéancier: <span className="text-white/60">{m.timeline}</span></div>
                         <div className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]"><Activity size={14}/> Statut: <span className="text-emerald-500 animate-pulse">Liaison Active</span></div>
                      </div>
                   </div>
                   <div className="flex lg:flex-col gap-4 justify-end">
                      <Button variant="outline" className="rounded-3xl border-white/10 bg-white/5 hover:border-red-500/50 hover:text-red-500 h-20 w-20 p-0 shadow-premium group/del transition-all" onClick={() => onDelete(m.id)}>
                         <Trash2 size={24} className="group-hover/del:scale-110 transition-transform"/>
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