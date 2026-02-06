import React, { useState } from 'react';
import { ShieldCheck, Armchair, Clock } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    id: 1,
    title: 'Seguridad a Bordo',
    description: 'Conductores profesionales y vehículos con mantenimiento constante para tu tranquilidad.',
    iconName: 'Shield'
  },
  {
    id: 2,
    title: 'Máximo Confort',
    description: 'Asientos reclinables, aire acondicionado y entretenimiento para un viaje placentero.',
    iconName: 'Armchair'
  },
  {
    id: 3,
    title: 'Puntualidad Garantizada',
    description: 'Respetamos tu tiempo. Salidas y llegadas puntuales para que planifiques sin sorpresas.',
    iconName: 'Clock'
  }
];

const Features: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Shield': return <ShieldCheck className="h-8 w-8 text-green-100" />;
      case 'Armchair': return <Armchair className="h-8 w-8 text-green-100" />;
      case 'Clock': return <Clock className="h-8 w-8 text-green-100" />;
      default: return null;
    }
  };

  return (
    <section className="py-24 bg-[#323632]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Por Qué Viajar Con Nosotros?</h2>
          <p className="text-gray-400">Comprometidos con tu experiencia en cada kilómetro.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center">
              <div className="h-16 w-16 bg-[#2ecc71]/80 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#2ecc71]/20">
                {getIcon(feature.iconName)}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;