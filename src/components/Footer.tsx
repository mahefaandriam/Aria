const Footer = () => {
  return (
    <footer id="contact" className="bg-black text-white">
      <div className="container mx-auto px-6 py-16">

        {/* Footer Content */}
        <div className="border-t border-white/20 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/images/aria-logo.png"
                  alt="ARIA Logo"
                  className="h-12 w-12"
                />
                <h3 className="text-2xl font-bold text-white">ARIA</h3>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                Chaque projet est pour nous une aventure unique où créativité et technologie se rencontrent
                pour donner vie à votre vision. Nos réalisations témoignent de notre capacité à comprendre
                les enjeux spécifiques de différents secteurs.
              </p>
              <div className="flex space-x-1 items-center">
                <span className="text-orange-500 text-lg">★</span>
                <span className="text-orange-500 text-lg">★</span>
                <span className="text-orange-500 text-lg">★</span>
                <span className="text-orange-500 text-lg">★</span>
                <span className="text-orange-500 text-lg">★</span>
                <span className="ml-2 text-white/70 text-sm">ÉQUIPE ARIA</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-500">Nos Services</h4>
              <ul className="space-y-2 text-white/80">
                <li>• Développement Web</li>
                <li>• Design UI/UX</li>
                <li>• Solutions E-commerce</li>
                <li>• Applications Mobile</li>
                <li>• Consulting Digital</li>
                <li>• Maintenance & Support</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-500">Contact</h4>
              <div className="space-y-3 text-white/80">
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="hover:text-orange-400 transition-colors">aria.madacom@gmail.com</p>
                </div>
                <div>
                  <p className="font-medium text-white">Téléphone</p>
                  <p>+262 693 52 16 26</p>
                </div>
                <div>
                  <p className="font-medium text-white">Adresse</p>
                  <p>................<br />Antananarivo, Madagascar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/60">
              © 2025 ARIA - Agence de développement digital. Tous droits réservés.
            </p>
            <p className="text-white/40 mt-2 text-sm">
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
