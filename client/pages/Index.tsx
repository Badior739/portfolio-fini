import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { ProjectTabs } from "@/components/site/ProjectTabs";
import { ProjectCard3D } from "@/components/site/ProjectCard3D";
import { TechCard } from "@/components/site/TechCard";
import { HeroArchitectural } from "@/components/site/HeroArchitectural";
import { AboutArchitectural } from "@/components/site/AboutArchitectural";
import { ContactForm } from "@/components/site/ContactForm";
import { motion } from "framer-motion";
import { ArrowUp, Filter, Briefcase, GraduationCap, Mail, MapPin } from "lucide-react";

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
  const [renderSkills, setRenderSkills] = useState([]);
  const [renderProjects, setRenderProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const [siteData, setSiteData] = useState<any>({
    hero: { badge: "", title: "", subtitle: "", description: "", primaryCTA: "", secondaryCTA: "" },
    about: { titleMain: "", titleSub: "", quote: "", description: "", profileImage: "" },
    bento: [],
    contact: { email: "", location: "", linkedin: "", github: "" }
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((totalScroll / windowHeight) * 100);
      setShowBackToTop(totalScroll > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/admin/visit', { method: 'POST' }).catch(() => {});

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/content');
        const data = await res.json();
        setRenderSkills(data.skills || []);
        setRenderProjects(data.projects || []);
        
        if (data.hero && data.about) {
          setSiteData({
            hero: data.hero,
            about: data.about,
            bento: data.bento || [],
            contact: data.contact || { email: "ouattarabadiori20@gmail.com", location: "France", linkedin: "", github: "" }
          });
        }
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

  const categories = useMemo(() => {
    const cats = new Set(renderProjects.map(p => p.category || "Web"));
    return ["Tous", ...Array.from(cats)];
  }, [renderProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "Tous") return renderProjects;
    return renderProjects.filter(p => (p.category || "Web") === activeCategory);
  }, [renderProjects, activeCategory]);

  const experiences = [
    { year: "2022 - Présent", role: "Architecte Logiciel Senior", company: "Freelance / Consultant", icon: <Briefcase size={18}/> },
    { year: "2019 - 2022", role: "Lead Developer Full-Stack", company: "Digital Agency", icon: <Briefcase size={18}/> },
    { year: "2017 - 2019", role: "UI/UX Designer & Dev", company: "Startup Studio", icon: <Briefcase size={18}/> },
    { year: "2016", role: "Master en Architecture SI", company: "Université Technologique", icon: <GraduationCap size={18}/> }
  ];



  return (
    <Layout>
      <div className="fixed top-0 left-0 h-1 bg-primary z-[60] transition-all duration-200" style={{ width: `${scrollProgress}%` }} />

      {/* HERO - EXTRAORDINAIRE */}
      <HeroArchitectural data={siteData.hero} />

      {/* ABOUT - ARCHITECTURAL OVERHAUL */}
      <AboutArchitectural data={siteData.about} bento={siteData.bento} />

      {/* SKILLS */}
      <section id="skills" className="relative py-32 border-t border-white/5 bg-background overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Expertise <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">&</span> Compétences
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Un arsenal technique complet pour concevoir des expériences numériques sans compromis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-[280px] rounded-3xl bg-secondary/20" />) : renderSkills.map((skill, idx) => (
              <TechCard key={skill.name} skill={skill} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-32 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/10">
        {/* Futuristic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center mb-16 gap-6">
             <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Réalisations <span className="text-primary italic">Signature</span></h2>
             <p className="text-muted-foreground text-lg max-w-2xl">
               Une collection de projets où l'ingénierie rencontre l'art. Explorez mes créations les plus récentes.
             </p>
             <ProjectTabs 
               categories={categories} 
               activeCategory={activeCategory} 
               onChange={setActiveCategory} 
             />
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 perspective-2000">
            {loading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[420px] rounded-3xl" />) : filteredProjects.map((p, idx) => (
              <ProjectCard3D key={p.id} project={p} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* MONUMENTAL IMPACT (Replaces Testimonials) */}
      <section className="py-40 relative overflow-hidden border-t border-border/5 bg-background/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="text-center mb-24 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.6em] text-primary mb-8"
            >
              Performance_Metric_Global
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
              Impact <span className="text-primary italic">Monumental</span>.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { label: "Projets Signés", value: "45+", desc: "Réalisations d'exception livrées." },
              { label: "Taux de Réussite", value: "100%", desc: "Dépassement systématique des attentes." },
              { label: "Maîtrise Tech", value: "15+", desc: "Technologies de pointe opérées." }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group p-12 rounded-[3rem] bg-card/20 border border-border/50 backdrop-blur-3xl hover:border-primary/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em] mb-6">{stat.label}</h4>
                <div className="text-6xl md:text-8xl font-black text-foreground tracking-tighter mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-500">
                  {stat.value}
                </div>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[200px]">
                  {stat.desc}
                </p>

                <div className="absolute bottom-6 right-6 w-12 h-12 border border-border/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Epic Call to Action Bridge - CONCRETE REFINEMENT */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-40 max-w-6xl mx-auto"
          >
             <div className="relative group rounded-[4rem] border border-border/50 bg-card/50 backdrop-blur-3xl overflow-hidden shadow-premium">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
                
                <div className="grid lg:grid-cols-2">
                   {/* Left: Mission Statement */}
                   <div className="p-12 md:p-20 border-b lg:border-b-0 lg:border-r border-border/50">
                      <div className="flex items-center gap-4 mb-10">
                         <div className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                         </div>
                         <span className="text-[10px] font-mono text-primary uppercase tracking-[0.5em]">Status_Available_For_Mission</span>
                      </div>
                      
                      <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.9] mb-10 text-balance">
                        Prêt à élever votre <span className="text-primary italic">Structure</span> logicielle ?
                      </h3>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                        Transformons vos concepts abstraits en architectures concrètes, performantes et scalables.
                      </p>
                   </div>

                   {/* Right: Technical Requirements & Action */}
                   <div className="p-12 md:p-20 bg-white/[0.01] flex flex-col justify-center">
                      <div className="space-y-8 mb-16">
                         {[
                            { label: "Performance", val: "Temps de réponse < 100ms" },
                            { label: "Architecture", val: "Composants scalables et modulaires" },
                            { label: "Design UX", val: "Interface immersive et fluide" }
                         ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                               <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{item.label}</span>
                                  <div className="h-[1px] flex-1 mx-4 bg-white/5" />
                                  <span className="text-[10px] font-bold text-white/60">{item.val}</span>
                               </div>
                               <div className="h-[1px] w-full bg-white/5 overflow-hidden">
                                  <div className="h-full bg-primary w-full animate-scan-slow origin-left" style={{ animationDelay: `${i * 0.2}s` }} />
                               </div>
                            </div>
                         ))}
                      </div>

                      <Button 
                        size="lg" 
                        className="group h-24 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl uppercase tracking-[0.2em] shadow-glow transition-all active:scale-95"
                        asChild
                      >
                        <a href="#contact" className="flex items-center gap-6">
                           <span>Initialiser le Briefing</span>
                           <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                              <ArrowUp className="rotate-90 h-5 w-5" />
                           </div>
                        </a>
                      </Button>
                   </div>
                </div>

                {/* Aesthetic Crosshairs */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-white/10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-white/10 pointer-events-none" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT - ARCHITECTURAL TRANSCRIPTION */}
      <section id="contact" className="py-40 border-t border-white/5 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_hsl(var(--primary)/0.10),transparent_50%)] pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            
            {/* Left: Architectural Transcription Metadata */}
            <div className="lg:col-span-5 flex flex-col gap-10">
               <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-6"
                  >
                    Signal_Channel_01
                  </motion.div>
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
                    Parlons de votre <span className="text-primary italic">Vision</span>.
                  </h2>
                  <p className="text-white/40 text-xl font-light leading-relaxed">
                    Transcription immédiate des besoins architecturaux en solutions numériques monumentales. 
                  </p>
               </div>

               <div className="space-y-8 border-l border-white/10 pl-8">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Direct_Communication</span>
                     <a href={`mailto:${siteData.contact.email || "ouattarabadiori20@gmail.com"}`} className="text-2xl font-bold text-white hover:text-primary transition-colors flex items-center gap-3 group">
                        {siteData.contact.email || "ouattarabadiori20@gmail.com"}
                        <Mail size={20} className="text-primary/40 group-hover:text-primary transition-colors" />
                     </a>
                  </div>

                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Spatial_Coordinates</span>
                     <span className="text-2xl font-bold text-white flex items-center gap-3">
                        {siteData.contact.location || "Paris // Remote Global"}
                        <MapPin size={20} className="text-primary/40" />
                     </span>
                  </div>
               </div>

               <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
                  <div className="text-[8px] font-mono text-white/10 uppercase tracking-[0.5em] mb-4">Transmission_Protocols</div>
                  <ul className="space-y-3">
                     {["Audit Structurel & Design", "Développement Full-Stack", "Déploiement Scalable"].map((item) => (
                       <li key={item} className="flex items-center gap-3 text-sm font-medium text-white/60">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {item}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Right: The High-End Submission Portal */}
            <div className="lg:col-span-7">
               <div className="relative p-1 rounded-[3rem] bg-gradient-to-br from-white/10 via-transparent to-primary/20 shadow-2xl">
                  <div className="absolute inset-[-20%] bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
                  <div className="bg-[#050508] p-8 md:p-12 rounded-[calc(3rem-4px)] relative overflow-hidden">
                     {/* Architectural Crosshairs */}
                     <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-white/10" />
                     <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-white/10" />
                     <div className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-white/10" />
                     <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-white/10" />
                     
                     <ContactForm />
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-8 right-8 h-12 w-12 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center transition-all duration-300 z-[70] hover:scale-110 hover:shadow-glow ${showBackToTop ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
        <ArrowUp size={24} />
      </button>
    </Layout>
  );
}