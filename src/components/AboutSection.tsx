import React, { useEffect, useRef } from 'react';
import { Users, Code, Palette, Rocket, Shield, ArrowRight } from 'lucide-react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Button = ({ children, className, ...props }) => (
  <button
    className={`px-5 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg ${className}`}
    {...props}
  >
    {children}
  </button>
);

// mêmes images que ton code original
const process1 = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process2 = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process3 = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process4 = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const process5 = "/images/process-4.jpg";
const backgroundVideo = "/videos/2715412-uhd_3840_2160_30fps.mp4";

const AboutSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const ctaRef = useRef(null);
  const processRef = useRef(null);

  useEffect(() => {
    // fade-in de la section
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }

    // titre
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
          },
        }
      );
    }

    // cartes gauche/droite
    if (leftCardRef.current) {
      gsap.fromTo(
        leftCardRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftCardRef.current,
            start: "top 85%",
          },
        }
      );
    }

    if (rightCardRef.current) {
      gsap.fromTo(
        rightCardRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rightCardRef.current,
            start: "top 85%",
          },
        }
      );
    }

    // CTA
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
          },
        }
      );
    }

    // Processus – apparition en stagger
    if (processRef.current) {
      const items = processRef.current.querySelectorAll(".process-item");
      gsap.fromTo(
        items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: processRef.current,
            start: "top 85%",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      id="about"
      className="relative w-full py-24 lg:py-28 overflow-hidden"
    >
      {/* vidéo de fond limitée à la section, pas en fixed */}
      <video
        className="absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={backgroundVideo} type="video/mp4" />
        Votre navigateur ne supporte pas les vidéos HTML5.
      </video>

      {/* overlay sombre pour lisibilité */}
      <div className="absolute inset-0 -z-5 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950/95" />

      {/* légers halos */}
      <div className="pointer-events-none absolute inset-0 -z-4">
        <div className="absolute -top-24 -left-16 w-72 h-72 bg-orange-500/35 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-400/30 rounded-full blur-3xl" />
      </div>

      <div
        ref={sectionRef}
        className="relative container mx-auto px-6 lg:px-10 max-w-6xl"
      >
        {/* titre */}
        <div ref={titleRef} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            A Propos
          </h2>
          <p className="mt-3 text-slate-200/85 text-sm md:text-base max-w-xl mx-auto">
            Découvrez notre équipe, nos expertises et notre processus créatif.
          </p>
        </div>

        {/* deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* gauche – Nos Expertises */}
          <div
            ref={leftCardRef}
            className="bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 shadow-[0_18px_55px_rgba(0,0,0,0.8)]"
          >
            <h3 className="text-xl font-bold text-orange-400 mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/15 mr-3">
                <Code className="w-5 h-5 text-orange-400" />
              </span>
              Nos Expertises
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: <Code className="w-4 h-4 text-orange-400" />, label: "Développement" },
                { icon: <Palette className="w-4 h-4 text-orange-400" />, label: "Design UI/UX" },
                { icon: <Rocket className="w-4 h-4 text-orange-400" />, label: "Marketing Digital" },
                { icon: <Shield className="w-4 h-4 text-orange-400" />, label: "Maintenance" },
              ].map((service, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 hover:border-orange-400/60 transition-all duration-200"
                >
                  <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    {service.icon}
                  </div>
                  <span className="text-slate-100 text-sm font-medium">
                    {service.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* droite – Notre Équipe (texte inchangé) */}
          <div
            ref={rightCardRef}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-black-500 p-7 shadow-[0_18px_55px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.25),transparent_55%)]" />
            <div className="relative z-10">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mr-3 shadow-md shadow-black/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Notre Équipe</h3>
                  <p className="text-orange-100/90 text-xs uppercase tracking-wide mt-0.5">
                    Professionnels dédiés à votre succès
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-orange-50">
                <p>
                  Notre équipe multidisciplinaire réunit des experts passionnés : développeurs full-stack,
                  designers UI/UX et consultants en stratégie digitale.
                </p>
                <p>
                  Ensemble, nous formons une équipe soudée déterminée à repousser les limites
                  du possible pour vos projets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex justify-center mb-16">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 blur-lg opacity-50 group-hover:opacity-80 transition" />
            <Button className="relative bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 flex items-center gap-2">
              Parlons de votre projet
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Processus (texte + images inchangés) */}
        <div
          ref={processRef}
          className="bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-[0_18px_55px_rgba(0,0,0,0.9)]"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-10">
            Notre Processus
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { image: process1, title: "Écoute", desc: "Analyse de vos besoins" },
              { image: process2, title: "Création", desc: "Design & développement" },
              { image: process3, title: "Lancement", desc: "Mise en production" },
              { image: process4, title: "Supports", desc: "Maintenance & évolution" },
              { image: process5, title: "Conseils", desc: "Accompagnement & recommandations personnalisées" },
            ].map((step, index) => (
              <div
                key={index}
                className="process-item group flex flex-col items-stretch text-left bg-slate-900/70 border border-slate-700/80 hover:border-slate-500/80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Image rectangulaire en haut */}
                <div className="relative h-28 sm:h-32 w-full overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 group-hover:brightness-110 transition-transform duration-500"
                  />
                  {/* Badge numéro en coin */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur text-[11px] font-semibold text-slate-100">
                    Étape {index + 1}
                  </div>
                </div>

                {/* Contenu texte */}
                <div className="flex-1 px-3.5 sm:px-4 py-3.5 space-y-1.5">
                  <h4 className="text-sm sm:text-base font-extrabold text-orange-400">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {step.desc}
                  </p>
                </div>

                {/* Ligne de progression subtile en bas */}
                <div className="h-1 w-full bg-slate-800">
                  <div
                   className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
/>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
