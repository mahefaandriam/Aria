import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import { contactApi, type ContactMessage } from '@/services/api';
import "@/styles/animations.css";

// Composant formulaire de contact avancé
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
      // Préparer les données pour l'API
      const messageData: ContactMessage = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        subject: formData.subject || 'Nouveau projet', // Valeur par défaut si vide
        message: formData.message
      };

      const response = await contactApi.sendMessage(messageData);

      if (response.success) {
        setIsSubmitted(true);
        console.log('📧 Message envoyé avec succès:', response.message);

        // Reset après 5 secondes
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', company: '', subject: '', message: '' });
        }, 5000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-12 rounded-2xl border border-green-500/30 text-center animate-scale-in">
        <div className="animate-bounce-in">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse-custom" />
          <h3 className="text-2xl font-bold text-green-400 mb-2">Message envoyé !</h3>
          <p className="text-gray-300">Nous vous recontacterons très bientôt.</p>
          <p className="text-sm text-green-400 mt-2">✉️ Un email de confirmation vous a été envoyé</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className={`relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl p-8 rounded-2xl border border-orange-500/30 shadow-2xl transition-all duration-700 ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Effet de lueur de fond */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-2xl" />

      <form onSubmit={handleSubmit} ref={containerRef} className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div className={`transform transition-all duration-500 ${
            visibleItems.has(0) ? 'animate-fade-in-left' : 'opacity-0 translate-x-4'
          }`}>
            <label className="block text-orange-300 font-medium mb-2 flex items-center">
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
                className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Votre nom complet"
                required
              />
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
                focusedField === 'name' ? 'opacity-100' : ''
              }`} />
            </div>
          </div>

          {/* Email */}
          <div className={`transform transition-all duration-500 ${
            visibleItems.has(1) ? 'animate-fade-in-right' : 'opacity-0 translate-x-4'
          }`}>
            <label className="block text-orange-300 font-medium mb-2 flex items-center">
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
                className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300"
                placeholder="votre@email.com"
                required
              />
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
                focusedField === 'email' ? 'opacity-100' : ''
              }`} />
            </div>
          </div>

          {/* Entreprise */}
          <div className={`transform transition-all duration-500 ${
            visibleItems.has(2) ? 'animate-fade-in-left' : 'opacity-0 translate-x-4'
          }`}>
            <label className="block text-orange-300 font-medium mb-2">Entreprise</label>
            <div className="relative">
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('company')}
                onBlur={() => setFocusedField(null)}
                className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Nom de votre entreprise"
              />
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
                focusedField === 'company' ? 'opacity-100' : ''
              }`} />
            </div>
          </div>

          {/* Sujet */}
          <div className={`transform transition-all duration-500 ${
            visibleItems.has(3) ? 'animate-fade-in-right' : 'opacity-0 translate-x-4'
          }`}>
            <label className="block text-orange-300 font-medium mb-2">Type de projet</label>
            <div className="relative">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white transition-all duration-300"
              >
                <option value="">Sélectionnez un type</option>
                <option value="Site web / E-commerce">Site web / E-commerce</option>
                <option value="Application mobile">Application mobile</option>
                <option value="Design UI/UX">Design UI/UX</option>
                <option value="Marketing digital">Marketing digital</option>
                <option value="Autre projet">Autre</option>
              </select>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
                focusedField === 'subject' ? 'opacity-100' : ''
              }`} />
            </div>
          </div>

          {/* Message */}
          <div className={`md:col-span-2 transform transition-all duration-500 ${
            visibleItems.has(4) ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
          }`}>
            <label className="block text-orange-300 font-medium mb-2 flex items-center">
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
                className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                placeholder="Parlez-nous de votre vision, vos objectifs, vos défis..."
                required
              />
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
                focusedField === 'message' ? 'opacity-100' : ''
              }`} />
            </div>
          </div>

          {/* Affichage d'erreur */}
          {submitError && (
            <div className="md:col-span-2 bg-gradient-to-br from-red-500/10 to-red-600/10 p-4 rounded-xl border border-red-500/30 text-center animate-scale-in">
              <p className="text-red-400 font-medium">❌ {submitError}</p>
            </div>
          )}

          {/* Bouton d'envoi */}
          <div className={`md:col-span-2 transform transition-all duration-500 ${
            visibleItems.has(5) ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
          }`}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Lancer le projet</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </form>

      {/* Particules décoratives */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
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
      content: "24/7 Support",
      description: "Assistance continue"
    }
  ];

  return (
    <section
      id="contact"
      className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden"
    >
      {/* Background décoratif */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-400 rounded-full filter blur-3xl animate-float delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header section */}
        <div
          ref={elementRef}
          className={`text-center mb-16 transform transition-all duration-700 ${
            isVisible ? 'animate-fade-in-down' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-orange-400 mr-3 animate-float" />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Transformons vos idées en réalité
            </h2>
            <Sparkles className="w-8 h-8 text-orange-400 ml-3 animate-float delay-500" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Chaque grand projet commence par une conversation. Partagez votre vision avec nous
            et découvrons ensemble comment créer des solutions digitales exceptionnelles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Informations de contact */}
          <div
            ref={containerRef}
            className="lg:col-span-1 space-y-6"
          >
            <div className={`transform transition-all duration-500 ${
              visibleItems.has(0) ? 'animate-fade-in-left' : 'opacity-0 translate-x-4'
            }`}>
              <h3 className="text-2xl font-bold text-orange-400 mb-6 flex items-center">
                <Mail className="w-6 h-6 mr-3" />
                Contactez-nous
              </h3>
            </div>

            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={index}
                  className={`group bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover-lift cursor-pointer transform ${
                    visibleItems.has(index + 1) ? 'animate-fade-in-left' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-500/20 p-3 rounded-lg group-hover:bg-orange-500/30 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1 group-hover:text-orange-300 transition-colors">
                        {info.title}
                      </h4>
                      <p className="text-orange-400 font-medium mb-1">{info.content}</p>
                      <p className="text-gray-400 text-sm">{info.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* CTA section */}
        <div className={`text-center mt-16 transform transition-all duration-700 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-xl p-8 rounded-2xl border border-orange-500/30 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              🚀 Prêt pour le décollage ?
            </h3>
            <p className="text-gray-300 mb-6">
              Rejoignez les entreprises qui ont déjà fait confiance à ARIA pour transformer leur présence digitale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
                ✓ Consultation gratuite
              </span>
              <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
                ✓ Devis personnalisé
              </span>
              <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
                ✓ Support 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
