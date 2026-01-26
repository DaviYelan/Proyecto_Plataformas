import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, Bus, Plus, Wallet } from 'lucide-react';
import { Trip, Seat, Ticket, User } from '../types';
import * as api from '../services/apiService';
import { useToast } from './ui/Toast';

interface PaymentProps {
  trip: Trip;
  selectedSeats: Seat[];
  onBack: () => void;
  onSuccess: (ticket: Ticket) => void;
  user: User | null;
  tripDate?: string;
  onUserUpdate?: (user: User) => void;
}

const Payment: React.FC<PaymentProps> = ({ trip, selectedSeats, onBack, onSuccess, user, tripDate, onUserUpdate }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passengerName, setPassengerName] = useState(user?.name ? `${user.name} ${user.lastName || ''}`.trim() : '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [saveCardModal, setSaveCardModal] = useState(false);
  const [shouldSaveCard, setShouldSaveCard] = useState(false);
  const [cardValidationErrors, setCardValidationErrors] = useState<{[key: string]: string}>({});

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

  // Validar número de tarjeta (Luhn algorithm)
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s+/g, '');
    if (cleaned.length !== 16) return false;
    if (!/^\d+$/.test(cleaned)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  // Validar expiración
  const validateExpiry = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/');
    const m = parseInt(month, 10);
    const y = parseInt(year, 10) + 2000;
    if (m < 1 || m > 12) return false;
    
    const now = new Date();
    const expDate = new Date(y, m - 1);
    return expDate > now;
  };

  // Validar CVC
  const validateCVC = (cvc: string): boolean => {
    return /^\d{3,4}$/.test(cvc);
  };

  // Validar formulario
  const validatePaymentForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!passengerName.trim()) {
      errors.name = 'El nombre es requerido';
    }
    
    if (!validateCardNumber(cardNumber)) {
      errors.card = 'Número de tarjeta inválido';
    }
    
    if (!validateExpiry(cardExpiry)) {
      errors.expiry = 'Expiración debe ser MM/YY y válida';
    }
    
    if (!validateCVC(cardCVC)) {
      errors.cvc = 'CVC debe tener 3 o 4 dígitos';
    }
    
    setCardValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Formatear expiración
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setCardExpiry(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar si es tarjeta nueva
    if (!useSavedCard) {
      if (!validatePaymentForm()) {
        toast.show('Por favor completa correctamente todos los campos de la tarjeta','warning');
        return;
      }
    }
    
    if (!user) {
      console.error('Usuario no autenticado');
      toast.show('Debes iniciar sesión para comprar boletos','error');
      onBack();
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const ticket: Ticket = {
        id: `TKT-${Math.floor(Math.random() * 10000)}`,
        trip: trip,
        seats: selectedSeats,
        purchaseDate: new Date().toISOString(),
        passengerName: passengerName || 'Pasajero',
        totalPrice: totalPrice,
        tripDate: tripDate || new Date().toISOString().split('T')[0]
      };

      // Guardar boletos en el backend de forma correcta
      const numerosAsientos = selectedSeats.map(seat => Number.parseInt(seat.number));
      
      // Usar el turnId del viaje si está disponible
      const turnId = trip.turnId || 1;
      
      const boletoData: Partial<api.BoletoBackend> = {
        asientos: numerosAsientos,
        precio_unitario: trip.price,
        persona: {
          id_persona: Number(user.id),
          tipo_identificacion: 'Cédula',
          numero_identificacion: '',
          nombre: user.name,
          apellido: user.lastName || '',
          genero: '',
          correo: user.email || '',
          telefono: user.phone || '',
          direccion: '',
          fecha_nacimiento: '',
          saldo_disponible: (user.balance || 0) - totalPrice,
          tipo_tarifa: 'Normal',
          usuario: user.email || '',
          contrasenia: '',
          estado_cuenta: 'Activo',
          tipo_cuenta: 'Cliente'
        } as api.PersonaBackend,
        turno: {
          id_turno: turnId,
          fecha_salida: tripDate || new Date().toLocaleDateString('es-EC'),
          numero_turno: 1,
          estado_turno: 'Activo',
          horario: {
            id_horario: 0,
            hora_salida: trip.departureTime,
            hora_llegada: trip.arrivalTime,
            estado_horario: 'Activo',
            ruta: {
              id_ruta: 0,
              origen: trip.origin,
              destino: trip.destination,
              precio_unitario: trip.price,
              distancia: 0,
              tiempo_estimado: trip.duration,
              estado_ruta: 'Activo',
              bus: {
                numero_bus: 0,
                placa: '',
                marca: '',
                modelo: '',
                capacidad_pasajeros: 40,
                estado_bus: 'Activo',
                cooperativa: {
                  id_cooperativa: 0,
                  nombre_cooperativa: trip.operator,
                  ruc: '',
                  direccion: '',
                  telefono: '',
                  correo_empresarial: ''
                }
              }
            }
          }
        } as any
      };

      console.log('Guardando boletos. Asientos:', numerosAsientos, 'Turno ID:', turnId);
      const result = await api.saveBoleto(boletoData);

      if (!result.ok) {
        const backendMsg = result.data?.msg || 'No se pudo guardar el boleto';
        toast.show(backendMsg,'error');
        setLoading(false);
        return;
      }

      let nuevoBalance = result.data?.saldo_restante;

      // Si el backend no devolvió saldo, consultar la persona para mantener consistencia
      if (nuevoBalance === undefined && user.id) {
        const personaBackend = await api.getPersonaById(Number(user.id));
        nuevoBalance = personaBackend?.saldo_disponible;
      }

      // Fallback al cálculo local en caso de que el backend no envíe saldo
      if (nuevoBalance === undefined) {
        nuevoBalance = (user.balance || 0) - totalPrice;
      }

      console.log('Saldo anterior:', user.balance, 'Nuevo saldo:', nuevoBalance);

      localStorage.setItem(`user_balance_${user.email}`, String(nuevoBalance));
      
      if (onUserUpdate) {
        onUserUpdate({
          ...user,
          balance: nuevoBalance
        });
      }

      setLoading(false);
      
      // Si es tarjeta nueva y no se ha guardado, mostrar modal
      if (!useSavedCard) {
        setSaveCardModal(true);
        setCreatedTicket(ticket);
      } else {
        setSuccess(true);
        setCreatedTicket(ticket);
      }
    } catch (error) {
      console.error('Error en el pago:', error);
      toast.show('Error al procesar el pago. Intenta de nuevo.','error');
      setLoading(false);
    }
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
                              onChange={(e) => {
                                setPassengerName(e.target.value);
                                if (cardValidationErrors.name) setCardValidationErrors({...cardValidationErrors, name: ''});
                              }}
                              placeholder="Ej. Juan Pérez" 
                              className={`w-full bg-[#2a2e2a] border rounded-xl px-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600 ${cardValidationErrors.name ? 'border-red-500' : 'border-gray-700'}`}
                            />
                            {cardValidationErrors.name && <p className="text-red-500 text-xs mt-1">{cardValidationErrors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Número de tarjeta</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                <input 
                                  type="text" 
                                  required 
                                  value={cardNumber}
                                  onChange={(e) => {
                                    formatCardNumber(e.target.value);
                                    if (cardValidationErrors.card) setCardValidationErrors({...cardValidationErrors, card: ''});
                                  }}
                                  maxLength={19}
                                  placeholder="0000 0000 0000 0000" 
                                  className={`w-full bg-[#2a2e2a] border rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600 font-mono ${cardValidationErrors.card ? 'border-red-500' : 'border-gray-700'}`}
                                />
                            </div>
                            {cardValidationErrors.card && <p className="text-red-500 text-xs mt-1">{cardValidationErrors.card}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Expiración</label>
                                <input 
                                  type="text" 
                                  required 
                                  value={cardExpiry}
                                  onChange={(e) => {
                                    formatExpiry(e.target.value);
                                    if (cardValidationErrors.expiry) setCardValidationErrors({...cardValidationErrors, expiry: ''});
                                  }}
                                  placeholder="MM/YY" 
                                  maxLength={5}
                                  className={`w-full bg-[#2a2e2a] border rounded-xl px-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600 text-center ${cardValidationErrors.expiry ? 'border-red-500' : 'border-gray-700'}`}
                                />
                                {cardValidationErrors.expiry && <p className="text-red-500 text-xs mt-1">{cardValidationErrors.expiry}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">CVC</label>
                                <input 
                                  type="text" 
                                  required 
                                  value={cardCVC}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setCardCVC(value);
                                    if (cardValidationErrors.cvc) setCardValidationErrors({...cardValidationErrors, cvc: ''});
                                  }}
                                  placeholder="123" 
                                  maxLength={4}
                                  className={`w-full bg-[#2a2e2a] border rounded-xl px-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600 text-center ${cardValidationErrors.cvc ? 'border-red-500' : 'border-gray-700'}`}
                                />
                                {cardValidationErrors.cvc && <p className="text-red-500 text-xs mt-1">{cardValidationErrors.cvc}</p>}
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

      {/* Save Card Modal */}
      {saveCardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl max-w-sm w-full shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="w-12 h-12 bg-[#2ecc71]/10 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-[#2ecc71]" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Guardar tarjeta</h3>
              <p className="text-gray-400 text-sm mb-6">¿Deseas guardar esta tarjeta para futuros pagos? Podrás usar tarjetas guardadas sin ingresar los datos nuevamente.</p>
              
              <div className="bg-[#2a2e2a] p-4 rounded-xl mb-6 border border-gray-700">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Tarjeta a guardar</p>
                <p className="text-white font-mono text-sm">•••• •••• •••• {cardNumber.slice(-4)}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSaveCardModal(false);
                    setSuccess(true);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  No, después
                </button>
                <button
                  onClick={() => {
                    setShouldSaveCard(true);
                    setSuccess(true);
                    setSaveCardModal(false);
                    // TODO: Save card to backend when shouldSaveCard is true
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-medium bg-[#2ecc71] hover:bg-[#27ae60] text-white transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" /> Sí, guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;