import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight } from 'lucide-react';
import "@/styles/animations.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollPosition / scrollHeight) * 100;
      setScrollProgress(progress);

      const sections = ['accueil', 'realisations', 'services', 'apropos', 'contact'];
      const current = sections.find(section => {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          transition: max-height 0.4s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .mobile-menu.open {
          max-height: 400px;
          opacity: 1;
        }
      `}</style>

      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'header-backdrop shadow-xl shadow-orange-500/20' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => {
              document.getElementById('accueil')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <div className={`logo-glow relative transition-all duration-700 ease-out transform group-hover:scale-110 ${scrolled ? 'h-12 w-12' : 'h-16 w-16'}`}>
                <img
                  src="/images/aria-logo.png"
                  alt="ARIA Logo"
                  className="w-full h-full object-contain transition-all duration-500 group-hover:rotate-12 filter drop-shadow-lg"
                  style={{
                    filter: scrolled
                      ? 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.6))'
                      : 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.3))'
                  }}
                />
              </div>
              <div className={`transition-all duration-500 ${scrolled ? 'opacity-0 w-0' : 'opacity-100'}`}>
                <span className="text-white font-bold text-xl group-hover:text-orange-400 transition-colors duration-300">ARIA</span>
              </div>
            </div>

            {/* Navigation Desktop - CENTRÉ */}
            <nav className="hidden lg:flex items-center space-x-6">
              {[
                { href: '#accueil', label: 'Accueil', icon: '' },
                { href: '#about', label: 'À Propos', icon: '' },
                { href: '#realisations', label: 'Réalisations', icon: '' },
                { href: '#services', label: 'Services', icon: '' },
                { href: '#contact', label: 'Contact', icon: '' }
              ].map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`nav-item relative px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium group ${
                    activeSection === item.href.substring(1)
                      ? 'text-orange-400 active'
                      : scrolled
                        ? 'text-gray-300 hover:text-orange-400'
                        : 'text-white/90 hover:text-orange-400'
                  }`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="flex items-center space-x-2 relative z-10">
                    <span className="text-xs group-hover:animate-bounce">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {hoveredItem === item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl animate-scale-in" />
                  )}
                </a>
              ))}
            </nav>

            {/* Bouton contact - Déplacé à droite */}
            <div className="hidden lg:block">
              <Button
                className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-500 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 overflow-hidden"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="transition-all duration-300 group-hover:translate-x-1">Parlons projet</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                className={`hamburger-open relative w-10 h-10 flex flex-col justify-center items-center rounded-lg transition-all duration-300 hover:bg-orange-500/10 ${
                  mobileMenuOpen ? 'hamburger-open' : ''
                } ${scrolled ? 'text-orange-400' : 'text-white'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="hamburger-line line1 block w-6 h-0.5 bg-current transition-all duration-300 transform" />
                <span className="hamburger-line line2 block w-6 h-0.5 bg-current mt-1.5 transition-all duration-300 transform" />
                <span className="hamburger-line line3 block w-6 h-0.5 bg-current mt-1.5 transition-all duration-300 transform" />
              </button>
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