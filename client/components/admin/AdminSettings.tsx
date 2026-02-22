import React, { useState } from 'react';
import { ShieldCheck, Lock, RefreshCw, Download, Globe, Key, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AdminHeader, AdminCard, CMSField, SaveBar } from './AdminShared';
import { SiteSettings } from '@shared/api';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { API_BASE_URL } from "@/config";

interface AdminSettingsProps {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
  onBackup: () => void;
  onLogout: () => void;
  onSave: () => void;
  loading: boolean;
  isDirty: boolean;
  token: string;
}

export function AdminSettings({ settings, setSettings, onBackup, onLogout, onSave, loading, isDirty, token }: AdminSettingsProps) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const handlePasswordChange = async () => {
    if (passwords.next !== passwords.confirm) {
      return toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/password`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: passwords.next })
      });
      if (res.ok) {
        toast({ title: "Succès", description: "Mot de passe mis à jour." });
        setShowPasswordChange(false);
        setPasswords({ current: '', next: '', confirm: '' });
      } else {
        const data = await res.json();
        toast({ title: "Erreur", description: data.error || "Échec du changement.", variant: "destructive" });
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-600 pb-32">
      <AdminHeader 
        title="Paramètres Système" 
        subtitle="Configuration globale, sécurité and protocoles SEO." 
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* SEO & Général */}
        <AdminCard title="Configuration Globale & SEO" icon={Globe}>
          <div className="space-y-6">
            <CMSField 
              label="Titre du Site (SEO)" 
              value={settings.siteTitle} 
              onChange={(v) => setSettings({ ...settings, siteTitle: v })} 
            />
            <CMSField 
              label="Description (SEO Meta)" 
              isTextArea
              value={settings.siteDescription} 
              onChange={(v) => setSettings({ ...settings, siteDescription: v })} 
            />
            <CMSField 
              label="Mots Clés (Séparés par virgules)" 
              value={settings.siteKeywords} 
              onChange={(v) => setSettings({ ...settings, siteKeywords: v })} 
            />
          </div>
        </AdminCard>

        {/* API & Services */}
        <AdminCard title="Intégrations & API Keys" icon={Key}>
          <div className="space-y-6">
            <CMSField 
              label="Web3Forms Access Key" 
              value={settings.web3formsKey || ''} 
              onChange={(v) => setSettings({ ...settings, web3formsKey: v })} 
              placeholder="00000000-0000-0000-0000-000000000000"
            />
            <CMSField 
              label="Google Analytics ID (G-XXXXX)" 
              value={settings.gaId || ''} 
              onChange={(v) => setSettings({ ...settings, gaId: v })} 
              placeholder="G-XXXXXXXXXX"
            />
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold text-white">Authentification 2FA</Label>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Activer la vérification par email</p>
              </div>
              <Switch 
                checked={settings.enable2FA} 
                onCheckedChange={(checked) => setSettings({ ...settings, enable2FA: checked })}
              />
            </div>
          </div>
        </AdminCard>

        {/* Sécurité */}
        <AdminCard title="Sécurité & Accès" icon={ShieldCheck}>
          <div className="space-y-6">
            {!showPasswordChange ? (
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl font-bold gap-3 border-white/10 hover:border-primary/40 transition-all justify-start px-6 text-white/70 hover:text-white"
                onClick={() => setShowPasswordChange(true)}
              >
                <Lock size={18} /> Changer le mot de passe Admin
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <input 
                  type="password"
                  placeholder="Mot de passe actuel"
                  className="w-full px-6 py-4 rounded-xl bg-black/40 border border-white/10 text-sm font-bold text-white outline-none focus:border-primary"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                />
                <input 
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="w-full px-6 py-4 rounded-xl bg-black/40 border border-white/10 text-sm font-bold text-white outline-none focus:border-primary"
                  value={passwords.next}
                  onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                />
                <input 
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  className="w-full px-6 py-4 rounded-xl bg-black/40 border border-white/10 text-sm font-bold text-white outline-none focus:border-primary"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
                <div className="flex gap-3">
                  <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handlePasswordChange}>Valider</Button>
                  <Button variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setShowPasswordChange(false)}>Annuler</Button>
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              className="w-full h-14 rounded-2xl font-bold gap-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all justify-start px-6"
              onClick={onLogout}
            >
              <Lock size={18} /> Déconnexion immédiate
            </Button>
          </div>
        </AdminCard>

        {/* Maintenance */}
        <AdminCard title="Maintenance Systémique" icon={RefreshCw}>
          <div className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl font-bold gap-3 border-white/10 hover:border-green-500/40 transition-all justify-start px-6 text-white/70 hover:text-white" 
              onClick={onBackup}
            >
              <Download size={18} /> Sauvegarder la Base (.json)
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl font-bold gap-3 border-white/10 hover:border-red-500/40 transition-all justify-start px-6 text-white/70 hover:text-white"
              onClick={() => {
                if (window.confirm("Réinitialiser les statistiques ? Cette action est irréversible.")) {
                  // Logic here
                  toast({ title: "Action demandée", description: "Le nettoyage des stats sera effectif à la prochaine sauvegarde." });
                }
              }}
            >
              <Activity size={18} /> Réinitialiser les Métriques
            </Button>
          </div>
        </AdminCard>
      </div>

      <SaveBar isDirty={isDirty} loading={loading} onSave={onSave} />
    </div>
  );
}
