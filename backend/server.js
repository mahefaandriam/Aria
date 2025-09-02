import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';
import projectRoutes from './routes/projects.js';
import uploadRoutes from './routes/upload.js';

// Import database
import { prisma } from './lib/prisma.js';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection and startup checks
async function checkDatabaseConnection() {
  try {
    console.log('🔍 Vérification de la connexion à la base de données...');

    // Test simple query
    const result = await prisma.$queryRaw`SELECT 1+1 AS result`;
    console.log('✅ Connexion à la base de données établie avec succès.');

    // Check tables (PostgreSQL version)
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `;

    console.log('📊 Tables disponibles dans la base de données:');
    for (const table of tables) {
      console.log(`   📋 Table: ${table.table_name}`);

      // Get count for each table
      try {
        const count = await prisma.$queryRawUnsafe(
          `SELECT COUNT(*) as count FROM "${table.table_name}"`
        );
        console.log(`      └─ Enregistrements: ${count[0].count}`);
      } catch (e) {
        console.log(`      └─ Erreur lecture: ${e.message}`);
      }
    }

    console.log('✅ Modèles synchronisés avec la base de données.');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    console.log('⚠️  Le serveur continuera avec les données par défaut.');
    return false;
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Startup function
async function startServer() {
  console.log('\n🚀 === ARIA CREATIVE BACKEND ===');
  console.log(`⚡ Node.js version: ${process.version}`);
  console.log(`📁 Working directory: ${process.cwd()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Port: ${PORT}`);
  console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8081'}`);

  // Check database connection
  const dbConnected = await checkDatabaseConnection();

  console.log('\n🔧 Configuration des middlewares...');

  // Security middleware
  app.use(helmet());
  console.log('   ✅ Helmet (sécurité)');

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
  console.log('   ✅ Rate limiting (100 req/15min)');

  // CORS configuration
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true
  }));
  console.log('   ✅ CORS configuré');

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  console.log('   ✅ Body parser (limite: 10mb)');

  // Static files for uploads
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  console.log('   ✅ Fichiers statiques: /uploads');

  console.log('\n📡 Configuration des routes API...');

  // Routes
  app.use('/api/contact', contactRoutes);
  console.log('   ✅ /api/contact');

  app.use('/api/admin', adminRoutes);
  console.log('   ✅ /api/admin');

  app.use('/api/projects', projectRoutes);
  console.log('   ✅ /api/projects');

  app.use('/api/upload', uploadRoutes);
  console.log('   ✅ /api/upload');

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbConnected ? 'connected' : 'fallback',
      version: '1.0.0'
    });
  });
  console.log('   ✅ /api/health');

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err.message);
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    console.log(`❓ Route non trouvée: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'API route not found' });
  });

  // Start server
  app.listen(PORT, () => {
    console.log('\n🎉 === SERVEUR DÉMARRÉ ===');
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📝 API disponible sur: http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Base de données: ${dbConnected ? '✅ Connectée' : '⚠️  Mode fallback'}`);
    console.log('\n👀 Prêt à recevoir des requêtes...\n');
  });
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  console.log('✅ Connexion base de données fermée');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur (Ctrl+C)...');
  await prisma.$disconnect();
  console.log('✅ Connexion base de données fermée');
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error('❌ Erreur fatale lors du démarrage:', error);
  process.exit(1);
});
