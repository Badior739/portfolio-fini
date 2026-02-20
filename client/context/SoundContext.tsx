import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundContextType {
  isEnabled: boolean;
  toggleSound: () => void;
  playHover: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playError: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false); // Default to off to respect user preference initially, or on? Let's default to off for "politeness" or on for "immersion"? User said "Optionnel et doit être désactivable". Default off is safer.
  
  // Audio Context Singleton
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext only on user interaction to comply with browser policies
    const initAudio = () => {
      if (!audioCtx) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx) {
            const ctx = new Ctx();
            setAudioCtx(ctx);
        }
      }
    };
    
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, [audioCtx]);

  const toggleSound = () => {
    setIsEnabled(prev => !prev);
  };

  const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    if (!isEnabled || !audioCtx) return;
    
    try {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.error("Audio error", e);
    }
  };

  const playHover = () => {
    // High pitch short blip
    playTone(800, 'sine', 0.05, 0.02);
  };

  const playClick = () => {
    // Mechanical click
    playTone(400, 'square', 0.05, 0.03);
    setTimeout(() => playTone(600, 'square', 0.05, 0.02), 50);
  };

  const playSuccess = () => {
    // Ascending major arpeggio
    playTone(440, 'sine', 0.1, 0.05);
    setTimeout(() => playTone(554, 'sine', 0.1, 0.05), 100);
    setTimeout(() => playTone(659, 'sine', 0.2, 0.05), 200);
  };
  
  const playError = () => {
    // Descending dissonant
    playTone(400, 'sawtooth', 0.2, 0.05);
    setTimeout(() => playTone(200, 'sawtooth', 0.2, 0.05), 100);
  };

  return (
    <SoundContext.Provider value={{ isEnabled, toggleSound, playHover, playClick, playSuccess, playError }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    // Return a safe fallback to allow components to work without the provider
    return {
      isEnabled: false,
      toggleSound: () => {},
      playHover: () => {},
      playClick: () => {},
      playSuccess: () => {},
      playError: () => {},
    };
  }
  return context;
}
