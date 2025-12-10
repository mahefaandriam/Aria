import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useParallax } from "@/hooks/useScrollAnimation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "@/styles/animations.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const dynamicWords = [
  "défis digitaux",
  "idées innovantes",
  "projets ambitieux",
  "visions créatives",
];

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const sectionRef = useRef<HTMLElement | null>(null);
  const logoCardRef = useRef<HTMLDivElement>(null);
  const { offset } = useParallax(0.3);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // Animation de la carte logo et des stats
  useGSAP(
    () => {
      // Animation de la carte logo
      if (logoCardRef.current) {
        gsap.fromTo(
          logoCardRef.current,
          {
            opacity: 0,
            x: 50,
            scale: 0.9,
            rotation: -5,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            delay: 0.3,
            ease: "back.out(1.7)",
          }
        );
      }

      // Créer une timeline pour l'animation en boucle des stats
      animationRef.current = gsap.timeline({
        repeat: -1, // Répétition infinie
        delay: 1, // Délai initial pour laisser la carte logo apparaître
      });

      // Animer les cartes desktop
      const desktopCards = gsap.utils.toArray(".desktop-stat .stat-card");
      const mobileCards = gsap.utils.toArray(".mobile-stat .stat-card");

      // Initialiser toutes les cartes de stats comme invisibles
      gsap.set([...desktopCards, ...mobileCards], {
        opacity: 0,
        scale: 0.8,
        y: 20,
      });

      // Durées pour l'animation
      const appearDuration = 0.7;
      const stayDuration = 0.8; // Temps entre chaque apparition
      const disappearDuration = 0.6;
      const allStayDuration = 1.5; // Temps où toutes sont visibles

      // ===== PHASE 1 : APPARITION SÉQUENTIELLE =====
      // Carte 1 (Projets) - index 0
      desktopCards.forEach((card: any, index) => {
        const startTime = index * (appearDuration + stayDuration);

        // Apparition
        animationRef.current?.to(
          card,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: appearDuration,
            ease: "back.out(1.7)",
          },
          startTime
        );

        // Animation du compteur
        const numberElement = card.querySelector(".stat-number");
        if (numberElement) {
          animationRef.current?.to(
            numberElement,
            {
              innerText: numberElement.getAttribute("data-value"),
              duration: appearDuration * 1.5,
              ease: "power2.out",
              snap: { innerText: 1 },
            },
            startTime + 0.2
          );
        }
      });

      // Apparition mobile séquentielle
      mobileCards.forEach((card: any, index) => {
        const startTime = index * (appearDuration + stayDuration);

        animationRef.current?.to(
          card,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: appearDuration * 0.9,
            ease: "power3.out",
          },
          startTime
        );

        const numberElement = card.querySelector(".stat-number");
        if (numberElement) {
          animationRef.current?.to(
            numberElement,
            {
              innerText: numberElement.getAttribute("data-value"),
              duration: appearDuration * 1.2,
              ease: "power2.out",
              snap: { innerText: 1 },
            },
            startTime + 0.15
          );
        }
      });

      // Temps où toutes les cartes sont visibles
      const allVisibleTime =
        2 * (appearDuration + stayDuration) + allStayDuration;

      // ===== PHASE 2 : DISPARITION SÉQUENTIELLE =====
      // Disparition dans le même ordre
      desktopCards.forEach((card: any, index) => {
        const disappearTime =
          allVisibleTime + index * (disappearDuration + stayDuration);

        animationRef.current?.to(
          card,
          {
            opacity: 0,
            scale: 0.8,
            y: 20,
            duration: disappearDuration,
            ease: "power2.in",
          },
          disappearTime
        );
      });

      mobileCards.forEach((card: any, index) => {
        const disappearTime =
          allVisibleTime + index * (disappearDuration + stayDuration);

        animationRef.current?.to(
          card,
          {
            opacity: 0,
            scale: 0.8,
            y: 20,
            duration: disappearDuration * 0.8,
            ease: "power2.in",
          },
          disappearTime
        );
      });

      // ===== PHASE 3 : PAUSE AVANT DE RECOMMENCER =====
      const totalCycleTime =
        allVisibleTime +
        2 * (disappearDuration + stayDuration) +
        disappearDuration;
      animationRef.current?.to({}, { duration: 1 }, totalCycleTime);

      // Démarrer l'animation des stats
      animationRef.current?.play();

      // Cleanup
      return () => {
        if (animationRef.current) {
          animationRef.current.kill();
        }
      };
    },
    { scope: sectionRef }
  );

  // Rotation des mots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
      setTypedWord("");
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Effet typewriter sur le mot seulement
  useEffect(() => {
    const currentWord = dynamicWords[currentWordIndex];
    let index = 0;
    const typingInterval = setInterval(() => {
      index += 1;
      setTypedWord(currentWord.slice(0, index));
      if (index === currentWord.length) {
        clearInterval(typingInterval);
      }
    }, 80);
    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  // Suivi de la souris pour le halo
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);
    return () => section?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const statsData = [
    { number: "40", label: "Projets", suffix: "+" },
    { number: "100", label: "Satisfaction", suffix: "%" },
    { number: "7", label: "Support", suffix: "/7" },
  ];

  return (
    <>
      <style>{`
        .hero-bg {
          background:
            radial-gradient(circle at 0% 0%, rgba(249,115,22,0.25), transparent 55%),
            radial-gradient(circle at 100% 100%, rgba(59,130,246,0.25), transparent 55%),
            linear-gradient(to right, #020617, #020617);
        }
        .hero-glass {
          background: linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.6));
          backdrop-filter: blur(18px);
          border: 1px solid rgba(148,163,184,0.25);
        }
        .hero-orbit {
          background: conic-gradient(from 180deg, rgba(249,115,22,0.3), transparent, rgba(59,130,246,0.3), transparent, rgba(249,115,22,0.3));
        }
        .cursor-glow {
          background: radial-gradient(circle at center, rgba(249,115,22,0.25), transparent 60%);
        }
        .typewriter-word {
          border-right: 2px solid #f97316;
          white-space: nowrap;
          overflow: hidden;
          animation: blinkCaret 0.9s step-end infinite;
        }
        
        /* État initial des cartes de stats - cachées */
        .desktop-stat .stat-card,
        .mobile-stat .stat-card {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          will-change: transform, opacity;
        }
        
        @keyframes blinkCaret {
          0%, 100% { border-color: transparent; }
          50% { border-color: #f97316; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(0.5deg); }
          66% { transform: translateY(4px) rotate(-0.5deg); }
        }
        
        .animate-float-loop {
          animation: float 5s ease-in-out infinite;
        }
        
        @media (max-width: 1024px) {
          .stats-desktop { display: none !important; }
        }
        @media (max-width: 768px) {
          #accueil {
            min-height: 100dvh;
            padding-top: 4.5rem;
            padding-bottom: calc(env(safe-area-inset-bottom) + 3rem);
          }
          .hero-title { font-size: 2rem !important; line-height: 1.1 !important; }
          .hero-subtitle { font-size: 1rem !important; }
          .logo-card { max-width: 280px !important; height: 320px !important; }
        }
        @media (max-width: 640px) {
          .hero-section { padding-top: 2rem; padding-bottom: 2rem; }
          .hero-title { font-size: 1.75rem !important; }
          .hero-buttons button { 
            width: 100% !important; 
            margin-bottom: 0.75rem !important; 
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="accueil"
        className="relative min-h-screen hero-bg text-white overflow-hidden flex flex-col py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        style={{ transform: `translateY(${offset * 0.4}px)` }}
      >
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/cover.jpg')`,
              filter: "blur(12px) brightness(0.6)",
            }}
          />
        </div>

        {/* Halo qui suit la souris */}
        <div
          className="pointer-events-none cursor-glow opacity-40 sm:opacity-60 md:opacity-80 absolute -translate-x-1/2 -translate-y-1/2 blur-2xl sm:blur-3xl hidden md:block"
          style={{
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            width: "300px",
            height: "300px",
          }}
        />

        {/* Orbes décoratives responsive */}
        <div className="pointer-events-none hero-orbit absolute -right-4 sm:-right-20 md:-right-40 -top-16 sm:-top-20 md:-top-40 w-32 sm:w-48 md:w-[420px] h-32 sm:h-48 md:h-[420px] rounded-full opacity-30 sm:opacity-40 blur-xl sm:blur-3xl animate-float-slow" />
        <div className="pointer-events-none hero-orbit absolute -left-8 sm:-left-20 md:-left-32 bottom-[-40px] sm:bottom-[-60px] md:bottom-[-120px] w-24 sm:w-40 md:w-[360px] h-24 sm:h-40 md:h-[360px] rounded-full opacity-20 sm:opacity-30 blur-xl sm:blur-3xl animate-float-slow" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 pt-8 sm:pt-12 lg:pt-16">
          {/* Colonne gauche : texte - RESPONSIVE */}
          <div className="w-full lg:w-auto lg:max-w-lg order-2 lg:order-1 space-y-4 sm:space-y-6 text-center lg:text-left">

            <h1 className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight animate-fade-in-left">
              Transformons vos{" "}
              <span className="relative text-orange-400">
                <span className="typewriter-word inline-block pr-1">
                  {typedWord}
                </span>
              </span>{" "}
              en opportunités de croissance.
            </h1>

            <p className="hero-subtitle text-sm sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-150 leading-relaxed">
              ARIA vous accompagne de la stratégie à la réalisation pour créer
              des expériences digitales sur mesure, performantes et mémorables.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 animate-fade-in-up delay-200 w-full sm:w-auto">
              <Button
                className="
                  relative group w-full sm:w-auto
                  text-sm sm:text-base md:text-lg
                  px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4
                  rounded-full font-semibold
                  text-white
                  bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300
                  shadow-lg sm:shadow-[0_15px_40px_rgba(249,115,22,0.6)]
                  border border-orange-300/80
                  hover:from-orange-400 hover:via-amber-300 hover:to-yellow-300
                  hover:shadow-xl sm:hover:shadow-[0_18px_55px_rgba(251,146,60,0.9)]
                  transition-all duration-300
                "
                onClick={() => handleScrollTo("realisations")}
              >
                <span
                  className="
                    pointer-events-none absolute inset-0 rounded-full opacity-0
                    bg-gradient-to-r from-white/40 via-white/10 to-transparent
                    -translate-x-[120%] sm:translate-x-[-120%]
                    group-hover:opacity-100 group-hover:translate-x-[120%]
                    transition-all duration-500
                  "
                />
                <span className="relative flex items-center justify-center gap-2">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                  <span>Découvrir nos réalisations</span>
                </span>
              </Button>

              <Button
                variant="outline"
                className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black px-5 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 rounded-full font-medium bg-black/20 backdrop-blur text-sm sm:text-base w-full sm:w-auto"
                onClick={() => handleScrollTo("about")}
              >
                En savoir plus
              </Button>
            </div>
          </div>

          {/* Colonne droite : carte logo + STATS ANIMÉES AUTOMATIQUES */}
          <div className="w-full lg:w-auto order-1 lg:order-2 flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            {/* Carte logo - RESPONSIVE */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end flex-1 max-w-sm sm:max-w-md lg:max-w-none">
              <div
                ref={logoCardRef}
                className="logo-card hero-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 w-full shadow-[0_12px_40px_rgba(15,23,42,0.8)] sm:shadow-[0_18px_60px_rgba(15,23,42,0.8)] border-slate-700/40 flex flex-col justify-center"
                style={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 flex-1 justify-center">
                  <div className="relative w-28 sm:w-32 md:w-40 lg:w-44 xl:w-48 h-28 sm:h-32 md:h-40 lg:h-44 xl:h-48 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-xl" />
                    <img
                      src="/images/aria-logo.png"
                      alt="ARIA Logo"
                      className="relative w-full h-full object-contain drop-shadow-lg sm:drop-shadow-[0_0_40px_rgba(249,115,22,0.85)]"
                    />
                  </div>

                  <div className="w-full space-y-2 sm:space-y-3 text-center">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-50">
                      Studio ARIA
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-2">
                      Design, développement web, identité de marque et
                      accompagnement digital.
                    </p>
                  </div>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-left text-xs sm:text-sm text-slate-300">
                    <div className="rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-700/60 p-2 sm:p-3">
                      <p className="font-semibold text-orange-300 mb-1 text-xs sm:text-sm">
                        Sites & Apps
                      </p>
                      <p className="text-[10px] sm:text-xs">
                        Interfaces modernes et performantes.
                      </p>
                    </div>
                    <div className="rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-700/60 p-2 sm:p-3">
                      <p className="font-semibold text-orange-300 mb-1 text-xs sm:text-sm">
                        Stratégie digitale
                      </p>
                      <p className="text-[10px] sm:text-xs">
                        Conseil UX et contenus résultats.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleScrollTo("contact")}
                    className="
                      mt-3 sm:mt-2 w-full sm:w-auto
                      inline-flex items-center justify-center
                      text-xs sm:text-sm font-medium
                      px-4 sm:px-5 md:px-6 py-2 sm:py-2.5
                      rounded-full relative
                      bg-gradient-to-r from-orange-500/15 via-orange-400/10 to-amber-300/15
                      border border-orange-300/70
                      text-orange-100 shadow-[0_0_0_1px_rgba(248,250,252,0.06)]
                      hover:from-orange-500/25 hover:via-amber-400/20 hover:to-yellow-300/25
                      hover:text-white hover:shadow-lg sm:hover:shadow-[0_12px_30px_rgba(251,146,60,0.45)]
                      backdrop-blur-md transition-all duration-300 group
                    "
                  >
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-orange-500/10 blur-md sm:blur-xl transition-opacity duration-300 pointer-events-none" />
                    <span className="relative flex items-center gap-1.5 sm:gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-300 animate-pulse shadow-sm sm:shadow-[0_0_10px_rgba(253,186,116,0.9)] flex-shrink-0" />
                      <span>Discuter de votre projet</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ STATS DESKTOP - Animation automatique en boucle (séquentielle) */}
            <div className="stats-desktop hidden lg:flex lg:flex-col lg:items-end lg:justify-center lg:ml-8 w-[180px] h-[380px]">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-orange-400/40 to-amber-400/40 rounded-xl blur-lg shadow-lg shadow-orange-500/50" />

              <div className="flex flex-col items-end gap-5 flex-1 justify-center space-y-1 relative z-10">
                {statsData.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="desktop-stat group relative w-full py-3 px-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/30 rounded-xl -z-10 scale-0 group-hover:scale-100 blur-sm transition-all duration-700" />

                    <div className="stat-card relative bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-slate-700/60 hover:border-orange-400/50 transition-all duration-500 hover:bg-slate-800/90 shadow-lg hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-[1.02]">
                      <div className="mb-2 overflow-hidden flex items-baseline">
                        <span
                          className="stat-number text-2xl lg:text-3xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-xl group-hover:drop-shadow-2xl transition-all duration-500 block leading-none"
                          data-value={stat.number}
                        >
                          0
                        </span>
                        <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-xl">
                          {stat.suffix}
                        </span>
                      </div>

                      <p className="text-xs uppercase tracking-wider font-semibold text-slate-300 group-hover:text-slate-100 group-hover:translate-x-1 transition-all duration-400 origin-left">
                        {stat.label}
                      </p>

                      <div className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-orange-400/60 to-amber-400/60 rounded-full scale-x-0 origin-left opacity-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-700 mx-auto" />
                    </div>
                  </div>
                ))}

                <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-orange-400/50 rounded-full blur-sm opacity-70" />
              </div>
            </div>

            {/* ✅ STATS MOBILE HORIZONTAL - Animation automatique en boucle (séquentielle) */}
            <div className="stats-mobile lg:hidden flex flex-row items-center justify-center gap-4 w-full h-[110px] p-3 mt-6">
              {statsData.map((stat, index) => (
                <div
                  key={stat.label}
                  className="mobile-stat group relative w-[80px] h-[85px] flex flex-col justify-center items-center flex-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/30 rounded-xl -z-10 scale-0 group-hover:scale-100 blur-sm transition-all duration-700" />

                  <div className="stat-card relative w-full h-full bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/60 hover:border-orange-400/50 transition-all duration-500 hover:bg-slate-800/90 shadow-lg hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 flex flex-col justify-center items-center p-2.5">
                    <div className="mb-1.5 overflow-hidden w-full flex justify-center items-baseline">
                      <span
                        className="stat-number text-[22px] md:text-[26px] font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-400 block leading-none"
                        data-value={stat.number}
                      >
                        0
                      </span>
                      <span className="text-[22px] md:text-[26px] font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
                        {stat.suffix}
                      </span>
                    </div>

                    <p className="text-[8px] md:text-[9px] uppercase tracking-wider font-semibold text-slate-300 group-hover:text-slate-100 transition-all duration-400 text-center leading-tight px-0.5">
                      {stat.label}
                    </p>

                    <div className="absolute bottom-1 left-1.5 right-1.5 h-[1.5px] bg-gradient-to-r from-orange-400/60 to-amber-400/60 rounded-full scale-x-0 origin-center opacity-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-700" />
                  </div>
                </div>
              ))}

              <div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 bg-orange-400/50 rounded-full blur-sm opacity-70" />
              <div className="absolute -right-1.5 -bottom-1.5 w-2.5 h-2.5 bg-amber-400/50 rounded-full blur-sm opacity-60" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
