import React, { useEffect, useRef } from 'react';
import { Users, Target, Heart, Award, Code, Palette, Rocket, Shield, ArrowRight } from 'lucide-react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const missionImage = "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
const visionImage = "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
const valuesImage = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
const process1 = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process2 = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process3 = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process4 = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process5 = "/images/process-4.jpg";
const backgroundVideo = "/videos/2715412-uhd_3840_2160_30fps.mp4";

const AboutSection = () => {
  const videoRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const processRef = useRef(null);
  const processCirclesRefs = useRef([]);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          videoRef.current.muted = true;
          videoRef.current.play();
        });
      }
    }

    // Animation carte gauche (lentement de la gauche ↔ droite)
    if (leftCardRef.current) {
      gsap.fromTo(leftCardRef.current, 
        { x: "-15vw", opacity: 0 }, 
        {
          x: 0,
          opacity: 1,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: leftCardRef.current,
            start: "top 85%",
            end: "bottom 20%",
            scrub: 1.5,
            toggleActions: "play reverse play reverse"
          }
        }
      );
    }

    // Animation carte droite (lentement de la droite ↔ gauche)
    if (rightCardRef.current) {
      gsap.fromTo(rightCardRef.current, 
        { x: "15vw", opacity: 0 }, 
        {
          x: 0,
          opacity: 1,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rightCardRef.current,
            start: "top 85%",
            end: "bottom 20%",
            scrub: 1.5,
            toggleActions: "play reverse play reverse"
          }
        }
      );
    }

    // Animation cercles processus (chacun son coin)
    if (processRef.current && processCirclesRefs.current.length === 5) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 90%",
          end: "bottom 10%",
          scrub: 2,
          toggleActions: "play reverse play reverse"
        }
      });

      // Positions des coins pour chaque cercle
      const positions = [
        { x: "-40%", y: "-40%" },  // 1: haut-gauche
        { x: "40%", y: "-40%" },   // 2: haut-droite
        { x: "-40%", y: "40%" },   // 3: bas-gauche
        { x: "40%", y: "40%" },    // 4: bas-droite
        { x: "0%", y: "0%" }       // 5: centre (fixe)
      ];

      processCirclesRefs.current.forEach((circle, index) => {
        if (circle) {
          tl.fromTo(circle, 
            { 
              x: positions[index].x, 
              y: positions[index].y,
              scale: 0.3,
              rotation: -180
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 1.5,
              ease: "power3.out"
            }, 0);
        }
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <style>{`
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
          background: radial-gradient(circle at top left, rgba(249,115,22,0.25), transparent 55%),
                      radial-gradient(circle at bottom right, rgba(249,115,22,0.35), rgba(15,23,42,0.95) 60%);
          z-index: 1;
        }

        .glass-panel {
          background: linear-gradient(135deg, rgba(15,23,42,0.4), rgba(15,23,42,0.85));
          border-radius: 24px;
          border: 1px solid rgba(148,163,184,0.35);
          box-shadow:
            0 24px 80px rgba(15,23,42,0.8),
            0 0 0 1px rgba(15,23,42,0.8);
        }

        .card-glass {
          background: linear-gradient(145deg, rgba(15,23,42,0.85), rgba(15,23,42,0.6));
          border-radius: 18px;
          border: 1px solid rgba(148,163,184,0.4);
          box-shadow:
            0 20px 40px rgba(15,23,42,0.65),
            0 0 0 1px rgba(15,23,42,0.8);
        }

        .card-light {
          background: linear-gradient(145deg, rgba(248,250,252,0.96), rgba(241,245,249,0.98));
          border-radius: 20px;
          border: 1px solid rgba(226,232,240,0.9);
          box-shadow:
            0 18px 45px rgba(15,23,42,0.25),
            0 0 0 1px rgba(148,163,184,0.35);
        }

        .process-image-ring {
          position: relative;
        }

        .process-image-ring::before {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          background: conic-gradient(from 180deg, #f97316, #fb923c, #fdba74, #f97316);
          opacity: 0.5;
          filter: blur(4px);
          z-index: -1;
        }

        .process-circle {
          position: relative;
          transform-origin: center;
        }
      `}</style>

      <section id="about" className="pt-16 pb-24 bg-gray-100 relative overflow-hidden">
        {/* Vidéo de fond principale */}
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

        {/* Overlay global */}
        <div className="video-overlay" />

        {/* Décor lumineux */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-20 -left-10 w-72 h-72 bg-orange-500/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-400/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-orange-600/40 rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Bloc principal avec seconde vidéo */}
            <div className="relative glass-panel p-[1px]">
              <div className="relative rounded-[22px] overflow-hidden">
                {/* Vidéo interne */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                >
                  <source src="/videos/planet.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas les vidéos HTML5.
                </video>

                {/* Overlay interne */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-black/80" /> */}

                {/* Contenu */}
                <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 space-y-10">
                  <div className="w-full flex justify-center">
                    <h2 className="text-4xl md:text-5xl text-center font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.55)]">
                      A Propos
                    </h2>
                  </div>

                  {/* Deux colonnes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                    {/* Colonne gauche */}
                    <div className="space-y-6">
                      {/* Carte Expertises */}
                      <div ref={leftCardRef} className="card-light bg-white/95 backdrop-blur-xl p-6 sm:p-7 relative overflow-hidden">
                        <h3 className="text-lg sm:text-xl font-bold text-orange-500 mb-5 flex items-center">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 mr-3">
                            <Code className="w-5 h-5 text-orange-500" />
                          </span>
                          Nos Expertises
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { icon: <Code className="w-4 h-4 text-orange-500" />, label: "Développement" },
                            { icon: <Palette className="w-4 h-4 text-orange-500" />, label: "Design UI/UX" },
                            { icon: <Rocket className="w-4 h-4 text-orange-500" />, label: "Marketing Digital" },
                            { icon: <Shield className="w-4 h-4 text-orange-500" />, label: "Maintenance" }
                          ].map((service, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-slate-50/80 hover:bg-orange-50/80 border border-slate-200/80 hover:border-orange-200 transition-all duration-200"
                            >
                              <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                {service.icon}
                              </div>
                              <span className="text-gray-800 text-sm font-medium">
                                {service.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Colonne droite */}
                    <div className="space-y-6">
                      {/* Carte Équipe */}
                      <div ref={rightCardRef} className="card-light bg-white/95 backdrop-blur-xl p-6 sm:p-7 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.18),transparent_55%)] opacity-80 pointer-events-none"
                        />
                        <div className="relative z-10">
                          <div className="flex items-start mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-3 shadow-md shadow-orange-500/40">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-orange-500">Notre Équipe</h3>
                              <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">
                                Professionnels dédiés à votre succès
                              </p>
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
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-sm group">
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition duration-300" />
                      <Button
                        className="relative w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 
                        text-white px-6 py-3.5 text-base rounded-2xl 
                        flex items-center justify-center gap-2 
                        shadow-[0_14px_35px_rgba(234,88,12,0.45)]
                        group-hover:-translate-y-1 transition-all"
                      >
                        Parlons de votre projet
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Processus */}
                  <div ref={processRef} className="card-glass mt-6 border border-white/10 bg-white/5 backdrop-blur-2xl px-5 sm:px-7 py-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-9 tracking-tight">
                      Notre Processus
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                      {[
                        { image: process1, title: "Écoute", desc: "Analyse de vos besoins" },
                        { image: process2, title: "Création", desc: "Design & développement" },
                        { image: process3, title: "Lancement", desc: "Mise en production" },
                        { image: process4, title: "Supports", desc: "Maintenance & évolution" },
                        { image: process5, title: "Conseils", desc: "Accompagnement & recommandations personnalisées" }
                      ].map((step, index) => (
                        <div key={index} className="text-center group flex flex-col items-center">
                          <div className="process-image-ring mb-4 process-circle" ref={el => {
                            if (el) processCirclesRefs.current[index] = el;
                          }}>
                            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-[3px] border-orange-400/80 shadow-[0_0_30px_rgba(249,115,22,0.6)] group-hover:shadow-[0_0_45px_rgba(249,115,22,0.9)] transition-all duration-500">
                              <img
                                src={step.image}
                                alt={step.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="absolute -right-1 -top-1 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-orange-500/60">
                              {index + 1}
                            </div>
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-1">
                            {step.title}
                          </h4>
                          <p className="text-sm text-slate-100/80">
                            {step.desc}
                          </p>
                        </div>
                      ))}
                    </div>
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
