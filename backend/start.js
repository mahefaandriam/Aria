#!/usr/bin/env node

/**
 * Script de démarrage du backend Aria Creative
 * Ce script vérifie les dépendances et démarre le serveur
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Vérifier si les dépendances sont installées
const checkDependencies = async () => {
  try {
    await fs.access(path.join(__dirname, 'node_modules'));
    return true;
  } catch {
    return false;
  }
};

// Installer les dépendances
const installDependencies = () => {
  return new Promise((resolve, reject) => {
    log('📦 Installation des dépendances...', 'yellow');
    
    const npm = spawn('npm', ['install'], {
      cwd: __dirname,
      stdio: 'inherit'
    });

    npm.on('close', (code) => {
      if (code === 0) {
        log('✅ Dépendances installées avec succès', 'green');
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });

    npm.on('error', (error) => {
      reject(error);
    });
  });
};

// Créer le fichier .env s'il n'existe pas
const createEnvFile = async () => {
  const envPath = path.join(__dirname, '.env');

  try {
    await fs.access(envPath);
    log('✅ Fichier .env trouvé', 'green');
  } catch {
    try {
      await fs.writeFile(envPath);
      log('📝 Fichier .env créé à partir de .env.example', 'yellow');
      log('⚠️  N\'oubliez pas de configurer vos variables d\'environnement dans .env', 'yellow');
    } catch (error) {
      log('❌ Erreur lors de la création du fichier .env', 'red');
      throw error;
    }
  }
};

// Créer les répertoires nécessaires
const createDirectories = async () => {
  const dirs = [
    'uploads',
    'uploads/projects',
    'data',
    'logs'
  ];

  for (const dir of dirs) {
    const dirPath = path.join(__dirname, dir);
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      log(`📁 Répertoire créé: ${dir}`, 'blue');
    }
  }
};

// Démarrer le serveur
const startServer = () => {
  return new Promise((resolve, reject) => {
    log('🚀 Démarrage du serveur...', 'cyan');
    
    const server = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: 'inherit'
    });

    server.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Server exited with code ${code}`));
      }
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Le serveur reste en cours d'exécution
  });
};

// Fonction principale
const main = async () => {
  try {
    log('🎯 Initialisation du backend Aria Creative', 'magenta');
    console.log('');

    // Vérifier et installer les dépendances
    const hasNodeModules = await checkDependencies();
    if (!hasNodeModules) {
      await installDependencies();
    } else {
      log('✅ Dépendances déjà installées', 'green');
    }

    // Créer le fichier .env
    await createEnvFile();

    // Créer les répertoires nécessaires
    await createDirectories();

    console.log('');
    log('✅ Initialisation terminée', 'green');
    console.log('');

    // Démarrer le serveur
    await startServer();

  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Gestion des signaux pour un arrêt propre
process.on('SIGINT', () => {
  log('\n👋 Arrêt du serveur...', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n👋 Arrêt du serveur...', 'yellow');
  process.exit(0);
});

// Démarrer
main();
