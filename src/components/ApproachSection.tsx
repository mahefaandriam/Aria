import React, { useRef } from 'react';

const TiltCard = ({ children }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateX = ((y - midY) / midY) * -10;
    const rotateY = ((x - midX) / midX) * 10;

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(0)
    `;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `
      perspective(900px)
      rotateX(0deg)
      rotateY(0deg)
      translateZ(0)
    `;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-200 will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

const ServicesSection = () => {
  return (
    <>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .service-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 18px;
          margin-bottom: 1.5rem;
        }
      `}</style>

      {/* Section Approche */}
      <section
        id="services"
        className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-black relative overflow-hidden"
      >
        {/* Fond décoratif */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-10 w-72 h-72 bg-orange-500/35 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-400/30 blur-3xl rounded-full" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-600/25 blur-3xl rounded-full" />
        </div>

        

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1 mb-4 rounded-full border border-orange-500/40 bg-orange-500/10 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              Notre approche
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500 mb-4 animate-fadeIn">
              Nos valeurs 
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-8">
                <TiltCard>
                  <div className="bg-slate-900/85 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-orange-500 hover:shadow-[0_24px_70px_rgba(249,115,22,0.55)] transition-all duration-300 animate-fadeIn delay-100">
                    <img
                      src="../../public/images/approche.avif"
                      alt="Approche sur mesure"
                      className="service-image"
                    />
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-500/20 w-11 h-11 rounded-full flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                        <span className="text-orange-300 text-xl font-bold">1</span>
                      </div>
                      <h3 className="text-xl font-bold text-orange-200">
                        Approche sur mesure
                      </h3>
                    </div>
                    <p className="text-gray-100/90 text-sm leading-relaxed">
                      Chaque industrie a ses particularités. Nous adaptons nos solutions aux besoins spécifiques de chaque secteur.
                    </p>
                  </div>
                </TiltCard>

                <TiltCard>
                  <div className="bg-slate-900/85 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-orange-500 hover:shadow-[0_24px_70px_rgba(249,115,22,0.55)] transition-all duration-300 animate-fadeIn delay-200">
                    <img
                      src="../../public/images/qualite.jpg"
                      alt="Qualité visuelle et technique"
                      className="service-image"
                    />
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-500/20 w-11 h-11 rounded-full flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                        <span className="text-orange-300 text-xl font-bold">2</span>
                      </div>
                      <h3 className="text-xl font-bold text-orange-200">
                        Qualité visuelle et technique
                      </h3>
                    </div>
                    <p className="text-gray-100/90 text-sm leading-relaxed">
                      Produits esthétiquement plaisants et techniquement robustes pour une expérience exceptionnelle.
                    </p>
                  </div>
                </TiltCard>
              </div>

              {/* Colonne droite */}
              <div className="space-y-8">
                <TiltCard>
                  <div className="bg-slate-900/85 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-orange-500 hover:shadow-[0_24px_70px_rgba(249,115,22,0.55)] transition-all duration-300 animate-fadeIn delay-300">
                    <img
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
                      alt="Performance optimale"
                      className="service-image"
                    />
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-500/20 w-11 h-11 rounded-full flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                        <span className="text-orange-300 text-xl font-bold">3</span>
                      </div>
                      <h3 className="text-xl font-bold text-orange-200">
                        Performance optimale
                      </h3>
                    </div>
                    <p className="text-gray-100/90 text-sm leading-relaxed">
                      Sites rapides et logiciels avec des interfaces intuitives et accessibles.
                    </p>
                  </div>
                </TiltCard>

                <TiltCard>
                  <div className="bg-slate-900/85 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-orange-500 hover:shadow-[0_24px_70px_rgba(249,115,22,0.55)] transition-all duration-300 animate-fadeIn delay-400">
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                      alt="Collaboration étroite"
                      className="service-image"
                    />
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-500/20 w-11 h-11 rounded-full flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                        <span className="text-orange-300 text-xl font-bold">4</span>
                      </div>
                      <h3 className="text-xl font-bold text-orange-200">
                        Collaboration étroite
                      </h3>
                    </div>
                    <p className="text-gray-100/90 text-sm leading-relaxed">
                      Nous travaillons en étroite collaboration avec nos clients pour maximiser leur ROI.
                    </p>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;
