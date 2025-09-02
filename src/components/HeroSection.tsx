import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useScrollAnimation, useTypewriter, useParallax } from "@/hooks/useScrollAnimation";
import { ChevronDown, Sparkles, Zap, Rocket } from 'lucide-react';
import "@/styles/animations.css";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { offset } = useParallax(0.3);

  const dynamicWords = [
    "défis digitaux",
    "idées innovantes",
    "projets ambitieux",
    "visions créatives"
  ];

  const { displayText, isComplete } = useTypewriter(
    "Transformons vos " + dynamicWords[currentWordIndex] + " en opportunités de croissance",
    30,
    true
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 4000);
    return () => clearInterval(interval);
  },);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <>
      {/* Styles avancés */}
      <style>{`
        .hero-gradient {
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(15, 15, 15, 0.8) 25%,
            rgba(30, 30, 30, 0.7) 50%,
            rgba(15, 15, 15, 0.8) 75%,
            rgba(0, 0, 0, 0.9) 100%
          );
        }
          @keyframes typewriter {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blinkCaret {
  0%, 100% { border-color: transparent }
  50% { border-color: orange }
}

@keyframes typewriter {
  from { width: 0 }
  to { width: 100% }
}

@keyframes textColorShift {
  0%   { color: #ffffff; }
  50%  { color: #f97316; }
  100% { color: #ffffff; }
}

.typewriter-text {
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: 0.05em;
  width: fit-content;
  display: inline-block;
  animation: 
    typewriter 4s steps(60, end),
    textColorShift 2s ease-in-out infinite;
}




        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .floating-element {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1));
          animation: floatingElement 6s ease-in-out infinite;
        }

        @keyframes floatingElement {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(-10px) rotate(240deg); }
        }

        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
        }

        .interactive-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(45deg, #f97316, #ea580c);
          transition: all 0.3s ease;
        }

        .interactive-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .interactive-button:hover::before {
          left: 100%;
        }

        .scroll-indicator {
          animation: bounceScroll 2s ease-in-out infinite;
        }

        @keyframes bounceScroll {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .logo-container {
          position: relative;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .logo-container:hover {
          transform: scale(1.05) rotate(2deg);
        }

        .logo-container::after {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #ea580c);
          opacity: 0;
          z-index: -1;
          transition: opacity 0.4s ease;
        }

        .logo-container:hover::after {
          opacity: 0.3;
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Section Hero avec fond interactif */}
      <section
        ref={sectionRef}
        id="accueil"
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('/images/cover.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateY(${offset * 0.5}px)`
        }}
      >
        {/* Overlay interactif avec gradient dynamique */}
        <div
          className="absolute inset-0 hero-gradient"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(249, 115, 22, 0.2) 0%, transparent 50%)`
          }}
        />

        {/* Éléments flottants interactifs */}
        <div className="floating-elements">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                animationDelay: `${Math.random() * 6}s`,
                transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center">
  <div className="max-w-5xl mx-auto text-center">
  {/* Logo avec effets avancés - remonter vers le header */}
  <div className="flex justify-center mb-6">
    <div className="logo-container animate-bounce-in mt-8 md:mt-10 relative">
      <img
        src="/images/aria-logo.png"
        alt="ARIA Logo"
        className="h-48 md:h-56 lg:h-64 w-auto filter drop-shadow-2xl"
        style={{
          filter: `drop-shadow(0 0 30px rgba(249, 115, 22, 0.8))`
        }}
      />
      <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/30 to-orange-600/30 rounded-full blur-2xl opacity-85 animate-pulse-custom" />
    </div>
  </div>

  

  {/* Texte de présentation */}
  {/* <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed max-w-4xl mx-auto animate-fade-in-up delay-300">
    <span className="block animate-fade-in-left delay-500">
      Chaque projet est pour nous une aventure unique où
    </span>
    <span className="block animate-fade-in-right delay-700 text-orange-300 font-semibold">
      créativité et technologie se rencontrent
    </span>
    <span className="block animate-fade-in-left delay-1000">
      pour donner vie à votre vision et dépasser vos attentes.
    </span>
  </p> */}
  <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed max-w-4xl mx-auto">
  <span className="typewriter-text block text-orange-300 font-semibold">
    Chaque projet est pour nous une aventure unique où créativité et <br />
    technologie se rencontrent pour donner vie à votre vision et dépasser vos
    <br /> attentes.
  </span>
</p>


 

 <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-1000">
  {/* Bouton 1 - scroll vers #realisations */}
  <Button
    className="interactive-button group text-lg px-10 py-6 rounded-full font-bold text-black shadow-2xl transform hover:scale-105 transition-all duration-300 hover-lift"
    style={{
      boxShadow: '0 10px 40px rgba(249, 115, 22, 0.4)'
    }}
    onClick={() => {
      document.getElementById('realisations')?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    <span className="flex items-center space-x-2">
      <Rocket className="w-5 h-5 group-hover:animate-bounce" />
      <span>Découvrir nos réalisations</span>
    </span>
  </Button>

  {/* Bouton 2 - scroll vers #about */}
  <Button
    variant="outline"
    className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black px-8 py-6 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm bg-black/20"
    onClick={() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    <span className="flex items-center space-x-2">
      <span>En savoir plus</span>
      <ChevronDown className="w-4 h-4" />
    </span>
  </Button>
</div>

   {/* Statistiques animées */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6 mb-12 animate-fade-in-up delay-1000">
    {[
      { number: "+50", label: "Projets réalisés" },
      { number: "+5", label: "Années d'expérience" },
      { number: "98%", label: "Clients satisfaits" },
      { number: "24/7", label: "Support client" }
    ].map((stat, index) => (
      <div
        key={index}
        className="text-center group cursor-pointer"
        style={{ animationDelay: `${1200 + index * 100}ms` }}
      >
        <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
          {stat.number}
        </div>
        <p className="text-gray-300 text-sm uppercase tracking-wider">{stat.label}</p>
      </div>
    ))}
  </div>
</div>


</div>



        {/* Indicateur de scroll animé */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in-up delay-1000">
          <div className="scroll-indicator cursor-pointer" onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <ChevronDown className="w-8 h-8 text-orange-400 hover:text-orange-300 transition-colors" />
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
