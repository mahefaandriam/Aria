#!/bin/bash

# Script de démarrage rapide pour le développement
# Lance le frontend et le backend simultanément

echo "🚀 Démarrage de l'environnement de développement..."
echo ""

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour tuer les processus en arrière-plan
cleanup() {
    echo ""
    echo -e "${YELLOW}Arrêt des services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Créer les fichiers .env s'ils n'existent pas
if [ ! -f .env ]; then
    echo -e "${BLUE}Création du fichier .env pour le frontend...${NC}"
    cp .env.example .env 2>/dev/null || echo "VITE_API_URL=http://localhost:3001/api" > .env
fi

if [ ! -f backend/.env ]; then
    echo -e "${BLUE}Création du fichier .env pour le backend...${NC}"
    if [ -f backend/.env.example ]; then
        cp backend/.env.example backend/.env
    else
        cat > backend/.env << EOF
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8081
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@aria-creative.com
ADMIN_PASSWORD=admin123
DATABASE_URL="postgresql://neondb_owner:npg_oFOxVsz8nv4N@ep-steep-paper-adheem47-pooler.c-2.us-east-1.aws.neon.tech/aria-db?sslmode=require&channel_binding=require"
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
EOF
    fi
fi

echo -e "${GREEN}✅ Configuration des fichiers d'environnement terminée${NC}"
echo ""

# Vérifier si les dépendances sont installées
echo -e "${BLUE}Vérification des dépendances...${NC}"

# Frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installation des dépendances frontend...${NC}"
    npm install
fi

# Backend
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installation des dépendances backend...${NC}"
    cd backend && npm install && cd ..
fi

echo -e "${GREEN}✅ Dépendances vérifiées${NC}"
echo ""

# Démarrer le backend
echo -e "${BLUE}🔧 Démarrage du backend sur le port 3001...${NC}"
cd backend && npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Attendre que le backend soit prêt
echo -e "${YELLOW}Attente du démarrage du backend...${NC}"
sleep 3

# Vérifier si le backend est démarré
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend démarré avec succès${NC}"
else
    echo -e "${YELLOW}⏳ Backend en cours de démarrage...${NC}"
fi

# Démarrer le frontend
echo -e "${BLUE}🎨 Démarrage du frontend sur le port 5173...${NC}"
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}🎉 Environnement de développement démarré !${NC}"
echo ""
echo -e "${BLUE}📍 URLs disponibles :${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend API: ${GREEN}http://localhost:3001/api${NC}"
echo -e "   Health Check: ${GREEN}http://localhost:3001/api/health${NC}"
echo ""
echo -e "${BLUE}📊 Identifiants admin par défaut :${NC}"
echo -e "   Email: ${YELLOW}admin@aria-creative.com${NC}"
echo -e "   Mot de passe: ${YELLOW}admin123${NC}"
echo ""
echo -e "${BLUE}📝 Logs en temps réel :${NC}"
echo -e "   Backend: ${YELLOW}tail -f backend.log${NC}"
echo -e "   Frontend: ${YELLOW}tail -f frontend.log${NC}"
echo ""
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter tous les services${NC}"
echo ""

# Suivre les logs du backend et frontend
tail -f backend.log frontend.log

# Attendre que les processus se terminent
wait
