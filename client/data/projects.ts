import { Project } from "@shared/api";

export const projects: Project[] = [
  {
    id: 'mind-graphix-solution',
    title: "Mind Graphix Solution",
    category: "Site Web",
    description: "Agence digitale de création de sites web et applications mobiles sur mesure.",
    tools: ["Next.js", "TailwindCSS", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    year: 2026,
    role: "Dev Fullstack / Chef de projet"
  },
  {
    id: "gourmet-digital",
    title: "Le Gourmet Digital",
    category: "Site Web",
    description: "Expérience culinaire numérique immersive avec réservation de tables en temps réel et menus interactifs visuels.",
    tools: ["React", "Framer Motion", "Supabase"],
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
    year: 2025,
    role: "Lead Frontend Developer"
  },
  {
    id: "pharmaconnect",
    title: "PharmaConnect 24/7",
    category: "Application",
    description: "Plateforme e-santé révolutionnaire connectant patients et pharmacies pour livraison express et conseils sécurisés.",
    tools: ["React Native", "Node.js", "MongoDB"],
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80",
    year: 2025,
    role: "Fullstack Engineer"
  },
  {
    id: "autotech-diagnostics",
    title: "AutoTech Manager",
    category: "Application",
    description: "Solution SaaS pour garages modernes : diagnostics prédictifs via OBD-II, gestion de flotte et CRM client automatisé.",
    tools: ["Vue.js", "Firebase", "Python"],
    image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80",
    year: 2024,
    role: "System Architect"
  },
  {
    id: "prestige-rentals",
    title: "Prestige Mobility",
    category: "Site Web",
    description: "Agence de location de véhicules premium avec vérification d'identité par IA et paiements crypto sécurisés.",
    tools: ["Next.js", "Solidity", "Stripe"],
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    year: 2024,
    role: "Lead Developer"
  },
  {
    id: "ecosmart-home",
    title: "EcoSmart Neural Home",
    category: "IoT / IA",
    description: "Système domotique autonome optimisant la consommation énergétique via des algorithmes d'apprentissage profond.",
    tools: ["Python", "TensorFlow", "React"],
    image: "https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&w=800&q=80",
    year: 2026,
    role: "AI Engineer"
  }
];
