import { Project } from "@shared/api";

export const projects: Project[] = [
  {
    id: 'mind-graphix-solution',
    title: "Mind Graphix Solution",
    category: "Site Web",
    description: "Agence digitale de création de sites web et applications mobiles sur mesure.",
    tools: ["Next.js", "TailwindCSS", "Framer Motion"],
    image: "/placeholder.svg",
    year: 2026,
    role: "Dev Fullstack / Chef de projet",
    content_blocks: []
  },
  {
    id: "gourmet-digital",
    title: "Le Gourmet Digital",
    category: "Site Web",
    description: "Expérience culinaire numérique immersive avec réservation de tables en temps réel et menus interactifs visuels.",
    tools: ["React", "Framer Motion", "Supabase"],
    image: "/placeholder.svg",
    year: 2025,
    role: "Lead Frontend Developer",
    content_blocks: []
  },
  {
    id: "pharmaconnect",
    title: "PharmaConnect 24/7",
    category: "Application",
    description: "Plateforme e-santé révolutionnaire connectant patients et pharmacies pour livraison express et conseils sécurisés.",
    tools: ["React Native", "Node.js", "MongoDB"],
    image: "/placeholder.svg",
    year: 2025,
    role: "Fullstack Engineer",
    content_blocks: []
  },
  {
    id: "autotech-diagnostics",
    title: "AutoTech Manager",
    category: "Application",
    description: "Solution SaaS pour garages modernes : diagnostics prédictifs via OBD-II, gestion de flotte et CRM client automatisé.",
    tools: ["Vue.js", "Firebase", "Python"],
    image: "/placeholder.svg",
    year: 2024,
    role: "System Architect",
    content_blocks: []
  },
  {
    id: "prestige-rentals",
    title: "Prestige Mobility",
    category: "Site Web",
    description: "Agence de location de véhicules premium avec vérification d'identité par IA et paiements crypto sécurisés.",
    tools: ["Next.js", "Solidity", "Stripe"],
    image: "/placeholder.svg",
    year: 2024,
    role: "Lead Developer",
    content_blocks: []
  },
  {
    id: "ecosmart-home",
    title: "EcoSmart Neural Home",
    category: "IoT / IA",
    description: "Système domotique autonome optimisant la consommation énergétique via des algorithmes d'apprentissage profond.",
    tools: ["Python", "TensorFlow", "React"],
    image: "/placeholder.svg",
    year: 2026,
    role: "AI Engineer",
    content_blocks: []
  }
];
