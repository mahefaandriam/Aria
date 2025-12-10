import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ApproachSection from "@/components/ApproachSection";
import ContactSection from "@/components/ContactSection";
import "@/styles/animations.css";
import PricingSection from "@/components/PricingSection";

// Type pour les données du service sélectionné
interface SelectedService {
  type: string;
  label: string;
}

const Index = () => {
  // État pour le service sélectionné
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);

  // Fonction pour gérer la sélection d'un service depuis le Header
  const handleServiceSelect = (service: SelectedService) => {
    setSelectedService(service);
    
    // Optionnel : Ajouter un effet de feedback visuel
    console.log(`Service sélectionné : ${service.label}`);
    
    // Optionnel : Faire défiler automatiquement vers ContactSection
    // (Le Header le fait déjà, mais on peut aussi le gérer ici)
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Fonction pour effacer le service sélectionné (optionnel)
  const handleClearService = () => {
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Background décoratif global */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-orange-400 rounded-full filter blur-3xl animate-float delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600 rounded-full filter blur-3xl animate-pulse-custom" />
      </div>

      {/* Indicateur visuel quand un service est sélectionné (optionnel) */}
      {selectedService && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500/90 to-orange-600/90 text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-3 backdrop-blur-sm border border-orange-400/50">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="font-medium text-sm">
              Service sélectionné : <span className="font-bold">{selectedService.label}</span>
            </span>
            <button 
              onClick={handleClearService}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Contenu principal avec z-index pour passer au-dessus du background */}
      <div className="relative z-10">
        {/* Passer la fonction de callback au Header */}
        <Header onServiceSelect={handleServiceSelect} />
        
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ApproachSection />
        
        {/* Passer le service sélectionné à ContactSection */}
        <ContactSection 
          selectedService={selectedService}
          onServiceClear={handleClearService} // Optionnel : pour effacer depuis ContactSection
        />
        
        {/* <PricingSection /> */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;