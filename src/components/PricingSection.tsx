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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-red-800 p-10">
            test
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded" onClick={onClose}>
                clicke me to close
            </button>
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