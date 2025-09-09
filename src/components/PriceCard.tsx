import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface PriceCardProps {
    title: string;
    price: string;
    services: string[];
    onChoose?: () => void; // Add this prop
}

const checkIcon = (
    <span style={{ color: "greenyellow", marginRight: 8 }}>
        {/* Unicode checkmark symbol */}
        ✓
    </span>
);

const PriceCard: React.FC<PriceCardProps> = ({ title, price, services, onChoose }) => {

    const [isHovered, setIsHovered] = useState(false);
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
    
    return (
        <div
        ref={elementRef}

        
        >
            <Card
                className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 hover:border-orange-500/60 transition-all duration-500 hover-lift cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Contenu principal */}
                <CardContent className="p-6 space-y-6"> 
                    <h2 className="text-xl text-gray-300">{title}</h2>
                    <div className="text-4xl font-bold mb-4 text-orange-500">
                        {price}
                    </div>
                    <ul className="text-gray-300 mb-6 space-y-2">
                        {services.map((service, idx) => (
                                <li
                            className="flex items-start space-x-3 text-sm text-gray-300 animate-fade-in-right"
                            style={{ animationDelay: `${400 + idx * 100}ms` }}
                            >
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>{service}</span>
                            </li>
                        ))}
                    </ul>
                    <Button
                          className="relative bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-base w-full transition-all duration-300 group-hover:scale-[1.02]"
                          style={{ boxShadow: "0 4px 14px rgba(234, 88, 12, 0.3)" }}
                          onClick={onChoose} // Add this
                        >
                        Choisir ce pack
                    </Button>
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
    )
};

export default PriceCard;