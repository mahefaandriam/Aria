import React, { useState, useEffect, useRef } from 'react';
import ProjectCard from "@/components/ProjectCard";
import { getClientProjects } from "@/services/projectsService";
import { Project } from "@/services/api";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import "@/styles/animations.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>();
  const { containerRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(projects.length, 200);

  const sectionRef = useRef<HTMLElement | null>(null);
  const linesRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const clientProjects = await getClientProjects();
        if (clientProjects.length > 0) {
          setProjects(clientProjects);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des projets");
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animation globale de la section
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Animation du fond "ligne d'arrivée"
      if (linesRef.current) {
        gsap.fromTo(
          linesRef.current,
          { xPercent: -20, opacity: 0 },
          {
            xPercent: 0,
            opacity: 0.35,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Animation des cards (wrapper)
      if (cardsWrapperRef.current) {
        const cards = cardsWrapperRef.current.querySelectorAll(".project-card-outer");
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          scale: 0.98,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsWrapperRef.current,
            start: "top 75%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        if (typeof elementRef === "function") elementRef(el);
        else if (elementRef) (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      id="realisations"
      className="py-24 bg-gradient-to-br from-gray-950 via-black to-slate-950 relative overflow-hidden"
    >
      {/* Background décoratif global */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-24 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-orange-400/25 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.25),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),#020617)] mix-blend-soft-light opacity-70" />
      </div>

      {/* Ligne d'arrivée (fond rayé derrière la grille) */}
      <div
        ref={linesRef}
        className="pointer-events-none absolute inset-x-0 top-56 bottom-10 flex items-center justify-center opacity-30"
      >
        <div className="relative w-[120%] max-w-6xl h-56">
          {/* Bande principale */}
          <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-full">
            <div
              className="w-full h-full bg-[repeating-linear-gradient(135deg,_rgba(248,250,252,0.08)_0px,_rgba(248,250,252,0.08)_12px,_rgba(15,23,42,0.3)_12px,_rgba(15,23,42,0.3)_24px)] rounded-3xl border border-orange-400/40 shadow-[0_0_80px_rgba(249,115,22,0.45)]"
            />
          </div>

          {/* Fading top & bottom */}
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header section */}
        <div
          className={`text-center mb-16 max-w-4xl mx-auto transform transition-all duration-700 ${
            isVisible ? "animate-fade-in-down" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-flex items-center px-4 py-1 mb-4 rounded-full border border-orange-500/30 bg-orange-500/10 text-xs font-medium uppercase tracking-[0.2em] text-orange-300">
            Portefeuille
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 mb-6 drop-shadow-[0_0_25px_rgba(249,115,22,0.55)]">
            NOS RÉALISATIONS
          </h2>

          <p className="text-lg md:text-xl text-gray-300/90 leading-relaxed">
            Laissez-vous inspirer par ces histoires de transformation digitale réussie.
            Chaque projet reflète notre engagement à comprendre les enjeux spécifiques
            de chaque secteur et à concevoir des solutions sur mesure.
          </p>
        </div>

        {/* Loader / Empty / Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-orange-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-orange-500/20" />
            </div>
            <span className="text-gray-300 text-sm uppercase tracking-[0.25em]">
              Chargement des projets...
            </span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">
              Aucun projet publié
            </h3>
            <p className="text-gray-400">
              Les projets créés dans le dashboard admin avec le statut "Terminé" apparaitront ici.
            </p>
          </div>
        ) : (
          <div
            ref={(el) => {
              containerRef.current = el as HTMLDivElement | null;
              cardsWrapperRef.current = el as HTMLDivElement | null;
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {projects.map((project, index) => (
              <div
                key={`${project.title}-${index}`}
                className={`
                  project-card-outer group transform transition-all duration-500 
                  ${visibleItems.has(index) ? "animate-fade-in-up" : "opacity-0 translate-y-10"}
                `}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="h-full rounded-2xl bg-slate-900/40 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,23,42,0.9)] hover:shadow-[0_28px_95px_rgba(249,115,22,0.5)] transition-shadow duration-300 overflow-hidden">
  <div className="h-full flex flex-col">
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.22),transparent_60%)] opacity-70 pointer-events-none" />
    </div>
    <div className="p-5 sm:p-6 h-full flex flex-col">
      <ProjectCard {...project} />
    </div>
  </div>
</div>

              </div>
            ))}
          </div>
        )}

        {/* Bloc informatif admin (inchangé, toujours commenté) */}
        {projects.length > 0 && (
          <div
            className={`text-center mt-12 transform transition-all duration-700 ${
              isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            {/* 
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-xl p-6 rounded-2xl border border-orange-500/30 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm">
                📝 <strong>Pour les administrateurs :</strong> Ces projets sont automatiquement synchronisés
                depuis l'API backend. Seuls les projets avec le statut "Terminé" sont affichés ici.
              </p>
            </div>
            */}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
