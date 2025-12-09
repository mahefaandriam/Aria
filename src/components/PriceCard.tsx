import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface PriceCardProps {
  title: string;
  price: string;
  services: string[];
  onChoose?: () => void;
  className?: string; // ✅ Nouvelle prop
}

const PriceCard: React.FC<PriceCardProps> = ({ 
  title, 
  price, 
  services, 
  onChoose,
  className = "" // ✅ Par défaut vide
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div ref={elementRef} className="w-full h-full flex flex-col"> {/* ✅ h-full flex-col */}
      <Card
        className={`
          w-full h-full flex flex-col justify-between
          group relative overflow-hidden 
          bg-gradient-to-br from-gray-900/90 to-black/90 
          border border-orange-500/20 hover:border-orange-500/60 
          transition-all duration-500 hover-lift cursor-pointer
          shadow-2xl hover:shadow-orange-500/40
          ${className} // ✅ Classe passée du parent
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex-1 flex flex-col justify-between p-8"> {/* ✅ flex-1 + justify-between */}
          
          {/* Titre */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
              {title}
            </h2>
            <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
              {price}
            </div>
          </div>

          {/* Services - prend tout l'espace restant */}
          <div className="flex-1 flex flex-col justify-center space-y-4 mb-8">
            <ul className="space-y-3">
              {services.map((service, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-3 text-sm text-gray-300 group-hover:text-gray-200 transition-colors animate-fade-in-right"
                  style={{ animationDelay: `${400 + idx * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0 animate-pulse-slow" />
                  <span className="flex-1">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bouton - toujours en bas */}
          <div className="pt-6 border-t border-orange-500/20"> {/* ✅ Séparateur */}
            <Button
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-400 group-hover:scale-[1.03] shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 transform-gpu"
              style={{ boxShadow: "0 10px 30px rgba(234, 88, 12, 0.4)" }}
              onClick={onChoose}
            >
              Choisir ce pack
            </Button>
          </div>
        </div>

        {/* Effet de lueur sur hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none blur-sm" />

        {/* Particules décoratives */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-float opacity-70"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2.5 + Math.random() * 1.5}s`
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PriceCard;
