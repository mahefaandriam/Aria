# 🚀 Configuration Neon Database

Guide pour configurer votre base de données PostgreSQL avec Neon et connecter votre repo GitHub.

## 📝 Étapes à suivre

### 1. 🎯 Créer votre base de données Neon

1. **Aller sur [Neon.tech](https://neon.tech)**
2. **Se connecter** avec votre compte GitHub
3. **Créer un nouveau projet** :
   - Nom : `aria-creative`
   - Région : Choisir la plus proche de vos utilisateurs
   - PostgreSQL version : 15 (recommandé)

### 2. 🔗 Connecter votre repo GitHub

1. Dans votre dashboard Neon, aller dans **Settings** → **Integrations**
2. **Connecter GitHub** et autoriser l'accès
3. **Sélectionner votre repo** aria-creative
4. Configurer les **branches** :
   - `main` → Base de production
   - `dev` → Base de développement (optionnel)

### 3. 📋 Récupérer l'URL de connexion

1. Dans votre projet Neon, aller dans **Dashboard**
2. **Copier la connection string** qui ressemble à :
```
postgresql://username:password@ep-xxx.neon.tech/aria_creative?sslmode=require
```

### 4. ⚙️ Configuration du backend

**Modifier `backend/.env`** :
```env
# Remplacer DATABASE_URL par votre URL Neon
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/aria_creative?sslmode=require"

# Autres variables (garder les mêmes)
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=votre-clé-secrète-très-longue-et-complexe
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application
ADMIN_EMAIL=admin@aria-creative.com
ADMIN_PASSWORD=admin123
```

### 5. 🚀 Initialiser la base de données

```bash
# Aller dans le dossier backend
cd backend

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Seeder les données par défaut
npm run db:seed

# Vérifier avec Prisma Studio (optionnel)
npx prisma studio
```

### 6. ✅ Tester la connexion

```bash
# Démarrer le backend
npm run dev

# Tester l'API
curl http://localhost:3001/api/health
```

## 🎯 Avantages de Neon

✅ **Serverless** - Pas de serveur à gérer  
✅ **Autoscaling** - S'adapte à la charge  
✅ **Branching** - Base de données par branche Git  
✅ **Backups automatiques** - Sauvegarde continue  
✅ **Intégration GitHub** - Déploiement automatique  
✅ **Plan gratuit** - Parfait pour le développement  

## 🔧 Variables d'environnement pour production

**Pour le déploiement** (Vercel, Netlify, etc.) :

```env
# Production
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/aria_creative?sslmode=require"
NODE_ENV=production
JWT_SECRET=clé-secrète-production-très-longue
ADMIN_PASSWORD=mot-de-passe-sécurisé-production
```

## 🐛 Résolution de problèmes

### Erreur de connexion SSL
```bash
# Ajouter ?sslmode=require à la fin de l'URL
DATABASE_URL="...?sslmode=require"
```

### Erreur Prisma
```bash
# Régénérer le client
npx prisma generate

# Réappliquer les migrations
npx prisma migrate reset
```

### Tester la connexion
```bash
# Depuis le dossier backend
npx prisma studio
```

## 📱 Monitoring avec Neon

1. **Dashboard Neon** - Métriques en temps réel
2. **Logs SQL** - Requêtes et performances  
3. **Alertes** - Notifications automatiques
4. **Metrics** - CPU, mémoire, connexions

---

🎉 **Une fois configuré, votre base Neon sera synchronisée avec votre repo GitHub !**
