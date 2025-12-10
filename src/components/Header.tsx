import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronRight,
  Home,
  User,
  Image,
  Settings,
  Mail,
} from "lucide-react";
import "@/styles/animations.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollPosition / scrollHeight) * 100, 100);
      setScrollProgress(progress);

      const sections = [
        "accueil",
        "realisations",
        "services",
        "about",
        "contact",
      ];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileIcons = [
    { href: "#accueil", icon: Home, label: "Accueil" },
    { href: "#about", icon: User, label: "À Propos" },
    { href: "#realisations", icon: Image, label: "Réalisation" },
    { href: "#services", icon: Settings, label: "Services" },
    { href: "#contact", icon: Mail, label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @keyframes logoSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 107, 53, 0.3); }
          50% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.6), 0 0 30px rgba(255, 107, 53, 0.4); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* BOUTON CTA PREMIUM */
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.8), 0 0 60px rgba(249, 115, 22, 0.4); }
        }
        @keyframes ctaRipple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }

        /* ❄️ NEIGE ULTRA DENSE + PLUS VISIBLE (20 flakes, opacity 0.95) */
        @keyframes snowfall {
          0% {
            transform: translateY(-120%) translateX(0px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(150%) translateX(25px) rotate(720deg);
            opacity: 0;
          }
        }

        /* ❄️ DÉPÔT DE NEIGE RÉALISTE SUR LE BOUTON CTA */
        @keyframes snowDrift {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.95; }
          33% { transform: translateY(0.5px) translateX(0.5px); opacity: 0.92; }
          66% { transform: translateY(0.3px) translateX(-0.3px); opacity: 0.93; }
        }

        @keyframes snowSettle {
          0% { 
            transform: translateY(-2px) scale(0.95); 
            opacity: 0; 
          }
          100% { 
            transform: translateY(0px) scale(1); 
            opacity: 1; 
          }
        }

        .cta-premium {
          position: relative;
          background: linear-gradient(145deg, #f97316, #fb923c);
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 1rem 2.5rem;
          color: white !important;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          box-shadow: 
            0 10px 30px rgba(249, 115, 22, 0.4),
            0 4px 15px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          z-index: 10;
        }

        /* ❄️ GROS DÉPÔT PRINCIPAL */
.cta-premium::before {
  content: '';
  position: absolute;
  top: -18px;          /* encore un peu plus haut */
  left: -5%;           /* déborde légèrement sur les côtés */
  width: 110%;         /* dépasse le bouton */
  height: 22px;        /* dépôt bien épais */
  background:
    radial-gradient(ellipse 100% 80% at 15% 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.95) 70%, transparent 88%),
    radial-gradient(ellipse 95% 75% at 55% 5%, rgba(255,255,255,1) 35%, rgba(255,255,255,0.92) 68%, transparent 85%),
    radial-gradient(ellipse 85% 70% at 85% 8%, rgba(255,255,255,0.99) 30%, rgba(255,255,255,0.9) 62%, transparent 82%);
  border-radius: 16px 16px 8px 8px;
  filter: blur(0.3px) brightness(1.1);
  opacity: 1;
  pointer-events: none;
  z-index: 12;
  animation: snowDrift 6s ease-in-out infinite;
}

