import React, { useState, useEffect } from 'react';
import ProjectCard from "@/components/ProjectCard";
import { getClientProjects, getDefaultProjects, type ClientProject } from "@/services/projectsService";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import "@/styles/animations.css";

// Les projets sont maintenant chargés dynamiquement depuis le dashboard admin

const ProjectsSection = () => {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>();
  const { containerRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(projects.length, 200);

  
  useEffect(() => {
    // Charger les projets depuis l'API backend
    const loadProjects = async () => {
      setIsLoading(true);

      try {
        // Récupérer les projets depuis l'API
        const clientProjects = await getClientProjects();

        if (clientProjects.length > 0) {
          setProjects(clientProjects);
        } else {
          // Fallback vers les projets par défaut s'il n'y en a aucun dans l'API
          setProjects(getDefaultProjects());
        }
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        // Fallback vers les projets par défaut en cas d'erreur
        setProjects(getDefaultProjects());
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();

    // Recharger les projets toutes les 30 secondes pour sync avec l'API
    const interval = setInterval(loadProjects, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={elementRef}
      id="realisations"
      className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
    >
      {/* Background décoratif */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-400 rounded-full filter blur-3xl animate-float delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header section */}
        <div className={`text-center mb-16 transform transition-all duration-700 ${
          isVisible ? 'animate-fade-in-down' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-6">
            NOS RÉALISATIONS
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Laissez-vous inspirer par ces histoires de transformation digitale réussie.
            Chaque projet reflète notre engagement à comprendre les enjeux spécifiques
            de chaque secteur et à concevoir des solutions sur mesure.
          </p>

          {/* Indicateur de synchronisation avec l'API
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Synchronisé avec l'API backend • {projects.length} projets publiés</span>
          </div> */}
        </div>

        {/* Grille des projets */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            <span className="ml-3 text-gray-300">Chargement des projets...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">Aucun projet publié</h3>
            <p className="text-gray-400">Les projets créés dans le dashboard admin avec le statut "Terminé" apparaitront ici.</p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
          >
            {projects.map((project, index) => (
              <div
                key={`${project.title}-${index}`}
                className={`transform transition-all duration-500 ${
                  visibleItems.has(index) ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        )}

        {/* Message informatif pour l'admin */}
        {projects.length > 0 && (
          <div className={`text-center mt-12 transform transition-all duration-700 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
          }`}>
            {/* <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-xl p-6 rounded-2xl border border-orange-500/30 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">
                📝 <strong>Pour les administrateurs :</strong> Ces projets sont automatiquement synchronisés
                depuis l'API backend. Seuls les projets avec le statut "Terminé" sont affichés ici.
              </p>
            </div> */}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
