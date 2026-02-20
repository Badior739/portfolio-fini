import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
}

export function SEOMetadata({ 
  title, 
  description,
  image = "/og-image.jpg",
  keywords
}: SEOProps) {
  const { t } = useLanguage();
  const location = useLocation();
  const fullUrl = `${window.location.origin}${location.pathname}`;

  const finalTitle = title || t('seo.title');
  const finalDescription = description || t('seo.description');
  const finalKeywords = keywords || t('seo.keywords');

  useEffect(() => {
    // Update Title
    document.title = finalTitle;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(name.startsWith("og:") || name.startsWith("twitter:") ? "property" : "name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard Meta
    updateMeta("description", finalDescription);
    updateMeta("keywords", finalKeywords);

    // Open Graph / Facebook
    updateMeta("og:type", "website");
    updateMeta("og:url", fullUrl);
    updateMeta("og:title", finalTitle);
    updateMeta("og:description", finalDescription);
    updateMeta("og:image", image);

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:url", fullUrl);
    updateMeta("twitter:title", finalTitle);
    updateMeta("twitter:description", finalDescription);
    updateMeta("twitter:image", image);

  }, [finalTitle, finalDescription, image, finalKeywords, fullUrl]);

  return null;
}
