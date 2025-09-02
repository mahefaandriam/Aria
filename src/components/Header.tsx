import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
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
      const progress = (scrollPosition / scrollHeight) * 100;
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        .header-backdrop {
          backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.8);
          border-bottom: 1px solid rgba(249, 115, 22, 0.2);
        }
        .mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease-in-out, opacity 0.4s ease-in-out;
          opacity: 0;
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
      `}</style>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "header-backdrop shadow-xl shadow-orange-500/20"
            : "bg-transparent"
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
                      ? "drop-shadow(0 0 10px rgba(249, 115, 22, 0.6))"
                      : "drop-shadow(0 0 5px rgba(249, 115, 22, 0.3))",
                  }}
                />
              </div>
              <div
                className={`transition-all duration-500 ${
                  scrolled ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
            
              </div>
            </div>
            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              {[
                { href: "#accueil", label: "Accueil", icon: "" },
                { href: "#about", label: "À Propos", icon: "" },
                { href: "#realisations", label: "Nos Réalisations", icon: "" },
                { href: "#services", label: "Nos Services", icon: "" },
                { href: "#contact", label: "Nos Contact", icon: "" },
              ].map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`nav-item relative px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium group ${
                    activeSection === item.href.substring(1)
                      ? "text-orange-400 active"
                      : scrolled
                      ? "text-gray-300 hover:text-orange-400"
                      : "text-white/90 hover:text-orange-400"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl animate-scale-in" />
                  )}
                </a>
              ))}
            </nav>
            {/* Bouton contact - Desktop */}
            <div className="hidden lg:block">
              <Button
                className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-500 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 overflow-hidden"
                onClick={() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="transition-all duration-300 group-hover:translate-x-1">
                    Parlons projet
                  </span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                className="relative w-10 h-10 flex flex-col justify-center items-center rounded-lg transition-all duration-300 hover:bg-orange-500/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X
                    className={`w-6 h-6 ${
                      scrolled ? "text-orange-400" : "text-white"
                    }`}
                  />
                ) : (
                  <Menu
                    className={`w-6 h-6 ${
                      scrolled ? "text-orange-400" : "text-white"
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
          {/* Menu Mobile */}
          <div
            className={`lg:hidden fixed inset-x-0 top-[70px] mobile-menu ${
              mobileMenuOpen ? "open" : ""
            }`}
          >
            <div className="container mx-auto px-6">
              <div className="bg-black/95 backdrop-blur-lg rounded-2xl shadow-2xl shadow-orange-500/20 border border-orange-500/10 p-6">
                <nav className="flex flex-col space-y-4">
                  {[
                    { href: "#accueil", label: "Accueil", icon: "" },
                    { href: "#about", label: "À Propos", icon: "" },
                    {
                      href: "#realisations",
                      label: "Nos Réalisations",
                      icon: "",
                    },
                    { href: "#services", label: "Nos Services", icon: "" },
                    { href: "#contact", label: "Nos Contact", icon: "" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mobile-menu-item px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeSection === item.href.substring(1)
                          ? "text-orange-400 bg-orange-500/10"
                          : "text-gray-300 hover:text-orange-400 hover:bg-orange-500/10"
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </a>
                  ))}
                  {/* Bouton contact version mobile */}
                  <Button
                    className="mobile-menu-button w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold px-8 py-3 rounded-xl"
                    onClick={() => {
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Parlons projet</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
          {/* Barre de progression scroll */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/30">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 transition-all duration-300 relative overflow-hidden"
              style={{ width: `${scrollProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;