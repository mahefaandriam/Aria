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
      } catch {
        console.error("Erreur lors du chargement des projets");
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
  if (!sectionRef.current || projects.length === 0) return;

  const ctx = gsap.context(() => {
    // Animation globale de la section
    gsap.from(sectionRef.current, {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      duration: 1.8,
      ease: "power4.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
      },
    });

    // Ligne d'arrivée
    if (linesRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      })
      .fromTo(
        linesRef.current,
        { scaleX: 0.8, xPercent: -30, opacity: 0, rotation: -5 },
        { scaleX: 1.1, xPercent: 0, opacity: 0.4, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.4)" }
      )
      .to(linesRef.current, {
        scaleX: 1,
        opacity: 0.35,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5");
    }

    // ✨ MESMERIZING CARDS EFFECTS ✨
    if (cardsWrapperRef.current) {
      const cards = cardsWrapperRef.current.querySelectorAll(".project-card-outer");

      cards.forEach((card, index) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "bottom 30%",
            scrub: 1.2,
            toggleActions: "play pause resume reset",
          }
        })
        // Phase 1: apparition
        .fromTo(
          card,
          {
            opacity: 0,
            y: 120,
            scale: 0.7,
            rotationX: 90,
            rotationY: index % 2 === 0 ? -20 : 20,
            filter: "brightness(0.3) blur(8px)"
          },
          {
            opacity: 1,
            y: 0,
            scale: 1.02,
            rotationX: 0,
            rotationY: 0,
            filter: "brightness(1.1) blur(0px)",
            duration: 1.5,
            ease: "power4.out"
          },
          0
        )
        // Phase 2: flottement
        .to(card, {
          y: -15,
          scale: 1,
          rotation: index % 2 === 0 ? 1 : -1,
          ease: "power2.inOut",
          duration: 2.5,
          repeat: -1,
          yoyo: true
        }, 0.8)
        // Phase 3: glow
        .to(card, {
          boxShadow: "0 25px 100px rgba(249,115,22,0.6)",
          scale: 1.03,
          duration: 2,
          ease: "power2.out"
        }, 1.2)
        // Phase 4: stabilisation
        .to(card, {
          y: 0,
          rotation: 0,
          scale: 1,
          boxShadow: "0 24px 80px rgba(15,23,42,0.9)",
          duration: 1.5,
          ease: "elastic.out(1, 0.3)"
        }, 2);
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
        else if (elementRef)
          (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      id="realisations"
      className="py-24 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-950 relative overflow-hidden"
    >
      {/* Fond lumineux subtil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-300/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.1),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.95),_#0f172a)] mix-blend-soft-light opacity-60" />
      </div>

      {/* Ligne décorative */}
      <div
        ref={linesRef}
        className="pointer-events-none absolute inset-x-0 top-56 bottom-10 flex items-center justify-center opacity-25"
      >
        <div className="relative w-[120%] max-w-6xl h-56">
          <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-full">
            <div className="w-full h-full bg-[repeating-linear-gradient(135deg,_rgba(255,255,255,0.05)_0px,_rgba(255,255,255,0.05)_12px,_rgba(249,115,22,0.08)_12px,_rgba(249,115,22,0.08)_24px)] rounded-3xl border border-orange-300/30 shadow-[0_0_80px_rgba(249,115,22,0.3)] backdrop-blur-md" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 max-w-4xl mx-auto transform transition-all duration-700 ${
            isVisible ? "animate-fade-in-down" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-flex items-center px-4 py-1 mb-4 rounded-full border border-orange-400/40 bg-orange-500/10 text-xs font-medium uppercase tracking-[0.2em] text-orange-200">
            Portefeuille
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-200 to-orange-400 mb-6 drop-shadow-[0_0_40px_rgba(249,115,22,0.3)]">
            NOS RÉALISATIONS
          </h2>

          <p className="text-lg md:text-xl text-gray-300/90 leading-relaxed bg-gray-800/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-orange-400/20 shadow-md">
            Laissez-vous inspirer par ces histoires de transformation digitale réussie.
            Chaque projet reflète notre engagement à comprendre les enjeux spécifiques
            de chaque secteur et à concevoir des solutions sur mesure.
          </p>
        </div>

        {/* Loader / Carte */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full border-t-4 border-b-4 border-orange-400 bg-orange-300/20 animate-spin shadow-lg shadow-orange-400/20" />
            </div>
            <span className="text-orange-300 text-lg font-medium uppercase tracking-[0.25em]">
              Chargement des projets...
            </span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">🚧</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">
              Aucun projet publié
            </h3>
            <p className="text-gray-400 bg-gray-800/40 px-8 py-4 rounded-xl border border-orange-400/20">
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
                className={`project-card-outer group transform transition-all duration-500 ${
                  visibleItems.has(index) ? "animate-fade-in-up" : ""
                } overflow-hidden relative`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="h-full rounded-3xl bg-gradient-to-br from-gray-800/60 to-slate-900/50 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_80px_rgba(249,115,22,0.4)] transition-all duration-500 group-hover:scale-[1.02] border border-orange-400/25 hover:border-orange-300/40 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-400/5 via-transparent to-orange-400/5" />
                  <div className="h-full flex flex-col relative z-10">
                    <div className="p-6 lg:p-8 h-full flex flex-col">
                      <ProjectCard {...project} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
