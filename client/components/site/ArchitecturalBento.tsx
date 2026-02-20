import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, MapPin, Terminal, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoItem } from "@shared/api";
import { useLanguage } from "@/context/LanguageContext";

const iconMap: Record<string, LucideIcon> = {
  Briefcase, GraduationCap, MapPin, Award, Terminal
};

export function ArchitecturalBento({ items }: { items?: BentoItem[] }) {
  const { t } = useLanguage();

  const defaultBento = [
    {
      title: t('bento.journey.title'),
      icon: "Briefcase",
      content: t('bento.journey.content'),
      className: "md:col-span-2 md:row-span-1",
      bg: "bg-indigo-500/10"
    },
    {
      title: t('bento.education.title'),
      icon: "GraduationCap",
      content: t('bento.education.content'),
      className: "md:col-span-1 md:row-span-1",
      bg: "bg-fuchsia-500/10"
    },
    {
      title: t('bento.vision.title'),
      icon: "Terminal",
      content: t('bento.vision.content'),
      className: "md:col-span-1 md:row-span-2",
      bg: "bg-cyan-500/10"
    },
    {
      title: t('bento.location.title'),
      icon: "MapPin",
      content: t('bento.location.content'),
      className: "md:col-span-2 md:row-span-1",
      bg: "bg-emerald-500/10"
    }
  ];

  const displayItems = items?.length ? items : defaultBento;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
      {displayItems.map((item, idx) => {
        const Icon = iconMap[item.icon] || Award;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={cn(
              "group relative overflow-hidden rounded-3xl p-[1px] transition-all duration-500",
              item.className
            )}
          >
            {/* Luminous Border Tracer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0" />
            
            <div className={cn(
              "relative h-full w-full rounded-[calc(1.5rem-1px)] p-8 overflow-hidden transition-all duration-300 z-10",
              "bg-card/40 backdrop-blur-xl border border-white/10",
              "group-hover:bg-card/60 group-hover:border-primary/30"
            )}>
              {/* 3. Luminous Internal Glow */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(139,92,246,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Background Highlight */}
              <div className={cn("absolute -top-10 -right-10 w-40 h-40 blur-[50px] opacity-20 transition-opacity group-hover:opacity-40", item.bg)} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-lg ring-1 ring-white/5">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-white">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>

              {/* Technical Detail / Award Icon */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rotate-45 text-primary/30 scale-75 group-hover:scale-100">
                 <Award size={44} strokeWidth={1} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
