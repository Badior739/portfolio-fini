import { motion } from "framer-motion";
import { Zap, Target, Hexagon } from "lucide-react";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function FloatingMetrics() {
  const { t } = useLanguage();

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {/* Metric 1 */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute top-1/3 left-20"
      >
        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4 group hover:bg-white/10 transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Zap size={20} />
          </div>
          <div className="pr-4">
            <div className="text-xs text-white/50 uppercase font-mono">{t('floatingMetrics.performance')}</div>
            <div className="text-xl font-bold text-white tracking-widest">99.9%</div>
          </div>
        </div>
      </motion.div>

      {/* Metric 2 */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-1/3 right-20"
      >
        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4 group hover:bg-white/10 transition-colors">
          <div className="h-10 w-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-500 group-hover:scale-110 transition-transform">
            <Target size={20} />
          </div>
          <div className="pr-4">
            <div className="text-xs text-white/50 uppercase font-mono">{t('floatingMetrics.satisfaction')}</div>
            <div className="text-xl font-bold text-white tracking-widest">100%</div>
          </div>
        </div>
      </motion.div>

      {/* Decorative HUD Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white/10 font-mono text-[10px] tracking-[0.5em] uppercase">
        {t('floatingMetrics.systemStatus')}
      </div>
    </div>
  );
}
