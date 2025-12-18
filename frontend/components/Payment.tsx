import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, Bus, Plus, Wallet } from 'lucide-react';
import { Trip, Seat, Ticket, User, PaymentMethod } from '../types';

interface PaymentProps {
  trip: Trip;
  selectedSeats: Seat[];
  onBack: () => void;
  onSuccess: (ticket: Ticket) => void;
  user: User | null;
  tripDate?: string;
}

const Payment: React.FC<PaymentProps> = ({ trip, selectedSeats, onBack, onSuccess, user, tripDate }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passengerName, setPassengerName] = useState(user?.name ? `${user.name} ${user.lastName || ''}`.trim() : '');
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  // Saved Card State
  const savedCards = user?.paymentMethods || [];
  const [useSavedCard, setUseSavedCard] = useState(savedCards.length > 0);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(savedCards.length > 0 ? savedCards[0].id : null);

  const totalPrice = selectedSeats.length * trip.price;

  useEffect(() => {
    // If user has saved cards, default to using the first one
    if (savedCards.length > 0) {
      setUseSavedCard(true);
      setSelectedCardId(savedCards[0].id);
    }
  }, [user]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      const ticket: Ticket = {
        id: `TKT-${Math.floor(Math.random() * 10000)}`,
        trip: trip,
        seats: selectedSeats,
        purchaseDate: new Date().toISOString(),
        passengerName: passengerName || 'Pasajero',
        totalPrice: totalPrice,
        tripDate: tripDate || new Date().toISOString().split('T')[0]
      };
      setCreatedTicket(ticket);
    }, 2000);
  };

  const handleFinish = () => {
    if (createdTicket) {
      onSuccess(createdTicket);
    }
  };

  const selectedCard = savedCards.find(c => c.id === selectedCardId);

  if (success && createdTicket) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#121212] text-white p-4 animate-in fade-in zoom-in duration-300 overflow-y-auto">
        <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-2xl border border-gray-800 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Pago Exitoso!</h2>
          <p className="text-gray-400 mb-6">Tu reserva ha sido confirmada. Puedes verla en "Mis Boletos".</p>
          
          <div className="bg-[#2a2e2a] rounded-xl p-4 mb-6 text-left border border-gray-700">
             <p className="text-xs text-gray-500 uppercase font-bold mb-2">Detalles del Viaje</p>
             <div className="flex justify-between items-center mb-1">
                <span className="text-white font-medium">{trip.origin} → {trip.destination}</span>
             </div>
             <div className="text-sm text-gray-400 mb-1">
               <span className="font-semibold text-gray-300">Asientos:</span> {selectedSeats.map(s => s.number).join(', ')}
             </div>
              <div className="text-sm text-gray-400">
               <span className="font-semibold text-gray-300">Total:</span> ${totalPrice.toFixed(2)}
             </div>
             <div className="text-sm text-gray-400 mt-2 pt-2 border-t border-gray-700">
               <span className="font-semibold text-gray-300">Ticket ID:</span> {createdTicket.id}
             </div>
          </div>
          
          <button onClick={handleFinish} className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-green-500/20">
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#121212] text-white font-sans">
       {/* Header */}
       <div className="bg-[#1e1e1e] border-b border-gray-800 px-6 py-4 flex items-center justify-between shadow-xl z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-300 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Pago Seguro</h2>
            <p className="text-sm text-gray-400">Finaliza tu compra</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
            
            {/* Payment Form */}
            <div className="bg-[#1e1e1e] p-6 md:p-8 rounded-2xl border border-gray-800 shadow-lg order-2 lg:order-1">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                    <Wallet className="h-5 w-5 text-[#2ecc71]" /> Método de Pago
                </h3>
                
                <form onSubmit={handlePayment} className="space-y-5">
                    
                    {savedCards.length > 0 && (
                      <div className="mb-6">
                        <div className="flex gap-2 mb-4">
                          <button
                            type="button"
                            onClick={() => setUseSavedCard(true)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${useSavedCard ? 'bg-[#2ecc71] border-[#2ecc71] text-white' : 'bg-[#2a2e2a] border-gray-700 text-gray-400 hover:text-white'}`}
                          >
                            Mis Tarjetas
                          </button>
                          <button
                            type="button"
                            onClick={() => setUseSavedCard(false)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${!useSavedCard ? 'bg-[#2ecc71] border-[#2ecc71] text-white' : 'bg-[#2a2e2a] border-gray-700 text-gray-400 hover:text-white'}`}
                          >
                            Nueva Tarjeta
                          </button>
                        </div>
                      </div>
                    )}

                    {useSavedCard && savedCards.length > 0 ? (
                      <div className="space-y-3">
                        {savedCards.map(card => (
                          <div 
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedCardId === card.id ? 'bg-[#2ecc71]/10 border-[#2ecc71]' : 'bg-[#2a2e2a] border-gray-700 hover:border-gray-600'}`}
                          >
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-6 bg-gray-600 rounded flex items-center justify-center text-[8px] text-white font-bold">
                                  {card.brand ? card.brand.toUpperCase() : 'CARD'}
                               </div>
                               <div>
                                  <p className="text-white font-medium text-sm">{card.number}</p>
                                  <p className="text-xs text-gray-500">{card.holder} • Exp: {card.expiry}</p>
                               </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedCardId === card.id ? 'border-[#2ecc71] bg-[#2ecc71]' : 'border-gray-500'}`}>
                               {selectedCardId === card.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                          </div>
                        ))}
                         <button 
                             type="button" 
                             onClick={() => setUseSavedCard(false)}
                             className="w-full mt-2 py-3 border border-dashed border-gray-600 rounded-xl text-gray-400 text-sm hover:text-white hover:border-gray-500 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                         >
                            <Plus size={16} /> Usar otra tarjeta
                         </button>
                      </div>
                    ) : (
                      <>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre en la tarjeta</label>
                            <input 
                              type="text" 
                              required 
                              value={passengerName}
                              onChange={(e) => setPassengerName(e.target.value)}
                              placeholder="Ej. Juan Pérez" 
                              className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Número de tarjeta</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                <input 
                                  type="text" 
                                  required 
                                  maxLength={19}
                                  placeholder="0000 0000 0000 0000" 
                                  className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600 font-mono" 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Expiración</label>
                                <input 
                                  type="text" 
                                  required 
                                  placeholder="MM/YY" 
                                  maxLength={5}
                                  className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600 text-center" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">CVC</label>
                                <input 
                                  type="text" 
                                  required 
                                  placeholder="123" 
                                  maxLength={3}
                                  className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600 text-center" 
                                />
                            </div>
                        </div>
                      </>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading || (useSavedCard && !selectedCardId) || (!useSavedCard && !passengerName)}
                        className="w-full mt-6 bg-[#2ecc71] hover:bg-[#27ae60] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Pagar $${totalPrice.toFixed(2)}`}
                    </button>
                    <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1 mt-2">
                        <CheckCircle className="h-3 w-3" /> Transacción encriptada SSL
                    </p>
                </form>
            </div>

            {/* Order Summary */}
            <div className="bg-[#1e1e1e] p-6 md:p-8 rounded-2xl border border-gray-800 shadow-lg h-fit order-1 lg:order-2 lg:sticky lg:top-24">
                 <h3 className="text-lg font-bold mb-6 text-white">Resumen del Viaje</h3>
                 
                 <div className="space-y-6 relative">
                    <div className="flex items-start gap-4">
                         <div className="w-12 h-12 bg-[#2a2e2a] rounded-xl flex items-center justify-center text-[#2ecc71] border border-gray-700">
                             <Bus className="h-6 w-6" />
                         </div>
                         <div>
                             <p className="text-xs text-gray-500 uppercase font-bold">Operador</p>
                             <p className="font-bold text-white text-lg">{trip.operator}</p>
                             <p className="text-xs text-[#2ecc71] font-medium bg-[#2ecc71]/10 px-2 py-0.5 rounded w-fit mt-1 border border-[#2ecc71]/20">{trip.type}</p>
                         </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#2a2e2a] p-4 rounded-xl border border-gray-700">
                        <div className="flex flex-col items-center h-full pt-1">
                            <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                            <div className="h-10 w-0.5 bg-gray-600 my-1 border-l border-dashed border-gray-500"></div>
                            <div className="w-2.5 h-2.5 bg-[#2ecc71] rounded-full"></div>
                        </div>
                        <div className="space-y-4 flex-1">
                             <div>
                                 <p className="text-xl font-bold text-white leading-none">{trip.departureTime}</p>
                                 <p className="text-sm text-gray-400 mt-1">{trip.origin}</p>
                             </div>
                             <div>
                                 <p className="text-xl font-bold text-white leading-none">{trip.arrivalTime}</p>
                                 <p className="text-sm text-gray-400 mt-1">{trip.destination}</p>
                             </div>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-700 pt-4 mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Precio por boleto</span>
                            <span className="text-white">${trip.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Asientos seleccionados</span>
                            <span className="text-white font-medium text-right max-w-[150px]">{selectedSeats.map(s => s.number).join(', ')}</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-700 mt-2">
                            <span className="text-lg font-bold text-white">Total a Pagar</span>
                            <span className="text-3xl font-bold text-[#2ecc71]">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;