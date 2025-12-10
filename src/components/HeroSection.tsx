import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Sparkles,
  Zap,
  Target,
  CheckCircle,
  Star,
  Award,
  Palette,
  Code,
  TrendingUp,
} from "lucide-react";
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
  const particlesRef = useRef<HTMLDivElement>(null);
  const { offset } = useParallax(0.3);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // Créer des particules flottantes
  useEffect(() => {
    if (!particlesRef.current) return;

    const particlesContainer = particlesRef.current;
    const particlesCount = 15;

    for (let i = 0; i < particlesCount; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";

      // Position aléatoire
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = 2 + Math.random() * 3;
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 2;

      particle.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, rgba(249,115,22,0.3), rgba(59,130,246,0.3));
        border-radius: 50%;
        opacity: ${0.3 + Math.random() * 0.4};
        animation: float-particle ${duration}s ease-in-out ${delay}s infinite;
      `;

      particlesContainer.appendChild(particle);
    }

    return () => {
      if (particlesContainer) {
        particlesContainer.innerHTML = "";
      }
    };
  }, []);

  // Animation de la carte logo et des stats
  useGSAP(
    () => {
      // Animation spectaculaire de la carte logo
      if (logoCardRef.current) {
        const logoCard = logoCardRef.current;

        // Reset pour animation
        gsap.set(logoCard, {
          opacity: 0,
          scale: 0.8,
          y: 50,
          rotationX: 10,
          rotationY: -10,
        });

        // Animation principale de la carte
        gsap.to(logoCard, {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 1.6,
          delay: 0.5,
          ease: "elastic.out(1, 0.5)",
        });

        // Animation du halo
        const halo = logoCard.querySelector(".logo-halo");
        if (halo) {
          gsap.fromTo(
            halo,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 0.7,
              duration: 2,
              ease: "power2.out",
              delay: 0.8,
            }
          );
        }

        // Animation des badges de service avec stagger
        const badges = logoCard.querySelectorAll(".service-badge");
        gsap.fromTo(
          badges,
          {
            y: 20,
            opacity: 0,
            scale: 0.8,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            delay: 1.2,
            ease: "back.out(1.7)",
          }
        );

        // Animation du CTA
        const ctaButton = logoCard.querySelector(".logo-cta-button");
        if (ctaButton) {
          gsap.fromTo(
            ctaButton,
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              delay: 1.8,
              ease: "power2.out",
            }
          );
        }

        // Animation hover continue subtile
        gsap.to(logoCard, {
          y: -5,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.5,
        });
      }

      // Animation des stats (identique)
      animationRef.current = gsap.timeline({
        repeat: -1,
        delay: 2,
      });

      const desktopCards = gsap.utils.toArray(".desktop-stat .stat-card");
      const mobileCards = gsap.utils.toArray(".mobile-stat .stat-card");

      gsap.set([...desktopCards, ...mobileCards], {
        opacity: 0,
        scale: 0.8,
        y: 20,
      });

      const appearDuration = 0.7;
      const stayDuration = 0.8;
      const disappearDuration = 0.6;
      const allStayDuration = 1.5;

      desktopCards.forEach((card: any, index) => {
        const startTime = index * (appearDuration + stayDuration);
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

      const allVisibleTime =
        2 * (appearDuration + stayDuration) + allStayDuration;

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

      const totalCycleTime =
        allVisibleTime +
        2 * (disappearDuration + stayDuration) +
        disappearDuration;
      animationRef.current?.to({}, { duration: 1 }, totalCycleTime);
      animationRef.current?.play();

      return () => {
        if (animationRef.current) {
          animationRef.current.kill();
        }
      };
    },
    { scope: sectionRef }
  );

  // Rotation des mots (identique)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
      setTypedWord("");
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    { number: "40", label: "Projets", suffix: "+", icon: Award },
    { number: "100", label: "Satisfaction", suffix: "%", icon: Star },
    { number: "7", label: "Support", suffix: "/7", icon: Zap },
  ];

  const services = [
    {
      icon: Palette,
      label: "UI/UX Design",
      color: "from-purple-400 to-pink-400",
      bg: "bg-purple-500/10",
    },
    {
      icon: Code,
      label: "Dev Fullstack",
      color: "from-blue-400 to-cyan-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: TrendingUp,
      label: "Stratégie SEO",
      color: "from-green-400 to-emerald-400",
      bg: "bg-green-500/10",
    },
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
        
        /* NOUVEAUX STYLES POUR LA CARTE LOGO ASSOMBRIE */
        .logo-card-premium {
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 2px solid transparent;
          border-radius: 32px;
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          perspective: 1000px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(255, 255, 255, 0.02);
        }
        .logo-card-premium::before {
  content: '';
  position: absolute;
  inset: -2px;
  
  border-radius: 34px;
  z-index: -1;
  opacity: 0.8; /* Augmenté de 0.6 à 0.8 */
  filter: blur(25px); /* Augmenté de 20px à 25px */
  animation: border-glow 4s ease-in-out infinite;
}

.logo-card-premium::after {
  content: '';
  position: absolute;
  inset: 0;
 
  border-radius: 30px;
  z-index: -1;
  opacity: 0.9; /* Augmenté de 0.8 à 0.9 */
  filter: blur(15px); /* Ajout d'un flou pour diffuser la lumière */
}
        
        .logo-inner-glow {
          position: absolute;
          inset: 1px;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(249, 115, 22, 0.12) 0%,
            transparent 70%
          );
          border-radius: 30px;
          z-index: 1;
          pointer-events: none;
          opacity: 0.9;
        }
        
        .logo-halo {
          position: absolute;
          inset: -10px;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(249, 115, 22, 0.3) 0%,
            rgba(59, 130, 246, 0.15) 30%,
            transparent 70%
          );
          border-radius: 40px;
          filter: blur(40px);
          z-index: -2;
          opacity: 0;
        }
        
        .logo-sparkle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          filter: blur(1px);
          animation: sparkle-twinkle 2s infinite;
        }
        
        .service-badge {
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .service-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .service-badge:hover {
          transform: translateY(-4px) scale(1.05);
        }
        
        .service-badge:hover::before {
          opacity: 1;
        }
        
        .floating-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        /* ANIMATIONS */
        @keyframes border-glow {
          0%, 100% { opacity: 0.5; filter: blur(20px); }
          50% { opacity: 0.7; filter: blur(25px); }
        }
        
        @keyframes sparkle-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
            opacity: 0.2;
          }
          25% { 
            transform: translate(10px, -15px) rotate(90deg); 
            opacity: 0.4;
          }
          50% { 
            transform: translate(5px, -30px) rotate(180deg); 
            opacity: 0.2;
          }
          75% { 
            transform: translate(-5px, -20px) rotate(270deg); 
            opacity: 0.4;
          }
        }
        
        @keyframes logo-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-6px) rotate(0.3deg); }
          66% { transform: translateY(3px) rotate(-0.3deg); }
        }
        
        .logo-image-container {
          position: relative;
          filter: drop-shadow(0 0 25px rgba(249, 115, 22, 0.6));
          animation: logo-float 6s ease-in-out infinite;
        }
        
        .logo-image-container::after {
          content: '';
          position: absolute;
          inset: -10px;
          background: radial-gradient(
            circle at center,
            rgba(249, 115, 22, 0.3) 0%,
            transparent 70%
          );
          filter: blur(15px);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .logo-image-container:hover::after {
          opacity: 0.6;
        }
        
        .cursor-glow {
          background: radial-gradient(circle at center, rgba(249,115,22,0.2), transparent 60%);
        }
        
        .typewriter-word {
          border-right: 2px solid #f97316;
          white-space: nowrap;
          overflow: hidden;
          animation: blinkCaret 0.9s step-end infinite;
        }
        
        @keyframes blinkCaret {
          0%, 100% { border-color: transparent; }
          50% { border-color: #f97316; }
        }
        
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        @keyframes badge-icon-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(3deg); }
        }
        
        .badge-icon {
          animation: badge-icon-float 3s ease-in-out infinite;
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
          .logo-card-premium { 
            max-width: 300px !important; 
            height: 360px !important;
            padding: 1.25rem !important;
          }
          .service-badges { grid-template-columns: repeat(3, 1fr) !important; }
          .logo-image-container { 
            width: 100px !important;
            height: 100px !important;
          }
        }
        
        @media (max-width: 640px) {
          .hero-section { padding-top: 2rem; padding-bottom: 2rem; }
          .hero-title { font-size: 1.75rem !important; }
          .hero-buttons button { 
            width: 100% !important; 
            margin-bottom: 0.75rem !important; 
          }
          .service-badges { grid-template-columns: repeat(3, 1fr) !important; gap: 0.4rem !important; }
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

        {/* Orbes décoratives */}
        <div className="pointer-events-none hero-orbit absolute -right-4 sm:-right-20 md:-right-40 -top-16 sm:-top-20 md:-top-40 w-32 sm:w-48 md:w-[420px] h-32 sm:h-48 md:h-[420px] rounded-full opacity-30 sm:opacity-40 blur-xl sm:blur-3xl animate-float-slow" />
        <div className="pointer-events-none hero-orbit absolute -left-8 sm:-left-20 md:-left-32 bottom-[-40px] sm:bottom-[-60px] md:bottom-[-120px] w-24 sm:w-40 md:w-[360px] h-24 sm:h-40 md:h-[360px] rounded-full opacity-20 sm:opacity-30 blur-xl sm:blur-3xl animate-float-slow" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 pt-8 sm:pt-12 lg:pt-16">
          {/* Colonne gauche : texte */}
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

          {/* Colonne droite : carte logo assombrie + STATS */}
          <div className="w-full lg:w-auto order-1 lg:order-2 flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            {/* CARTE LOGO ASSOMBRIE */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end flex-1 max-w-sm sm:max-w-md lg:max-w-none">
              <div
                ref={logoCardRef}
                className="logo-card-premium relative p-6 sm:p-8 md:p-10 w-full group transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20"
                style={{ opacity: 0 }}
              >
                {/* Particules flottantes */}
                <div ref={particlesRef} className="floating-particles" />

                {/* Effets de lumière */}
                <div className="logo-halo" />
                <div className="logo-inner-glow" />

                {/* Étincelles décoratives */}
                <div
                  className="logo-sparkle"
                  style={{ top: "10%", left: "15%", animationDelay: "0s" }}
                />
                <div
                  className="logo-sparkle"
                  style={{ top: "20%", right: "20%", animationDelay: "0.5s" }}
                />
                <div
                  className="logo-sparkle"
                  style={{ bottom: "30%", left: "25%", animationDelay: "1s" }}
                />
                <div
                  className="logo-sparkle"
                  style={{
                    bottom: "15%",
                    right: "30%",
                    animationDelay: "1.5s",
                  }}
                />

                <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 flex-1 justify-center relative z-10">
                  {/* Logo avec animation flottante */}
                  <div className="logo-image-container">
                    <div className="relative w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44 h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 via-amber-500/15 to-orange-500/25 rounded-full blur-xl scale-105 opacity-50 animate-subtle-pulse" />
                      <img
                        src="/images/aria-logo.png"
                        alt="ARIA Logo"
                        className="relative w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Titre et description */}
                  <div className="w-full space-y-2 sm:space-y-3 text-center">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                      Studio{" "}
                      <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                        ARIA
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-2 max-w-xs mx-auto">
                      Excellence digitale : design, développement & stratégie
                      sur mesure
                    </p>
                  </div>

                  {/* CTA premium assombri */}
                  <button
                    onClick={() => handleScrollTo("contact")}
                    className="
                      logo-cta-button
                      mt-2 sm:mt-4 w-full
                      inline-flex items-center justify-center
                      text-sm sm:text-base font-semibold
                      px-4 sm:px-5 py-2.5 sm:py-3
                      rounded-xl relative
                      bg-gradient-to-r from-orange-500/25 via-orange-400/15 to-amber-300/25
                      border border-orange-500/40
                      text-slate-100 shadow-lg
                      hover:from-orange-500/35 hover:via-amber-400/25 hover:to-yellow-300/35
                      hover:shadow-xl hover:shadow-orange-500/30
                      hover:border-orange-400/60
                      hover:text-white
                      backdrop-blur-md transition-all duration-300 group overflow-hidden
                    "
                  >
                    {/* Effet de fond animé */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-400/10 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    {/* Points d'effet */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-300/70 rounded-full blur-sm" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-300/70 rounded-full blur-sm" />

                    <span className="relative flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-bold">Démarrer mon projet</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* STATS DESKTOP */}
            <div className="stats-desktop hidden lg:flex lg:flex-col lg:items-end lg:justify-center lg:ml-8 w-[180px] h-[380px]">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-orange-400/30 to-amber-400/30 rounded-xl blur-lg shadow-lg shadow-orange-500/40" />

              <div className="flex flex-col items-end gap-5 flex-1 justify-center space-y-1 relative z-10">
                {statsData.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="desktop-stat group relative w-full py-3 px-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/15 to-amber-400/25 rounded-xl -z-10 scale-0 group-hover:scale-100 blur-sm transition-all duration-700" />

                      <div className="stat-card relative bg-slate-500/5 backdrop-blur-sm rounded-xl p-4 border border-slate-700/40 hover:border-orange-400/25 transition-all duration-500 hover:bg-slate-900/30 shadow-none hover:shadow-md hover:shadow-orange-500/20 hover:scale-[1.01]">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-orange-400/90" />
                          <div className="overflow-hidden flex items-baseline">
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
                        </div>

                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-400 origin-left">
                          {stat.label}
                        </p>

                        <div className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-orange-400/40 to-amber-400/40 rounded-full scale-x-0 origin-left opacity-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-700 mx-auto" />
                      </div>
                    </div>
                  );
                })}

                <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-orange-400/40 rounded-full blur-sm" />
              </div>
            </div>

            {/* STAT MOBILE HORIZONTAL */}
            <div className="stats-mobile lg:hidden flex flex-row items-center justify-center gap-3 sm:gap-4 w-full h-[100px] p-3 mt-4">
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="mobile-stat group relative w-[75px] sm:w-[80px] h-[80px] flex flex-col justify-center items-center flex-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/15 to-amber-400/25 rounded-xl -z-10 scale-0 group-hover:scale-100 blur-sm transition-all duration-700" />

                    <div className="stat-card relative w-full h-full bg-slate-900/20 backdrop-blur-sm rounded-xl border border-slate-600/40 hover:border-orange-400/25 transition-all duration-500 hover:bg-slate-900/25 shadow-none hover:shadow-md hover:shadow-orange-500/20 hover:scale-102 flex flex-col justify-center items-center p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Icon className="w-3 h-3 text-orange-400/90" />
                        <div className="overflow-hidden flex items-baseline">
                          <span
                            className="stat-number text-[18px] sm:text-[20px] font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-400 block leading-none"
                            data-value={stat.number}
                          >
                            0
                          </span>
                          <span className="text-[18px] sm:text-[20px] font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
                            {stat.suffix}
                          </span>
                        </div>
                      </div>

                      <p className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-slate-400 group-hover:text-slate-300 transition-all duration-400 text-center leading-tight px-0.5">
                        {stat.label}
                      </p>

                      <div className="absolute bottom-1 left-1.5 right-1.5 h-[1px] bg-gradient-to-r from-orange-400/40 to-amber-400/40 rounded-full scale-x-0 origin-center opacity-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-700" />
                    </div>
                  </div>
                );
              })}

              <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-orange-400/40 rounded-full blur-sm" />
              <div className="absolute -right-1.5 -bottom-1.5 w-2 h-2 bg-amber-400/40 rounded-full blur-sm" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