/* ❄️ COUCHE SUPPLÉMENTAIRE (EFFET TAS DE NEIGE) */
.cta-premium::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -3%;
  width: 106%;
  height: 16px;
  background:
    radial-gradient(12px 12px at 12% 30%, #fff 75%, transparent 85%),
    radial-gradient(10px 10px at 35% 20%, #fff 80%, transparent 88%),
    radial-gradient(9px 9px at 60% 25%, #fff 80%, transparent 88%),
    radial-gradient(11px 11px at 80% 35%, #fff 78%, transparent 88%),
    radial-gradient(8px 8px at 50% 55%, #fff 75%, transparent 88%);
  border-radius: 50%;
  filter: blur(0.2px);
  opacity: 1;
  pointer-events: none;
  z-index: 13;
  animation: snowDrift 7s ease-in-out infinite reverse;
}



        /* La neige suit légèrement le hover */
        .cta-premium:hover::before {
          transform: translateY(-1px);
          filter: blur(1.5px) brightness(1.05);
        }

        .cta-premium:active {
          transform: translateY(-2px) scale(1.02);
        }

        .cta-premium > div {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.7s;
        }

        .cta-premium:hover > div {
          left: 100%;
        }

        /* ❄️ 20 FLAKES ULTRA DENSE + PLUS VISIBLES */
        .snowflake {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          pointer-events: none;
          z-index: 5;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }
        .snowflake:nth-child(1) { width: 3px; height: 3px; animation: snowfall 3.2s linear infinite; left: 2%; animation-delay: 0s; }
        .snowflake:nth-child(2) { width: 5px; height: 5px; animation: snowfall 4.1s linear infinite; left: 12%; animation-delay: 0.5s; }
        .snowflake:nth-child(3) { width: 4px; height: 4px; animation: snowfall 3.8s linear infinite; left: 22%; animation-delay: 1.0s; }
        .snowflake:nth-child(4) { width: 6px; height: 6px; animation: snowfall 4.8s linear infinite; left: 32%; animation-delay: 1.5s; }
        .snowflake:nth-child(5) { width: 2px; height: 2px; animation: snowfall 2.9s linear infinite; left: 42%; animation-delay: 2.0s; }
        .snowflake:nth-child(6) { width: 7px; height: 7px; animation: snowfall 5.3s linear infinite; left: 52%; animation-delay: 0.2s; }
        .snowflake:nth-child(7) { width: 4px; height: 4px; animation: snowfall 4.0s linear infinite; left: 62%; animation-delay: 2.5s; }
        .snowflake:nth-child(8) { width: 5px; height: 5px; animation: snowfall 3.6s linear infinite; left: 72%; animation-delay: 0.8s; }
        .snowflake:nth-child(9) { width: 3px; height: 3px; animation: snowfall 4.4s linear infinite; left: 82%; animation-delay: 1.8s; }
        .snowflake:nth-child(10) { width: 6px; height: 6px; animation: snowfall 5.0s linear infinite; left: 92%; animation-delay: 2.2s; }
        .snowflake:nth-child(11) { width: 4px; height: 4px; animation: snowfall 3.5s linear infinite; left: 8%; animation-delay: 0.3s; }
        .snowflake:nth-child(12) { width: 5px; height: 5px; animation: snowfall 4.7s linear infinite; left: 18%; animation-delay: 1.2s; }
        .snowflake:nth-child(13) { width: 2px; height: 2px; animation: snowfall 3.1s linear infinite; left: 28%; animation-delay: 2.7s; }
        .snowflake:nth-child(14) { width: 7px; height: 7px; animation: snowfall 5.6s linear infinite; left: 38%; animation-delay: 0.7s; }
        .snowflake:nth-child(15) { width: 3px; height: 3px; animation: snowfall 4.2s linear infinite; left: 48%; animation-delay: 1.9s; }
        .snowflake:nth-child(16) { width: 6px; height: 6px; animation: snowfall 4.9s linear infinite; left: 58%; animation-delay: 2.4s; }
        .snowflake:nth-child(17) { width: 4px; height: 4px; animation: snowfall 3.7s linear infinite; left: 68%; animation-delay: 0.4s; }
        .snowflake:nth-child(18) { width: 5px; height: 5px; animation: snowfall 5.1s linear infinite; left: 78%; animation-delay: 1.6s; }
        .snowflake:nth-child(19) { width: 3px; height: 3px; animation: snowfall 3.9s linear infinite; left: 88%; animation-delay: 2.1s; }
        .snowflake:nth-child(20) { width: 6px; height: 6px; animation: snowfall 4.6s linear infinite; left: 98%; animation-delay: 0.9s; }

        /* Reste des styles identiques */
        .animate-logo-spin { animation: logoSpin 0.8s ease-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }

        .nav-link {
          position: relative;
          overflow: hidden;
        }
        .nav-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff6b35, #ff8c42);
          transition: width 0.3s ease;
        }
        .nav-link:hover::before,
        .nav-link.active::before {
          width: 100%;
        }

        .nav-item {
          position: relative;
          transition: all 0.3s ease;
        }
        .nav-item::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #f97316, #ea580c);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        .nav-item:hover::before,
        .nav-item.active::before {
          width: 100%;
        }
        .nav-item::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(249, 115, 22, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 8px;
        }
        .nav-item:hover::after {
          opacity: 1;
        }

        .logo-glow {
          position: relative;
        }
        .logo-glow::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #f97316, #ea580c, #f97316);
          border-radius: 50%;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
          filter: blur(8px);
        }
        .logo-glow:hover::before {
          opacity: 0.6;
          animation: pulse 2s ease-in-out infinite;
        }

        .header-always-blur {
          backdrop-filter: blur(35px) saturate(170%) brightness(102%);
          -webkit-backdrop-filter: blur(35px) saturate(170%) brightness(102%);
        }
        .header-backdrop {
          backdrop-filter: blur(40px) saturate(180%) brightness(105%);
          -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(105%);
          background:
            radial-gradient(circle at 15% 85%, rgba(249, 115, 22, 0.20), transparent 45%),
            radial-gradient(circle at 85% 15%, rgba(249, 115, 22, 0.15), transparent 45%),
            rgba(17, 24, 39, 0.96);
          border-bottom: 1px solid rgba(249, 115, 22, 0.40);
        }

        /* ✅ MENU HAMBURGER BLUR AMÉLIORÉ */
        .mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease-in-out, opacity 0.4s ease-in-out;
          opacity: 0;
          backdrop-filter: blur(25px) saturate(160%) brightness(105%);
          -webkit-backdrop-filter: blur(25px) saturate(160%) brightness(105%);
          background: rgba(15, 23, 42, 0.75);
          border-top: 1px solid rgba(249, 115, 22, 0.2);
        }
        .mobile-menu.open {
          max-height: 500px;
          opacity: 1;
        }
        .mobile-menu-item {
          animation: slideIn 0.4s ease-out forwards;
        }
        .mobile-menu-item:nth-child(1) { animation-delay: 0.1s; }
        .mobile-menu-item:nth-child(2) { animation-delay: 0.2s; }
        .mobile-menu-item:nth-child(3) { animation-delay: 0.3s; }
        .mobile-menu-item:nth-child(4) { animation-delay: 0.4s; }
        .mobile-menu-item:nth-child(5) { animation-delay: 0.5s; }
        .mobile-menu-button {
          animation: slideIn 0.4s ease-out forwards;
          animation-delay: 0.6s;
        }

        .mobile-icon {
          width: 24px;
          height: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
        }
        .mobile-icon:hover {
          transform: scale(1.15) rotate(8deg);
          filter: drop-shadow(0 4px 12px rgba(249, 115, 22, 0.5));
          background: rgba(249, 115, 22, 0.1);
        }
        .mobile-icon.active {
          color: #f97316 !important;
          background: rgba(249, 115, 22, 0.2);
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3);
        }
      `}</style>

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-700 header-always-blur ${
          scrolled
            ? "header-backdrop shadow-2xl shadow-orange-500/35"
            : "bg-slate-900/92 backdrop-blur-[45px] border-b border-orange-500/45"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={() => {
                document
                  .getElementById("accueil")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div
                className={`logo-glow relative transition-all duration-700 ease-out transform group-hover:scale-110 ${
                  scrolled ? "h-12 w-12" : "h-16 w-16"
                }`}
              >
                <img
                  src="/images/aria-logo.png"
                  alt="ARIA Logo"
                  className="w-full h-full object-contain transition-all duration-500 group-hover:rotate-12 filter drop-shadow-lg"
                  style={{
                    filter: scrolled
                      ? "drop-shadow(0 0 18px rgba(249, 115, 22, 0.85))"
                      : "drop-shadow(0 0 10px rgba(249, 115, 22, 0.6))",
                  }}
                />
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              {[
                { href: "#accueil", label: "Accueil", icon: "" },
                { href: "#about", label: "À Propos", icon: "" },
                { href: "#realisations", label: "Nos Réalisations", icon: "" },
                { href: "#services", label: "Nos Services", icon: "" },
                { href: "#contact", label: "Nos Contacts", icon: "" },
              ].map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`nav-item relative px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium group ${
                    activeSection === item.href.substring(1)
                      ? "text-orange-400 active"
                      : scrolled
                      ? "text-gray-200 hover:text-orange-400"
                      : "text-white/95 hover:text-orange-400"
                  }`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="flex items-center space-x-2 relative z-10">
                    <span className="text-xs group-hover:animate-bounce">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {hoveredItem === item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 to-orange-600/25 rounded-xl backdrop-blur-md" />
                  )}
                </a>
              ))}
            </nav>

            {/* 🚀 BOUTON CTA + NEIGE ULTRA DENSE + DÉPÔT DE NEIGE - DESKTOP */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 w-[240px] h-[100px]">
                {/* ❄️ 20 FLAKES ULTRA DENSE */}
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
              </div>

              <button
                className="cta-premium group relative"
                onClick={() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="relative z-10 flex items-center space-x-3 font-bold tracking-wide">
                  <span className="group-hover:translate-x-1 transition-transform duration-500">
                   Commencer maintenant
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>

            {/* Icône + burger mobile - ESPACEMENT MAXIMUM */}
            <div className="lg:hidden flex items-center space-x-14">
              {" "}
              {/* space-x-4 → space-x-6 */}
              <div className="flex items-center space-x-12">
                {" "}
                {/* space-x-3 → space-x-4 */}
                {mobileIcons.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`mobile-icon group p-4 ${
                        /* p-3 → p-4 */
                        activeSection === item.href.substring(1) ? "active" : ""
                      }`}
                    >
                      <IconComponent
                        className={`transition-all duration-300 w-7 h-7 ${
                          /* w-6 → w-7 */
                          activeSection === item.href.substring(1)
                            ? "text-orange-400"
                            : scrolled
                            ? "text-orange-300 hover:text-orange-200"
                            : "text-white hover:text-orange-300"
                        }`}
                      />
                    </a>
                  );
                })}
              </div>
              <button
                className="relative w-14 h-14 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 hover:bg-orange-500/40 p-3 ml-4 border-2 border-orange-500/50 backdrop-blur-sm shadow-xl" /* w-12→w-14, h-12→h-14, p-2→p-3, ml-2→ml-4, border→border-2, rounded-lg→rounded-2xl */
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X
                    className={`w-8 h-8 transition-colors ${
                      /* w-7 → w-8 */
                      scrolled ? "text-orange-400" : "text-white"
                    }`}
                  />
                ) : (
                  <Menu
                    className={`w-8 h-8 transition-colors ${
                      /* w-7 → w-8 */
                      scrolled ? "text-orange-400" : "text-white"
                    }`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* ✅ MENU MOBILE - BLUR RENFORCÉ + CONTRASTE AMÉLIORÉ */}
          <div
            className={`lg:hidden fixed inset-x-0 top-[70px] mobile-menu ${
              mobileMenuOpen ? "open" : ""
            }`}
          >
            <div className="container mx-auto px-6">
              <div className="bg-slate-900/85 backdrop-blur-[60px] rounded-2xl shadow-2xl shadow-orange-500/30 border border-orange-500/25 p-6">
                <nav className="flex flex-col space-y-4">
                  {[
                    { href: "#accueil", label: "Accueil" },
                    { href: "#about", label: "À Propos" },
                    { href: "#realisations", label: "Nos Réalisations" },
                    { href: "#services", label: "Nos Services" },
                    { href: "#contact", label: "Nos Contacts" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mobile-menu-item px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeSection === item.href.substring(1)
                          ? "text-orange-400 bg-orange-500/20"
                          : "text-gray-300 hover:text-orange-400 hover:bg-orange-500/15"
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </a>
                  ))}
                  <div className="relative">
                    <div className="absolute inset-0 w-full h-[120px]">
                      {/* ❄️ 20 FLAKES NEIGE MOBILE ULTRA DENSE */}
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="snowflake"
                          style={{
                            left: `${2 + i * 5}%`,
                            animationDelay: `${(i * 0.15).toFixed(1)}s`,
                            animationDuration: `${3 + i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                    <button
                      className="mobile-menu-button w-full mt-6 cta-premium text-lg py-4 px-8 !rounded-2xl shadow-2xl relative z-10"
                      onClick={() => {
                        document
                          .getElementById("contact")
                          ?.scrollIntoView({ behavior: "smooth" });
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span className="flex items-center justify-center space-x-3">
                        <span>🚀 Commencer projet</span>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                      </span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="pointer-events-none select-none">
            <div
              className="relative mx-auto w-full max-w-5xl"
              style={{ height: "0px" }}
            >
              <div
                className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 h-[6px] rounded-full overflow-hidden"
                style={{ width: `${Math.max(scrollProgress, 5)}%` }}
              >
                <div className="h-full w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 shadow-[0_0_18px_rgba(249,115,22,0.8)]">
                  <div
                    className="w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)]"
                    style={{ animation: "progressShine 2s infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
