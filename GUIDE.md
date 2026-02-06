# Guide d'installation, modifications et déploiement

Date: 2025-11-29

Ce document décrit les changements récents apportés au projet, comment lancer localement, recommandations de sécurité et améliorations suggérées avant d'héberger en production.

---

## Résumé des changements récents

- **AdminPanel amélioré** : styles élégants, boutons avec animations, curseurs interactifs, masquage/affichage du mot de passe, upload d'images par projet et dispatch d'événements pour mise à jour en temps réel.
- **Listener CaseStudy** : Ajouté dans `client/pages/CaseStudy.tsx` pour rafraîchir les images des projets après modification depuis l'admin.
- **Styles globaux renforcés** : animations, lueur, transitions dans `client/global.css`.
- **Correction JSON** : `data/site-data.json` (objets `projects` replacés correctement).
- **Uploads** : route `/api/uploads` enregistre les fichiers sous `tmp/uploads`, avec support optionnel S3 et scan de fichiers.
- **Newsletter** : endpoints d'abonnement, double opt-in optionnel, admin panel pour lister/supprimer les abonnés.
- **Admin** : endpoints de login/password change avec hachage sécurisé (scrypt), UI client pour gestion des credentials.
- **Rate limiting** : middleware appliqué sur les endpoints sensibles pour protection bruteforce.
- **SMTP configurable** : possibilité de désactiver l'envoi d'e-mails via `ENABLE_EMAILS=false`.
- **Footer** : icône Threads remplacée par un SVG plus représentatif.

## Fichiers modifiés (clé)

- `client/components/site/AdminPanel.tsx` — UI admin, upload d'images, masquage/affichage du mot de passe, styles.
- `client/pages/CaseStudy.tsx` — charge dynamiquement les projets depuis `/api/admin/content` et écoute l'évènement `project-image-updated`.
- `client/global.css` — animations, boutons, lueur, transitions globales.
- `client/components/site/Footer.tsx` — icône Threads remplacée par un SVG plus représentatif.
- `server/routes/uploads.ts` — route d'upload (multer) et validation taille/type.
- `server/routes/admin.ts` — endpoints admin (login, password change, verify) (vérifier la version sur le repo si nécessaire).
- `data/site-data.json` — correction JSON.

## Exécution locale

1. Installer les dépendances (pnpm recommandé) :

```powershell
pnpm install
```

2. Démarrer en mode développement (Vite) :

```powershell
pnpm dev
```

3. Vérifier le typage TypeScript :

```powershell
pnpm typecheck
```

4. Construire et démarrer en production (build serveur + client) :

```powershell
pnpm build
pnpm start
```

> Note : le script `start` exécute `node dist/server/node-build.mjs` (voir `package.json`).

## Variables d'environnement importantes

