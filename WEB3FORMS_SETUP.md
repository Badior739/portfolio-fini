# Configuration Web3Forms pour le Formulaire de Contact

## 📋 Étapes à suivre :

### 1. **Créer un compte Web3Forms**
   - Allez sur https://web3forms.com
   - Cliquez sur "Sign Up" (c'est gratuit)
   - Entrez votre email : `ouattarabadiori5@gmail.com`

### 2. **Générer votre clé d'accès**
   - Après la création du compte, connectez-vous
   - Allez dans le dashboard
   - Trouvez votre **"Access Key"**
   - Copiez cette clé

### 3. **Configurer la clé dans le projet**
   - Ouvrez le fichier `.env.local` à la racine du projet
   - Remplacez `your_actual_access_key_here` par votre clé réelle
   - Exemple :
     ```
     VITE_WEB3FORMS_KEY=abc123def456xyz789...
     ```

### 4. **Vérifier la configuration**
   - Redémarrez le serveur de développement : `pnpm dev`
   - Testez le formulaire de contact
   - Les messages devraient arriver dans `ouattarabadiori5@gmail.com`

## 🔒 Sécurité

- Le fichier `.env.local` est dans `.gitignore` (ne sera pas commité)
- Votre clé reste privée et sécurisée
- Web3Forms gère l'infrastructure d'envoi d'email

## 🎨 Nouvelles fonctionnalités ajoutées

### Onglet "Mes Connaissances Professionnelles"
- **Section interactive** avec cartes animées
- **9 compétences** : Photoshop, Illustrator, HTML, CSS, JavaScript, Python, React, SQL, TypeScript
- **Animations fluides** :
  - Apparition progressive au chargement
  - Hover effects avec grossissement et rotation
  - Gradients animés
  - Effets de glow

### Formulaire de Contact
- **Intégration Web3Forms** (gratuit jusqu'à 500 envois/mois)
- Les messages sont envoyés directement à votre email
- **Pas besoin de serveur backend** pour l'envoi d'email
- Support du CORS automatique

## 📞 Support Web3Forms

Si vous avez des questions :
- Documentation : https://docs.web3forms.com
- Support : https://web3forms.com/support
