import { LucideIcon, Palette, PenTool, Code, Database, Zap, Cpu } from 'lucide-react';

export interface Skill {
  name: string;
  description: string;
  expertise: string; // "Expert" | "Avancé" | "Maîtrisé"
  icon: LucideIcon;
  color: {
    from: string;
    to: string;
    accent: string;
  };
}

export const skills: Skill[] = [
  {
    name: 'Photoshop',
    description: 'Maîtrise complète du logiciel. Retouche photo, composition, effets avancés et création de visuels profesionnels pour le web et l\'impression.',
    expertise: 'Expert',
    icon: Palette,
    color: {
      from: 'from-indigo-500',
      to: 'to-indigo-600',
      accent: 'indigo',
    },
  },
  {
    name: 'Illustrator',
    description: 'Conception graphique vectorielle, création de logos, illustrations originales et design de marques avec une grande précision technique.',
    expertise: 'Expert',
    icon: PenTool,
    color: {
      from: 'from-violet-500',
      to: 'to-violet-600',
      accent: 'violet',
    },
  },
  {
    name: 'HTML',
    description: 'Structuration sémantique optimale, accessibilité Web (WCAG), et best practices modernes pour une base solide et performante.',
    expertise: 'Expert',
    icon: Code,
    color: {
      from: 'from-orange-500',
      to: 'to-orange-600',
      accent: 'orange',
    },
  },
  {
    name: 'CSS',
    description: 'Stylisation avancée, layouts modernes (Flexbox, Grid), animations fluides, responsive design et TailwindCSS pour des interfaces magnifiques.',
    expertise: 'Expert',
    icon: Zap,
    color: {
      from: 'from-blue-500',
      to: 'to-blue-600',
      accent: 'blue',
    },
  },
  {
    name: 'JavaScript',
    description: 'Programmation fonctionnelle et orientée objet, manipulation du DOM, API modernes et optimisation des performances côté client.',
    expertise: 'Expert',
    icon: Code,
    color: {
      from: 'from-yellow-500',
      to: 'to-yellow-600',
      accent: 'yellow',
    },
  },
  {
    name: 'Python',
    description: 'Développement backend robuste, scripts d\'automatisation, analyse de données et intégration d\'API tierces pour applications complètes.',
    expertise: 'Avancé',
    icon: Code,
    color: {
      from: 'from-green-500',
      to: 'to-green-600',
      accent: 'green',
    },
  },
  {
    name: 'React',
    description: 'Architecture de composants réutilisables, state management avancé, hooks personnalisés et optimisation du rendering pour performance maximale.',
    expertise: 'Expert',
    icon: Zap,
    color: {
      from: 'from-cyan-500',
      to: 'to-cyan-600',
      accent: 'cyan',
    },
  },
  {
    name: 'IA (Intelligence Artificielle)',
    description: "Conception et intégration de modèles d'IA pour automatisation, traitement du langage naturel, et systèmes de recommandation. Mise en production et optimisation des performances.",
    expertise: 'Avancé',
    icon: Cpu,
    color: {
      from: 'from-emerald-500',
      to: 'to-emerald-600',
      accent: 'emerald',
    },
  },
  {
    name: 'SQL',
    description: 'Requêtes optimisées, design de bases de données, jointures complexes et gestion performante des données pour applications scalables.',
    expertise: 'Avancé',
    icon: Database,
    color: {
      from: 'from-pink-500',
      to: 'to-pink-600',
      accent: 'pink',
    },
  },
  {
    name: 'TypeScript',
    description: 'Typage strict pour code robuste et maintenable, interfaces complexes, generics et tooling avancé pour prévenir les erreurs.',
    expertise: 'Expert',
    icon: Code,
    color: {
      from: 'from-fuchsia-500',
      to: 'to-fuchsia-600',
      accent: 'fuchsia',
    },
  },
];
