import React from 'react';
import { X, Ticket as TicketIcon, Calendar, MapPin, Clock } from 'lucide-react';
import { Ticket } from '../types';

interface MyTicketsProps {
  tickets: Ticket[];
  onClose: () => void;
}

const MyTickets: React.FC<MyTicketsProps> = ({ tickets, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#1e1e1e] w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e1e1e]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#2ecc71]/20 text-[#2ecc71] rounded-full flex items-center justify-center">
               <TicketIcon className="h-5 w-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">Mis Boletos</h2>
               <p className="text-xs text-gray-400">Historial de tus viajes</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#121212]">
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <TicketIcon className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No tienes boletos aún</h3>
              <p className="text-gray-500 max-w-xs mb-6">Explora nuestros destinos y compra tu primer boleto para tu próxima aventura.</p>
              <button 
                onClick={onClose}
                className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Buscar Viajes
              </button>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-[#1e1e1e] rounded-xl border border-gray-700 overflow-hidden hover:border-[#2ecc71]/50 transition-colors">
                <div className="bg-gray-800/50 p-3 border-b border-gray-700 flex justify-between items-center">
                   <span className="text-xs font-mono text-gray-400">ID: {ticket.id}</span>
                   <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">CONFIRMADO</span>
                </div>
                <div className="p-5 flex flex-col md:flex-row gap-6">
                   <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[#2ecc71] font-bold">{ticket.trip.operator}</span>
                         <span className="text-xs text-gray-500">{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className="text-center w-16">
                            <span className="block text-xl font-bold text-white">{ticket.trip.departureTime}</span>
                            <span className="text-xs text-gray-400">{ticket.trip.origin}</span>
                         </div>
                         <div className="flex-1 border-t border-dashed border-gray-600 relative top-1"></div>
                         <div className="text-center w-16">
                            <span className="block text-xl font-bold text-white">{ticket.trip.arrivalTime}</span>
                            <span className="text-xs text-gray-400">{ticket.trip.destination}</span>
                         </div>
                      </div>

                      <div className="flex gap-4 text-xs text-gray-400">
                         <div className="flex items-center gap-1">
                           <Calendar className="h-3 w-3" /> {new Date().toLocaleDateString()}
                         </div>
                         <div className="flex items-center gap-1">
                           <Clock className="h-3 w-3" /> {ticket.trip.duration}
                         </div>
                      </div>
                   </div>

                   <div className="md:border-l border-gray-700 md:pl-6 flex flex-col justify-center min-w-[150px] space-y-2">
                      <div>
                        <span className="text-xs text-gray-500 block uppercase font-bold">Pasajero</span>
                        <span className="text-white font-medium">{ticket.passengerName}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block uppercase font-bold">Asientos</span>
                        <span className="text-white font-medium">{ticket.seats.map(s => s.number).join(', ')}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-700 mt-1">
                         <span className="text-lg font-bold text-[#2ecc71] block">${ticket.totalPrice.toFixed(2)}</span>
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;