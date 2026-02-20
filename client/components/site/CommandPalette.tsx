
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Home, 
  User, 
  Briefcase, 
  Mail, 
  FileText, 
  Github, 
  Linkedin, 
  Twitter, 
  Laptop,
  Terminal,
  ExternalLink,
  Volume2,
  VolumeX
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useSound } from "@/context/SoundContext";

import { useLanguage } from "@/context/LanguageContext";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setAdminOpen } = useAdmin();
  const { isEnabled, toggleSound } = useSound();
  const { t } = useLanguage();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const rect = el.getBoundingClientRect();
      const offsetTop = rect.top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    } else {
        navigate(`/#${id}`);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('commandPalette.placeholder')} />
      <CommandList>
        <CommandEmpty>{t('commandPalette.noResults')}</CommandEmpty>
        <CommandGroup heading={t('commandPalette.navigation')}>
          <CommandItem
            onSelect={() => runCommand(() => handleScrollTo("home"))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>{t('nav.home')}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => handleScrollTo("about"))}
          >
            <User className="mr-2 h-4 w-4" />
            <span>{t('nav.about')}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => handleScrollTo("skills"))}
          >
            <Laptop className="mr-2 h-4 w-4" />
            <span>{t('nav.skills')}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => handleScrollTo("projects"))}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            <span>{t('nav.projects')}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => handleScrollTo("contact"))}
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>{t('nav.contact')}</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />

        <CommandGroup heading={t('commandPalette.config')}>
           <CommandItem onSelect={() => runCommand(toggleSound)}>
            {isEnabled ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
            <span>{isEnabled ? t('commandPalette.mute') : t('commandPalette.unmute')}</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandGroup heading={t('commandPalette.social')}>
          <CommandItem
            onSelect={() => runCommand(() => window.open("https://github.com", "_blank"))}
          >
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => window.open("https://linkedin.com", "_blank"))}
          >
            <Linkedin className="mr-2 h-4 w-4" />
            <span>LinkedIn</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t('commandPalette.actions')}>
          <CommandItem
             onSelect={() => runCommand(() => setAdminOpen(true))}
          >
             <Terminal className="mr-2 h-4 w-4" />
             <span>{t('commandPalette.admin')}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
