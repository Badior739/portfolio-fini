import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { ProjectTabs } from "@/components/site/ProjectTabs";
import { ProjectCard3D } from "@/components/site/ProjectCard3D";
import { SkillCard } from "@/components/site/SkillsCard";
import { HeroArchitectural } from "@/components/site/HeroArchitectural";
import { AboutArchitectural } from "@/components/site/AboutArchitectural";
import { ContactForm } from "@/components/site/ContactForm";
import { AppointmentScheduler } from "@/components/site/AppointmentScheduler";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp, Filter, Briefcase, GraduationCap, Mail, MapPin, ArrowRight, Github, Linkedin, Terminal, Code, Cpu, Globe, ExternalLink, Zap, Box, Layers, ArrowUpRight, Clock, Video } from "lucide-react";
import { Project, SiteData, Skill } from "@shared/api";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL } from "@/config";

function Typewriter({ phrases, speed = 60 }: { phrases: string[]; speed?: number }) {
  const [current, setCurrent] = useState(0);
  const [display, setDisplay] = useState("");
  const [typing, setTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      if (charIndex < phrases[current].length) {
        timeout = setTimeout(() => {
          setDisplay((d) => d + phrases[current][charIndex]);
          setCharIndex((i) => i + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => setTyping(false), 1200);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplay((d) => d.slice(0, -1));
          setCharIndex((i) => i - 1);
        }, 30);
      } else {
        setTyping(true);
        setCurrent((c) => (c + 1) % phrases.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, typing, current, phrases, speed]);

  return (
    <div className="mt-6 h-12">
      <span className="text-xl sm:text-2xl md:text-2xl inline-block text-muted-foreground">{display}</span>
      <span className="inline-block ml-1 animate-blink">|</span>
    </div>
  );
}

export default function Index() {
  const { t, language } = useLanguage();
  const [renderSkills, setRenderSkills] = useState<Skill[]>([]);
  const [renderProjects, setRenderProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeRndCard, setActiveRndCard] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRndCard(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const [siteData, setSiteData] = useState<SiteData>({
    visits: 0,
    messages: 0,
    skills: [],
    projects: [],
    subscribers: [],
    hero: { badge: "", title: "", subtitle: "", description: "", primaryCTA: "", secondaryCTA: "" },
    about: { titleMain: "", titleSub: "", quote: "", description: "", profileImage: "" },
    bento: [],
    contact: { email: "", location: "", linkedin: "", github: "" },
    receivedMessages: [],
    testimonials: [],
    experiences: [],
    settings: {
      siteTitle: "Architecte Digital",
      siteDescription: "Portfolio d'exception",
      siteKeywords: "",
      enable2FA: true
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0);
      setShowBackToTop(totalScroll > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/visit`, { method: 'POST' }).catch(() => {});

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = (await res.json()) as Partial<SiteData>;
        // Use updated skills from data/skills.ts if available, or fallback to API
        setRenderSkills(skills.length > 0 ? skills : (data.skills || []));
        setRenderProjects(data.projects || []);
        
        setSiteData((prev) => ({
          ...prev,
          hero: data.hero || prev.hero,
          about: data.about || prev.about,
          bento: data.bento || prev.bento,
          contact: data.contact || prev.contact,
          skills: data.skills || prev.skills,
          projects: data.projects || prev.projects,
          testimonials: data.testimonials || prev.testimonials,
          experiences: data.experiences || prev.experiences,
          settings: data.settings || prev.settings,
        }));
      } catch (e) {
        setRenderSkills(skills);
        setRenderProjects(projects);
      } finally {
        setTimeout(() => setLoading(false), 1500); // 1.5s for a majestic entry reveal
      }
    };
    fetchData();

    const onUpdate = () => fetchData();
    window.addEventListener('site-data-updated', onUpdate as EventListener);
    return () => window.removeEventListener('site-data-updated', onUpdate as EventListener);
  }, []);

  useEffect(() => {
    if (siteData.settings) {
      document.title = siteData.settings.siteTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", siteData.settings.siteDescription);
      const metaKeys = document.querySelector('meta[name="keywords"]');
      if (metaKeys) metaKeys.setAttribute("content", siteData.settings.siteKeywords);
    }
  }, [siteData.settings]);

  const displayedSkills = useMemo(() => {
    const list = t('skills.list');
    return (Array.isArray(list) && list.length > 0) ? (list as Skill[]) : renderSkills;
  }, [t, renderSkills]);

  const displayedProjects = useMemo(() => {
    const list = t('projects.list');
    return (Array.isArray(list) && list.length > 0) ? (list as Project[]) : renderProjects;
  }, [t, renderProjects]);

  const categories = useMemo(() => {
    const cats = new Set(displayedProjects.map(p => p.category || "Web"));
    return ["Tous", ...Array.from(cats)];
  }, [displayedProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "Tous") return displayedProjects;
    return displayedProjects.filter(p => (p.category || "Web") === activeCategory);
  }, [displayedProjects, activeCategory]);

  const experiences = useMemo(() => {
    if (siteData.experiences && siteData.experiences.length > 0) {
      return siteData.experiences.map(e => ({
        ...e,
        icon: e.icon?.includes('Graduation') ? <GraduationCap size={18}/> : <Briefcase size={18}/>
      }));
    }
    // Fallback data with translation
    const items = (t('experience.items') as any[]) || [];
    if (items.length > 0) {
      return items.map((item, index) => ({
        id: `exp-${index + 1}`,
        year: item.year,
        role: item.role,
        company: item.company,
        description: item.desc,
        icon: <Briefcase size={18}/>
      }));
    }
    
    // Default hardcoded fallback if translation fails (should not happen)
    return [
      { 
        id: "exp-1", 
        year: "2022 - Présent", 
        role: "Architecte Logiciel Senior", 
        company: "Freelance / Consultant", 
        description: "Expertise approfondie en architecture microservices et déploiement cloud natif.", 
        icon: <Briefcase size={18}/> 
      },
      { 
        id: "exp-2", 
        year: "2019 - 2022", 
        role: "Lead Developer Full-Stack", 
        company: "Digital Agency", 
        description: "Direction technique de projets d'envergure pour des clients internationaux.", 
        icon: <Briefcase size={18}/> 
      },
      { 
        id: "exp-3", 
        year: "2017 - 2019", 
        role: "UI/UX Designer & Dev", 
        company: "Startup Studio", 
        description: "Conception d'interfaces innovantes et développement front-end haute performance.", 
        icon: <Briefcase size={18}/> 
      },
    ];
  }, [siteData.experiences, t]);



  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const handlePasswordChange = async () => {
    if (passwords.next !== passwords.confirm) {
      return toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
    }
    try {
      const res = await fetch('/api/admin/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: passwords.current, next: passwords.next })
      });
      if (res.ok) {
        toast({ title: "Succès", description: "Mot de passe mis à jour." });
        setPasswords({ current: '', next: '', confirm: '' });
      } else {
        const data = await res.json();
        toast({ title: "Erreur", description: data.error || "Échec du changement.", variant: "destructive" });
      }
    } catch (e) { console.error(e); }
  };

  const handleResetMetrics = async () => {
    if (!window.confirm("Réinitialiser les statistiques ? Cette action est irréversible.")) return;
    try {
      const res = await fetch('/api/admin/reset-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwords.current })
      });
      if (res.ok) {
        toast({ title: "Succès", description: "Métriques réinitialisées." });
      } else {
        toast({ title: "Erreur", description: "Échec de la réinitialisation.", variant: "destructive" });
      }
    } catch (e) { console.error(e); }
  };

  return (
    <Layout>
      <div className="grain" />
      <div className="fixed top-0 left-0 h-1 bg-primary z-[60] transition-all duration-200" style={{ width: `${scrollProgress}%` }} />

      <div className="relative z-10">
        {/* HERO - EXTRAORDINAIRE */}
        <HeroArchitectural data={language === 'fr' ? siteData.hero : undefined} />

        {/* ABOUT - ARCHITECTURAL OVERHAUL */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-20 relative z-20">
          <AboutArchitectural data={siteData.about} bento={language === 'fr' ? siteData.bento : undefined} />
        </div>

        {/* SKILLS - 3D CLOUD REPLACEMENT */}
        <section id="skills" className="py-20 md:py-32 relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-24">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-6"
               >
                 {t('skills.badge')}
               </motion.div>
               <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
                 {t('skills.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary italic">{t('skills.subtitle')}</span>
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {displayedSkills.map((skill, index) => (
                <div key={skill.name} className="h-[400px]">
                  <SkillCard skill={skill} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* EXPERIENCE - PROFESSIONAL TIMELINE */}
      <section id="experience" className="py-20 md:py-32 border-t border-white/5 bg-secondary/5 relative overflow-hidden">
        {/* Artistic background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-24 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-6">
                {t('experience.badge')}
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase leading-[0.9] text-white">
                {t('experience.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary italic">{t('experience.subtitle')}</span>
              </h2>
              <p className="text-muted-foreground/80 text-sm md:text-xl leading-relaxed max-w-xl font-medium border-l-2 border-primary/20 pl-6">
                {t('experience.description')}
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 px-6 py-4 rounded-[2rem] border-premium backdrop-blur-3xl self-start lg:self-auto group hover-confidence"
            >
               <div className="relative">
                 <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                 <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-75" />
               </div>
               <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/80">{t('experience.status')}</span>
            </motion.div>
          </div>

          <div className="space-y-6 md:space-y-10">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id || idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="group relative p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border-premium hover-confidence overflow-hidden"
              >
                {/* Luminous Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="absolute top-0 right-0 p-8 md:p-14 opacity-[0.03] group-hover:opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-1000 text-primary pointer-events-none">
                  {exp.icon}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center relative z-10">
                  <div className="lg:col-span-2">
                    <div className="text-3xl md:text-5xl font-black text-white/10 group-hover:text-primary transition-colors duration-700 font-mono tracking-tighter uppercase">
                      {exp.year}
                    </div>
                  </div>
                  <div className="lg:col-span-6">
                    <h4 className="text-3xl md:text-5xl font-black text-white mb-4 group-hover:translate-x-4 transition-transform duration-700 tracking-tighter uppercase leading-none">{exp.role}</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[2px] bg-primary shadow-glow" />
                      <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">{exp.company}</p>
                    </div>
                  </div>
                  <div className="lg:col-span-4">
                    <p className="text-sm md:text-lg text-white/50 leading-relaxed font-medium group-hover:text-white/80 transition-colors border-l border-white/10 pl-8 md:pl-12">
                      {exp.description || "Ingénierie de solutions critiques et pilotage de projets à haute intensité technologique."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/10">
        {/* Futuristic Grid Background - More subtle on mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] md:bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-12 md:mb-24 gap-8">
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
             >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                  {t('projects.badge')}
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none">
                  {t('projects.title')} <span className="text-primary italic">{t('projects.subtitle')}</span>
                </h2>
                <p className="text-sm md:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                  {t('projects.description')}
                </p>
             </motion.div>
             <ProjectTabs 
               categories={categories} 
               activeCategory={activeCategory} 
               onChange={setActiveCategory} 
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 perspective-2000 relative">
            {/* Focus Mode Backdrop - dims the background when a project is hovered */}
            <div 
              className={`absolute inset-0 -m-20 bg-black/60 z-0 transition-opacity duration-500 pointer-events-none ${hoveredProject !== null ? 'opacity-100' : 'opacity-0'}`} 
            />

            {loading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[420px] rounded-[2.5rem]" />) : filteredProjects.map((p, idx) => (
              <div 
                key={p.id} 
                className={`transition-all duration-500 ${hoveredProject !== null && hoveredProject !== idx ? 'opacity-30 blur-sm scale-95 grayscale' : ''} ${hoveredProject === idx ? 'z-10' : 'z-0'}`}
              >
                <ProjectCard3D 
                  project={p} 
                  index={idx}
                  onHoverStart={() => setHoveredProject(idx)}
                  onHoverEnd={() => setHoveredProject(null)}
                  isFocused={hoveredProject === idx}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - SOCIAL PROOF */}
      {siteData.testimonials && siteData.testimonials.length > 0 && (
        <section id="testimonials" className="py-20 md:py-32 border-t border-white/5 bg-background relative overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-24">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 mb-6"
              >
                {t('testimonials.badge')}
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase leading-none"
              >
                {t('testimonials.title')} <span className="text-primary italic">{t('testimonials.subtitle')}</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
              >
                {t('testimonials.description')}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {siteData.testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-secondary/10 border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-700 flex flex-col justify-between group relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="absolute -right-4 -top-4 w-24 md:w-32 h-24 md:h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                  
                  <div className="relative z-10">
                    <div className="mb-8 md:mb-12 text-primary/40 group-hover:text-primary transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 origin-left">
                      <svg width="40" height="40" className="md:w-14 md:h-14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12M10 21L10 18C10 16.8954 9.10457 16 8 16H5C4.44772 16 4 15.5523 4 15V9C4 8.44772 4.44772 8 5 8H9C9.55228 8 10 8.44772 10 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                    <p className="text-base md:text-xl text-foreground/80 leading-relaxed mb-10 md:mb-14 italic group-hover:text-foreground transition-colors font-medium">
                      "{t.content}"
                    </p>
                  </div>
                  <div className="flex items-center gap-5 relative z-10 border-t border-white/5 pt-8">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 text-lg md:text-2xl shadow-glow">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-white group-hover:text-primary transition-colors text-base md:text-xl tracking-tight">{t.name}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">{t.role} @ {t.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MONUMENTAL IMPACT (Replaces Testimonials) */}
      <section className="py-24 md:py-40 relative overflow-hidden border-t border-border/5 bg-background/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
              Impact <span className="text-primary italic">Monumental</span>.
            </h2>
          </div>

          {/* R&D Laboratory Preview - EXPERIMENTAL */}
          <div className="mt-32 relative">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
               <div>
                 <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
                   {t('impact.labTitle')}
                 </h3>
                 <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                   {t('impact.labDesc')}
                 </p>
               </div>
               <Button variant="outline" className="hidden md:flex rounded-full border-primary/20 text-primary hover:bg-primary/10">
                 {t('impact.labButton')} <ArrowUpRight className="ml-2 w-4 h-4" />
               </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {(t('impact.rnd') as any[] || []).map((item, i) => {
                 const styles = [
                   { color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
                   { color: "from-emerald-400 to-green-500", shadow: "shadow-emerald-500/20" },
                   { color: "from-purple-500 to-pink-500", shadow: "shadow-purple-500/20" }
                 ][i] || { color: "", shadow: "" };
                 return (
                 <motion.div
                   key={i}
                   whileHover={{ y: -5, scale: 1.02 }}
                   className={`group relative p-8 rounded-[2rem] bg-card/10 border overflow-hidden transition-all duration-700 ${
                     i === activeRndCard 
                       ? `border-white/20 shadow-2xl ${styles.shadow} bg-card/20 scale-[1.02]` 
                       : "border-white/5 hover:bg-card/20"
                   }`}
                 >
                   {/* External Glow Effect when active */}
                   <div className={`absolute -inset-1 bg-gradient-to-r ${styles.color} rounded-[2rem] opacity-0 blur-xl transition-opacity duration-700 ${
                     i === activeRndCard ? "opacity-40" : "group-hover:opacity-20"
                   }`} />
                   
                   {/* Internal Glow */}
                   <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${styles.color} opacity-10 blur-[60px] rounded-full transition-all duration-700 ${
                     i === activeRndCard ? "opacity-40 scale-125 translate-x-10 -translate-y-10" : "group-hover:opacity-20"
                   }`} />
                   
                   <div className="relative z-10">
                     <div className="flex justify-between items-start mb-8">
                       <span className={`px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest border border-white/5 transition-colors duration-500 ${
                         i === activeRndCard ? "text-white border-white/20 bg-white/10" : "text-white/70"
                       }`}>
                         {item.tag}
                       </span>
                       <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
                         i === activeRndCard 
                           ? "bg-white text-black border-white scale-110" 
                           : "border-white/10 group-hover:bg-white group-hover:text-black"
                       }`}>
                         <Zap className="w-5 h-5" />
                       </div>
                     </div>
                     
                     <h4 className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-500 ${
                       i === activeRndCard ? "text-white" : "text-white/90 group-hover:text-white"
                     }`}>
                       {item.title}
                     </h4>
                     <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                       i === activeRndCard ? "text-white/80" : "text-muted-foreground group-hover:text-white/70"
                     }`}>
                       {item.desc}
                     </p>
                   </div>
                 </motion.div>
               );
               })}
             </div>
             
             <div className="mt-8 flex justify-center md:hidden">
                <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/10 w-full sm:w-auto">
                 {t('impact.labButton')} <ArrowUpRight className="ml-2 w-4 h-4" />
               </Button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-24">
            {(t('impact.stats') as any[] || []).map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-card/20 border border-border/50 backdrop-blur-3xl hover:border-primary/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <h4 className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4 md:mb-6">{stat.label}</h4>
                <div className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tighter mb-4 group-hover:scale-105 group-hover:text-primary transition-all duration-500">
                  {stat.value}
                </div>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[250px]">
                  {stat.desc}
                </p>

                <div className="absolute bottom-6 right-6 w-10 h-10 md:w-12 md:h-12 border border-border/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
                </div>
              </motion.div>
            ))}
          </div>

          </div>

          {/* Appointment Scheduling Module */}
          <div className="mt-24 md:mt-32 relative z-10 px-4">
             <div className="text-center mb-12">
               <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-4">
                 <span className="text-primary">{t('appointment.titleHighlight')}</span> {t('appointment.title')}
               </h3>
               <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
                 {t('appointment.description')}
               </p>
             </div>
             
             <AppointmentScheduler />
          </div>

          {/* Epic Call to Action Bridge - CONCRETE REFINEMENT */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 md:mt-40 max-w-6xl mx-auto"
          >
             <div className="relative group rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50 pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="grid lg:grid-cols-2 gap-8 md:gap-0">
                   {/* Left: Vision & Availability */}
                   <div className="p-8 md:p-16 lg:border-r border-white/10 flex flex-col justify-center relative z-10">
                      <div className="flex items-center gap-3 mb-6 md:mb-8">
                         <div className="relative flex h-3 w-3">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                         </div>
                         <span className="text-xs font-bold text-green-400 uppercase tracking-widest">{t('cta.available')}</span>
                      </div>
                      
                      <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6 md:mb-8">
                        {t('cta.vision')} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">{t('cta.elevated')}</span>
                      </h3>
                      
                      <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-md mb-8 md:mb-10">
                        {t('cta.description')}
                      </p>

                      <Button 
                        size="lg" 
                        className="w-full md:w-auto h-14 md:h-16 rounded-full bg-white text-black hover:bg-white/90 font-black text-sm md:text-base uppercase tracking-widest shadow-glow-white transition-all hover:scale-105 active:scale-95"
                        asChild
                      >
                        <a href="#contact" className="flex items-center justify-center gap-3">
                           <span>{t('cta.button')}</span>
                           <ArrowUpRight className="w-5 h-5" />
                        </a>
                      </Button>
                   </div>

                   {/* Right: Metrics & Impact */}
                   <div className="p-8 md:p-16 bg-white/[0.02] flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
                      
                      <div className="space-y-8 relative z-10">
                         {(t('cta.metrics') as any[] || []).map((item, i) => {
                            const icons = [Zap, Box, Layers];
                            const Icon = icons[i] || Zap;
                            return (
                            <div key={i} className="group">
                               <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Icon className="w-4 h-4" />
                                     </div>
                                     <span className="text-xs md:text-sm font-bold text-white/80 uppercase tracking-wider">{item.label}</span>
                                  </div>
                                  <span className="text-xs md:text-sm font-mono text-white/40">{item.val}</span>
                               </div>
                               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ delay: i * 0.2, duration: 1, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-primary to-indigo-500" 
                                  />
                               </div>
                            </div>
                         )})}
                      </div>
                   </div>
                </div>

                {/* Aesthetic Crosshairs */}
                <div className="absolute top-0 left-0 w-12 md:w-20 h-12 md:h-20 border-t border-l border-white/10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-12 md:w-20 h-12 md:h-20 border-b border-r border-white/10 pointer-events-none" />
             </div>
          </motion.div>
      </section>

      {/* CONTACT - ARCHITECTURAL TRANSCRIPTION */}
      <section id="contact" className="py-32 md:py-48 border-t border-white/5 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_hsl(var(--primary)/0.15),transparent_60%)] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            
            {/* Left: Contact Intelligence */}
            <div className="lg:col-span-5 flex flex-col gap-10 md:gap-16">
               <div className="relative">
                  <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-transparent to-transparent opacity-50 hidden md:block" />
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6 uppercase">
                    {t('contactSection.title')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary animate-text-shimmer bg-[length:200%_auto]">{t('contactSection.subtitle')}</span>.
                  </h2>
                  <p className="text-white/50 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                    {t('contactSection.description')}
                  </p>
               </div>

               <div className="grid gap-8">
                  <a 
                    href={`mailto:${siteData.contact.email || "ouattarabadiori20@gmail.com"}`} 
                    className="group flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                  >
                     <div className="h-14 w-14 rounded-2xl bg-black/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-glow">
                        <Mail className="w-6 h-6" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">{t('contactSection.emailLabel')}</span>
                        <span className="text-lg md:text-xl font-black text-white group-hover:text-primary transition-colors break-all">
                           {siteData.contact.email || "ouattarabadiori20@gmail.com"}
                        </span>
                     </div>
                  </a>

                  <div className="group flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                     <div className="h-14 w-14 rounded-2xl bg-black/50 flex items-center justify-center text-indigo-400 shadow-glow">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">{t('contactSection.locationLabel')}</span>
                        <span className="text-lg md:text-xl font-black text-white">
                           {siteData.contact.location || "Bobo-Dioulasso, Burkina Faso"}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <span className="text-xs font-bold text-white/20 uppercase tracking-[0.2em] ml-2">{t('contactSection.scopeTitle')}</span>
                  <div className="flex flex-wrap gap-3">
                     {(t('contactSection.scopeItems') as any[] || []).map((item, i) => (
                       <span key={i} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs md:text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all cursor-default">
                          {item}
                       </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right: The High-End Submission Portal */}
            <div className="lg:col-span-7">
              <div className="p-[1px] rounded-[3.5rem] bg-gradient-to-br from-white/20 via-transparent to-white/5">
                <div className="bg-black/40 backdrop-blur-3xl rounded-[calc(3.5rem-1px)] p-8 md:p-16 border border-white/5">
                  <ContactForm data={siteData.contact} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BACK TO TOP - ARTISTIC */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-[100] w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-glow group hover:scale-110 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            
            {/* Visual indicator of scroll progress on the button border */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="48"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="301.59"
                strokeDashoffset={301.59 - (301.59 * scrollProgress) / 100}
                className="opacity-40"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
}
