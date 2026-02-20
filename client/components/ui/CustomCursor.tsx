import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      
      // Add particles on move
      if (Math.random() > 0.5) { // Throttling particle creation
         addParticle(e.clientX, e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.classList.contains("hover-trigger")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  // Particle System Logic
  const addParticle = (x: number, y: number) => {
    const colors = ["#8b5cf6", "#d8b4fe", "#ffffff", "#4c1d95"]; // Violet theme
    particles.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: 1.0,
      size: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  };

  const animateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.current.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      
      if (p.life <= 0) {
        particles.current.splice(i, 1);
        return;
      }

      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestRef.current = requestAnimationFrame(animateParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      window.addEventListener("resize", handleResize);
      requestRef.current = requestAnimationFrame(animateParticles);
      
      return () => {
        window.removeEventListener("resize", handleResize);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9997]"
      />
      
      {/* Main Cursor (Dot) */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isClicking ? 0.8 : (isHovered ? 0.5 : 1),
        }}
      />
      
      {/* Outer Ring (Magnetic Feel) */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-12 h-12 border border-primary/50 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out",
          isHovered ? "scale-150 border-primary opacity-50 bg-primary/10" : "scale-100 opacity-20",
          isClicking && "scale-90 border-primary opacity-80"
        )}
        style={{
          x: useSpring(cursorX, { damping: 40, stiffness: 200, mass: 0.8 }), // Slightly delayed follow
          y: useSpring(cursorY, { damping: 40, stiffness: 200, mass: 0.8 }),
          translateX: -14, // Offset to center with the inner dot (12px radius diff approx)
          translateY: -14
        }}
      >
        <div className={cn(
            "absolute inset-0 rounded-full border-t-2 border-primary/80 animate-spin-slow transition-opacity",
            isHovered ? "opacity-100" : "opacity-0"
        )} />
      </motion.div>
    </>
  );
}
