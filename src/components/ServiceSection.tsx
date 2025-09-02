import React from 'react';

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
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
      `}</style>

      {/* Section Approche */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-orange-500 mb-6 animate-fadeIn">
              Pourquoi ces projets nous différencient ?
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 animate-fadeIn delay-100">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Approche sur mesure"
                    className="service-image"
                  />
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                      <span className="text-orange-500 text-xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-500">
                      Approche sur mesure
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Chaque industrie a ses particularités. Nous adaptons nos solutions aux besoins spécifiques de chaque secteur.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 animate-fadeIn delay-200">
                  <img 
                    src="https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Qualité visuelle et technique"
                    className="service-image"
                  />
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                      <span className="text-orange-500 text-xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-500">
                      Qualité visuelle et technique
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Produits esthétiquement plaisants et techniquement robustes pour une expérience exceptionnelle.
                  </p>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 animate-fadeIn delay-300">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
                    alt="Performance optimale"
                    className="service-image"
                  />
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                      <span className="text-orange-500 text-xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-500">
                      Performance optimale
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Sites rapides et réactifs avec des interfaces intuitives et accessibles.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 animate-fadeIn delay-400">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Collaboration étroite"
                    className="service-image"
                  />
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                      <span className="text-orange-500 text-xl font-bold">4</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-500">
                      Collaboration étroite
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Nous travaillons en étroite collaboration avec nos clients pour maximiser leur ROI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;