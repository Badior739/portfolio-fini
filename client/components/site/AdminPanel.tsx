'use client';

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Globe, User, Zap, Briefcase, Mail, 
  MessageSquare, Users, Send, Settings, Lock, Activity, Calendar
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  AboutContent, BentoItem, ContactInfo, HeroContent, 
  Experience, Project, ReceivedMessage, SiteData, SiteSettings, Skill, StatsEntry, Subscriber, Testimonial, Appointment 
} from '@shared/api';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from "@/config";

// Modular Components
import { AdminTab, NavBtn, Label } from '../admin/AdminShared';
import { AdminAuth } from '../admin/AdminAuth';
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminHome } from '../admin/AdminHome';
import { AdminAbout } from '../admin/AdminAbout';
import { AdminSkills } from '../admin/AdminSkills';
import { AdminProjects } from '../admin/AdminProjects';
import { AdminContact } from '../admin/AdminContact';
import { AdminInbox } from '../admin/AdminInbox';
import { AdminAppointments } from '../admin/AdminAppointments';
import { AdminNewsletter } from '../admin/AdminNewsletter';
import { AdminSettings } from '../admin/AdminSettings';
import { AdminCredibility } from '../admin/AdminCredibility';
import { Award } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [authenticated, setAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [stats, setStats] = useState({ visits: 0, messages: 0 });
  const [localSkills, setLocalSkills] = useState<Skill[]>([]);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [statsHistory, setStatsHistory] = useState<StatsEntry[]>([]);

  // CMS State
  const [hero, setHero] = useState<HeroContent>({
    badge: "", title: "", subtitle: "", description: "", primaryCTA: "", secondaryCTA: ""
  });
  const [about, setAbout] = useState<AboutContent>({
    titleMain: "", titleSub: "", quote: "", description: "", profileImage: ""
  });
  const [bento, setBento] = useState<BentoItem[]>([]);
  const [contact, setContact] = useState<ContactInfo>({
    email: "ouattarabadiori20@gmail.com",
    location: "France",
    linkedin: "linkedin.com/in/badior-o",
    github: "github.com/badior-o"
  });
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<ReceivedMessage[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: "Architecte Digital",
    siteDescription: "Portfolio d'exception",
    siteKeywords: "web design, development, react",
    enable2FA: true
  });

  // Helper for dirty state
  const wrapSet = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: React.SetStateAction<T>) => {
    setter(value);
    setIsDirty(true);
  };

  const setHeroDirty = wrapSet(setHero);
  const setAboutDirty = wrapSet(setAbout);
  const setBentoDirty = wrapSet(setBento);
  const setSkillsDirty = wrapSet(setLocalSkills);
  const setProjectsDirty = wrapSet(setLocalProjects);
  const setContactDirty = wrapSet(setContact);
  const setTestimonialsDirty = wrapSet(setTestimonials);
  const setExperiencesDirty = wrapSet(setExperiences);
  const setSettingsDirty = wrapSet(setSettings);

  useEffect(() => {
    if (authenticated) {
      loadStats();
      loadContent();
      loadSubscribers();
    }
  }, [authenticated]);

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = (await res.json()) as Partial<SiteData>;
      setStats({ visits: data.visits || 0, messages: data.messages || 0 });
      setStatsHistory(data.statsHistory || []);
    } catch (e) { console.error(e); }
  };

  const loadContent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/content`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = (await res.json()) as Partial<SiteData>;
      setLocalSkills(data.skills || []);
      setLocalProjects(data.projects || []);
      
      if (data.hero) setHero(data.hero);
      if (data.about) setAbout(data.about);
      if (data.bento) setBento(data.bento);
      if (data.contact) setContact(data.contact);
      if (data.receivedMessages) setReceivedMessages(data.receivedMessages);
      if (data.appointments) setAppointments(data.appointments);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.experiences) setExperiences(data.experiences);
      if (data.settings) setSettings(data.settings);
      setIsDirty(false);
    } catch (e) { console.error(e); }
  };

  const loadSubscribers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribers`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (e) { console.error(e); }
  };

  const saveContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ 
          skills: localSkills.map((s) => ({ ...s, icon: s.icon || s.name || "Code" })), 
          projects: localProjects,
          hero,
          about,
          bento,
          contact,
          testimonials,
          experiences,
          settings
        }),
      });
      if (res.ok) {
        toast({ title: "Succès", description: "Modifications enregistrées." });
        setIsDirty(false);
        window.dispatchEvent(new CustomEvent('site-data-updated'));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    const updatedMessages = receivedMessages.filter(m => m.id !== id);
    setReceivedMessages(updatedMessages);
    try {
      await fetch(`${API_BASE_URL}/api/admin/content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ receivedMessages: updatedMessages })
      });
      toast({ title: "Message supprimé" });
    } catch(e) {}
  };

  const deleteAppointment = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce rendez-vous ?")) return;
    const updatedAppointments = appointments.filter(a => a.id !== id);
    setAppointments(updatedAppointments);
    try {
      await fetch(`${API_BASE_URL}/api/admin/content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ appointments: updatedAppointments })
      });
      toast({ title: "Rendez-vous supprimé" });
    } catch(e) {}
  };

  const handleReply = async (to: string, subject: string, message: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/reply`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ to, subject, message })
    });
    if (!res.ok) throw new Error('Failed to send reply');
  };

  const deleteSubscriber = async (email: string) => {
    if (!window.confirm(`Voulez-vous vraiment désabonner ${email} ?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter/remove`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSubscribers(subscribers.filter(s => s.email !== email));
        toast({ title: "Abonné supprimé", description: `${email} a été retiré de la liste.` });
      } else {
        const data = await res.json();
        toast({ title: "Erreur", description: data.error || "Échec de la suppression", variant: "destructive" });
      }
    } catch (e) { 
      console.error(e); 
      toast({ title: "Erreur", description: "Problème de connexion au serveur", variant: "destructive" });
    }
    setLoading(false);
  };

  const sendBroadcastEmail = async () => {
    if (!emailSubject || !emailBody) return toast({ title: "Erreur", description: "Champs vides", variant: "destructive" });
    setLoading(true);
    try {
       const res = await fetch(`${API_BASE_URL}/api/admin/broadcast`, {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${adminToken}`
         },
         body: JSON.stringify({ 
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

  const handleBackup = () => {
    const data = { hero, about, bento, skills: localSkills, projects: localProjects, subscribers, stats };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_cosmos_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast({ title: "Backup Créé", description: "Votre base de données locale a été téléchargée." });
  };

  if (!authenticated) {
    return (
      <AdminAuth 
        onSuccess={(token) => {
          setAdminToken(token);
          setAuthenticated(true);
        }} 
        onClose={onClose} 
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/95">
      <div className="w-full max-w-7xl h-[90vh] rounded-[3rem] bg-card/40 backdrop-blur-3xl shadow-premium border border-white/10 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-full md:w-72 border-r border-white/5 p-8 flex flex-col gap-1 overflow-y-auto bg-black/20">
          <div className="mb-10 px-2 text-center md:text-left">
            <h3 className="text-2xl font-black flex items-center gap-3 text-primary uppercase tracking-tighter">
              <Activity className="animate-pulse" size={26}/> {t('adminPanel.cmsElite')}
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono mt-2 opacity-50 uppercase tracking-[0.2em] leading-tight">
              {t('adminPanel.commandPool')}
            </p>
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
              <NavBtn active={activeTab === 'credibility'} icon={<Award size={18}/>} label="Crédibilité & XP" onClick={() => setActiveTab('credibility')} />
              <NavBtn active={activeTab === 'contact'} icon={<Mail size={18}/>} label="Configuration Contact" onClick={() => setActiveTab('contact')} />
              <NavBtn active={activeTab === 'messages'} icon={<MessageSquare size={18}/>} label="Propositions Client" onClick={() => setActiveTab('messages')} badge={receivedMessages.length} />
              <NavBtn active={activeTab === 'appointments'} icon={<Calendar size={18}/>} label="Agenda Stratégique" onClick={() => setActiveTab('appointments')} badge={appointments.length} />
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
            <AdminDashboard 
              stats={stats} 
              subscribersCount={subscribers.length} 
              history={statsHistory} 
              onRefresh={loadStats} 
              loading={loading} 
            />
          )}

          {activeTab === 'home' && (
            <AdminHome 
              hero={hero} 
              setHero={setHeroDirty} 
              onSave={saveContent} 
              loading={loading} 
              isDirty={isDirty} 
            />
          )}

          {activeTab === 'about' && (
            <AdminAbout 
              about={about} 
              setAbout={setAboutDirty} 
              bento={bento} 
              setBento={setBentoDirty} 
              onSave={saveContent} 
              loading={loading} 
              isDirty={isDirty} 
            />
          )}

          {activeTab === 'skills' && (
            <AdminSkills 
              skills={localSkills} 
              setSkills={setSkillsDirty} 
              onSave={saveContent} 
              loading={loading} 
              isDirty={isDirty} 
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjects 
              projects={localProjects} 
              setProjects={setProjectsDirty} 
              onSave={saveContent} 
              loading={loading} 
              isDirty={isDirty} 
            />
          )}

          {activeTab === 'credibility' && (
            <AdminCredibility 
              testimonials={testimonials} 
              setTestimonials={setTestimonialsDirty} 
              experiences={experiences} 
              setExperiences={setExperiencesDirty} 
              onSave={saveContent} 
              loading={loading} 
              isDirty={isDirty} 
            />
          )}

          {activeTab === 'contact' && (
            <AdminContact 
              contact={contact} 
              setContact={setContactDirty} 
              onSave={saveContent} 
              loading={loading} 
              isDirty={isDirty} 
            />
          )}

          {activeTab === 'messages' && (
            <AdminInbox 
              messages={receivedMessages} 
              onDelete={deleteMessage} 
            />
          )}

          {activeTab === 'appointments' && (
            <AdminAppointments
              appointments={appointments}
              onDelete={deleteAppointment}
              onReply={handleReply}
            />
          )}

          {(activeTab === 'newsletter' || activeTab === 'emailing') && (
            <AdminNewsletter 
              subscribers={subscribers} 
              onDelete={deleteSubscriber} 
              emailSubject={emailSubject} 
              setEmailSubject={setEmailSubject} 
              emailBody={emailBody} 
              setEmailBody={setEmailBody} 
              onSendBroadcast={sendBroadcastEmail} 
              loading={loading} 
              activeTab={activeTab} 
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings 
              settings={settings}
              setSettings={setSettingsDirty}
              onBackup={handleBackup} 
              onLogout={() => { setAuthenticated(false); setAdminToken(null); }}
              onSave={saveContent}
              loading={loading}
              isDirty={isDirty}
              token={adminToken || ''}
            />
          )}
        </div>
      </div>
    </div>
  );
}
