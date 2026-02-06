import React from "react";

export function SocialIcons({ className = "", size = 10 }: { className?: string; size?: number }) {
  const base = `inline-flex items-center justify-center rounded-full p-2 transition-transform transform hover:-translate-y-1 ${className} motion-safe:animate-float`;
  return (
    <div className="flex items-center gap-3">
      <a
        className={base + " bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md"}
        href="https://www.linkedin.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{width: size, height: size}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-14h4v2"/></svg>
      </a>

      <a
        className={base + " bg-black text-white shadow-md"}
        href="https://github.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{width: size, height: size}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 012.5-.34c.85 0 1.7.11 2.5.34 1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.41-.01 2.74 0 .26.18.58.69.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z"/></svg>
      </a>

      <a
        className={base + " bg-sky-500 text-white shadow-md"}
        href="https://twitter.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="Twitter"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{width: size, height: size}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
      </a>

      <a
        className={base + " bg-gradient-to-br from-pink-500 to-yellow-400 text-white shadow-md"}
        href="https://www.instagram.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{width: size, height: size}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><path d="M17.5 6.5h.01"/></svg>
      </a>
    </div>
  );
}
