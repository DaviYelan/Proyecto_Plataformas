
import React, { useState } from 'react';
import { View } from '../types';

interface Props {
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const FAQS = [
  { q: '¿Cómo puedo cancelar mi boleto?', a: 'Puedes cancelar tu boleto hasta 4 horas antes del viaje desde la sección Mis Viajes.' },
  { q: '¿Qué equipaje está permitido?', a: 'Se permite una maleta de bodega de hasta 20kg y un bolso de mano de 5kg.' },
  { q: '¿Aceptan pagos con tarjeta de débito?', a: 'Sí, aceptamos todas las tarjetas Visa, Mastercard y Diners Club locales.' },
  { q: '¿Tienen descuentos para estudiantes?', a: 'Sí, contamos con tarifas reducidas para estudiantes y tercera edad presentando el carnet.' },
];

const HelpCenterView: React.FC<Props> = ({ onBack, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-background-dark font-sans">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md pt-12 border-b border-white/5">
        <div className="flex items-center px-4 pb-4 gap-4">
          <button 
            onClick={onBack}
            className="size-10 flex items-center justify-center rounded-full bg-white/5 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <h2 className="text-white text-lg font-bold">Centro de Ayuda</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
        <div className="relative mb-8">
           <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">search</span>
           <input 
            type="text"
            placeholder="¿En qué podemos ayudarte?"
            className="w-full h-14 bg-surface-dark border border-white/5 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-accent-green transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: 'confirmation_number', label: 'Boletos' },
            { icon: 'payments', label: 'Pagos' },
            { icon: 'account_circle', label: 'Mi Cuenta' },
            { icon: 'security', label: 'Seguridad' },
          ].map(cat => (
            <button key={cat.label} className="flex flex-col items-center gap-3 p-6 bg-surface-dark rounded-2xl border border-white/5 active:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-accent-green text-3xl">{cat.icon}</span>
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-10">
          <h3 className="text-white font-bold mb-4">Preguntas Frecuentes</h3>
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="text-sm font-bold text-white/90">{faq.q}</span>
                <span className={`material-symbols-outlined text-neutral-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-accent-green/10 border border-accent-green/20 rounded-3xl p-6 text-center space-y-4">
           <div className="size-14 bg-accent-green rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-outlined text-primary font-bold">smart_toy</span>
           </div>
           <div>
              <h4 className="text-white font-bold">¿Aún necesitas ayuda?</h4>
              <p className="text-xs text-neutral-400 mt-1">Nuestra IA está disponible 24/7 para asistirte en tiempo real.</p>
           </div>
           <button 
            onClick={() => onNavigate(View.AI_CHAT)}
            className="w-full h-12 bg-accent-green text-primary font-bold rounded-xl active:scale-95 transition-transform"
           >
             Hablar con BusGo AI
           </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterView;
