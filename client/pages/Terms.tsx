import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, FileText, Lock, Globe } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { cn } from "@/lib/utils";

export default function Terms() {
  const { t, language } = useLanguage();

  const sections = [
    {
      title: language === 'fr' ? "1. Préambule" : "1. Preamble",
      content: language === 'fr' 
        ? "Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles BADIOR OUATTARA (ci-après « l'Éditeur ») met à la disposition des utilisateurs (ci-après « l'Utilisateur ») le site internet accessible à l'adresse [URL DU SITE] (ci-après « le Site »)."
        : "These General Terms of Use (hereinafter \"GTU\") aim to define the terms and conditions under which BADIOR OUATTARA (hereinafter \"the Publisher\") makes the website accessible at [SITE URL] (hereinafter \"the Site\") available to users (hereinafter \"the User\")."
    },
    {
      title: language === 'fr' ? "2. Accès au site" : "2. Access to the Site",
      content: language === 'fr'
        ? "Le Site est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au Site, que ce soient les frais matériels, logiciels ou d'accès à internet sont exclusivement à la charge de l'utilisateur. Il est seul responsable du bon fonctionnement de son équipement informatique ainsi que de son accès à internet."
        : "The Site is accessible free of charge to any User with internet access. All costs related to accessing the Site, whether hardware, software or internet access costs, are exclusively the responsibility of the user. He is solely responsible for the proper functioning of his computer equipment and his internet access."
    },
    {
      title: language === 'fr' ? "3. Propriété intellectuelle" : "3. Intellectual Property",
      content: language === 'fr'
        ? "La structure générale du Site, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété de l'Éditeur ou de ses partenaires. Toute représentation et/ou reproduction et/ou exploitation partielle ou totale des contenus et services proposés par le Site, par quelque procédé que ce soit, sans l'autorisation préalable et par écrit de l'Éditeur et/ou de ses partenaires est strictement interdite et serait susceptible de constituer une contrefaçon au sens des articles L 335-2 et suivants du Code de la propriété intellectuelle."
        : "The general structure of the Site, as well as the texts, graphics, images, sounds and videos composing it, are the property of the Publisher or its partners. Any representation and/or reproduction and/or partial or total exploitation of the contents and services proposed by the Site, by any process whatsoever, without the prior written authorization of the Publisher and/or its partners is strictly prohibited and could constitute an infringement within the meaning of articles L 335-2 and following of the Intellectual Property Code."
    },
    {
      title: language === 'fr' ? "4. Données personnelles" : "4. Personal Data",
      content: language === 'fr'
        ? "Dans une logique de respect de la vie privée de ses Utilisateurs, l'Éditeur s'engage à ce que la collecte et le traitement d'informations personnelles, effectués au sein du présent site, soient effectués conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, dite Loi « Informatique et Libertés »."
        : "In a logic of respect for the privacy of its Users, the Publisher undertakes that the collection and processing of personal information, carried out within this site, are carried out in accordance with Law No. 78-17 of January 6, 1978 relating to data processing, files and freedoms, known as the \"Data Processing and Freedoms\" Law."
    },
    {
      title: language === 'fr' ? "5. Responsabilité" : "5. Liability",
      content: language === 'fr'
        ? "Les informations et/ou documents figurant sur ce Site et/ou accessibles par ce Site proviennent de sources considérées comme étant fiables. Toutefois, ces informations et/ou documents sont susceptibles de contenir des inexactitudes techniques et des erreurs typographiques. L'Éditeur se réserve le droit de les corriger, dès que ces erreurs sont portées à sa connaissance."
        : "The information and/or documents appearing on this Site and/or accessible through this Site come from sources considered to be reliable. However, such information and/or documents may contain technical inaccuracies and typographical errors. The Publisher reserves the right to correct them as soon as these errors are brought to its attention."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
      <Header onOpenRecruit={() => {}} />
      
      <main className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Grid */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none -z-10" />

        <div className="container max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-6 border border-primary/20 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              {language === 'fr' ? "Conditions d'Utilisation" : "Terms of Use"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              {language === 'fr' 
                ? "Dernière mise à jour : 20 Février 2026. Veuillez lire attentivement ces conditions avant d'utiliser nos services."
                : "Last updated: February 20, 2026. Please read these terms carefully before using our services."}
            </p>
          </motion.div>

          <div className="grid gap-8">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-secondary/30 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/5" />
                <div className="p-8 rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/20 transition-colors">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3 text-primary">
                    <span className="w-1.5 h-6 bg-primary rounded-full inline-block" />
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-justify">
                    {section.content}
                  </p>
                </div>
              </motion.section>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center"
          >
            <Lock className="w-6 h-6 text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              {language === 'fr' 
                ? "Pour toute question concernant ces conditions, veuillez nous contacter via le formulaire de contact."
                : "For any questions regarding these terms, please contact us via the contact form."}
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
