
import React, { useState } from 'react';
import { View, BusTrip } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  onSelectTrip: (trip: BusTrip) => void;
  onTrackTrip: (trip: BusTrip) => void;
  myTrips: BusTrip[];
}

const MyTripsView: React.FC<Props> = ({ onNavigate, onSelectTrip, onTrackTrip, myTrips }) => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredTrips = myTrips.filter(t => 
    tab === 'upcoming' ? t.status !== 'Completado' : t.status === 'Completado'
  );

  return (
    <div className="flex flex-col h-full bg-background-dark font-sans">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md pt-12 border-b border-white/5">
        <div className="px-6 pb-4">
          <h2 className="text-white text-2xl font-bold tracking-tight">Mis Viajes</h2>
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-widest mt-1">Gestiona tus boletos</p>
        </div>
        
        <div className="flex px-6 gap-8 border-t border-white/5">
          <button 
            onClick={() => setTab('upcoming')}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${tab === 'upcoming' ? 'text-accent-green' : 'text-neutral-500'}`}
          >
            Próximos
            {tab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-green rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setTab('past')}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${tab === 'past' ? 'text-accent-green' : 'text-neutral-500'}`}
          >
            Pasados
            {tab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-green rounded-t-full"></div>}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 pb-32 hide-scrollbar">
        {filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
            <span className="material-symbols-outlined text-6xl mb-4">no_travel</span>
            <p className="font-bold text-lg">No hay viajes registrados</p>
          </div>
        ) : (
          filteredTrips.map(trip => (
            <div key={trip.id} className="bg-[#1c1c1c] rounded-2xl p-5 border border-white/5 space-y-4 shadow-xl relative overflow-hidden">
              {trip.isOfflineAvailable && (
                <div className="absolute top-0 right-0 bg-accent-green/20 px-3 py-1 rounded-bl-xl border-l border-b border-accent-green/30 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-accent-green text-[14px]">offline_pin</span>
                  <span className="text-[8px] font-black text-accent-green uppercase tracking-tighter">Sincronizado</span>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
                    <img src={trip.logoUrl} alt={trip.company} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{trip.company}</h3>
                    <p className="text-[10px] text-accent-green font-bold uppercase tracking-widest">{trip.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">${trip.price.toFixed(2)}</p>
                  <p className="text-neutral-500 text-[10px] font-medium">{trip.bookingDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-lg font-black">{trip.origin}</p>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tighter">{trip.departureTime}</p>
                </div>
                <div className="flex-1 px-4 flex flex-col items-center opacity-30">
                  <div className="w-full h-px bg-white/10 relative">
                    <span className="material-symbols-outlined absolute left-1/2 -translate-x-1/2 -top-2.5 text-accent-green text-sm">directions_bus</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg font-black">{trip.destination}</p>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tighter">{trip.arrivalTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => onSelectTrip(trip)}
                  className="h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-lg">confirmation_number</span>
                  Boleto
                </button>
                {tab === 'upcoming' && (
                  <button 
                    onClick={() => onTrackTrip(trip)}
                    className="h-12 bg-accent-green/10 hover:bg-accent-green/20 border border-accent-green/20 rounded-xl text-accent-green text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-lg">map</span>
                    Rastrear
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background-dark/95 backdrop-blur-2xl border-t border-white/5 h-[84px] flex justify-around items-center px-4 pb-6 z-50">
        <button onClick={() => onNavigate(View.HOME)} className="flex flex-col items-center gap-1.5 opacity-30">
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Inicio</span>
        </button>
        <button onClick={() => onNavigate(View.AI_CHAT)} className="flex flex-col items-center gap-1.5 opacity-30">
          <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">BusGo AI</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-accent-green">
          <span className="material-symbols-outlined text-[24px] fill-1">confirmation_number</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Viajes</span>
        </button>
        <button onClick={() => onNavigate(View.PROFILE)} className="flex flex-col items-center gap-1.5 opacity-30">
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default MyTripsView;
