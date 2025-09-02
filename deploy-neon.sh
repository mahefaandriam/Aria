#!/bin/bash

# Script de déploiement avec Neon Database
# À exécuter après avoir configuré votre base Neon

echo "🚀 Déploiement avec Neon Database..."
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "backend/package.json" ]; then
    echo -e "${RED}❌ Erreur: Exécutez ce script depuis la racine du projet${NC}"
    exit 1
fi

# Vérifier que DATABASE_URL est configuré
cd backend
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Fichier backend/.env manquant${NC}"
    echo -e "${YELLOW}💡 Copiez backend/.env.example vers backend/.env et configurez DATABASE_URL${NC}"
    exit 1
fi

# Vérifier DATABASE_URL
if ! grep -q "neon.tech" .env; then
    echo -e "${YELLOW}⚠️  Attention: DATABASE_URL ne semble pas être une URL Neon${NC}"
    echo -e "${BLUE}Assurez-vous que DATABASE_URL contient votre URL Neon dans backend/.env${NC}"
    read -p "Continuer quand même ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}📦 Installation des dépendances backend...${NC}"
npm install

echo -e "${BLUE}🔧 Génération du client Prisma...${NC}"
npx prisma generate

echo -e "${BLUE}🗄️ Application des migrations sur Neon...${NC}"
npx prisma migrate deploy

echo -e "${BLUE}🌱 Seeding des données initiales...${NC}"
npm run db:seed

echo -e "${BLUE}✅ Test de connexion à Neon...${NC}"
if npx prisma db pull --preview-feature > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connexion à Neon réussie !${NC}"
else
    echo -e "${RED}❌ Problème de connexion à Neon${NC}"
    echo -e "${YELLOW}Vérifiez votre DATABASE_URL dans backend/.env${NC}"
    exit 1
fi

cd ..

echo -e "${BLUE}📦 Installation des dépendances frontend...${NC}"
npm install

echo -e "${BLUE}🏗️ Build du frontend...${NC}"
npm run build

echo ""
echo -e "${GREEN}🎉 Déploiement terminé avec succès !${NC}"
echo ""
echo -e "${BLUE}📍 Prochaines étapes :${NC}"
echo -e "1. ${YELLOW}Déployer le frontend${NC} sur Vercel/Netlify"
echo -e "2. ${YELLOW}Déployer le backend${NC} sur Railway/Render"
echo -e "3. ${YELLOW}Configurer les variables d'environnement${NC} de production"
echo -e "4. ${YELLOW}Mettre à jour FRONTEND_URL${NC} dans le backend"
echo ""
echo -e "${BLUE}🔧 Pour tester localement :${NC}"
echo -e "   cd backend && npm run dev"
echo -e "   npm run dev"
echo ""
echo -e "${BLUE}🎯 Base de données Neon :${NC}"
echo -e "   Dashboard: ${YELLOW}https://console.neon.tech${NC}"
echo -e "   Monitoring: Disponible dans votre dashboard Neon"
echo ""
echo -e "${GREEN}✨ Votre application est prête pour la production !${NC}"