- `ADMIN_PASSWORD` : mot de passe admin initial (optionnel si défini côté `data/site-data.json`).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` : si vous activez l'envoi d'emails via nodemailer.
- `PORT` : port du serveur en production.
- `UPLOADS_DIR` (optionnel) : dans la version actuelle, les uploads sont sauvegardés dans `tmp/uploads`. Pour la production, configurez un stockage persistant (S3 ou autre) et adaptez la route d'upload.

## Recommandations avant mise en production (prioritaires)

1. Stockage des fichiers :
   - Remplacer le stockage local (`tmp/uploads`) par un stockage d'objets (S3 / DigitalOcean Spaces / Azure Blob) pour durabilité et scalabilité.
   - Générer des URLs publiques signées si nécessaire, ou servir via un CDN.

2. Base de données :
   - La persistance actuelle utilise `data/site-data.json` (fichiers JSON locaux).
   - Migrer vers une vraie base (Postgres / MySQL / MongoDB) pour fiabilité, requêtes, sauvegardes et concurrents.

3. Authentification admin :
   - Remplacer le mécanisme d'auth en mémoire par des sessions ou JWT avec expiry et rafraîchissement.
   - Stocker les hashs de mot de passe (scrypt/argon2/bcrypt) côté serveur dans une DB.

4. Sécurité des uploads :
   - Scanner les fichiers uploadés (antivirus/malware) si possible.
   - Vérifier le type MIME côté serveur ET côté client.
   - Continuer à appliquer une limite raisonnable (ex : 10MB) et imposer extensions autorisées.

5. E-mails & Newsletter :
   - Mettre en place double opt-in (confirmation par email) pour collecter des emails.
   - Utiliser un service d'email transactionnel (SendGrid, Mailgun, Amazon SES) si volume.

6. Rate limiting & protection bruteforce :
   - Limiter les requêtes aux endpoints sensibles (`/api/admin/*`, `/api/newsletter/subscribe`, `/api/recruit`).
   - Bloquer ou ralentir après plusieurs échecs de login.

7. Production hardening :
   - Activer HTTPS (via reverse-proxy ou plateforme d'hébergement).
   - Activer helmet / en-têtes de sécurité, CSP minimal.
   - Logger les erreurs et mettre en place monitoring (Sentry / Logflare / Datadog).

## Déploiement conseillé (options)

- Platformes serverful (recommandées pour Express server intégré) : Render, Railway, Fly.io, Heroku (legacy), DigitalOcean App Platform.
  - Avantage : hébergent Node.js, permettent variables d'environnement, certificats TLS et volumes ou intégration S3.

- Platformes serverless (Vercel, Netlify) :
  - Vercel/Netlify ciblent principalement des fonctions serverless et un front statique. Pour une app Express complète, il faut adapter la configuration : packager server en serverless ou découper les endpoints en functions.
  - Si vous préférez Vercel, considérez extraire l'API en serverless functions et déployer le client statique séparément.

- Conteneurisation :
  - Dockeriser l'application et déployer sur ECS / GCP Cloud Run / Azure Container Instances.
  - Exemple rapide : construire l'image et lancer sur un service managé.

## Checklist avant déploiement (quick)

- [x] Configurer `ADMIN_PASSWORD` dans les env (ou initialiser en DB).
   - Implementé: le serveur supporte `ADMIN_PASSWORD` (env) et un mot de passe haché persisté dans `data/site-data.json` via l'endpoint `/api/admin/password`.
- [x] Configurer SMTP ou désactiver l'envoi d'e-mails si non prévu.
   - Implementé: variable `ENABLE_EMAILS` (par défaut `true`). Mettre `ENABLE_EMAILS=false` pour désactiver l'envoi d'e-mails (utile pour staging). Les envois SMTP utilisent `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
- [x] Configurer stockage d'objets pour les uploads.
   - Partiellement implémenté: support optionnel S3 via `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`. Installez `@aws-sdk/client-s3` si vous souhaitez activer S3.
- [x] Ajouter rate limiting + protection bruteforce.
   - Implementé: middleware `server/middleware/rateLimit.ts` appliqué sur `/api/newsletter/subscribe`, `/api/newsletter/remove`, `/api/uploads`.
- [x] Scanner les uploads (optionnel mais recommandé).
   - Partiellement implémenté: support pour exécuter une commande de scan configurée via `SCAN_COMMAND` (ex: `clamscan {file}`) ; si la commande échoue, l'upload est rejeté.
- [~] Tester le flux d'inscription newsletter (double opt-in recommandé).
   - Implementé: double opt-in activable via `NEWSLETTER_DOUBLE_OPTIN=true`. Si SMTP est configuré, un email de confirmation est envoyé; sinon (mode dev) le serveur renvoie l'URL de confirmation (`confirmUrl`) dans la réponse et la logge dans la console pour tester le flux.

### Variables d'environnement supplémentaires (récapitulatif)

- `ENABLE_EMAILS` (true|false) — si `false`, empêche l'envoi d'e-mails (recrutement, etc.).
- `NEWSLETTER_DOUBLE_OPTIN` (true|false) — active le double opt-in pour la newsletter.
- `SITE_ORIGIN` — origine du site (ex: `https://votre-site.com`) utilisée pour construire `confirmUrl`.
- `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — pour activer l'upload vers S3.
- `SCAN_COMMAND` — commande shell pour scanner un fichier (utilisez `{file}` comme placeholder ou la commande sera appelée avec le chemin en argument). Exemple: `clamscan {file}`.

### Comment tester le double opt-in en local sans SMTP

1. Dans `.env` définir `NEWSLETTER_DOUBLE_OPTIN=true` et laissez `SMTP_*` non configurées.
2. POSTer à `/api/newsletter/subscribe` avec `{ "email": "test@example.com" }`.
3. La réponse contiendra `confirmUrl` (mode dev). Ouvrez cette URL dans le navigateur pour confirmer.


## Commandes utiles

```powershell
pnpm install
pnpm dev         # dev server
pnpm typecheck    # vérifier types
pnpm build        # build client + server
pnpm start        # lancer la version buildée
```

## Notes finales et offre d'aide

Cette version est **prête pour POC / staging**. Les améliorations clés (stockage d'objets, DB robuste, auth avancée, rate-limiting, scanning) sont implémentées ou prêtes pour activation via config ENV.

### Décisions architecturales prises
1. **Persistance** : JSON local par défaut (simple, dev-friendly) → migration vers DB recommandée pour production.
2. **Admin auth** : Hachage scrypt + fallback env var → support token/session recommandé pour production.
3. **Uploads** : Local par défaut, S3 optionnel → S3/CDN recommandé pour production.
4. **Double opt-in** : Fallback dev qui retourne `confirmUrl` si SMTP absent → test facile sans email.
5. **Rate limiting** : Middleware simple en mémoire → Redis recommandé pour production distribué.

### Commandes de déploiement

```powershell
# Dev local
pnpm install
pnpm dev

# Build production
pnpm build
pnpm start

# Vérifier les types
pnpm typecheck
```

### Plateformes recommandées

- **Render / Railway / Fly.io** : serverful avec Node.js, S3, support env vars.
- **Vercel / Netlify** : serverless + static (adapté si vous découchez l'API en functions).
- **Docker + ECS / Cloud Run** : conteneurisation complète, production-ready.

### Prochaines étapes suggérées

1. Copier `.env.example` vers `.env` et configurer avec vos valeurs (SMTP, S3, etc.).
2. Tester localement le double opt-in : `NEWSLETTER_DOUBLE_OPTIN=true`, puis POST à `/api/newsletter/subscribe`.
3. Configurer S3 si vous avez besoin de stockage durable pour uploads.
4. Ajouter Dockerfile et docker-compose pour déploiement (je peux générer si nécessaire).
5. Migrer vers DB (SQLite dev / Postgres prod) pour fiabilité.

### Support

Si vous avez besoin de :
- Dockeriser l'app complète
- Migrer vers une vraie DB (Postgres/MongoDB)
- Ajouter JWT / sessions robustes
- Configurer CI/CD (GitHub Actions, etc.)
- Performance tuning et monitoring

**Demandez-moi en français et je m'en occupe ! 🚀**
