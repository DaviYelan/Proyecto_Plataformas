
import React, { useState } from 'react';
import { View, BusTrip, CreditCard } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  trip: BusTrip | null;
  seatCount: number;
  onComplete: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  savedCards: CreditCard[];
  onSaveCard: (card: Omit<CreditCard, 'id'>) => void;
}

const PaymentView: React.FC<Props> = ({ onNavigate, trip, seatCount, onComplete, showToast, savedCards, onSaveCard }) => {
  const totalPrice = (trip?.price || 0) * seatCount;
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | 'new'>('new');

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

  const isFormValid = selectedCardId !== 'new' || (cardNumber.length === 16 && expiryDate.length === 5 && cvv.length === 3 && cardholder);

  return (
    <div className="flex flex-col h-full bg-[#141414] text-white overflow-hidden font-sans">
      <header className="flex items-center p-4 pt-12 pb-4 bg-[#141414] border-b border-white/5">
        <button 
          onClick={() => onNavigate(View.SEAT_SELECTION)}
          className="text-white flex size-12 items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-white text-[18px] font-bold flex-1 text-center pr-12 tracking-tight">Pago Seguro</h2>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 pb-40">
        <div className="mb-8">
          <h3 className="text-neutral-500 text-[11px] font-bold uppercase tracking-[0.15em] mb-4">Resumen de Pedido</h3>
          <div className="bg-[#1c1c1c] rounded-2xl p-6 border border-white/5 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-white text-[17px] font-bold leading-tight">{trip?.origin} → {trip?.destination}</p>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                  {trip?.company} • {trip?.class}
                </p>
              </div>
            </div>
            <div className="h-[1px] bg-white/5"></div>
            <div className="space-y-3 pt-1">
              <div className="flex justify-between text-[14px]">
                <span className="text-neutral-400 font-medium">Tickets ({seatCount}x)</span>
                <span className="text-white font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-white text-[16px] font-bold">Total a Pagar</span>
                <span className="text-accent-green text-[20px] font-black">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-neutral-500 text-[11px] font-bold uppercase tracking-[0.15em] mb-2">Método de Pago</h3>
          
          {/* Tarjetas Guardadas */}
          {savedCards.length > 0 && (
            <div className="space-y-3">
              {savedCards.map(card => (
                <button 
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedCardId === card.id ? 'bg-accent-green/10 border-accent-green' : 'bg-surface-dark border-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-white/50">credit_card</span>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white uppercase">{card.brand} •••• {card.number}</p>
                      <p className="text-[10px] text-neutral-500 font-medium uppercase">{card.holder}</p>
                    </div>
                  </div>
                  {selectedCardId === card.id && (
                    <span className="material-symbols-outlined text-accent-green">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <button 
            onClick={() => setSelectedCardId('new')}
            className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${selectedCardId === 'new' ? 'bg-accent-green/10 border-accent-green' : 'bg-surface-dark border-white/5'}`}
          >
            <span className="material-symbols-outlined text-white/50">add</span>
            <span className="text-sm font-bold text-white">Usar Nueva Tarjeta</span>
          </button>

          {selectedCardId === 'new' && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <p className="text-white text-[13px] font-bold ml-1">Nombre del Titular</p>
                <input 
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                  className="w-full h-14 bg-[#1c1c1c] border border-white/10 rounded-xl px-4 text-white text-[15px] focus:outline-none focus:border-accent-green transition-colors placeholder:text-neutral-600" 
                  placeholder="Juan Perez" 
                />
              </div>
              <div className="space-y-2">
                <p className="text-white text-[13px] font-bold ml-1">Número de Tarjeta</p>
                <input 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  type="text"
                  inputMode="numeric"
                  className="w-full h-14 bg-[#1c1c1c] border border-white/10 rounded-xl px-4 text-white text-[15px] focus:outline-none focus:border-accent-green transition-colors placeholder:text-neutral-600" 
                  placeholder="1234 5678 9101 1121" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  className="h-14 bg-[#1c1c1c] border border-white/10 rounded-xl px-4 text-white text-[15px] focus:outline-none focus:border-accent-green" 
                  placeholder="MM/YY" 
                />
                <input 
                  value={cvv}
                  onChange={handleCvvChange}
                  className="h-14 bg-[#1c1c1c] border border-white/10 rounded-xl px-4 text-white text-[15px] focus:outline-none focus:border-accent-green" 
                  placeholder="CVV" 
                />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer group pt-2">
                <div className={`size-6 rounded-md border flex items-center justify-center transition-all ${saveForFuture ? 'bg-accent-green border-accent-green' : 'border-white/10'}`}>
                  {saveForFuture && <span className="material-symbols-outlined text-primary text-sm font-bold">check</span>}
                  <input type="checkbox" className="hidden" checked={saveForFuture} onChange={() => setSaveForFuture(!saveForFuture)} />
                </div>
                <span className="text-xs text-neutral-400 font-medium select-none">Guardar esta tarjeta para futuros viajes</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 pb-12 bg-gradient-to-t from-[#141414] via-[#141414]/95 to-transparent">
        <button 
          disabled={isProcessing || !isFormValid}
          onClick={handlePayment}
          className="w-full h-16 bg-accent-green text-primary font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-30"
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
  );
};

export default PaymentView;
