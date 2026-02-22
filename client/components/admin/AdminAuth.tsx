import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from "@/config";

interface AdminAuthProps {
  onSuccess: (password: string) => void;
  onClose: () => void;
}

export function AdminAuth({ onSuccess, onClose }: AdminAuthProps) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ password }) 
      });
      const data = await res.json();
      console.log('Login response:', res.status, JSON.stringify(data));
      if (res.ok) {
        if (data.requires2FA) {
          setRequires2FA(true);
          toast({ title: "Code envoyé", description: "Veuillez vérifier votre email pour le code de sécurité." });
        } else {
          onSuccess(data.token);
        }
      } else {
        if (data.error === "Admin not configured") {
           toast({ 
             title: "Configuration Requise", 
             description: "Système non initialisé. Utilisez le mot de passe 'admin' pour la première connexion.", 
             variant: "default" 
           });
        } else {
           toast({ title: "Erreur", description: data.error || "Mot de passe incorrect", variant: "destructive" });
        }
      }
    } catch (e) { 
      console.error(e); 
      toast({ title: "Erreur", description: "Problème de connexion", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleVerify2FA = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpCode.length !== 6) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode })
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.token);
        toast({ title: "Accès autorisé", description: "Bienvenue, Badior." });
      } else {
        toast({ title: "Erreur 2FA", description: data.error || "Code invalide", variant: "destructive" });
      }
    } catch (e) { 
      console.error(e); 
      toast({ title: "Erreur", description: "Problème de connexion", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="w-[92%] max-w-sm rounded-[2.5rem] bg-card p-10 shadow-premium border border-border/50 transition-all duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 animate-pulse">
             <ShieldCheck size={32} />
          </div>
          <h3 className="text-3xl font-black tracking-tight text-foreground">Badior Admin</h3>
          <p className="text-sm text-muted-foreground mt-2">Authentification Sécurisée 2FA</p>
        </div>

        {!requires2FA ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Mot de passe système" 
                className="w-full rounded-2xl border border-border bg-secondary/50 px-6 py-4 outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/40" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-6 top-4 text-muted-foreground/60 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button type="submit" disabled={loading} className="w-full py-7 rounded-2xl font-black uppercase tracking-widest bg-primary shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all">
              {loading ? "Chargement..." : "Initialiser la session"}
            </Button>
          </form>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-2 mb-2">
               <button onClick={() => setRequires2FA(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                 <ArrowLeft size={16} />
               </button>
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Saisir le Code OTP</span>
             </div>
             
             <div className="flex justify-center">
               <InputOTP 
                 maxLength={6} 
                 value={otpCode} 
                 onChange={(val) => {
                   setOtpCode(val);
                   if (val.length === 6) {
                      handleVerify2FA();
                   }
                 }}
               >
                 <InputOTPGroup className="gap-2">
                   {[0,1,2,3,4,5].map(i => (
                     <InputOTPSlot key={i} index={i} className="rounded-xl border-border bg-secondary/50 h-14 w-12 text-lg font-bold" />
                   ))}
                 </InputOTPGroup>
               </InputOTP>
             </div>

             <Button 
              onClick={() => handleVerify2FA()} 
              disabled={loading || otpCode.length !== 6}
              className="w-full py-7 rounded-2xl font-black uppercase tracking-widest bg-primary shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
               {loading ? "Vérification..." : "Vérifier le Code"}
             </Button>
             
             <p className="text-[10px] text-center text-muted-foreground/60 uppercase tracking-widest">
               Code envoyé à votre adresse sécurisée
             </p>
          </div>
        )}
        
        <Button variant="ghost" onClick={onClose} className="w-full mt-6 text-muted-foreground hover:text-foreground">Fermer la console</Button>
      </div>
    </div>
  );
}
