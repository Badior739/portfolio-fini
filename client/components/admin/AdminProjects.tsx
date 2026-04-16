import React from 'react';
import { Plus, Trash2, Download, Code, FileText, Image as ImageIcon } from 'lucide-react';
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
        role: '',
        content_blocks: []
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

  const addContentBlock = (projectIndex: number, type: 'text' | 'image' | 'code') => {
    const newProjects = [...projects];
    const project = newProjects[projectIndex];
    project.content_blocks = [...(project.content_blocks || []), { type, content: '' }];
    setProjects(newProjects);
  };

  const updateContentBlock = (projectIndex: number, blockIndex: number, content: string) => {
    const newProjects = [...projects];
    newProjects[projectIndex].content_blocks[blockIndex].content = content;
    setProjects(newProjects);
  };

  const removeContentBlock = (projectIndex: number, blockIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].content_blocks.splice(blockIndex, 1);
    setProjects(newProjects);
  };

  const handleFileUpload = async (index: number, file: File, blockIndex?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/uploads`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        if (blockIndex !== undefined) {
           updateContentBlock(index, blockIndex, data.url);
        } else {
           updateProject(index, { image: data.url });
        }
        toast({ title: "Contenu Uploadé", description: "Le système a synchronisé l'élément." });
      }
    } catch (e) {
      toast({ title: "Erreur", description: "Échec de l'upload.", variant: "destructive" });
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
          <AdminCard key={project.id} className="group flex flex-col gap-12 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-12">
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
                <CMSField label="Titre" value={project.title} onChange={(v) => updateProject(idx, { title: v })} />
                <CMSField label="Catégorie" value={project.category} onChange={(v) => updateProject(idx, { category: v })} />
                <CMSField label="Rôle" value={project.role || ""} onChange={(v) => updateProject(idx, { role: v })} />
                <CMSField label="Année" value={project.year?.toString() || ""} onChange={(v) => updateProject(idx, { year: parseInt(v) || 0 })} />
                <div className="md:col-span-2">
                  <CMSField label="Description" isTextArea value={project.description} onChange={(v) => updateProject(idx, { description: v })} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Blocs de contenu enrichi</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => addContentBlock(idx, 'text')}><FileText size={16} className="mr-2"/>Texte</Button>
                  <Button size="sm" variant="outline" onClick={() => addContentBlock(idx, 'image')}><ImageIcon size={16} className="mr-2"/>Image</Button>
                  <Button size="sm" variant="outline" onClick={() => addContentBlock(idx, 'code')}><Code size={16} className="mr-2"/>Code</Button>
                </div>
              </div>
              
              {project.content_blocks?.map((block, bIdx) => (
                <div key={bIdx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex-1">
                    {block.type === 'image' ? (
                       <input className="w-full p-2 bg-transparent border-b" value={block.content} onChange={(e) => updateContentBlock(idx, bIdx, e.target.value)} />
                    ) : (
                       <textarea className="w-full p-2 bg-transparent border-b" rows={3} value={block.content} onChange={(e) => updateContentBlock(idx, bIdx, e.target.value)} />
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeContentBlock(idx, bIdx)}><Trash2 size={16} className="text-red-500"/></Button>
                </div>
              ))}
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
