#!/bin/bash

echo "🚀 Démarrage du backend Aria Creative..."

# Change to backend directory
cd backend

# Kill any existing processes
echo "🔍 Vérification des processus existants..."
pkill -f "node server.js" 2>/dev/null || echo "Aucun processus existant"

# Wait a moment
sleep 2

# Start the server
echo "🚀 Démarrage du serveur..."
node server.js
