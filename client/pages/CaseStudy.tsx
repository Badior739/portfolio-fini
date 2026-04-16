import { useMemo, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { projects as defaultProjects } from "@/data/projects";
import { API_BASE_URL } from "@/config";
import { SystemConsole } from "@/components/site/SystemConsole";
import { MajesticTitle } from "@/components/site/MajesticTitle";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CaseStudy() {
  const q = useQuery();
  const pid = q.get("project") || defaultProjects[0].id;
  const [projectData, setProjectData] = useState(defaultProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/content`);
        const data = await res.json();
        if (data.projects?.length) {
          setProjectData(data.projects);
        }
      } catch (e) {
        console.error('Failed to fetch projects:', e);
      }
    };
    fetchProjects();
  }, []);

  const project = useMemo(() => projectData.find((p) => p.id === pid) || projectData[0], [pid, projectData]);

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <SystemConsole />
        <section className="container relative z-10 py-32">
          <div className="mx-auto max-w-5xl">
            <Link to="/#projects" className="text-xs font-mono text-primary hover:underline uppercase tracking-widest mb-12 block">← {`[SYSTEM_EXIT]`}</Link>
            
            <MajesticTitle title={project.title} subtitle="ÉTUDE DE CAS" />

            <div className="mt-24 grid gap-16 md:grid-cols-2 items-start">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img src={project.image} alt={project.title} className="w-full rounded-3xl object-cover shadow-2xl border border-white/10" loading="lazy" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md">
                  <h3 className="text-xl font-bold mb-4">Architecture & Rôle</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                  <p className="mt-4 text-sm font-semibold text-primary">{project.role}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md">
                  <h4 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-4">Stack technique</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((t) => (
                      <span key={t} className="rounded-full bg-white/5 px-4 py-1 text-xs border border-white/10">{t}</span>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="lg" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                  <a href="/#contact">Démarrer une collaboration</a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
