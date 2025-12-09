import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import { type ContactMessage } from '@/services/api';
import { addMessage } from '@/services/messagesService';
import "@/styles/animations.css";

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { containerRef, visibleItems } = useStaggeredAnimation<HTMLFormElement>(6, 150);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const messageData: ContactMessage = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        subject: formData.subject || 'Nouveau projet',
        message: formData.message
      };

      const response = await addMessage(messageData);

      if (response) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', company: '', subject: '', message: '' });
        }, 3000);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-emerald-600/10 to-emerald-500/15 p-10 rounded-3xl border border-emerald-400/50 text-center animate-scale-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.5),transparent_60%)] opacity-40" />
        <div className="relative z-10 animate-bounce-in">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-pulse-custom" />
          <h3 className="text-2xl font-bold text-emerald-300 mb-2">Message envoyé !</h3>
          <p className="text-emerald-50/90">Nous vous recontacterons très bientôt.</p>
          <p className="text-sm text-emerald-300 mt-2">✉️ Un email de confirmation vous a été envoyé</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-black/90 p-8 sm:p-10 rounded-3xl border border-orange-500/40 shadow-[0_24px_80px_rgba(15,23,42,0.9)] transition-all duration-700 ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Grille lumineuse en fond */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-[-1px] bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.40),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.95),#020617)]" />
        <div className="absolute inset-6 border border-white/5 rounded-[1.6rem] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      </div>

      {/* Lignes diagonales animées */}
      <div className="pointer-events-none absolute -inset-x-10 top-0 h-full opacity-20">
        <div className="w-full h-full bg-[repeating-linear-gradient(135deg,rgba(148,163,184,0.18)_0px,rgba(148,163,184,0.18)_1px,transparent_1px,transparent_12px)] animate-slow-pan" />
      </div>

      <form onSubmit={handleSubmit} ref={containerRef} className="relative z-10 space-y-6">
        {/* En-tête du formulaire */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-orange-300/80 mb-2">
              Formulaire de projet
            </p>
            <h3 className="text-xl font-semibold text-white">
              Donnez vie à votre idée
            </h3>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-orange-200/80 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-400/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Temps de réponse moyen &lt; 24h</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div
            className={`transform transition-all duration-500 ${
              visibleItems.has(0) ? 'animate-fade-in-left' : 'opacity-0 translate-x-4'
            }`}
          >
            <label className="block text-orange-200 font-medium mb-2 flex items-center text-sm">
              <span>Nom complet</span>
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className="w-full p-3.5 bg-black/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 text-sm transition-all duration-300"
                placeholder="Votre nom complet"
                required
              />
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/25 to-orange-600/25 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'name' ? 'opacity-100' : ''
                }`}
              />
            </div>
          </div>

          {/* Email */}
          <div
            className={`transform transition-all duration-500 ${
              visibleItems.has(1) ? 'animate-fade-in-right' : 'opacity-0 translate-x-4'
            }`}
          >
            <label className="block text-orange-200 font-medium mb-2 flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2" />
              <span>Email</span>
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full p-3.5 bg-black/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 text-sm transition-all duration-300"
                placeholder="votre@email.com"
                required
              />
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/25 to-orange-600/25 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'email' ? 'opacity-100' : ''
                }`}
              />
            </div>
          </div>

          {/* Entreprise */}
          <div
            className={`transform transition-all duration-500 ${
              visibleItems.has(2) ? 'animate-fade-in-left' : 'opacity-0 translate-x-4'
            }`}
          >
            <label className="block text-orange-200 font-medium mb-2 text-sm">
              Entreprise
            </label>
            <div className="relative">
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('company')}
                onBlur={() => setFocusedField(null)}
                className="w-full p-3.5 bg-black/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 text-sm transition-all duration-300"
                placeholder="Nom de votre entreprise"
              />
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/25 to-orange-600/25 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'company' ? 'opacity-100' : ''
                }`}
              />
            </div>
          </div>

          {/* Sujet */}
          <div
            className={`transform transition-all duration-500 ${
              visibleItems.has(3) ? 'animate-fade-in-right' : 'opacity-0 translate-x-4'
            }`}
          >
            <label className="block text-orange-200 font-medium mb-2 text-sm">
              Type de projet
            </label>
            <div className="relative">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                className="w-full p-3.5 bg-black/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white text-sm transition-all duration-300"
              >
                <option value="">Sélectionnez un type</option>
                <option value="Site web / E-commerce">Site web / E-commerce</option>
                <option value="Application mobile">Application mobile</option>
                <option value="Design UI/UX">Design UI/UX</option>
                <option value="Marketing digital">Marketing digital</option>
                <option value="Autre projet">Autre</option>
              </select>
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/25 to-orange-600/25 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'subject' ? 'opacity-100' : ''
                }`}
              />
            </div>
          </div>

          {/* Message */}
          <div
            className={`md:col-span-2 transform transition-all duration-500 ${
              visibleItems.has(4) ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
            }`}
          >
            <label className="block text-orange-200 font-medium mb-2 flex items-center text-sm">
              <span>Décrivez votre projet</span>
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                rows={6}
                className="w-full p-3.5 bg-black/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 text-sm transition-all duration-300 resize-none"
                placeholder="Parlez-nous de votre vision, vos objectifs, vos défis..."
                required
              />
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/25 to-orange-600/25 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'message' ? 'opacity-100' : ''
                }`}
              />
            </div>
          </div>

          {/* Erreur */}
          {submitError && (
            <div className="md:col-span-2 bg-gradient-to-br from-red-500/10 to-red-600/15 p-4 rounded-2xl border border-red-500/40 text-center animate-scale-in">
              <p className="text-red-300 text-sm font-medium">
                ❌ Erreur de réseau. Si l'erreur persiste, veuillez réessayer ou nous contacter par e-mail.
              </p>
            </div>
          )}

          {/* Bouton */}
          <div
            className={`md:col-span-2 transform transition-all duration-500 ${
              visibleItems.has(5) ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 px-8 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] shadow-[0_18px_45px_rgba(234,88,12,0.55)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-6 transition-transform duration-300" />
                    <span>Lancer le projet</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/25 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </form>

      {/* Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float opacity-50"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ContactSection = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { containerRef, visibleItems } = useStaggeredAnimation(4, 200);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "aria.madacom@gmail.com",
      description: "Réponse sous 24h"
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+262 693 52 16 26",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: MapPin,
      title: "Localisation",
      content: "Antananarivo, Madagascar",
      description: "Sur rendez-vous"
    },
    {
      icon: Clock,
      title: "Disponibilité",
      content: "7/7 Support",
      description: "Assistance continue"
    }
  ];

  return (
    <section
      id="contact"
      className="relative py-20 bg-gradient-to-br from-slate-950 via-black to-slate-950 overflow-hidden"
    >
      {/* Halo de fond */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 left-10 w-80 h-80 bg-orange-500/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-orange-400/25 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 bg-orange-600/20 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={elementRef}
          className={`text-center mb-16 transform transition-all duration-700 ${
            isVisible ? 'animate-fade-in-down' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-4 py-1 mb-4 rounded-full border border-orange-500/35 bg-orange-500/10 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
            <Sparkles className="w-4 h-4 mr-2" />
            Parlons de votre projet
          </div>

          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-7 h-7 text-orange-400 mr-3 animate-float" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500">
              Transformons vos idées en réalité
            </h2>
            <Sparkles className="w-7 h-7 text-orange-400 ml-3 animate-float delay-500" />
          </div>

          <p className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Chaque grand projet commence par une conversation. Partagez votre vision avec nous
            et découvrons ensemble comment créer des solutions digitales exceptionnelles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Infos */}
          <div
            ref={containerRef}
            className="lg:col-span-1 space-y-6"
          >
            <div
              className={`transform transition-all duration-500 ${
                visibleItems.has(0) ? 'animate-fade-in-left' : 'opacity-0 translate-x-4'
              }`}
            >
              <h3 className="text-xl font-semibold text-orange-200 mb-2 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contactez-nous
              </h3>
              <p className="text-sm text-gray-300">
                Choisissez le canal qui vous convient le mieux. Nous sommes là pour répondre à vos questions.
              </p>
            </div>

            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-black/80 p-5 rounded-2xl border border-slate-700 hover:border-orange-500/60 hover:shadow-[0_18px_55px_rgba(249,115,22,0.55)] transition-all duration-300 cursor-pointer transform ${
                    visibleItems.has(index + 1) ? 'animate-fade-in-left' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start space-x-4">
                    <div className="bg-orange-500/15 p-3 rounded-xl group-hover:bg-orange-500/25 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-orange-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1 group-hover:text-orange-200 transition-colors">
                        {info.title}
                      </h4>
                      <p className="text-orange-300 font-medium text-sm mb-1">
                        {info.content}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* CTA bas de section */}
        <div
          className={`text-center mt-14 transform transition-all duration-700 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/15 via-orange-600/15 to-orange-500/15 backdrop-blur-xl p-7 rounded-3xl border border-orange-500/40 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.5),transparent_60%)] opacity-40" />
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-white mb-3">
                🚀 Prêt pour le décollage ?
              </h3>
              <p className="text-gray-100/90 text-sm md:text-base mb-5">
                Rejoignez les entreprises qui ont déjà fait confiance à ARIA pour transformer leur présence digitale.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
                <span className="px-4 py-2 bg-black/30 text-orange-200 rounded-full border border-orange-400/40">
                  ✓ Consultation gratuite
                </span>
                <span className="px-4 py-2 bg-black/30 text-orange-200 rounded-full border border-orange-400/40">
                  ✓ Devis personnalisé
                </span>
                <span className="px-4 py-2 bg-black/30 text-orange-200 rounded-full border border-orange-400/40">
                  ✓ Support 7/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
