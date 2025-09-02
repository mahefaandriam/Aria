# 🚀 Système Aria Creative - Configuration et Utilisation

## ✅ Fonctionnalités Implémentées

### 🔧 Backend API
- ✅ **Base de données Prisma + PostgreSQL** avec Neon
- ✅ **Authentification JWT** pour l'admin
- ✅ **API CRUD complète** pour les projets
- ✅ **API de contact** avec envoi d'emails
- ✅ **Upload d'images** pour les projets
- ✅ **Validation des données** avec Joi
- ✅ **Rate limiting** et sécurité
- ✅ **Seed de données** par défaut

### 🎨 Frontend React
- ✅ **Dashboard admin moderne** avec authentification
- ✅ **CRUD complet des projets** avec interface intuitive
- ✅ **Changement de statut en temps réel**
- ✅ **Upload d'images** avec preview
- ✅ **Formulaire de contact** fonctionnel
- ✅ **Affichage des projets** depuis la base de données
- ✅ **Notifications de statut** de l'API
- ✅ **Interface responsive** et animations

## 🔑 Identifiants par Défaut

```
Email: admin@aria-creative.com
Mot de passe: admin123
```

⚠️ **Important**: Changez ces identifiants en production via les variables d'environnement.

## 🛠️ Installation et Démarrage

### 1. Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db seed
npm start
```

### 2. Frontend
```bash
npm install
npm run dev
```

## 📊 Test du Système

### Méthode 1: Interface Web
1. Ouvrez l'application frontend
2. Regardez l'indicateur de statut API (coin bas-droit)
3. Connectez-vous au dashboard admin
4. Testez la création/modification de projets

### Méthode 2: Console Développeur
```javascript
// Dans la console du navigateur
import { SystemTester } from '/src/utils/testServices.ts';
await SystemTester.runAndLog();
```

### Méthode 3: Login Admin
1. Allez sur `/admin`
2. Cliquez sur "🔍 Tester la connexion backend"
3. Utilisez les identifiants par défaut
4. Vérifiez le dashboard

## 🔄 Utilisation du Dashboard Admin

### Gestion des Projets
- **Créer**: Remplissez le formulaire de gauche
- **Modifier**: Cliquez sur "✏️ Modifier" sur un projet existant
- **Supprimer**: Cliquez sur "🗑 Supprimer" avec confirmation
- **Changer le statut**: Utilisez le dropdown sur chaque projet
- **Upload d'images**: Drag & drop ou sélection de fichiers

### Statuts des Projets
- **En attente**: Projet non démarré
- **En cours**: Projet en développement
- **Terminé**: Projet fini et **visible sur le site public**

### Messages Clients
- Les messages du formulaire de contact apparaissent dans l'onglet "Messages"
- Possibilité de répondre directement par email
- Marquer comme lu/traité

## 🌐 Endpoints API

### Publics
- `GET /api/health` - Status de l'API
- `GET /api/projects` - Projets publiés (status: TERMINE)
- `POST /api/contact` - Envoyer un message

### Admin (Authentification requise)
- `POST /api/admin/login` - Connexion
- `GET /api/projects/admin` - Tous les projets
- `POST /api/projects` - Créer un projet
- `PUT /api/projects/:id` - Modifier un projet
- `DELETE /api/projects/:id` - Supprimer un projet
- `POST /api/projects/:id/status` - Changer le statut

## 🔧 Configuration Email

Pour que l'envoi d'emails fonctionne, configurez ces variables dans `backend/.env`:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-app-password
ADMIN_EMAIL=admin@votre-domaine.com
```

## 🐛 Dépannage

### Backend non accessible
1. Vérifiez que le serveur est démarré (`npm start` dans `/backend`)
2. Vérifiez le port 3001
3. Regardez les logs du serveur

### Base de données
1. Vérifiez la `DATABASE_URL` dans `.env`
2. Exécutez `npx prisma db seed` pour les données par défaut
3. Testez avec `npx prisma studio`

### Authentification
1. Videz le localStorage: `localStorage.clear()`
2. Utilisez les identifiants par défaut
3. Vérifiez les variables d'environnement

### Projets non affichés
1. Vérifiez que les projets ont le statut "TERMINE"
2. Regardez la console développeur pour les erreurs API
3. Testez l'endpoint `/api/projects` directement

## 📱 Fonctionnalités Avancées

### Synchronisation Temps Réel
- Les projets se rechargent automatiquement toutes les 30s
- Le statut de l'API est vérifié périodiquement
- Les changements de statut sont instantanés

### Upload d'Images
- Formats supportés: JPG, PNG, GIF, WebP
- Taille max: 10MB
- Preview automatique
- Stockage sécurisé

### Validation des Données
- Validation côté client et serveur
- Messages d'erreur explicites
- Rate limiting pour éviter le spam

## 🚀 Déploiement

### Backend
1. Configurez les variables d'environnement production
2. Changez les identifiants admin par défaut
3. Configurez l'email de production
4. Déployez sur votre service préféré (Railway, Render, etc.)

### Frontend
1. Mettez à jour `VITE_API_URL` avec l'URL de production
2. Build: `npm run build`
3. Déployez le dossier `dist`

## 📞 Support

En cas de problème:
1. Vérifiez cette documentation
2. Regardez les logs du serveur
3. Utilisez l'utilitaire de test système
4. Vérifiez les variables d'environnement

---

✨ **Le système est maintenant entièrement fonctionnel avec une base de données réelle et une interface d'administration complète !**
