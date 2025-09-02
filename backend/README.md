# Backend Aria Creative

Backend API pour le site web Aria Creative, construit avec Node.js et Express.

## 🚀 Fonctionnalités

- **API de contact** - Envoi d'emails avec confirmation
- **Authentification admin** - JWT avec protection des routes
- **Gestion des projets** - CRUD complet pour les projets
- **Upload de fichiers** - Gestion des images avec validation
- **Sécurité** - Rate limiting, validation, helmet
- **Storage** - Système de fichiers JSON (facilement extensible)

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte email (Gmail recommandé) pour l'envoi de messages

## 🛠️ Installation

### Installation automatique
```bash
cd backend
node start.js
```

### Installation manuelle
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables dans .env
npm run dev
```

## ⚙️ Configuration

Créer un fichier `.env` basé sur `.env.example` :

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=votre-clé-secrète-très-longue-et-complexe

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application

# Admin
ADMIN_EMAIL=admin@aria-creative.com
ADMIN_PASSWORD=motdepasse123
```

### Configuration Gmail

1. Activer l'authentification à 2 facteurs
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `EMAIL_PASS`

## 🚦 Démarrage

```bash
# Développement
npm run dev

# Production
npm start

# Avec le script de démarrage
node start.js
```

Le serveur sera disponible sur `http://localhost:3001`

## 📚 API Endpoints

### Contact

- `POST /api/contact` - Envoyer un message de contact
- `GET /api/contact/test` - Tester la configuration email

### Admin

- `POST /api/admin/login` - Connexion admin
- `POST /api/admin/verify` - Vérifier le token
- `POST /api/admin/refresh` - Renouveler le token
- `POST /api/admin/logout` - Déconnexion
- `GET /api/admin/profile` - Profil admin

### Projets

- `GET /api/projects` - Liste des projets publics (terminés)
- `GET /api/projects/admin` - Liste complète (admin)
- `GET /api/projects/:id` - Détail d'un projet
- `POST /api/projects` - Créer un projet (admin)
- `PUT /api/projects/:id` - Modifier un projet (admin)
- `DELETE /api/projects/:id` - Supprimer un projet (admin)
- `POST /api/projects/:id/status` - Changer le statut (admin)

### Upload

- `POST /api/upload/image` - Upload d'une image (admin)
- `POST /api/upload/images` - Upload multiple (admin)
- `DELETE /api/upload/image/:filename` - Supprimer une image (admin)
- `GET /api/upload/images` - Lister les images (admin)
- `GET /api/upload/stats` - Statistiques des uploads (admin)

### Général

- `GET /api/health` - Statut du serveur

## ��� Authentification

Le système utilise JWT (JSON Web Tokens) pour l'authentification admin.

### Headers requis pour les routes protégées :
```
Authorization: Bearer <token>
```

### Identifiants par défaut :
- Email : `admin@aria-creative.com`
- Mot de passe : `admin123`

⚠️ **Changez ces identifiants en production !**

## 📁 Structure des fichiers

```
backend/
├── routes/           # Routes API
│   ├── admin.js      # Authentification admin
│   ├── contact.js    # Formulaire de contact
│   ├── projects.js   # Gestion des projets
│   └── upload.js     # Upload de fichiers
├── data/             # Stockage JSON
│   └── projects.json # Base de données des projets
├── uploads/          # Fichiers uploadés
│   └── projects/     # Images des projets
├── logs/             # Logs du serveur
├── server.js         # Serveur principal
├── start.js          # Script de démarrage
└── package.json      # Dépendances
```

## 🛡️ Sécurité

- **Rate limiting** - Limite les requêtes par IP
- **Helmet** - Headers de sécurité
- **CORS** - Configuration des origines autorisées
- **Validation** - Joi pour valider les données
- **JWT** - Tokens sécurisés pour l'admin
- **Upload sécurisé** - Validation des types de fichiers

## 📊 Monitoring

- Logs automatiques des actions importantes
- Endpoint de santé `/api/health`
- Statistiques des uploads

## 🔄 Évolutions possibles

- Migration vers MongoDB/PostgreSQL
- Système de cache (Redis)
- Logs structurés (Winston)
- Tests automatisés
- CI/CD avec GitHub Actions
- Monitoring avec Sentry
- Backup automatique

## 🐛 Résolution de problèmes

### Erreur d'envoi d'email
- Vérifiez la configuration Gmail
- Assurez-vous d'utiliser un mot de passe d'application
- Activez l'authentification à 2 facteurs

### Erreur de permissions
- Vérifiez les droits d'écriture sur les dossiers
- Le script `start.js` crée automatiquement les répertoires

### Erreur de token JWT
- Vérifiez que `JWT_SECRET` est défini
- Le token expire après 24h

## 📞 Support

Pour toute question ou problème :
- Vérifiez les logs du serveur
- Consultez les endpoints de test
- Contactez l'équipe de développement

---

**Aria Creative Backend** - Développé avec ❤️ par l'équipe Aria Creative
