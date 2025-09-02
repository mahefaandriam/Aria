# 🎨 Aria Creative - Site Web Complet avec Backend

Site web moderne et professionnel pour Aria Creative avec backend Node.js/Express et base de données PostgreSQL.

## 🚀 Stack Technique

### Frontend
- **React 18** + TypeScript
- **Vite** pour le build
- **Tailwind CSS** + Shadcn/ui
- **React Router** pour la navigation
- **Framer Motion** pour les animations

### Backend  
- **Node.js** + Express
- **PostgreSQL** avec Prisma ORM
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **Nodemailer** pour l'envoi d'emails

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn
- Compte email (Gmail recommandé)

## 🛠️ Installation Rapide

### 1. Cloner et installer
```bash
git clone <repo-url>
cd aria-creative
npm install
cd backend && npm install && cd ..
```

### 2. Configuration de la base de données avec Neon

**🎯 Option A: Neon Database (Recommandé)**
1. Aller sur [Neon.tech](https://neon.tech) et se connecter avec GitHub
2. Créer un nouveau projet `aria-creative`
3. Connecter votre repo GitHub dans les intégrations
4. Copier l'URL de connexion PostgreSQL

**📋 Option B: PostgreSQL local**
```bash
# Si vous préférez une installation locale
sudo apt update && sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb aria_creative
```

### 3. Configuration des variables d'environnement

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend (backend/.env)**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=votre-clé-secrète-très-longue-et-complexe
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application
ADMIN_EMAIL=admin@aria-creative.com
ADMIN_PASSWORD=admin123

# 🎯 Neon Database (remplacer par votre URL Neon)
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/aria_creative?sslmode=require"

# 📋 OU PostgreSQL local
# DATABASE_URL="postgresql://aria_user:secure_password@localhost:5432/aria_creative?schema=public"
```

### 4. Initialiser la base de données

**🎯 Avec Neon (production-ready)**
```bash
cd backend
npx prisma generate
npx prisma migrate deploy  # Pour Neon
npm run db:seed
cd ..
```

**📋 Avec PostgreSQL local (développement)**
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init  # Pour local
npm run db:seed
cd ..
```

### 5. Démarrer l'application

**Option 1 : Script automatique**
```bash
./start-dev.sh
```

**Option 2 : Manuel**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

## 🌐 URLs d'accès

- **Site web** : http://localhost:5173
- **API Backend** : http://localhost:3001/api
- **Admin Dashboard** : http://localhost:5173/admin

## 🔐 Authentification Admin

- **Email** : admin@aria-creative.com
- **Mot de passe** : admin123

⚠️ **Changez ces identifiants en production !**

## 📚 Fonctionnalités

### 🎨 Frontend
- ✅ Page d'accueil avec animations
- ✅ Section À propos
- ✅ Portfolio/Réalisations dynamique
- ✅ Formulaire de contact avec envoi d'email
- ✅ Dashboard admin complet
- ✅ Authentification sécurisée
- ✅ Gestion des projets CRUD
- ✅ Upload d'images
- ✅ Design responsive

### ⚙️ Backend API
- ✅ **Contact** - Envoi d'emails automatique
- ✅ **Auth** - JWT, login/logout sécurisé
- ✅ **Projets** - CRUD complet avec statuts
- ✅ **Upload** - Gestion des images
- ✅ **Sécurité** - Rate limiting, validation
- ✅ **Base de données** - PostgreSQL avec Prisma

## 📁 Structure du Projet

```
aria-creative/
├── src/                    # Frontend React
│   ├── components/         # Composants UI
│   ├── services/          # Services API
│   ├── hooks/             # Hooks personnalisés
│   ├── pages/             # Pages/Routes
│   └── styles/            # Styles CSS
├── backend/               # Backend Node.js
│   ├── routes/            # Routes API
│   ├── lib/               # Utilitaires
│   ├── prisma/            # Schéma BDD et migrations
│   ├── uploads/           # Fichiers uploadés
│   └── data/              # Stockage temporaire
├── public/                # Assets statiques
└── docs/                  # Documentation
```

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm run preview      # Preview du build
npm run lint         # Linting
```

### Backend
```bash
npm run dev          # Démarrage développement
npm start            # Démarrage production
npm run db:generate  # Générer client Prisma
npm run db:migrate   # Migrations BDD
npm run db:seed      # Seeding données
npm run db:studio    # Interface Prisma Studio
```

## 🚀 Déploiement

### 1. Préparation
```bash
# Build frontend
npm run build

# Préparer backend
cd backend
npm run db:generate
```

### 2. Variables d'environnement production

**Important** : Changez ces valeurs :
- `JWT_SECRET` : Clé secrète forte
- `ADMIN_PASSWORD` : Mot de passe sécurisé  
- `DATABASE_URL` : URL de production
- Identifiants email réels

### 3. Plateformes recommandées

**Frontend** : Vercel, Netlify, GitHub Pages
**Backend** : Railway, Render, DigitalOcean
**Base de données** : Neon, Supabase, AWS RDS

## 📧 Configuration Email (Gmail)

1. Activer l'authentification à 2 facteurs
2. Générer un mot de passe d'application :
   - Compte Google → Sécurité → Mots de passe d'application
3. Utiliser ce mot de passe dans `EMAIL_PASS`

## 🎯 Utilisation

### 👤 Côté Client
1. Visiter le site web
2. Parcourir les réalisations
3. Envoyer un message via le formulaire
4. Recevoir une confirmation par email

### 🔧 Côté Admin
1. Se connecter sur `/admin`
2. Gérer les projets (CRUD)
3. Uploader des images
4. Voir les messages clients
5. Publier/dépublier des projets

### 📊 Workflow Projets
1. Créer un projet (statut "En attente")
2. Développer (statut "En cours")  
3. Terminer et publier (statut "Terminé")
4. Apparition automatique sur le site public

## 🔍 API Documentation

### Endpoints principaux

| Route | Méthode | Description | Auth |
|-------|---------|-------------|------|
| `/api/contact` | POST | Envoyer message | ❌ |
| `/api/admin/login` | POST | Connexion admin | ❌ |
| `/api/projects` | GET | Projets publics | ❌ |
| `/api/projects/admin` | GET | Tous les projets | ✅ |
| `/api/projects` | POST | Créer projet | ✅ |
| `/api/upload/image` | POST | Upload image | ✅ |

### Authentification
```javascript
// Headers requis
Authorization: Bearer <jwt_token>
```

## 🐛 Résolution de Problèmes

### Backend ne démarre pas
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Vérifier les variables d'environnement
cat backend/.env

# Réinitialiser la BDD
cd backend && npm run db:reset
```

### Erreur d'email
- Vérifier les identifiants Gmail
- Utiliser un mot de passe d'application
- Tester avec `/api/contact/test`

### Erreur de build
```bash
# Nettoyer les caches
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
npm install
cd backend && npm install
```

## 🔄 Évolutions Futures

- [ ] Tests automatisés (Jest/Vitest)
- [ ] CI/CD avec GitHub Actions
- [ ] Monitoring avec Sentry
- [ ] Cache Redis
- [ ] WebSockets pour temps réel
- [ ] API versioning
- [ ] Documentation OpenAPI
- [ ] Backup automatique BDD

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs : `tail -f backend.log frontend.log`
2. Tester l'API : `curl http://localhost:3001/api/health`
3. Consulter cette documentation
4. Ouvrir une issue GitHub

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Aria Creative** - Développé avec ❤️ par l'équipe Aria Creative

🌟 **Star le projet si il vous a été utile !**
