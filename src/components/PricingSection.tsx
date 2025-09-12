import React, { useState } from "react";
import PriceCard from "./PriceCard";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import { CheckCircle, Mail, Send } from "lucide-react";
import { contactApi, ContactMessage } from "@/services/api";

// Composant formulaire de contact avancé
const ContactFormModal: React.FC<{ open: boolean; onClose: () => void; pack?: string }> = ({ open, onClose, pack }) => {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div
        className={`relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl p-8 rounded-2xl border border-orange-500/30 shadow-2xl transition-all duration-700 ${
            true ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
        }`}
        >
        {/* Effet de lueur de fond */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-2xl" />

        <form onSubmit={handleSubmit} className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className={`transform transition-all duration-500 animate-fade-in-left`}>
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
            <div className={`transform transition-all duration-500 animate-fade-in-left`}>
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
            <div className={`transform transition-all duration-500 animate-fade-in-left`}>
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

            {/* Pack */}
            <div className={`transform transition-all duration-500 animate-fade-in-left`}>
                <label className="block text-orange-300 font-medium mb-2">Votre pack</label>
                <div className="relative">
                <input
                    type="text"
                    name="subject"
                    value={pack || formData.subject }
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300 disabled"
                    placeholder="Type de pack (ex: Pack Pro)"
                />
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
                    focusedField === 'subject' ? 'opacity-100' : ''
                }`} />
                </div>
            </div>

            {/* Message */}
            <div className={`md:col-span-2 transform transition-all duration-500 animate-fade-in-up`}>
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
                <p className="text-red-400 font-medium">❌ Erreur de réseau. Si l'erreur persiste, veuillez réessayer ou nous contacter par e-mail.</p>
                </div>
            )}

            {/* Bouton d'envoi */}
            <div className={`flex space-x-3 md:col-span-2 transform transition-all duration-500 $animate-fade-in-up`}>
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
                <button
                    className="border border-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300"
                    onClick={onClose}
                >
                    Fermer
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
    </div>
  );
};

const PricingSection: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPack, setSelectedPack] = useState<string | undefined>(undefined);
    const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>();

    const handleChoosePack = (pack: string) => {
        setSelectedPack(pack);
        setModalOpen(true);
    };

    return (
        <section
            ref={elementRef}
            id="realisations"
            className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
        >
            {/* Background décoratif */}
            <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-400 rounded-full filter blur-3xl animate-float delay-1000" />
            </div>
    
            <div className="container mx-auto px-6 relative z-10">
            {/* Header section */}
            <div className={`text-center mb-16 transform transition-all duration-700 
                 animate-fade-in-down
            `}>
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-6">
                Nos Offres, Nos Tarifs  
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Trouvez le Pack Idéal pour Votre Projet !
                </p>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Découvrez nos offres de création de site web adaptées à vos besoins.
                Choisissez le pack qui correspond à votre projet et bénéficiez d’un accompagnement personnalisé.
                </p>
    
                {/* Indicateur de synchronisation avec l'API
                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Synchronisé avec l'API backend • {projects.length} projets publiés</span>
                </div> */}
            </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <div className="transform transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${1 * 150}ms` }}>
                        <PriceCard
                            title="Pack Essentiel"
                            price="500 000 Ar"
                            services={[
                                "3 à 4 (Accueil, Services, À propos, Contact)",
                                "Design responsive (PC + mobile)",
                                "Formulaire de contact",
                                "Livraison en 7 jours ouvrables"
                            ]}
                            onChoose={() => handleChoosePack("Pack Essentiel")}
                        />
                    </div>
                    <div className="transform transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${1 * 150}ms` }}>
                        <PriceCard
                            title="Pack Pro"
                            price="850 000 Ar"
                            services={[
                                "5 à 8 pages",
                                "Design personnalisé & optimisé",
                                "Intégration réseaux sociaux",
                                "Google Maps & SEO basique (référencement naturel)",
                                "Livraison en 10 jours ouvrables",
                            ]}
                            onChoose={() => handleChoosePack("Pack Pro")}
                        />
                    </div>
                    <div className="transform transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${1 * 150}ms` }}>
                        <PriceCard
                            title="Pack Premium"
                            price="1 350 000 Ar"
                            services={[
                                "Jusqu'à 12 pages",
                                "Design sur mersure avec animations",
                                "Optimisation SEO avancée",
                                "Formation client à la gestion du site",
                                "Garentie & support 1 mois inclus"
                            ]}
                            onChoose={() => handleChoosePack("Pack Premium")}
                        />
                    </div>
                </div>            
            </div>
            <ContactFormModal open={modalOpen} onClose={() => setModalOpen(false)} pack={selectedPack} />
        </section>
    );
};

export default PricingSection;