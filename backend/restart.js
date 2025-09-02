#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function restartServer() {
  try {
    console.log('🔍 Recherche des processus server.js en cours...');
    
    // Kill existing server processes
    try {
      await execAsync('pkill -f "node server.js"');
      console.log('🛑 Processus existants arrêtés');
    } catch (e) {
      console.log('ℹ️  Aucun processus existant trouvé');
    }

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🚀 Démarrage du nouveau serveur...\n');

    // Start new server
    const server = spawn('node', ['server.js'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    server.on('error', (error) => {
      console.error('❌ Erreur lors du démarrage:', error);
    });

    server.on('exit', (code) => {
      console.log(`\n🛑 Serveur arrêté avec le code: ${code}`);
    });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt demandé...');
      server.kill('SIGTERM');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

restartServer();
