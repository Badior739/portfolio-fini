# Guide de Déploiement et Gestion (Vercel + Neon)

Ce guide explique comment déployer votre portfolio et gérer vos fichiers (images, CV) en utilisant la base de données PostgreSQL.

## 1. Architecture Simplifiée

- **Frontend & Backend** : Hébergés sur **Vercel** (Serverless).
- **Données & Fichiers** : Stockés sur **Neon** (PostgreSQL).
- **Emails** : Gérés via SMTP (Gmail, etc.).

Plus besoin de service S3 externe (AWS/Cloudflare) : tout est centralisé dans la base de données.

## 2. Configuration (Environment Variables)

Sur **Vercel** (Settings > Environment Variables) et dans votre fichier `.env` local :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL (Neon) | `postgresql://user:pass@...` |
| `STORAGE_TYPE` | **Important** : Mettre sur "db" | `db` |
| `JWT_SECRET` | Clé secrète pour la sécurité | `une_chaine_aleatoire_tres_longue` |
| `SMTP_HOST` | Serveur Email | `smtp.gmail.com` |
| `SMTP_USER` | Votre email | `mon.email@gmail.com` |
| `SMTP_PASS` | Mot de passe d'application | `abcd efgh ijkl mnop` |

## 3. Commandes Utiles

### A. Mettre à jour la Base de Données
Si vous modifiez le code (schéma), lancez cette commande pour mettre à jour la structure de la base de données en ligne :

```bash
npm run db:push
```

### B. Importer vos Données (Projets, Textes)
Pour envoyer vos données actuelles (`site-data.json`) vers la base de données en ligne :

```bash
npm run db:import
```

### C. Importer des Fichiers (Images, CV)
C'est la fonctionnalité que vous avez demandée. Vous pouvez envoyer des fichiers de votre ordinateur vers la base de données en ligne.

**Importer un seul fichier :**
```bash
npm run files:import ./public/mon-cv.pdf
```

**Importer tout un dossier :**
```bash
npm run files:import ./tmp/uploads
```

Une fois importés, ces fichiers seront accessibles via l'API et stockés de manière permanente dans la base de données.

## 4. Vérification du Déploiement

1. **Pousser sur GitHub** :
   ```bash
   git add .
   git commit -m "Finalisation déploiement DB"
   git push
   ```

2. **Vercel** :
   - Le déploiement se lancera automatiquement.
   - Vérifiez que les variables d'environnement sont bien configurées.
   - Si les images ne s'affichent pas, assurez-vous de les avoir importées via la commande `files:import`.

## 5. Résolution de problèmes courants

- **Erreur "Database not configured"** : Vérifiez que `DATABASE_URL` est correct dans Vercel.
- **Fichiers disparus** : Sur Vercel, les fichiers uploadés via l'interface admin disparaissent au redémarrage SI vous n'avez pas mis `STORAGE_TYPE="db"`.
- **Images trop lourdes** : Le stockage en base de données est pratique mais évitez les fichiers > 5MB pour ne pas ralentir le site.

---
*Généré par votre Assistant IA - 17 Février 2026*
