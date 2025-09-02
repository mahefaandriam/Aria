import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ApproachSection from "@/components/ApproachSection";
import ContactSection from "@/components/ContactSection";
import "@/styles/animations.css";

const Index = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Background décoratif global */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-orange-400 rounded-full filter blur-3xl animate-float delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600 rounded-full filter blur-3xl animate-pulse-custom" />
      </div>

      {/* Contenu principal avec z-index pour passer au-dessus du background */}
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ApproachSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
