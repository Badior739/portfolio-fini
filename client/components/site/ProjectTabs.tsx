import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface ProjectTabsProps {
  categories: string[];
  activeCategory: string;
  onChange: (cat: string) => void;
}

export function ProjectTabs({ categories, activeCategory, onChange }: ProjectTabsProps) {
  const { t } = useLanguage();
  return (
    <div className="flex justify-center mb-16 relative z-20">
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-secondary/50 border border-border/50 rounded-2xl backdrop-blur-3xl shadow-premium">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              "relative px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300",
              activeCategory === cat ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-background border border-border/50 rounded-xl shadow-premium"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{cat === "Tous" ? t('projects.all') : cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
