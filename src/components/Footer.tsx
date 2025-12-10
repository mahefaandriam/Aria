const Footer = () => {
  return (
    <footer id="contact" className="relative bg-gradient-to-t from-black via-slate-950 to-slate-900 text-white overflow-hidden">
      {/* Halo de fond */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-20 left-10 w-64 h-64 bg-orange-500/30 blur-3xl rounded-full" />
        <div className="absolute -top-16 right-10 w-72 h-72 bg-orange-400/25 blur-3xl rounded-full" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
      </div>

      {/* Lignes fines décoratives */}
      <div className="pointer-events-none absolute inset-x-0 top-0 opacity-20">
        <div className="mx-auto max-w-6xl h-px bg-gradient-to-r from-transparent via-slate-500/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Contenu principal */}
        <div className="border-t border-white/10 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            {/* Company Info */}
            <div className="md:col-span-2 space-y-4 animate-fade-in-up">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-2xl blur opacity-60" />
                  <div className="relative bg-black/80 rounded-2xl p-1">
                    <img
                      src="/images/aria-logo.png"
                      alt="ARIA Logo"
                      className="h-11 w-11"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight">ARIA</h3>
                  <p className="text-xs uppercase tracking-[0.25em] text-orange-300/80">
                    Agences digitales
                  </p>
                </div>
              </div>

              <p className="text-white/70 mb-4 leading-relaxed text-sm md:text-base">
                Chaque projet est pour nous une aventure unique où créativité et technologie se rencontrent
                pour donner vie à votre vision. Nos réalisations témoignent de notre capacité à comprendre
                les enjeux spécifiques de différents secteurs.
              </p>

              <div className="inline-flex items-center space-x-1 px-3 py-2 rounded-full bg-orange-500/10 border border-orange-400/40 animate-fade-in-up delay-200">
                <span className="text-orange-400 text-lg">★</span>
                <span className="text-orange-400 text-lg">★</span>
                <span className="text-orange-400 text-lg">★</span>
                <span className="text-orange-400 text-lg">★</span>
                <span className="text-orange-400 text-lg">★</span>
                <span className="ml-2 text-white/70 text-xs font-medium tracking-wide">
                  ÉQUIPE ARIA
                </span>
              </div>
            </div>

            {/* Services */}
            <div className="animate-fade-in-up delay-100">
              <h4 className="text-lg font-semibold mb-4 text-orange-400">
                Nos Services
              </h4>
              <ul className="space-y-2 text-white/75 text-sm">
                {[
                  "Développement Web",
                  "Design UI/UX",
                  "Solutions E-commerce",
                  "Applications Mobile",
                  "Consulting Digital",
                  "Maintenance & Support",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center group"
                  >
                    <span className="mr-2 text-orange-400 group-hover:translate-x-0.5 transition-transform">
                      •
                    </span>
                    <span className="group-hover:text-orange-200 transition-colors duration-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="animate-fade-in-up delay-200">
              <h4 className="text-lg font-semibold mb-4 text-orange-400">
                Contact
              </h4>
              <div className="space-y-4 text-white/80 text-sm">
                <div className="group">
                  <p className="font-medium text-white mb-1">Email</p>
                  <p className="inline-flex items-center cursor-pointer group-hover:text-orange-300 transition-colors">
                    aria.madacom@gmail.com
                  </p>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Téléphone</p>
                  <p className="text-white/80">+261 32 03 682 18</p> 
                  <p className="text-white/80">+261 34 17 533 02</p>
                  <p className="text-white/80">+261 34 07 042 09</p>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Adresse</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Madagascar 
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Bas de footer */}
          <div className="border-t border-white/10 mt-10 pt-6 text-center space-y-2 animate-fade-in-up delay-300">
            <p className="text-white/60 text-xs md:text-sm">
              © 2025 ARIA - Agence de développement digital. Tous droits réservés.
            </p>
            <p className="text-white/40 text-[11px] md:text-xs max-w-3xl mx-auto leading-relaxed">
              Notre approche unique et notre engagement envers l'excellence nous permettent
              de nous démarquer et de fournir des solutions qui dépassent les attentes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
