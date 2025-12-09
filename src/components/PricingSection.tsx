import React, { useEffect, useState } from "react";
import PriceCard from "./PriceCard";
import { CheckCircle, Mail, Send } from "lucide-react";
import { type ContactMessage } from "@/services/api";
import { addMessage } from "@/services/messagesService";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  pack: string;
}

// Reusable input component
const FormField: React.FC<{
  label: string;
  name: keyof ContactMessage;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
  rows?: number;
  placeholder?: string;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
}> = ({
  label,
  name,
  value,
  onChange,
  required,
  icon,
  rows,
  placeholder,
  onFocus,
  onBlur,
  isFocused,
}) => (
  <div className="transform transition-all duration-500 animate-fade-in-left">
    <label className="text-orange-300 font-medium mb-2 flex items-center">
      {icon}
      <span>{label}</span>
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <div className="relative">
      {rows ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          rows={rows}
          className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300 resize-none"
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          type={name === "email" ? "email" : "text"}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300"
          placeholder={placeholder}
          required={required}
        />
      )}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
          isFocused ? "opacity-100" : ""
        }`}
      />
    </div>
  </div>
);

const ContactFormModal: React.FC<ContactFormModalProps> = ({ open, onClose, pack }) => {
  const [formData, setFormData] = useState<ContactMessage>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const messageData: ContactMessage = {
      ...formData,
      subject: `Projet ${pack || "Nouveau projet"}`,
    };

    try {
      const response = await addMessage(messageData);
      if (response) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: "", email: "", company: "", subject: "", message: "" });
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border border-orange-500/30 shadow-2xl animate-fade-in-up w-full max-w-2xl">
        {isSubmitted ? (
          <div className="p-12 text-center bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl border border-green-500/30 animate-scale-in">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse-custom" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">Message envoyé !</h3>
            <p className="text-gray-300">Nous vous recontacterons très bientôt.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Nom complet"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                isFocused={focusedField === "name"}
                placeholder="Votre nom complet"
                required
              />
              <FormField
                label="Email"
                name="email"
                icon={<Mail className="w-4 h-4 mr-2" />}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                isFocused={focusedField === "email"}
                placeholder="votre@email.com"
                required
              />
              <FormField
                label="Entreprise"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onFocus={() => setFocusedField("company")}
                onBlur={() => setFocusedField(null)}
                isFocused={focusedField === "company"}
                placeholder="Nom de votre entreprise"
              />
              <FormField
                label="Votre pack"
                name="subject"
                value={pack}
                onChange={handleChange}
                onFocus={() => setFocusedField("subject")}
                onBlur={() => setFocusedField(null)}
                isFocused={focusedField === "subject"}
                placeholder="Type de pack (ex: Pack Pro)"
              />
              <div className="md:col-span-2">
                <FormField
                  label="Décrivez votre projet"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "message"}
                  placeholder="Parlez-nous de votre vision..."
                  rows={6}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-center bg-red-500/10 border border-red-600/30 p-3 rounded-xl">
                ❌ {error}
              </p>
            )}

            <div className="flex justify-between space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Envoi en cours...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Lancer le projet</span>
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="border border-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition"
              >
                Fermer
              </button>
            </div>
          </form>
        )}

        {/* Decorative floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
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
  const [selectedPack, setSelectedPack] = useState("");
  const { elementRef } = useScrollAnimation<HTMLDivElement>();

  const openPackModal = (pack: string) => {
    setSelectedPack(pack);
    setModalOpen(true);
  };

  const packs = [
    {
      title: "Pack Essentiel",
      price: "500 000 Ar",
      services: [
        "3 à 4 pages (Accueil, Services, À propos, Contact)",
        "Design responsive (PC + mobile)",
        "Formulaire de contact",
        "Livraison en 7 jours ouvrables",
      ],
    },
    {
      title: "Pack Pro",
      price: "850 000 Ar",
      services: [
        "5 à 8 pages",
        "Design personnalisé & optimisé",
        "Intégration réseaux sociaux",
        "Google Maps & SEO basique",
        "Livraison en 10 jours ouvrables",
      ],
    },
    {
      title: "Pack Premium",
      price: "1 350 000 Ar",
      services: [
        "Jusqu’à 12 pages",
        "Design sur mesure avec animations",
        "Optimisation SEO avancée",
        "Formation à la gestion du site",
        "Garantie & support 1 mois inclus",
      ],
    },
  ];

  return (
    <section
      ref={elementRef}
      id="tarifs"
      className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-6">
          Nos Offres, Nos Tarifs
        </h2>
        <p className="text-xl text-gray-300 mb-10">
          Trouvez le pack idéal pour votre projet web, adapté à vos objectifs et à votre budget.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packs.map((pack) => (
            <div key={pack.title} className="animate-fade-in-up">
              <PriceCard {...pack} onChoose={() => openPackModal(pack.title)} />
            </div>
          ))}
        </div>
      </div>
      <ContactFormModal open={modalOpen} onClose={() => setModalOpen(false)} pack={selectedPack} />
    </section>
  );
};

export default PricingSection;
