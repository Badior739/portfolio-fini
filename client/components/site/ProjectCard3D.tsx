import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import React, { useRef } from "react";

interface ProjectCardProps {
  project: any;
  index: number;
}

export function ProjectCard3D({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-[480px] w-full rounded-[2.5rem] p-[1px] group perspective-2000 overflow-hidden"
    >
      {/* 2. Luminous Border Tracer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out z-0" />
      
      <div className="relative h-full w-full rounded-[calc(2.5rem-1px)] bg-card border border-border/50 overflow-hidden z-10 transition-colors duration-500 group-hover:border-primary/20 shadow-premium">
        
        {/* Background Image with Blur Effect */}
        <div className="absolute inset-0 transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-md group-hover:opacity-40">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/5 to-foreground/40" />
        </div>

        {/* 1. Initial State: Title Only (Bottom) */}
        <div className="absolute inset-0 p-10 flex flex-col justify-end transition-all duration-500 group-hover:translate-y-[-20%] group-hover:opacity-0">
          <Badge className="w-fit bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 backdrop-blur-md mb-4 uppercase tracking-[0.2em] font-black text-[9px]">
            {project.category || "Architecture"}
          </Badge>
          <h3 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-2">
            {project.title}
          </h3>
          <div className="h-1 w-12 bg-primary rounded-full" />
        </div>

        {/* 2. Hover State: Full Reveal */}
        <div className="absolute inset-0 p-10 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-10 group-hover:translate-y-0">
          <div className="mb-8">
            <h3 className="text-4xl font-black text-foreground tracking-tighter mb-4 leading-none">
              {project.title}
            </h3>
            <div className="h-[2px] w-full bg-gradient-to-r from-primary to-transparent" />
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed font-medium mb-8 line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {project.tools?.map((t: string) => (
              <span key={t} className="px-3 py-1.5 rounded-lg bg-secondary border border-border/50 text-[10px] uppercase font-bold text-muted-foreground tracking-widest backdrop-blur-md hover:border-primary/50 hover:text-primary transition-all">
                {t}
              </span>
            ))}
          </div>

          <Link
            to={`/case-study?project=${project.id}`}
            className="group/btn relative inline-flex items-center gap-3 w-fit py-4 px-8 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-[0.2em] shadow-glow overflow-hidden transition-all active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">Découvrir le projet <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          </Link>
        </div>

        {/* Technical Corner Marking */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
           <div className="text-[8px] font-mono text-primary/40 uppercase tracking-tighter flex flex-col text-right">
             <span>Project_Node: 0x{index}</span>
             <span>Ref: {project.id}</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
