
import React, { useState } from 'react';
import { CreditCard } from '../types';

interface Props {
  onBack: () => void;
  savedCards: CreditCard[];
  onSaveCard: (card: Omit<CreditCard, 'id'>) => void;
  onDeleteCard: (id: string) => void;
}

const PaymentMethodsView: React.FC<Props> = ({ onBack, savedCards, onSaveCard, onDeleteCard }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', holder: '', expiry: '', brand: 'visa' as const });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCard({
      ...newCard,
      number: newCard.number.slice(-4) // Solo guardamos los últimos 4 dígitos por seguridad simulada
    });
    setShowAddForm(false);
    setNewCard({ number: '', holder: '', expiry: '', brand: 'visa' });
  };

  return (
    <div className="flex flex-col h-full bg-background-dark font-sans relative">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md pt-12 border-b border-white/5">
        <div className="flex items-center px-4 pb-4 gap-4">
          <button 
            onClick={onBack}
            className="size-10 flex items-center justify-center rounded-full bg-white/5 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <h2 className="text-white text-lg font-bold">Métodos de Pago</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar pb-32">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Tus Tarjetas Guardadas</h3>
          
          {savedCards.map(card => (
            <div key={card.id} className="relative h-48 w-full bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-8xl text-white">contactless</span>
              </div>
              <button 
                onClick={() => onDeleteCard(card.id)}
                className="absolute top-4 right-4 z-20 text-white/30 hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
              <div className="flex flex-col h-full justify-between relative z-10">
                 <div className="flex justify-between items-start">
                    <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">credit_card</span>
                    </div>
                    <span className="text-white font-bold italic tracking-tighter uppercase">{card.brand}</span>
                 </div>
                 <div className="space-y-1">
                    <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Número de Tarjeta</p>
                    <p className="text-white text-lg font-mono tracking-[0.2em]">•••• •••• •••• {card.number}</p>
                 </div>
                 <div className="flex justify-between">
                    <div>
                      <p className="text-white/40 text-[8px] font-bold uppercase">Titular</p>
                      <p className="text-white text-xs font-bold uppercase">{card.holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-[8px] font-bold uppercase">Vence</p>
                      <p className="text-white text-xs font-bold">{card.expiry}</p>
                    </div>
                 </div>
              </div>
            </div>
          ))}

          {!showAddForm ? (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full h-16 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-neutral-400 font-bold hover:border-accent-green hover:text-accent-green transition-all active:scale-95"
            >
               <span className="material-symbols-outlined">add_card</span>
               Agregar Nueva Tarjeta
            </button>
          ) : (
            <form onSubmit={handleAddCard} className="bg-surface-dark border border-white/10 rounded-3xl p-6 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="text-white font-bold text-sm">Nueva Tarjeta</h4>
                 <button type="button" onClick={() => setShowAddForm(false)} className="text-neutral-500">
                   <span className="material-symbols-outlined text-sm">close</span>
                 </button>
               </div>
               <div className="space-y-4">
                 <input 
                   required
                   placeholder="Número de Tarjeta" 
                   className="w-full bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                   value={newCard.number}
                   onChange={e => setNewCard({...newCard, number: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                 />
                 <input 
                   required
                   placeholder="Nombre del Titular" 
                   className="w-full bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                   value={newCard.holder}
                   onChange={e => setNewCard({...newCard, holder: e.target.value})}
                 />
                 <div className="grid grid-cols-2 gap-4">
                   <input 
                     required
                     placeholder="MM/YY" 
                     className="bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                     value={newCard.expiry}
                     onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                   />
                   <select 
                     className="bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                     value={newCard.brand}
                     onChange={e => setNewCard({...newCard, brand: e.target.value as any})}
                   >
                     <option value="visa">Visa</option>
                     <option value="mastercard">Mastercard</option>
                     <option value="amex">Amex</option>
                   </select>
                 </div>
               </div>
               <button type="submit" className="w-full bg-accent-green text-primary h-12 rounded-xl font-bold mt-2 active:scale-95 transition-transform">
                 Guardar Tarjeta
               </button>
            </form>
          )}
        </div>

        <div className="pt-4 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Otros Métodos</h3>
          <div className="bg-surface-dark p-4 rounded-xl border border-white/5 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-400">payments</span>
                <span className="text-sm font-bold text-white">PayPal</span>
             </div>
             <span className="text-[10px] font-bold text-neutral-500 italic">Próximamente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsView;
