import React, { useState, useEffect, useRef } from 'react';
import { Users, Target, Heart, Award, Code, Palette, Rocket, Shield, ArrowRight } from 'lucide-react';

// Mock Button component
const Button = ({ children, className, ...props }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Importez vos images ou utilisez des placeholders
const missionImage = "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
const visionImage = "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
const valuesImage = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
const process1 = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process2 = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process3 = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process4 = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const backgroundVideo = "/videos/2715412-uhd_3840_2160_30fps.mp4";

const AboutSection = () => {
  const videoRef = useRef(null);

  // Gestion de la vidéo de fond
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          videoRef.current.muted = true;
          videoRef.current.play();
        });
      }
    }
  }, []);

  return (
    <>
      <style>{`
        .gradient-border {
          background: linear-gradient(45deg, #f97316, #ea580c);
          padding: 2px;
          border-radius: 12px;
        }
        
        .gradient-border-inner {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border-radius: 10px;
          height: 100%;
        }
        
        .process-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #f97316;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(31, 41, 55, 0.85);
          z-index: 1;
        }

        .white-gradient-card {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border: 1px solid #e2e8f0;
        }

        .white-gradient-card-alt {
          background: linear-gradient(135deg, #f8fafc, #ffffff);
          border: 1px solid #e2e8f0;
        }
      `}</style>

      {/* Section À propos avec vidéo de fond */}
      <section id="about" className="pt-10 pb-20 bg-gray-900 relative overflow-hidden">
        {/* Vidéo de fond */}
        <video
          ref={videoRef}
          className="video-background"
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/2715412-uhd_3840_2160_30fps.mp4"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
        
        {/* Overlay pour assurer la lisibilité du contenu */}
        <div className="video-overlay"></div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5 z-2">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-600 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Titre principal */}
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 text-center mb-16 animate-fadeIn">
              Notre Approche
            </h2>

            {/* Section Mission, Vision, Valeurs - Tout en haut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
              {/* Mission */}
              <div className="relative group overflow-hidden rounded-2xl shadow-xl min-h-[400px] hover:shadow-2xl transition-all duration-500">
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(${missionImage})`,
                    backgroundPosition: 'center center'
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent h-1/3">
                  <div className="flex flex-col h-full justify-end">
                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center mb-2 ml-auto group-hover:rotate-12 transition-transform duration-300">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Mission</h3>
                    <p className="text-white/90 text-sm leading-tight">
                    Chez ARIA, nous croyons que chaque entreprise mérite une présence digitale qui reflète son unicité. Notre mission est d'accompagner nos clients dans leur transformation numérique en créant des solutions innovantes, performantes et sur mesure qui génèrent un impact réel sur leur croissance

                    </p>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="relative group overflow-hidden rounded-2xl shadow-xl min-h-[400px] hover:shadow-2xl transition-all duration-500">
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(${visionImage})`,
                    backgroundPosition: 'center center'
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent h-1/3">
                  <div className="flex flex-col h-full justify-end">
                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center mb-2 ml-auto group-hover:rotate-12 transition-transform duration-300">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Vision</h3>
                    <p className="text-white/90 text-sm leading-tight">
                    Être le partenaire privilégié des entreprises ambitieuses qui souhaitent exploiter pleinement le potentiel du digital. Nous aspirons à créer des expériences numériques exceptionnelles qui connectent véritablement les marques à leur audience

                    </p>
                  </div>
                </div>
              </div>

              {/* Valeurs */}
              <div className="relative group overflow-hidden rounded-2xl shadow-xl min-h-[400px] hover:shadow-2xl transition-all duration-500">
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(${valuesImage})`,
                    backgroundPosition: 'center center'
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent h-1/3">
                  <div className="flex flex-col h-full justify-end">
                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center mb-2 ml-auto group-hover:rotate-12 transition-transform duration-300">
                      <Heart className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Valeurs</h3>
                    <p className="text-white/90 text-sm leading-tight">
                     L'excellence technique, la créativité sans limites, et l'écoute attentive de nos clients sont au cœur de tout ce que nous faisons. Nous privilégions la transparence, l'innovation et la collaboration pour créer des partenariats durables et fructueux

                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* Contenu secondaire */}
          <div className="relative rounded-2xl p-8 shadow-lg overflow-hidden">
            {/* Nouvelle vidéo de fond pour cette section */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src="/videos/planet.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas les vidéos HTML5.
            </video>
            
            {/* Overlay semi-transparent pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-black/30 z-1"></div>
            
            {/* Contenu avec position relative pour apparaître au-dessus */}
            <div className="relative z-10">
              {/* Section principale avec contenu et statistiques */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
                {/* Colonne de gauche - Statistiques et Expertises */}
                <div className="space-y-6">
                  {/* Grille de statistiques compacte */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "50+", label: "Projets réalisés" },
                      { value: "5+", label: "Années d'expérience" },
                      { value: "98%", label: "Clients satisfaits" },
                      { value: "24/7", label: "Support client" }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        className="gradient-border group cursor-pointer hover:shadow-md transition-all duration-300"
                      >
                        <div className="gradient-border-inner p-4 text-center h-full bg-white/90 backdrop-blur-sm">
                          <div className="text-3xl font-bold text-orange-500 mb-1 group-hover:scale-105 transition-transform duration-300">
                            {stat.value}
                          </div>
                          <p className="text-gray-700 text-xs md:text-sm">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bloc Expertises compact */}
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center">
                      <Code className="w-6 h-6 mr-2" />
                      Nos Expertises
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: <Code className="w-4 h-4 text-orange-500" />, label: "Développement" },
                        { icon: <Palette className="w-4 h-4 text-orange-500" />, label: "Design UI/UX" },
                        { icon: <Rocket className="w-4 h-4 text-orange-500" />, label: "Marketing Digital" },
                        { icon: <Shield className="w-4 h-4 text-orange-500" />, label: "Maintenance" }
                      ].map((service, i) => (
                        <div 
                          key={i}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100/50 transition-colors duration-200"
                        >
                          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                            {service.icon}
                          </div>
                          <span className="text-gray-700 text-sm">{service.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colonne de droite - Équipe et CTA */}
                <div className="space-y-6">
                  {/* Bloc Équipe avec style brique */}
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg relative overflow-hidden min-h-[250px]">
                    <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0" 
                        style={{ backgroundImage: "url('brick-pattern.png')" }}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-orange-500">Notre Équipe</h3>
                          <p className="text-gray-600 text-xs">Professionnels dédiés à votre succès</p>
                        </div>
                      </div>
                      
                      {/* Avatar team horizontaux */}
                      <div className="flex justify-start mb-4 overflow-x-auto pb-2">
                        <div className="flex space-x-3">
                          {[
                            'https://randomuser.me/api/portraits/men/32.jpg',     // Homme
                        'https://randomuser.me/api/portraits/women/45.jpg',   // Femme
                        'https://randomuser.me/api/portraits/men/76.jpg',     // Homme
                        'https://randomuser.me/api/portraits/women/68.jpg',   // Femme
                        'https://randomuser.me/api/portraits/men/21.jpg'      // Homme
                          ].map((url, i) => (
                            <div 
                              key={i}
                              className="w-10 h-10 bg-white rounded-full border-2 border-orange-400 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-sm overflow-hidden"
                            >
                              <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Notre équipe multidisciplinaire réunit des experts passionnés : développeurs full-stack, 
                          designers UI/UX et consultants en stratégie digitale.
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Ensemble, nous formons une équipe soudée déterminée à repousser les limites 
                          du possible pour vos projets.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA élargi */}
                  <div className="text-center">
                    <div className="relative inline-block group w-full max-w-md mx-auto">
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                      <Button 
                        className="relative bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-base w-full transition-all duration-300 group-hover:scale-[1.02]"
                        style={{ boxShadow: "0 4px 14px rgba(234, 88, 12, 0.3)" }}
                      >
                        Parlons de votre projet
                        <ArrowRight className="w-4 h-4 ml-2 inline" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section processus avec timeline */}
              <div className="bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold text-orange-500 text-center mb-12">Notre Processus</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { image: process1, title: "Écoute", desc: "Analyse de vos besoins" },
                    { image: process2, title: "Création", desc: "Design & développement" },
                    { image: process3, title: "Lancement", desc: "Mise en production" },
                    { image: process4, title: "Support", desc: "Maintenance & évolution" }
                  ].map((step, index) => (
                    <div key={index} className="text-center group">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 mx-auto group-hover:scale-110 transition-transform duration-300">
                          <img 
                            src={step.image} 
                            alt={step.title}
                            className="process-image w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-black mb-2">{step.title}</h4>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;