const ApproachSection = () => {
    return (
      <section id="services" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-orange-500 mb-6 animate-fadeIn">
              Pourquoi ces projets nous différencient ?
            </h2>
          </div>
  
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-all duration-300 animate-fadeIn delay-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                      <span className="text-orange-500 text-xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-500">
                      Approche sur mesure
                    </h3>
                  </div>
                  <p className="text-gray-300">
                    Chaque industrie a ses particularités. Nous adaptons nos solutions aux besoins spécifiques de chaque secteur.
                  </p>
                </div>
  
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-all duration-300 animate-fadeIn delay-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                      <span className="text-orange-500 text-xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-500">
                      Qualité visuelle et technique
                    </h3>
                  </div>
                  <p className="text-gray-300">
                    Produits esthétiquement plaisants et techniquement robustes pour une expérience exceptionnelle.
                  </p>
                </div>
              </div>
  
              <div className="space-y-8">
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-all duration-300 animate-fadeIn delay-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                      <span className="text-orange-500 text-xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-500">
                      Performance optimale
                    </h3>
                  </div>
                  <p className="text-gray-300">
                    Sites rapides et réactifs avec des interfaces intuitives et accessibles.
                  </p>
                </div>
  
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-all duration-300 animate-fadeIn delay-400">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-full mr-4">
                      <span className="text-orange-500 text-xl font-bold">4</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-500">
                      Collaboration étroite
                    </h3>
                  </div>
                  <p className="text-gray-300">
                    Nous travaillons en étroite collaboration avec nos clients pour maximiser leur ROI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default ApproachSection;