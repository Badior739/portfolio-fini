import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "home", label: "00. Home" },
  { id: "about", label: "01. About" },
  { id: "skills", label: "02. Skills" },
  { id: "projects", label: "03. Work" },
  { id: "contact", label: "04. Contact" },
];

export function ScrollSpy() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6 items-end pointer-events-none">
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group relative flex items-center gap-4 pointer-events-auto"
        >
          {/* Label (Shows on Hover/Active) */}
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: activeSection === id ? 1 : 0, 
              x: activeSection === id ? 0 : 20 
            }}
            className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold bg-black/50 backdrop-blur px-2 py-1 rounded"
          >
            {label}
          </motion.span>

          {/* Dot Indicator */}
          <div className="relative w-3 h-3 flex items-center justify-center">
            <motion.div
              animate={{
                scale: activeSection === id ? 1.5 : 1,
                backgroundColor: activeSection === id ? "var(--primary)" : "rgba(255,255,255,0.2)",
              }}
              className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            />
            {/* Active Glow Ring */}
            {activeSection === id && (
              <motion.div
                layoutId="active-ring"
                className="absolute inset-0 rounded-full border border-primary opacity-50"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        </a>
      ))}
      
      {/* Vertical Line Connector */}
      <div className="absolute top-0 bottom-0 right-[5px] w-[1px] bg-white/5 -z-10" />
    </div>
  );
}
