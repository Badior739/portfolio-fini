import { Skill, Project } from '@shared/api';

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      skills: "Compétences",
      projects: "Projets",
      contact: "Contact",
      recruit: "Recrutement"
    },
    header: {
      role: "Architecte Digital"
    },
    hero: {
      badge: "Ingénierie de Précision & Esthétique Future",
      description: "Architecte Digital spécialisé dans la conception d'écosystèmes numériques monumentaux.",
      primaryCTA: "Explorer_Projets",
      secondaryCTA: "Consultation_Node",
      scroll: "Scroll_Initiate"
    },
    about: {
      titleMain: "Héritage",
      titleSub: "Architectural",
      quote: "Concevoir le code comme on érige une structure, avec une intention pure et une exécution mathématique.",
      description: "Mon approche transcende le simple développement web. Je bâtis des écosystèmes numériques où chaque pixel et chaque ligne de code sont les briques d'une expérience utilisateur monumentale.",
      yearsXP: "Années d'XP",
      focus: "Focus on Architecture"
    },
    recruit: {
      title: "Protocole Recrutement",
      accessLevel: "Access_Level: Professional_Collaboration",
      name: "Identité",
      email: "Canal Email",
      phone: "Signal Téléphonique",
      cv: "Dossier / CV (PDF)",
      company: "Organisation",
      position: "Mission Proposée",
      projectType: "Nature",
      budget: "Budget Est.",
      timeline: "Timeline",
      message: "Détails Stratégiques // Opportunité",
      submit: "Envoyer le Signal",
      placeholders: {
        name: "Votre Nom",
        email: "votre@email.com",
        phone: "+XX ... (Opt.)",
        company: "Nom Structure",
        position: "Titre du Poste",
        message: "Décrivez les fondations de cette synergie..."
      },
      options: {
        projectType: ["Collaboration", "CDI/CDD", "Freelance", "Audit", "Autre"],
        budget: ["À discuter", "< 5k€", "5k€ - 10k€", "10k€ - 20k€", "> 20k€"],
        timeline: ["Indéfini", "Urgent (< 1 mois)", "1 - 3 mois", "3 - 6 mois", "Long terme"]
      },
      analysisWait: "Analysis_Wait: 48h",
      secureProtocol: "Secure_Protocol",
      init: "Initialisation...",
      selectFile: "Sélectionner un fichier...",
      toast: {
        requiredTitle: "Champs requis",
        requiredDesc: "Veuillez compléter les informations de base.",
        signalReceivedTitle: "Signal Reçu",
        signalReceivedDesc: "Votre proposition a été transmise avec succès via le protocole sécurisé.",
        signalInterruptedTitle: "Signal Interrompu",
        signalInterruptedDesc: "Échec de la transmission.",
        systemErrorTitle: "Erreur Système",
        systemErrorDesc: "La liaison avec le service de transmission a été perdue."
      }
    },
    contact: {
      title: "Transmission Finalisée",
      successMessage: "Votre proposition a été injectée dans le système. Une itération stratégique sera générée prochainement.",
      newSignal: "Nouveau Signal",
      name: "Structure / Identité",
      email: "Canal de Communication",
      message: "Vision_Architecture // Brief",
      submit: "Lancer la Transmission",
      placeholders: {
        name: "Votre Nom Complet",
        email: "votre@email.com",
        message: "Décrivez les fondations de votre projet..."
      },
      sending: "Calcul..."
    },
    projects: {
      category: "Développement",
      explore: "Explorer le Projet",
      badge: "Portfolio",
      title: "Réalisations",
      subtitle: "Signature",
      description: "Une collection de projets où l'ingénierie rencontre l'art. Explorez mes créations les plus récentes.",
      all: "Tous",
      list: [
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
      ]
    },
    skills: {
      explore: "Explorer",
      badge: "Technologies Maîtrisées",
      title: "Arsenal",
      subtitle: "Tech",
      list: [
        { name: "Photoshop", description: "Maîtrise complète du logiciel. Retouche photo, composition, effets avancés et création de visuels profesionnels pour le web et l'impression.", expertise: "Expert", level: 95, icon: "Palette", color: { from: "from-indigo-500", to: "to-indigo-600", accent: "indigo" } },
        { name: "Illustrator", description: "Conception graphique vectorielle, création de logos, illustrations originales et design de marques avec une grande précision technique.", expertise: "Expert", level: 90, icon: "PenTool", color: { from: "from-violet-500", to: "to-violet-600", accent: "violet" } },
        { name: "HTML", description: "Structuration sémantique optimale, accessibilité Web (WCAG), et best practices modernes pour une base solide et performante.", expertise: "Expert", level: 98, icon: "Globe", color: { from: "from-orange-500", to: "to-orange-600", accent: "orange" } },
        { name: "CSS", description: "Stylisation avancée, layouts modernes (Flexbox, Grid), animations fluides, responsive design et TailwindCSS pour des interfaces magnifiques.", expertise: "Expert", level: 95, icon: "Layout", color: { from: "from-blue-500", to: "to-blue-600", accent: "blue" } },
        { name: "JavaScript", description: "Programmation fonctionnelle et orientée objet, manipulation du DOM, API modernes et optimisation des performances côté client.", expertise: "Expert", level: 92, icon: "Terminal", color: { from: "from-yellow-500", to: "to-yellow-600", accent: "yellow" } },
        { name: "Python", description: "Développement backend robuste, scripts d'automatisation, analyse de données et intégration d'API tierces pour applications complètes.", expertise: "Avancé", level: 85, icon: "Server", color: { from: "from-green-500", to: "to-green-600", accent: "green" } },
        { name: "React", description: "Architecture de composants réutilisables, state management avancé, hooks personnalisés et optimisation du rendering pour performance maximale.", expertise: "Expert", level: 90, icon: "Atom", color: { from: "from-cyan-500", to: "to-cyan-600", accent: "cyan" } },
        { name: "IA", description: "Conception et intégration de modèles d'IA pour automatisation, traitement du langage naturel, et systèmes de recommandation.", expertise: "Avancé", level: 80, icon: "Brain", color: { from: "from-emerald-500", to: "to-emerald-600", accent: "emerald" } },
        { name: "SQL", description: "Requêtes optimisées, design de bases de données, jointures complexes et gestion performante des données pour applications scalables.", expertise: "Avancé", level: 85, icon: "Database", color: { from: "from-pink-500", to: "to-pink-600", accent: "pink" } },
        { name: "TypeScript", description: "Typage strict pour code robuste et maintenable, interfaces complexes, generics et tooling avancé pour prévenir les erreurs.", expertise: "Expert", level: 90, icon: "Shield", color: { from: "from-fuchsia-500", to: "to-fuchsia-600", accent: "fuchsia" } }
      ]
    },
    experience: {
      badge: "Chronologie",
      title: "Parcours",
      subtitle: "Pro",
      description: "Une progression constante dans l'ingénierie logicielle, jalonnée de défis techniques et de réalisations d'envergure.",
      status: "Status : Disponible pour Projets_Premium",
      items: [
        {
          year: "2022 - Présent",
          role: "Architecte Logiciel Senior",
          company: "Freelance / Consultant",
          desc: "Expertise approfondie en architecture microservices et déploiement cloud natif."
        },
        {
          year: "2019 - 2022",
          role: "Lead Developer Full-Stack",
          company: "Digital Agency",
          desc: "Direction technique de projets d'envergure pour des clients internationaux."
        },
        {
          year: "2017 - 2019",
          role: "UI/UX Designer & Dev",
          company: "Startup Studio",
          desc: "Conception d'interfaces innovantes et développement front-end haute performance."
        }
      ]
    },
    testimonials: {
      badge: "Témoignages",
      title: "Échos de",
      subtitle: "Confiance",
      description: "Ce que disent les leaders d'industrie et partenaires technologiques sur notre collaboration."
    },
    impact: {
      title: "Impact",
      subtitle: "Monumental",
      labTitle: "Laboratoire R&D",
      labDesc: "Exploration de concepts techniques appliqués. Des solutions innovantes pour des problèmes réels.",
      labButton: "Explorer le Labo",
      rnd: [
        { title: "Optimisation Web", tag: "Performance", desc: "Techniques avancées de chargement et de rendu pour une vitesse maximale." },
        { title: "Sécurité API", tag: "Backend", desc: "Architecture robuste et protection des données sensibles." },
        { title: "Interfaces Réactives", tag: "UX/UI", desc: "Design adaptatif pour une expérience utilisateur fluide sur tous les écrans." }
      ],
      stats: [
        { label: "Expertise Concrète", value: "3 Ans", desc: "D'expérience terrain et de résolution de problèmes complexes." },
        { label: "Projets Livrés", value: "20+", desc: "Solutions digitales déployées et fonctionnelles." },
        { label: "Satisfaction", value: "100%", desc: "Engagement total pour la réussite de chaque mission." }
      ]
    },
    appointment: {
      title: "Consultation",
      titleHighlight: "Stratégique",
      description: "Réservez un créneau pour discuter de votre vision. Sans engagement, 100% focus valeur.",
      scheduler: {
        title: "Consultation Stratégique",
        description: "Réservez un créneau pour discuter de votre vision et transformer vos idées en réalité numérique.",
        duration: "30 - 60 Minutes",
        platform: "Google Meet / Zoom",
        step: "Étape",
        of: "sur",
        chooseDate: "Choisir une date & heure",
        availableSlots: "Créneaux disponibles pour le",
        next: "Suivant",
        detailsTitle: "Vos Coordonnées",
        nameLabel: "Nom complet",
        namePlaceholder: "John Doe",
        emailLabel: "Email professionnel",
        emailPlaceholder: "john@company.com",
        topicLabel: "Sujet de la consultation",
        topicPlaceholder: "Décrivez brièvement votre projet ou vos besoins...",
        back: "Retour",
        confirm: "Confirmer le rendez-vous",
        successTitle: "Demande Envoyée !",
        successMessage: "Votre demande de rendez-vous pour le {date} à {time} a bien été enregistrée. Je vous confirmerai ce créneau très rapidement par email.",
        returnHome: "Retour à l'accueil",
        toast: {
          confirmed: "Rendez-vous confirmé !",
          confirmedDesc: "Vous recevrez un email de confirmation sous peu.",
          error: "Erreur",
          errorDesc: "Impossible de prendre le rendez-vous. Veuillez réessayer.",
          required: "Champs requis",
          requiredDesc: "Veuillez compléter tous les champs."
        }
      }
    },
    footer: {
      invalidEmailTitle: "Email invalide",
      invalidEmailDesc: "Veuillez saisir un email valide.",
      successTitle: "Succès",
      successDesc: "Merci ! Vous êtes inscrit à la newsletter.",
      errorTitle: "Erreur",
      errorDesc: "Une erreur s'est produite",
      subscribeErrorTitle: "Erreur",
      subscribeErrorDesc: "Impossible de s'inscrire. Veuillez réessayer.",
      description: "Concepteur logiciel & Architecte UI/UX. Spécialisé dans la création de structures numériques monumentales et scalables.",
      subscribeText: "Abonnez-vous pour recevoir les rapports d'études et innovations système.",
      emailPlaceholder: "Identifiant_Email",
      subscribeButton: "OK",
      rights: "Badior_Architecture",
      allRightsReserved: "All rights reserved.",
      termsOfUse: "Terms of Use",
      downloadCV: "Download_CV (PDF)",
      location: "Bobo-Dioulasso, Burkina Faso"
    },
    commandPalette: {
      placeholder: "Tapez une commande ou recherchez...",
      noResults: "Aucun résultat trouvé.",
      navigation: "Navigation Système",
      config: "Configuration Système",
      mute: "Désactiver le son (Mute)",
      unmute: "Activer le son (Unmute)",
      social: "Réseaux & Social",
      actions: "Actions Système",
      admin: "Mode Admin"
    },
    floatingMetrics: {
      performance: "Performance",
      satisfaction: "Satisfaction",
      systemStatus: "System_Status: Optimal // Core_Initialized"
    },
    systemConsole: {
      activeNexus: "Active_Nexus",
      architecture: "Badior_Architecture",
      structuralIntegrity: "Structural_Integrity",
      coreStudio: "Core_Studio // Edition_2026",
      coordinates: "48.8566 N // 2.3522 E"
    },
    adminPanel: {
      cmsElite: "CMS Elite",
      commandPool: "Architectural Command Pool CC-V2"
    },
    seo: {
      title: "Architecte Digital | Portfolio Premium",
      description: "Conception d'expériences numériques haute performance. Audit, Design et Développement Full-Stack.",
      keywords: "développeur web, architecte digital, react, typescript, design premium"
    },

    cta: {
      available: "Disponible pour Projets",
      vision: "Votre vision,",
      elevated: "Elevée au Cube.",
      description: "Je transforme des concepts complexes en architectures digitales fluides, rapides et prêtes pour l'avenir.",
      button: "Démarrer l'Ascension",
      metrics: [
        { label: "Performance", val: "Optimisation < 100ms" },
        { label: "Architecture", val: "Systèmes Distribués" },
        { label: "Design", val: "Expérience Immersive" }
      ]
    },
    contactSection: {
      title: "Parlons",
      subtitle: "Futur",
      description: "Vous avez l'ambition, j'ai l'architecture. Connectons nos intelligences pour bâtir l'exceptionnel.",
      emailLabel: "Email Direct",
      locationLabel: "Base Opérationnelle",
      scopeTitle: "Scope d'Intervention",
      scopeItems: ["Audit Structurel", "Développement Full-Stack", "Déploiement Scalable", "UI/UX Design"]
    },
    bento: {
      journey: { title: "Le Parcours", content: "Plus de 5 ans à transformer des idées complexes en architectures logicielles élégantes." },
      education: { title: "Formation", content: "Master en Architecture des Systèmes d'Information." },
      vision: { title: "Ma Vision", content: "L'ingénierie n'est pas seulement du code, c'est l'art de construire des structures pérennes." },
      location: { title: "Localisation", content: "Opérant depuis Bobo-Dioulasso, Burkina Faso, avec une portée d'intervention internationale." }
    },
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
      passwordUpdated: "Mot de passe mis à jour.",
      resetConfirm: "Réinitialiser les statistiques ? Cette action est irréversible.",
      metricsReset: "Métriques réinitialisées.",
      resetFailed: "Échec de la réinitialisation."
    }
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
      recruit: "Recruitment"
    },
    header: {
      role: "Digital Architect"
    },
    hero: {
      badge: "Precision Engineering & Future Aesthetics",
      description: "Digital Architect specialized in designing monumental digital ecosystems.",
      primaryCTA: "Explore_Projects",
      secondaryCTA: "Consultation_Node",
      scroll: "Scroll_Initiate"
    },
    about: {
      titleMain: "Heritage",
      titleSub: "Architectural",
      quote: "Designing code as one erects a structure, with pure intention and mathematical execution.",
      description: "My approach transcends simple web development. I build digital ecosystems where every pixel and every line of code are the bricks of a monumental user experience.",
      yearsXP: "Years XP",
      focus: "Focus on Architecture"
    },
    recruit: {
      title: "Recruitment Protocol",
      accessLevel: "Access_Level: Professional_Collaboration",
      name: "Identity",
      email: "Email Channel",
      phone: "Phone Signal",
      cv: "File / CV (PDF)",
      company: "Organization",
      position: "Proposed Mission",
      projectType: "Nature",
      budget: "Est. Budget",
      timeline: "Timeline",
      message: "Strategic Details // Opportunity",
      submit: "Send Signal",
      placeholders: {
        name: "Your Name",
        email: "your@email.com",
        phone: "+XX ... (Opt.)",
        company: "Structure Name",
        position: "Job Title",
        message: "Describe the foundations of this synergy..."
      },
      options: {
        projectType: ["Collaboration", "Full-time/Part-time", "Freelance", "Audit", "Other"],
        budget: ["To be discussed", "< 5k€", "5k€ - 10k€", "10k€ - 20k€", "> 20k€"],
        timeline: ["Undefined", "Urgent (< 1 month)", "1 - 3 months", "3 - 6 months", "Long term"]
      },
      analysisWait: "Analysis_Wait: 48h",
      secureProtocol: "Secure_Protocol",
      init: "Initializing...",
      selectFile: "Select a file...",
      toast: {
        requiredTitle: "Fields Required",
        requiredDesc: "Please complete basic information.",
        signalReceivedTitle: "Signal Received",
        signalReceivedDesc: "Your proposal has been successfully transmitted via secure protocol.",
        signalInterruptedTitle: "Signal Interrupted",
        signalInterruptedDesc: "Transmission failed.",
        systemErrorTitle: "System Error",
        systemErrorDesc: "Connection to transmission service lost."
      }
    },
    contact: {
      title: "Transmission Finalized",
      successMessage: "Your proposal has been injected into the system. A strategic iteration will be generated shortly.",
      newSignal: "New Signal",
      name: "Structure / Identity",
      email: "Communication Channel",
      message: "Vision_Architecture // Brief",
      submit: "Initiate Transmission",
      placeholders: {
        name: "Your Full Name",
        email: "your@email.com",
        message: "Describe the foundations of your project..."
      },
      sending: "Calculating..."
    },
    projects: {
      category: "Development",
      explore: "Explore Project",
      badge: "Portfolio",
      title: "Signature",
      subtitle: "Creations",
      description: "A collection of projects where engineering meets art. Explore my most recent creations.",
      all: "All",
      list: [
        {
          id: 'mind-graphix-solution',
          title: "Mind Graphix Solution",
          category: "Website",
          description: "Digital agency creating custom websites and mobile applications.",
          tools: ["Next.js", "TailwindCSS", "Framer Motion"],
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          year: 2026,
          role: "Fullstack Dev / Project Manager"
        },
        {
          id: "gourmet-digital",
          title: "Le Gourmet Digital",
          category: "Website",
          description: "Immersive digital culinary experience with real-time table reservation and visual interactive menus.",
          tools: ["React", "Framer Motion", "Supabase"],
          image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
          year: 2025,
          role: "Lead Frontend Developer"
        },
        {
          id: "pharmaconnect",
          title: "PharmaConnect 24/7",
          category: "Application",
          description: "Revolutionary e-health platform connecting patients and pharmacies for express delivery and secure advice.",
          tools: ["React Native", "Node.js", "MongoDB"],
          image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80",
          year: 2025,
          role: "Fullstack Engineer"
        },
        {
          id: "autotech-diagnostics",
          title: "AutoTech Manager",
          category: "Application",
          description: "SaaS solution for modern garages: predictive diagnostics via OBD-II, fleet management and automated client CRM.",
          tools: ["Vue.js", "Firebase", "Python"],
          image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80",
          year: 2024,
          role: "System Architect"
        },
        {
          id: "prestige-rentals",
          title: "Prestige Mobility",
          category: "Website",
          description: "Premium vehicle rental agency with AI identity verification and secure crypto payments.",
          tools: ["Next.js", "Solidity", "Stripe"],
          image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
          year: 2024,
          role: "Lead Developer"
        },
        {
          id: "ecosmart-home",
          title: "EcoSmart Neural Home",
          category: "IoT / AI",
          description: "Autonomous home automation system optimizing energy consumption via deep learning algorithms.",
          tools: ["Python", "TensorFlow", "React"],
          image: "https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&w=800&q=80",
          year: 2026,
          role: "AI Engineer"
        }
      ]
    },
    skills: {
      explore: "Explore",
      badge: "Mastered Technologies",
      title: "Arsenal",
      subtitle: "Tech",
      list: [
        { name: "Photoshop", description: "Complete mastery of the software. Photo retouching, composition, advanced effects and creation of professional visuals for web and print.", expertise: "Expert", level: 95, icon: "Palette", color: { from: "from-indigo-500", to: "to-indigo-600", accent: "indigo" } },
        { name: "Illustrator", description: "Vector graphic design, logo creation, original illustrations and brand design with high technical precision.", expertise: "Expert", level: 90, icon: "PenTool", color: { from: "from-violet-500", to: "to-violet-600", accent: "violet" } },
        { name: "HTML", description: "Optimal semantic structuring, Web accessibility (WCAG), and modern best practices for a solid and performant foundation.", expertise: "Expert", level: 98, icon: "Globe", color: { from: "from-orange-500", to: "to-orange-600", accent: "orange" } },
        { name: "CSS", description: "Advanced styling, modern layouts (Flexbox, Grid), fluid animations, responsive design and TailwindCSS for magnificent interfaces.", expertise: "Expert", level: 95, icon: "Layout", color: { from: "from-blue-500", to: "to-blue-600", accent: "blue" } },
        { name: "JavaScript", description: "Functional and object-oriented programming, DOM manipulation, modern APIs and client-side performance optimization.", expertise: "Expert", level: 92, icon: "Terminal", color: { from: "from-yellow-500", to: "to-yellow-600", accent: "yellow" } },
        { name: "Python", description: "Robust backend development, automation scripts, data analysis and third-party API integration for complete applications.", expertise: "Advanced", level: 85, icon: "Server", color: { from: "from-green-500", to: "to-green-600", accent: "green" } },
        { name: "React", description: "Reusable component architecture, advanced state management, custom hooks and rendering optimization for maximum performance.", expertise: "Expert", level: 90, icon: "Atom", color: { from: "from-cyan-500", to: "to-cyan-600", accent: "cyan" } },
        { name: "AI", description: "Design and integration of AI models for automation, natural language processing, and recommendation systems.", expertise: "Advanced", level: 80, icon: "Brain", color: { from: "from-emerald-500", to: "to-emerald-600", accent: "emerald" } },
        { name: "SQL", description: "Optimized queries, database design, complex joins and performant data management for scalable applications.", expertise: "Advanced", level: 85, icon: "Database", color: { from: "from-pink-500", to: "to-pink-600", accent: "pink" } },
        { name: "TypeScript", description: "Strict typing for robust and maintainable code, complex interfaces, generics and advanced tooling to prevent errors.", expertise: "Expert", level: 90, icon: "Shield", color: { from: "from-fuchsia-500", to: "to-fuchsia-600", accent: "fuchsia" } }
      ]
    },
    experience: {
      badge: "Timeline",
      title: "Journey",
      subtitle: "Pro",
      description: "Constant progression in software engineering, marked by technical challenges and major achievements.",
      status: "Status: Available for Premium_Projects",
      items: [
        {
          year: "2022 - Present",
          role: "Senior Software Architect",
          company: "Freelance / Consultant",
          desc: "Deep expertise in microservices architecture and cloud-native deployment."
        },
        {
          year: "2019 - 2022",
          role: "Lead Developer Full-Stack",
          company: "Digital Agency",
          desc: "Technical direction of major projects for international clients."
        },
        {
          year: "2017 - 2019",
          role: "UI/UX Designer & Dev",
          company: "Startup Studio",
          desc: "Design of innovative interfaces and high-performance front-end development."
        }
      ]
    },
    testimonials: {
      badge: "Testimonials",
      title: "Echoes of",
      subtitle: "Trust",
      description: "What industry leaders and technology partners say about our collaboration."
    },
    impact: {
      title: "Impact",
      subtitle: "Monumental",
      labTitle: "R&D Lab",
      labDesc: "Exploration of applied technical concepts. Innovative solutions for real problems.",
      labButton: "Explore the Lab",
      rnd: [
        { title: "Web Optimization", tag: "Performance", desc: "Advanced loading and rendering techniques for maximum speed." },
        { title: "API Security", tag: "Backend", desc: "Robust architecture and sensitive data protection." },
        { title: "Reactive Interfaces", tag: "UX/UI", desc: "Adaptive design for a fluid user experience on all screens." }
      ],
      stats: [
        { label: "Concrete Expertise", value: "3 Years", desc: "Field experience and complex problem solving." },
        { label: "Delivered Projects", value: "20+", desc: "Digital solutions deployed and functional." },
        { label: "Satisfaction", value: "100%", desc: "Total commitment to the success of each mission." }
      ]
    },
    appointment: {
      title: "Consultation",
      titleHighlight: "Strategic",
      description: "Book a slot to discuss your vision. No commitment, 100% value focus.",
      scheduler: {
        title: "Strategic Consultation",
        description: "Book a slot to discuss your vision and transform your ideas into digital reality.",
        duration: "30 - 60 Minutes",
        platform: "Google Meet / Zoom",
        step: "Step",
        of: "of",
        chooseDate: "Choose a date & time",
        availableSlots: "Available slots for",
        next: "Next",
        detailsTitle: "Your Details",
        nameLabel: "Full Name",
        namePlaceholder: "John Doe",
        emailLabel: "Professional Email",
        emailPlaceholder: "john@company.com",
        topicLabel: "Consultation Topic",
        topicPlaceholder: "Briefly describe your project or needs...",
        back: "Back",
        confirm: "Confirm Appointment",
        successTitle: "Request Sent!",
        successMessage: "Your appointment request for {date} at {time} has been recorded. I will confirm this slot very quickly by email.",
        returnHome: "Return to Home",
        toast: {
          confirmed: "Appointment confirmed!",
          confirmedDesc: "You will receive a confirmation email shortly.",
          error: "Error",
          errorDesc: "Unable to book appointment. Please try again.",
          required: "Required fields",
          requiredDesc: "Please complete all fields."
        }
      }
    },
    footer: {
      invalidEmailTitle: "Invalid Email",
      invalidEmailDesc: "Please enter a valid email.",
      successTitle: "Success",
      successDesc: "Thanks! You are subscribed to the newsletter.",
      errorTitle: "Error",
      errorDesc: "An error occurred",
      subscribeErrorTitle: "Error",
      subscribeErrorDesc: "Unable to subscribe. Please try again.",
      description: "Software Designer & UI/UX Architect. Specialized in creating monumental and scalable digital structures.",
      subscribeText: "Subscribe to receive study reports and system innovations.",
      emailPlaceholder: "Email_ID",
      subscribeButton: "OK",
      rights: "Badior_Architecture",
      downloadCV: "Download_CV (PDF)",
      location: "Bobo-Dioulasso, Burkina Faso"
    },
    commandPalette: {
      placeholder: "Type a command or search...",
      noResults: "No results found.",
      navigation: "System Navigation",
      config: "System Configuration",
      mute: "Mute Sound",
      unmute: "Unmute Sound",
      social: "Network & Social",
      actions: "System Actions",
      admin: "Admin Mode"
    },
    floatingMetrics: {
      performance: "Performance",
      satisfaction: "Satisfaction",
      systemStatus: "System_Status: Optimal // Core_Initialized"
    },
    systemConsole: {
      activeNexus: "Active_Nexus",
      architecture: "Badior_Architecture",
      structuralIntegrity: "Structural_Integrity",
      coreStudio: "Core_Studio // Edition_2026",
      coordinates: "48.8566 N // 2.3522 E"
    },
    adminPanel: {
      cmsElite: "CMS Elite",
      commandPool: "Architectural Command Pool CC-V2"
    },
    seo: {
      title: "Digital Architect | Premium Portfolio",
      description: "High-performance digital experience design. Audit, Design, and Full-Stack Development.",
      keywords: "web developer, digital architect, react, typescript, premium design"
    },
    cta: {
      available: "Available for Projects",
      vision: "Your vision,",
      elevated: "Elevated to the Cube.",
      description: "I transform complex concepts into fluid, fast, and future-ready digital architectures.",
      button: "Start the Ascent",
      metrics: [
        { label: "Performance", val: "Optimization < 100ms" },
        { label: "Architecture", val: "Distributed Systems" },
        { label: "Design", val: "Immersive Experience" }
      ]
    },
    contactSection: {
      title: "Let's Talk",
      subtitle: "Future",
      description: "You have the ambition, I have the architecture. Let's connect our intelligences to build the exceptional.",
      emailLabel: "Direct Email",
      locationLabel: "Operational Base",
      scopeTitle: "Intervention Scope",
      scopeItems: ["Structural Audit", "Full-Stack Development", "Scalable Deployment", "UI/UX Design"]
    },
    bento: {
      journey: { title: "The Journey", content: "Over 5 years transforming complex ideas into elegant software architectures." },
      education: { title: "Education", content: "Master in Information Systems Architecture." },
      vision: { title: "My Vision", content: "Engineering is not just code, it is the art of building lasting structures." },
      location: { title: "Location", content: "Operating from Bobo-Dioulasso, Burkina Faso, with international intervention reach." }
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      passwordMismatch: "Passwords do not match.",
      passwordUpdated: "Password updated.",
      resetConfirm: "Reset statistics? This action is irreversible.",
      metricsReset: "Metrics reset.",
      resetFailed: "Reset failed."
    }
  }
};
