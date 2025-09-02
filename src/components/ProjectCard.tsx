import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Zap, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import "@/styles/animations.css";

interface ProjectCardProps {
  title: string;
  description: string;
  sector: string;
  objectives: string[];
  solutions: string[];
  imageUrl: string;
  websiteUrl?: string;
}

const ProjectCard = ({
  title,
  description,
  sector,
  objectives,
  solutions,
  imageUrl,
  websiteUrl
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={elementRef}
      className={`transform transition-all duration-700 ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
      }`}
    >
      <Card
        className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 hover:border-orange-500/60 transition-all duration-500 hover-lift cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Image avec overlay interactif */}
        <div className="relative overflow-hidden h-64">
          <img
            src={imageUrl}
            alt={`Projet ${title}`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter group-hover:brightness-110"
          />

          {/* Overlay gradient dynamique */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Badge secteur flottant */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-orange-500/90 text-white border-none font-semibold px-3 py-1 backdrop-blur-sm animate-fade-in-right delay-200">
              <Zap className="w-3 h-3 mr-1" />
              {sector}
            </Badge>
          </div>

          {/* Indicateur d'interaction */}
          <div className={`absolute bottom-4 right-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            <div className="bg-orange-500 rounded-full p-2 shadow-lg animate-pulse-custom">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Titre sur l'image */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold mb-1 group-hover:text-orange-300 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-gray-300 opacity-90">
              {description.substring(0, 60)}...
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <CardContent className="p-6 space-y-6">
          {/* Description complète */}
          <div className="animate-fade-in-up delay-100">
            <p className="text-gray-300 leading-relaxed">{description}</p>
          </div>

          {/* Section objectifs avec animation staggerée */}
          <div className={`transition-all duration-500 ${
            showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="space-y-4">
              <div className="animate-fade-in-left delay-200">
                <div className="flex items-center mb-3">
                  <Target className="w-5 h-5 text-orange-400 mr-2" />
                  <h4 className="font-semibold text-orange-400">Objectifs</h4>
                </div>
                <ul className="space-y-2">
                  {objectives.map((objective, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-sm text-gray-300 animate-fade-in-left"
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0 animate-pulse" />
                      <span className="leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="animate-fade-in-right delay-300">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <h4 className="font-semibold text-green-400">Solutions</h4>
                </div>
                <ul className="space-y-2">
                  {solutions.map((solution, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-sm text-gray-300 animate-fade-in-right"
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-300 border border-gray-700 hover:border-orange-500/50 group"
            >
              <span>{showDetails ? 'Masquer' : 'Plus de détails'}</span>
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                showDetails ? 'rotate-90' : 'group-hover:translate-x-1'
              }`} />
            </button>

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30 group"
              >
                <span>Voir le site</span>
                <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </a>
            )}
          </div>
        </CardContent>

        {/* Effet de lueur sur hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

        {/* Particules décoratives */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectCard;
