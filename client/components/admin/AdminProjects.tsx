import React from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@shared/api';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from "@/config";
import { AdminHeader, AdminCard, CMSField, SaveBar } from './AdminShared';

interface AdminProjectsProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  onSave: () => void;
  loading: boolean;
  isDirty: boolean;
}

export function AdminProjects({ projects, setProjects, onSave, loading, isDirty }: AdminProjectsProps) {
  const addProject = () => {
    setProjects([
      {
        id: Date.now().toString(),
        title: 'Nouveau Projet',
        category: 'Web Architecture',
        description: '',
        tools: [],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        year: new Date().getFullYear(),
        role: ''
      },
      ...projects
    ]);
  };

  const removeProject = (index: number) => {
    if (!window.confirm(`Supprimer le projet "${projects[index].title}" ?`)) return;
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };

  const updateProject = (index: number, updates: Partial<Project>) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], ...updates };
    setProjects(newProjects);
  };

  const handleFileUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/uploads`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        updateProject(index, { image: data.url });
        toast({ title: "Image Projet Uploadée", description: "Le système a synchronisé l'aperçu." });
      }
    } catch (e) {
      toast({ title: "Erreur", description: "Échec de l'upload de l'image.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Portfolio Projets" 
        subtitle="Curateur de vos réalisations monumentales." 
      />

      <div className="flex justify-between items-center mb-8">
        <Button onClick={addProject} className="gap-3 rounded-2xl h-14 font-black px-10 shadow-glow">
          <Plus size={20} /> Déployer un Projet
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {(projects || []).map((project, idx) => (
          <AdminCard key={project.id} className="group flex flex-col lg:flex-row gap-12 relative overflow-hidden">
            <div className="w-full lg:w-72 h-48 rounded-[2rem] overflow-hidden border border-white/10 shadow-glow flex-shrink-0 relative group/img">
              <img 
                src={project.image} 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
                alt={project.title} 
              />
              <div 
                className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm" 
                onClick={() => document.getElementById(`project-up-${project.id}`)?.click()}
              >
                <Download size={24} className="text-white" />
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <CMSField 
                label="Identifiant Projet (Titre)" 
                value={project.title} 
                onChange={(v) => updateProject(idx, { title: v })} 
              />
              <CMSField 
                label="Catégorie Système" 
                value={project.category} 
                onChange={(v) => updateProject(idx, { category: v })} 
              />
              <CMSField 
                label="Rôle / Position" 
                value={project.role || ""} 
                onChange={(v) => updateProject(idx, { role: v })} 
              />
              <CMSField 
                label="Année de Livraison" 
                value={project.year?.toString() || ""} 
                onChange={(v) => updateProject(idx, { year: parseInt(v) || 0 })} 
              />
              <div className="md:col-span-2">
                <CMSField 
                  label="Narration Techniques (Description)" 
                  isTextArea 
                  value={project.description} 
                  onChange={(v) => updateProject(idx, { description: v })} 
                />
              </div>
              <div className="md:col-span-2">
                <CMSField 
                  label="Outils & Technologies (Séparés par des virgules)" 
                  value={project.tools?.join(', ') || ""} 
                  onChange={(v) => updateProject(idx, { tools: v.split(',').map(t => t.trim()).filter(t => t !== "") })} 
                />
              </div>
              <div className="md:col-span-2">
                <CMSField 
                  label="Image Source (URL ou Upload)" 
                  value={project.image} 
                  onChange={(v) => updateProject(idx, { image: v })} 
                />
              </div>
              <input 
                id={`project-up-${project.id}`} 
                type="file" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(idx, file);
                }} 
              />
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-6 right-6 text-muted-foreground/20 hover:text-red-500 transition-colors" 
              onClick={() => removeProject(idx)}
            >
              <Trash2 size={24} />
            </Button>
          </AdminCard>
        ))}
      </div>

      <SaveBar onSave={onSave} loading={loading} isDirty={isDirty} />
    </div>
  );
}
