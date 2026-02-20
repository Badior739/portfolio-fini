import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, WifiOff, Terminal } from "lucide-react";
import { useSound } from "@/context/SoundContext";

const NotFound = () => {
  const location = useLocation();
  const { playError, playClick } = useSound();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    playError();
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, [playError]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-black font-mono">
        {/* CRT Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]" />
        <div className="absolute inset-0 bg-red-500/5 animate-pulse z-10 pointer-events-none" />

        <div className="relative z-30 text-center space-y-8 p-4">
          <div className={`relative inline-block ${glitch ? 'translate-x-1' : ''} transition-transform duration-75`}>
            <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-5xl md:text-9xl font-black text-red-500 tracking-tighter mb-2" style={{ textShadow: '2px 2px 0px rgba(255,0,0,0.5), -2px -2px 0px rgba(0,255,255,0.3)' }}>
              SYSTEM FAILURE
            </h1>
          </div>

          <div className="max-w-md mx-auto border border-red-500/30 bg-red-950/10 p-6 rounded-lg backdrop-blur-sm text-left shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <div className="flex items-center gap-2 text-red-400 mb-4 border-b border-red-500/30 pb-2">
              <Terminal size={16} />
              <span className="text-xs uppercase tracking-widest">Error Log</span>
            </div>
            <div className="space-y-2 font-mono text-sm text-red-300/80">
              <p>&gt; CRITICAL_ERROR: 404_NOT_FOUND</p>
              <p>&gt; LOC: {location.pathname}</p>
              <p>&gt; STATUS: ORBITAL_DECAY_DETECTED</p>
              <p>&gt; ACTION_REQUIRED: IMMEDIATE_EVACUATION</p>
              <p className="animate-pulse">&gt; _</p>
            </div>
          </div>

          <p className="text-red-400 text-lg uppercase tracking-[0.2em] animate-pulse">
            Liaison interrompue avec le secteur demandé.
          </p>

          <Button 
            asChild 
            variant="destructive" 
            size="lg" 
            className="mt-8 bg-red-600 hover:bg-red-700 text-white rounded-none border border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105"
            onClick={playClick}
          >
            <Link to="/" className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              RÉTABLIR LA LIAISON
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
