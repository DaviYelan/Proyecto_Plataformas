import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Check } from 'lucide-react';
import { Trip, Seat } from '../types';
import * as api from '../services/apiService';

interface SeatSelectionProps {
  trip: Trip;
  onBack: () => void;
  onNext: (seats: Seat[]) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ trip, onBack, onNext }) => {
  // Mock generation of seats with initial state
  const generateSeats = (occupiedSeatNumbers: number[] = []): Seat[] => {
    const seats: Seat[] = [];
    const totalSeats = 40;
    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        id: `seat-${i}`,
        number: `${i}`,
        status: occupiedSeatNumbers.includes(i) ? 'occupied' : 'available',
        isWindow: i % 4 === 1 || i % 4 === 0,
        floor: 1
      });
    }
    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

  // Cargar boletos comprados al montar el componente
  useEffect(() => {
    const loadOccupiedSeats = async () => {
      try {
        const boletos = await api.getBoletos();
        
        // Filtrar boletos por la ruta del viaje (origen, destino)
        const filteredBoletos = boletos.filter(boleto => {
          const turno = boleto.turno;
          if (!turno) return false;
          
          const horario = turno.horario;
          if (!horario) return false;
          
          const ruta = horario.ruta;
          if (!ruta) return false;
          
          // Comparar origen y destino
          return (
            ruta.origen.toLowerCase() === trip.origin.toLowerCase() &&
            ruta.destino.toLowerCase() === trip.destination.toLowerCase()
          );
        });

        // Extraer números de asientos ocupados
        const occupiedNumbers = filteredBoletos
          .map(boleto => boleto.numero_asiento)
          .filter(numero => numero !== null && numero !== undefined);

        console.log('Boletos encontrados para', trip.origin, '-', trip.destination, ':', filteredBoletos.length);
        console.log('Asientos ocupados:', occupiedNumbers);

        setOccupiedSeats(occupiedNumbers);
        setSeats(generateSeats(occupiedNumbers));
      } catch (error) {
        console.error('Error al cargar asientos ocupados:', error);
        // Si hay error, usar generación normal
        setSeats(generateSeats());
      }
    };

    loadOccupiedSeats();
  }, [trip.origin, trip.destination]);
  
  const toggleSeat = (seatId: string) => {
    setSeats(prev => prev.map(seat => {
      if (seat.id !== seatId || seat.status === 'occupied') return seat;
      return {
        ...seat,
        status: seat.status === 'selected' ? 'available' : 'selected'
      };
    }));
  };

  const selectedSeats = seats.filter(s => s.status === 'selected');
  const totalPrice = selectedSeats.length * trip.price;

  return (
    <div className="h-full flex flex-col bg-[#121212] text-white">
      {/* Header for Seat Selection */}
      <div className="bg-[#1e1e1e] border-b border-gray-800 px-6 py-4 flex items-center justify-between shadow-xl z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-300 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Selecciona tus asientos</h2>
            <p className="text-sm text-gray-400">{trip.operator} • {trip.origin} a {trip.destination}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Bus Layout Area */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#121212]">
          <div className="bg-[#1e1e1e] rounded-[3rem] p-8 pb-20 shadow-2xl border border-gray-800 w-full max-w-[320px] relative">
            
            {/* Driver Area */}
            <div className="border-b-2 border-gray-700 mb-8 pb-4 flex justify-between px-4 opacity-50">
               <div className="flex flex-col items-center">
                 <div className="w-8 h-8 rounded-full border-2 border-gray-500"></div>
                 <span className="text-[10px] uppercase font-bold mt-1 text-gray-500">Conductor</span>
               </div>
               <div className="w-16 h-8 bg-gray-700 rounded mb-2"></div>
            </div>

            {/* Seats Grid */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-4">
              {seats.map((seat) => (
                <button
                  key={seat.id}
                  disabled={seat.status === 'occupied'}
                  onClick={() => toggleSeat(seat.id)}
                  className={`
                    relative w-10 h-10 rounded-t-lg rounded-b-md flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-sm
                    ${seat.status === 'available' ? 'bg-[#2a2e2a] border-2 border-gray-600 text-gray-400 hover:border-[#2ecc71] hover:text-[#2ecc71] hover:bg-[#2ecc71]/10' : ''}
                    ${seat.status === 'selected' ? 'bg-[#2ecc71] border-2 border-[#2ecc71] text-white transform scale-105 shadow-md shadow-green-500/20' : ''}
                    ${seat.status === 'occupied' ? 'bg-gray-800 border-2 border-gray-800 text-gray-600 cursor-not-allowed' : ''}
                    ${(parseInt(seat.number) % 2 === 0 && parseInt(seat.number) % 4 !== 0) ? 'mr-1' : ''}
                  `}
                >
                  {seat.status === 'selected' && <Check className="h-4 w-4 absolute -top-1 -right-1 bg-white text-[#2ecc71] rounded-full p-0.5 shadow-sm" />}
                  {seat.number}
                </button>
              ))}
            </div>

            {/* Rear of bus */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">
              Fondo del Bus
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-[#1e1e1e] w-full md:w-96 border-l border-gray-800 p-6 flex flex-col shadow-[-4px_0_20px_-5px_rgba(0,0,0,0.5)] z-20">
          <h3 className="text-lg font-bold text-white mb-6">Resumen de compra</h3>
          
          <div className="flex-1 space-y-4">
             {/* Legend */}
             <div className="flex gap-4 text-xs text-gray-400 mb-6 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#2a2e2a] border border-gray-500 rounded"></div> Libre</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#2ecc71] rounded"></div> Tuyo</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-800 rounded"></div> Ocupado</div>
             </div>

             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-400">Pasajeros</span>
                 <span className="font-medium text-gray-200">{selectedSeats.length} Personas</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-400">Asientos</span>
                 <span className="font-medium text-gray-200">
                   {selectedSeats.length > 0 ? selectedSeats.map(s => s.number).join(', ') : '-'}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-400">Precio Unitario</span>
                 <span className="font-medium text-gray-200">${trip.price.toFixed(2)}</span>
               </div>
             </div>
             
             <div className="border-t border-dashed border-gray-700 my-4"></div>
             
             <div className="flex justify-between items-end">
               <span className="text-lg font-bold text-white">Total</span>
               <span className="text-2xl font-bold text-[#2ecc71]">${totalPrice.toFixed(2)}</span>
             </div>
          </div>

          <button 
            disabled={selectedSeats.length === 0}
            className="w-full mt-6 bg-[#2ecc71] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-green-500/20 active:scale-[0.98]"
            onClick={() => onNext(selectedSeats)}
          >
            Continuar al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;