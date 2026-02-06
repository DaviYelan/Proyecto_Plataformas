import React, { useState } from 'react';
import { Destination } from '../types';

const destinations: Destination[] = [
  {
    id: 1,
    title: 'Baños de Agua Santa',
    description: 'La puerta de entrada a la Amazonía, famosa por sus cascadas, aguas termales y deportes de aventura.',
    image: '/img/baños.jpg'
  },
  {
    id: 2,
    title: 'Cuenca',
    description: 'Una ciudad colonial con una rica historia, arquitectura impresionante y una vibrante escena cultural.',
    image: '/img/cuenca.jpg'
  },
  {
    id: 3,
    title: 'Laguna de Quilotoa',
    description: 'Un impresionante lago de cráter volcánico con aguas turquesas, ideal para el senderismo y la fotografía.',
    image: '/img/quilotoa.jpg'
  }
];

interface DestinationsProps {
  onSelectDestination: (destination: string) => void;
}

const Destinations: React.FC<DestinationsProps> = ({ onSelectDestination }) => {
  return (
    <section id="destinos" className="py-20 bg-[#2b302c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Destinos Populares</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Explora los lugares más increíbles de Ecuador con la comodidad y seguridad que mereces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div key={dest.id} className="group bg-[#363b37] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{dest.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{dest.description}</p>
                <button 
                  onClick={() => onSelectDestination(dest.title)}
                  className="mt-4 text-[#2ecc71] hover:text-[#27ae60] text-sm font-medium flex items-center gap-1 transition-colors group/btn"
                >
                  Ver Horarios <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;