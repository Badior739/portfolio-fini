import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, Suspense, lazy } from "react";
import { AboutContent, BentoItem } from "@shared/api";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Profile3DLayered = lazy(() => import('./Profile3DLayered').then(module => ({ default: module.Profile3DLayered })));
const ArchitecturalBento = lazy(() => import('./ArchitecturalBento').then(module => ({ default: module.ArchitecturalBento })));

export function AboutArchitectural({ data, bento }: { data?: AboutContent; bento?: BentoItem[] }) {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();

  const about = {
    titleMain: language === 'fr' ? (data?.titleMain || t('about.titleMain')) : t('about.titleMain'),
    titleSub: language === 'fr' ? (data?.titleSub || t('about.titleSub')) : t('about.titleSub'),
    quote: language === 'fr' ? (data?.quote || t('about.quote')) : t('about.quote'),
    description: t('about.description'),
    profileImage: data?.profileImage || "/uploads/1768703448637-profiljpg.jpg"
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleX = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityBio = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const yBio = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative py-24 md:py-40 overflow-hidden bg-background"
    >
      {/* 10. Blueprint Grid Lines & Labels (Enhanced) */}
      <div className="absolute inset-0 opacity-[0.03] md:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:100px_100px] md:bg-[size:200px_200px] border-primary/20" />
        
        {/* Corner Tech Notations */}
        <span className="absolute top-6 left-6 md:top-10 md:left-10 text-[8px] md:text-[10px] font-mono text-primary flex flex-col uppercase tracking-tighter">
          <span>Scale: 1:1</span>
          <span>Project: Cosmos_Home_V2</span>
        </span>
        <span className="absolute top-6 right-6 md:top-10 md:right-10 text-[8px] md:text-[10px] font-mono text-primary text-right flex flex-col uppercase tracking-tighter">
          <span>Lat: 11.1772 N</span>
          <span>Lng: 4.2974 W</span>
        </span>
      </div>

      {/* 11. Premium Grain Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-soft-light" />

      <div className="container relative z-10 px-4">
        <div className="flex flex-col mb-16 md:mb-32">
          {/* 9. Gradient-X Titles & 13. Spring physics */}
          <motion.div style={{ x: titleX }} className="overflow-visible">
             <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-foreground/20 animate-gradient-x whitespace-normal md:whitespace-nowrap">
               {about.titleMain}
             </h2>
          </motion.div>
          <div className="flex justify-end -mt-2 md:-mt-8">
             <h2 className="text-3xl sm:text-5xl md:text-7xl font-light italic tracking-tight text-primary/80">
               {about.titleSub}
             </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-16 lg:gap-24 items-start">
          {/* 1. 3D Parallax Profile Wrapper */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 order-1 lg:order-1">
            <div className="relative group max-w-md mx-auto lg:max-w-none">
              <Profile3DLayered image={about.profileImage} />
            </div>
            <div className="mt-8 space-y-4 text-center lg:hidden">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                "{about.quote}"
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
                {about.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12 md:space-y-20 order-2 lg:order-2">
            {/* 5. Char-by-Char (Word-by-word here) Bio Reveal & 17. Blur/Focus */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-center lg:text-left"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight text-foreground tracking-tight">
                "{about.quote}"
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                {about.description}
              </p>
            </motion.div>

            {/* 2. Architectural Bento Grid & 8. Axis-Tilt Hover */}
            <div className="w-full">
              <Suspense fallback={<div className="grid grid-cols-2 gap-4 h-64 bg-background/50 animate-pulse rounded-xl" />}>
                <ArchitecturalBento items={bento} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Trace Lines (Visual Decor) */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 blur-sm pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[1px] h-64 bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-sm pointer-events-none" />
      
      {/* 20. Premium Mobile Stack is handled via Tailwind classes in components */}
    </section>
  );
}
