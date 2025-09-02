import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient();

const DEFAULT_PROJECTS = [
  {
    title: "CGEPRO",
    description: "Votre spécialiste du bois exotique et des aménagements extérieurs sur La Réunion",
    technologies: ["WordPress", "PHP", "MySQL", "SEO"],
    client: "CGEPRO",
    duration: "2 mois",
    status: "TERMINE",
    images: null, // On charge le binaire ici
    date: new Date("2024-03-15"),
    url: "https://cgepro.com"
  },
  {
    title: "ERIC RABY",
    description: "Coaching en compétences sociales et émotionnelles",
    technologies: ["React", "Node.js", "Stripe", "Calendar API"],
    client: "Eric Raby Coaching",
    duration: "3 mois",
    status: "TERMINE",
    images: null,
    date: new Date("2024-04-22"),
    url: "https://eric-raby.com"
  },
  {
      title: "CONNECT TALENT",
      description: "Plateforme de mise en relation entre entreprises et talents africains",
      technologies: ["Vue.js", "Laravel", "PostgreSQL", "Socket.io"],
      client: "Connect Talent Inc",
      duration: "5 mois",
      status: "TERMINE",
      images: null,
      date: new Date("2024-05-10"),
      url: "https://connecttalent.cc"
    },
    {
      title: "SOA DIA TRAVEL",
      description: "Transport & Logistique à Madagascar",
      technologies: ["Angular", "Express.js", "MongoDB", "Maps API"],
      client: "SOA DIA TRAVEL",
      duration: "4 mois",
      status: "TERMINE",
      images: null,
      date: new Date("2024-06-01"),
      url: "https://soatransplus.mg"
    },
    {
      title: "Site E-commerce Fashion",
      description: "Développement d'une plateforme e-commerce complète avec système de paiement intégré",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      client: "Fashion Boutique",
      duration: "3 mois",
      status: "TERMINE",
      images: null,
      date: new Date("2024-06-15"),
      url: "https://fashion-boutique.com"
    },
    {
      title: "Application Mobile Banking",
      description: "Application mobile sécurisée pour la gestion bancaire avec authentification biométrique",
      technologies: ["React Native", "Firebase", "Redux"],
      client: "BankTech Solutions",
      duration: "6 mois",
      status: "EN_COURS",
      images: null,
      date: new Date("2024-07-01"),
      url: null
    }
];

async function seedProjects() {
  const existingCount = await prisma.project.count();
  
  if (existingCount > 0) {
    console.log(`⏩ ${existingCount} projets existent déjà, skip...`);
    return;
  }

  for (const project of DEFAULT_PROJECTS) {
    await prisma.project.create({
      data: {
        title: project.title,
        description: project.description,
        technologies: JSON.stringify(project.technologies),
        client: project.client,
        duration: project.duration,
        status: project.status,
        date: project.date,
        url: project.url,
        slug: project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        images: project.images
          ? {
              create: project.images.map(img => ({
                filename: img.filename,
                mimetype: img.mimetype,
                size: img.size,
                data: img.data,
              })),
            }
          : undefined,
      }
    });
  }

  console.log(`✅ ${DEFAULT_PROJECTS.length} projets créés avec succès.`);
  return DEFAULT_PROJECTS.length;
}

async function main() {
  console.log('\n🌱 Début du seeding...');

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