import { useMemo, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { projects as defaultProjects } from "@/data/projects";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CaseStudy() {
  const q = useQuery();
  const pid = q.get("project") || defaultProjects[0].id;
  const [projectData, setProjectData] = useState(defaultProjects);

  // Fetch updated project data from server and listen for image updates
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/admin/content');
        const data = await res.json();
        if (data.projects?.length) {
          setProjectData(data.projects);
        }
      } catch (e) {
        console.error('Failed to fetch projects:', e);
      }
    };

    fetchProjects();

    // Listen for project image updates from admin panel
    const handleImageUpdate = (event: any) => {
      const { projectId, newImage } = event.detail;
      setProjectData((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, image: newImage } : p
        )
      );
    };

    window.addEventListener('project-image-updated', handleImageUpdate);
    window.addEventListener('site-data-updated', fetchProjects);

    return () => {
      window.removeEventListener('project-image-updated', handleImageUpdate);
      window.removeEventListener('site-data-updated', fetchProjects);
    };
  }, []);

  const project = useMemo(() => projectData.find((p) => p.id === pid) || projectData[0], [pid, projectData]);

  return (
    <Layout>
      <section className="container py-20">
        <div className="mx-auto max-w-4xl">
          <Link to="/#projects" className="text-sm text-muted-foreground hover:underline">← Retour aux projets</Link>

          <h1 className="mt-4 text-4xl font-extrabold">{project.title}</h1>
          <p className="mt-2 text-muted-foreground">{project.description}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <img src={project.image} alt={project.title} className="w-full rounded-2xl object-cover shadow-sm" loading="lazy" />
            </div>
            <div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold">Mon rôle</h3>
                <p className="mt-2 text-muted-foreground">{project.role}</p>

                <h4 className="mt-4 text-sm font-medium">Outils & technologies</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tools.map((t) => (
                    <span key={t} className="rounded-md bg-background/50 px-3 py-1 text-xs">{t}</span>
                  ))}
                </div>

                <div className="mt-6">
                  <Button asChild>
                    <a href="/#contact">Me contacter pour ce projet</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold">Contexte et résultats</h3>
            <p className="mt-2 text-muted-foreground">Description détaillée, défis techniques, architecture mise en place, et chiffres clés.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
