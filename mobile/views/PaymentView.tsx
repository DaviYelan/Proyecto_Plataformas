
import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { View, BusTrip, CreditCard, User } from '../types';
import { apiService } from '../services/apiService';

interface Props {
  onNavigate: (view: View) => void;
  trip: BusTrip | null;
  seatCount: number;
  onComplete: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  savedCards: CreditCard[];
  onSaveCard: (card: Omit<CreditCard, 'id'>) => void;
  user: User | null;
}

const PaymentView: React.FC<Props> = ({ onNavigate, trip, seatCount, onComplete, showToast, savedCards, onSaveCard, user }) => {
  const { isDarkMode } = useTheme();
  const totalPrice = (trip?.price || 0) * seatCount;
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | 'new'>('new');
  const [backendCards, setBackendCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar tarjetas guardadas del backend
  useEffect(() => {
    const loadBackendCards = async () => {
      if (!user) {
        console.log('[PAYMENT] No user logged in');
        setLoading(false);
        return;
      }
      
      console.log('[PAYMENT] Loading cards for user:', user.email);
      
      try {
        const response = await apiService.get('/persona/lista');
        console.log('[PAYMENT] API Response:', response);
        const personas = response.data?.personas || response.personas || response.data || [];
        console.log('[PAYMENT] Total personas:', personas.length);
        
        // Buscar todas las personas con este correo y tomar la que tenga metodo_pago
        const userPersonas = personas.filter((p: any) => p.correo === user.email);
        console.log('[PAYMENT] Personas encontradas con este correo:', userPersonas.length);
        
        const userFound = userPersonas.find((p: any) => p.metodo_pago?.numero_tarjeta) || userPersonas[0];
        console.log('[PAYMENT] Persona seleccionada:', userFound);
        
        if (userFound?.metodo_pago?.numero_tarjeta) {
          console.log('[PAYMENT] Backend card found:', userFound.metodo_pago);
          const metodo_pago = userFound.metodo_pago;
          // Limpiar el número de tarjeta de guiones y espacios, luego tomar los últimos 4
          const cleanCardNumber = metodo_pago.numero_tarjeta.replace(/[-\s]/g, '');
          console.log('[PAYMENT] Clean card number:', cleanCardNumber);
          const lastFour = cleanCardNumber.slice(-4);
          console.log('[PAYMENT] Last 4 digits:', lastFour);
          
          const card: CreditCard = {
            id: `backend-${metodo_pago.id_pago || Date.now()}`,
            number: lastFour,
            holder: metodo_pago.titular || 'Titular',
            expiry: metodo_pago.fecha_vencimiento || 'MM/YY',
            brand: 'visa' // Por defecto
          };
          console.log('[PAYMENT] Card object created:', card);
          setBackendCards([card]);
          // Auto-seleccionar la tarjeta del backend si existe
          setSelectedCardId(card.id);
        } else {
          console.log('[PAYMENT] No backend card found for user - metodo_pago:', userFound?.metodo_pago);
          setBackendCards([]);
        }
      } catch (error) {
        console.error('[PAYMENT] Error loading backend cards:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBackendCards();
  }, [user]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Si se eligió guardar la tarjeta nueva
    if (selectedCardId === 'new' && saveForFuture) {
      onSaveCard({
        number: cardNumber.slice(-4),
        holder: cardholder,
        expiry: expiryDate,
        brand: 'visa' // Simplificación
      });
    }

    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  // Combinar tarjetas del backend y localStorage
  const allCards = [...backendCards, ...savedCards];
  
  console.log('[PAYMENT RENDER] backendCards:', backendCards);
  console.log('[PAYMENT RENDER] savedCards:', savedCards);
  console.log('[PAYMENT RENDER] allCards:', allCards);
  console.log('[PAYMENT RENDER] user:', user);
  console.log('[PAYMENT RENDER] loading:', loading);
  
  // Si se seleccionó una tarjeta guardada, no se necesita validar el formulario
  const isFormValid = selectedCardId !== 'new' || (cardNumber.length === 16 && expiryDate.length === 5 && cvv.length === 3 && cardholder);

  return (
    <div className={`flex flex-col h-full overflow-hidden font-sans ${isDarkMode ? 'bg-[#141414] text-white' : 'bg-white text-black'}`}>
      <header className={`flex items-center p-4 pt-12 pb-4 border-b ${isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-gray-200'}`}>
        <button 
          onClick={() => onNavigate(View.SEAT_SELECTION)}
          className="bg-[#2ecc71] text-black flex size-12 items-center justify-center cursor-pointer rounded-xl hover:bg-[#27ae60] active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/30"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
        </button>
        <h2 className={`text-[18px] font-bold flex-1 text-center pr-12 tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Pago Seguro</h2>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 pb-32">
        <div className="mb-8">
          <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-4 ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Resumen de Pedido</h3>
          <div className={`rounded-2xl p-6 border space-y-4 shadow-xl ${isDarkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className={`text-[17px] font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{trip?.origin} → {trip?.destination}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>
                  {trip?.company} • {trip?.class}
                </p>
              </div>
            </div>
            <div className={`h-[1px] ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}></div>
            <div className="space-y-3 pt-1">
              <div className="flex justify-between text-[14px]">
                <span className={`font-medium ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>Tickets ({seatCount}x)</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Total a Pagar</span>
                <span className="text-[#2ecc71] text-[20px] font-black">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Método de Pago</h3>
          
          {/* Tarjetas Guardadas (Backend + localStorage) */}
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="material-symbols-outlined animate-spin text-[#2ecc71] text-[32px]">refresh</span>
            </div>
          ) : allCards.length > 0 ? (
            <div className="space-y-3">
              {allCards.map(card => (
                <button 
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedCardId === card.id ? 'bg-[#2ecc71]/10 border-[#2ecc71]' : isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`}>credit_card</span>
                    <div className="text-left">
                      <p className={`text-sm font-bold uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>{card.brand} •••• {card.number}</p>
                      <p className={`text-[10px] font-medium uppercase ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{card.holder}</p>
                    </div>
                  </div>
                  {selectedCardId === card.id && (
                    <span className="material-symbols-outlined text-[#2ecc71]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          ) : null}

          <button 
            onClick={() => setSelectedCardId('new')}
            className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${selectedCardId === 'new' ? 'bg-[#2ecc71]/10 border-[#2ecc71]' : isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-gray-50 border-gray-200'}`}
          >
            <span className={`material-symbols-outlined ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`}>add</span>
            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Usar Nueva Tarjeta</span>
          </button>

          {selectedCardId === 'new' && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <p className={`text-[13px] font-bold ml-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Nombre del Titular</p>
                <input 
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                  className={`w-full h-14 border rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#2ecc71] transition-colors ${isDarkMode ? 'bg-[#1c1c1c] border-white/10 text-white placeholder:text-neutral-600' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
                  placeholder="Juan Perez" 
                />
              </div>
              <div className="space-y-2">
                <p className={`text-[13px] font-bold ml-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Número de Tarjeta</p>
                <input 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  type="text"
                  inputMode="numeric"
                  className={`w-full h-14 border rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#2ecc71] transition-colors ${isDarkMode ? 'bg-[#1c1c1c] border-white/10 text-white placeholder:text-neutral-600' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
                  placeholder="1234 5678 9101 1121" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  className={`h-14 border rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#2ecc71] ${isDarkMode ? 'bg-[#1c1c1c] border-white/10 text-white' : 'bg-white border-gray-200 text-black'}`}
                  placeholder="MM/YY" 
                />
                <input 
                  value={cvv}
                  onChange={handleCvvChange}
                  className={`h-14 border rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#2ecc71] ${isDarkMode ? 'bg-[#1c1c1c] border-white/10 text-white' : 'bg-white border-gray-200 text-black'}`}
                  placeholder="CVV" 
                />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer group pt-2">
                <div className={`size-6 rounded-md border flex items-center justify-center transition-all ${saveForFuture ? 'bg-[#2ecc71] border-[#2ecc71]' : isDarkMode ? 'border-white/10' : 'border-gray-300'}`}>
                  {saveForFuture && <span className="material-symbols-outlined text-black text-sm font-bold">check</span>}
                  <input type="checkbox" className="hidden" checked={saveForFuture} onChange={() => setSaveForFuture(!saveForFuture)} />
                </div>
                <span className={`text-xs font-medium select-none ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>Guardar esta tarjeta para futuros viajes</span>
              </label>
            </div>
          )}
        </div>
        
        {/* Botón de Pagar Movido Aquí */}
        <div className="mt-8 pb-6">
          <button 
            disabled={isProcessing || !isFormValid}
            onClick={handlePayment}
            className="w-full h-16 bg-[#2ecc71] text-black font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#2ecc71]/50 hover:bg-[#27ae60] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined animate-spin">refresh</span>
                 <span>Procesando Pago...</span>
              </div>
            ) : `PAGAR $${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </div>

    </div>
  );
};

export default PaymentView;
