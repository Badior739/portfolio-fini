import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500); // Hold at 100% briefly
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1; // Random increment
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center font-mono"
        >
          {/* Central Logo / Pulse */}
          <div className="relative mb-8">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full animate-pulse" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center text-primary font-black text-2xl tracking-tighter">
              {progress}%
            </div>
          </div>

          {/* Status Messages */}
          <div className="h-8 overflow-hidden text-center">
            <motion.div
              key={progress < 30 ? "init" : progress < 70 ? "modules" : "ready"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-xs uppercase tracking-[0.3em] text-white/50"
            >
              {progress < 30 && "Initialisation du Système..."}
              {progress >= 30 && progress < 70 && "Chargement des Modules Architecturaux..."}
              {progress >= 70 && "Optimisation Finale..."}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-[1px] bg-white/10 mt-8 relative overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          
          {/* Aesthetic Code Rain or Grid overlay could go here */}
          <div className="absolute bottom-8 text-[10px] text-white/20 font-mono">
            BADIOR SYSTEM v2.0 // READY
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
