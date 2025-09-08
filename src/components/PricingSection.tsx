import React from "react";
import PriceCard from "./PriceCard";

const PricingSection: React.FC = () => {
    return (
        <section
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
                <div
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                >
                    <div
                    className={`transform transition-all duration-500 
                        animate-fade-in-up
                    `}
                    style={{ animationDelay: `${1 * 150}ms` }}
                    >
                        <PriceCard
                            title="Pack Essentiel"
                            price="500 000 Ar"
                            services={["3 à 4 (Accueil, Services, À propos, Contact", 
                                    "Design responsive (PC + mobile)",
                                    "Formulaire de contact",
                                    "Livraison en 7 jours ouvrables"
                                        ]}
                        />
                    </div>
                    <div
                    className={`transform transition-all duration-500 
                        animate-fade-in-up
                    `}
                    style={{ animationDelay: `${1 * 150}ms` }}
                    >
                        <PriceCard
                            title="Pack Pro"
                            price="850 000 Ar"
                            services={["5 à 8 pages",
                                    "Design personnalisé & optimisé",
                                    "Intégration réseaux sociaux",
                                    "Google Maps & SEO basique (référencement naturel)",
                                    "Livraison en 10 jours ouvrables",
                            ]}
                        />
                    </div>
                    <div
                    className={`transform transition-all duration-500 
                        animate-fade-in-up
                    `}
                    style={{ animationDelay: `${1 * 150}ms` }}
                    >
                        <PriceCard
                            title="Pack Premium"
                            price="1 350 000 Ar"
                            services={["Jusqu'à 12 pages",
                                    "Design sur mersure avec animations",
                                    "Optimisation SEO avancée",
                                    "Formation client à la gestion du site",
                                    "Garentie & support 1 mois inclus"
                            ]}
                        />
                    </div>                    
                </div>            
            </div>
        </section>
    );
};

export default PricingSection;