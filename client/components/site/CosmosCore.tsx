import { motion } from "framer-motion";
import React from "react";

export function CosmosCore() {
  const seeds = Array.from({ length: 15 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Deep Space Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a103d_0%,#000000_100%)]" />
      
      {/* 2. Architectural Blueprint Grid (Large) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:120px_120px]" />
      
      {/* 3. Floating Glass Fragments (Debris) */}
      {seeds.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 2000 - 1000, 
            y: Math.random() * 2000 - 1000, 
            rotate: Math.random() * 360,
            opacity: 0 
          }}
          animate={{
            x: [null, Math.random() * 2000 - 1000],
            y: [null, Math.random() * 2000 - 1000],
            rotate: [null, Math.random() * 360],
            opacity: [0, 0.2, 0]
          }}
          transition={{
            duration: 20 + Math.random() * 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-32 h-32 border border-white/10 bg-white/5 backdrop-blur-[2px] rounded-lg"
          style={{
            clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
          }}
        />
      ))}

      {/* 4. Core Energy Pulsars */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-500/10 blur-[100px] rounded-full animate-float-slow" />

      {/* 5. Star Dust (Small particles) */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
