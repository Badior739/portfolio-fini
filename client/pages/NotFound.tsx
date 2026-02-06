import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/site/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="stars-container">
            <div className="star tiny animate-twinkle" style={{ left: '20%', top: '30%' }} />
            <div className="star animate-twinkle" style={{ left: '80%', top: '20%' }} />
            <div className="star big animate-twinkle" style={{ left: '50%', top: '50%' }} />
          </div>
        </div>
        <div className="text-center z-10">
          <h1 className="text-8xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500 animate-pulse">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Perdu dans le cosmos ? Cette page est introuvable.
          </p>
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-white shadow-glow transition-all hover:scale-105">
            Retour sur Terre
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
