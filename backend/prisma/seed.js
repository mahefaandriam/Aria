import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient();

// Configuration des données par défaut
const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@aria-creative.com',
  password: process.env.ADMIN_PASSWORD || 'admin@aria25!!',
  name: 'Administrateur',
  role: 'ADMIN' // Utilisation d'une constante en majuscules pour les rôles
};


async function createAdminUser() {
  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
  
  return await prisma.user.upsert({
    where: { email: DEFAULT_ADMIN.email },
    update: {
      password: hashedPassword,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role
    },
    create: {
      email: DEFAULT_ADMIN.email,
      password: hashedPassword,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role
    }
  });
}

async function main() {
  console.log('\n🌱 Début du seeding...');

  // 1. Créer l'utilisateur admin
  console.log('\n👤 Création de l\'utilisateur admin...');
  const admin = await createAdminUser();
  console.log(`✅ Admin créé/mis à jour: ${admin.email} (ID: ${admin.id})`);

  // 2. Créer les catégories si nécessaire
  console.log('\n🏷️  Vérification des catégories...');
  const categories = ['Site Web', 'Application', 'E-commerce', 'Mobile'];
  await prisma.category.createMany({
    data: categories.map(name => ({ name })),
    skipDuplicates: true
  });
  console.log(`✅ ${categories.length} catégories disponibles`);

  // 3. Créer les projets
  console.log('\n📂 Création des projets...');
  const projectCount = await seedProjects();
  if (projectCount) {
    console.log(`✅ ${projectCount} projets créés avec succès`);
  }

  // 4. Lier projets et catégories
  console.log('\n🔗 Association projets/catégories...');
  const allProjects = await prisma.project.findMany();
  const webCategory = await prisma.category.findFirst({ where: { name: 'Site Web' }});
  
  if (webCategory) {
    await Promise.all(
      allProjects.map(project => 
        prisma.projectCategory.create({
          data: {
            projectId: project.id,
            categoryId: webCategory.id
          }
        })
      )
    );
    console.log(`✅ ${allProjects.length} projets associés à la catégorie "Site Web"`);
  }

  console.log('\n🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('\n❌ Erreur lors du seeding:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });