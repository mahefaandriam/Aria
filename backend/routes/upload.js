import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { authenticateToken } from './admin.js';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du stockage avec multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/projects');
    
    try {
      await fs.access(uploadPath);
    } catch {
      await fs.mkdir(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Configuration multer pour la mémoire (pas de stockage disque)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB par défaut
    files: 5 // Maximum 5 fichiers
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (JPEG, JPG, PNG, GIF, WebP)'));
    }
  }
});

// Middleware de gestion des erreurs multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'Fichier trop volumineux',
        message: 'La taille maximum autorisée est de 10MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Trop de fichiers',
        message: 'Maximum 5 fichiers autorisés'
      });
    }
  }
  
  if (err.message.includes('Seules les images')) {
    return res.status(400).json({ 
      error: 'Type de fichier non autorisé',
      message: err.message
    });
  }
  
  next(err);
};

// POST /api/upload/image - Upload d'une image (admin seulement)
router.post('/image', authenticateToken, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Stocker l'image dans la base de données
    const image = await prisma.projectImage.create({
      data: {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer
      }
    });

    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      data: {
        imageId: image.id,
        filename: image.filename,
        size: image.size,
        url: `/api/upload/image/${image.id}` // URL pour récupérer l'image
      }
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
  }
});

// POST /api/upload/images - Upload multiple d'images (admin seulement)
router.post('/images', authenticateToken, upload.array('images', 5), handleMulterError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Stocker toutes les images
    const uploadPromises = req.files.map(file => 
      prisma.projectImage.create({
        data: {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          data: file.buffer
        }
      })
    );

    const uploadedImages = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${uploadedImages.length} image(s) uploadée(s) avec succès`,
      data: {
        images: uploadedImages.map(img => ({
          imageId: img.id,
          filename: img.filename,
          size: img.size,
          url: `/api/upload/image/${img.id}`
        }))
      }
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload des images' });
  }
});

// DELETE /api/upload/image/:filename - Supprimer une image (admin seulement)
router.delete('/image/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/projects', filename);

    // Vérifier que le fichier existe
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    // Supprimer le fichier
    await fs.unlink(filePath);

    console.log(`🗑️ Image deleted: ${filename} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Image supprimée avec succès'
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
  }
});

router.delete('/image/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.projectImage.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Image supprimée avec succès'
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Image non trouvée' });
    }

    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
  }
});

router.get('/image/:id', async (req, res) => {
  try {
    const image = await prisma.projectImage.findUnique({
      where: { id: req.params.id },
      select: { data: true, mimetype: true }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }

    res.set('Content-Type', image.mimetype);
    res.send(image.data);

  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'image' });
  }
});

// GET /api/upload/images - Lister toutes les images uploadées (admin seulement)
router.get('/images', authenticateToken, async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads/projects');
    
    try {
      await fs.access(uploadsDir);
    } catch {
      // Répertoire n'existe pas
      return res.json({
        success: true,
        data: {
          images: []
        }
      });
    }

    const files = await fs.readdir(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    });

    const images = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const stats = await fs.stat(filePath);
        
        return {
          filename,
          imageUrl: `/uploads/projects/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
    );

    // Trier par date de création (plus récent en premier)
    images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        images: images,
        total: images.length
      }
    });

  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des images' });
  }
});

// GET /api/upload/stats - Statistiques des uploads (admin seulement)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads/projects');
    
    try {
      await fs.access(uploadsDir);
    } catch {
      return res.json({
        success: true,
        data: {
          stats: {
            totalFiles: 0,
            totalSize: 0,
            averageSize: 0
          }
        }
      });
    }

    const files = await fs.readdir(uploadsDir);
    let totalSize = 0;

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = await fs.stat(filePath);
      totalSize += stats.size;
    }

    const averageSize = files.length > 0 ? totalSize / files.length : 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalFiles: files.length,
          totalSize: totalSize,
          totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
          averageSize: Math.round(averageSize),
          averageSizeMB: Math.round(averageSize / (1024 * 1024) * 100) / 100
        }
      }
    });

  } catch (error) {
    console.error('Error getting upload stats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router;
