
import React from 'react';
import { View, SearchCriteria } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  searchCriteria: SearchCriteria;
  onSearchUpdate: (criteria: SearchCriteria) => void;
}

const HomeView: React.FC<Props> = ({ onNavigate, searchCriteria, onSearchUpdate }) => {
  const handleSwap = () => {
    onSearchUpdate({
      ...searchCriteria,
      origin: searchCriteria.destination,
      destination: searchCriteria.origin
    });
  };

  return (
    <div className="flex flex-col h-full bg-background-dark relative overflow-hidden">
      {/* Elementos decorativos de fondo para evitar que se vea totalmente negro */}
      <div className="absolute top-[-10%] right-[-10%] size-64 bg-accent-emerald/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[20%] left-[-10%] size-64 bg-accent-green/5 rounded-full blur-[100px]"></div>

      <div className="relative z-10 flex flex-col h-full overflow-y-auto hide-scrollbar">
        {/* Barra superior */}
        <div className="flex items-center p-6 pt-12 justify-between w-full">
          <div className="flex flex-col">
            <span className="text-accent-emerald text-[10px] font-black uppercase tracking-[0.2em] mb-1">BusGo Platinum</span>
            <h1 className="text-2xl font-black tracking-tight text-white leading-tight">Hola, Juan Pérez 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate(View.NOTIFICATIONS)}
              className="size-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-95 transition-transform relative"
            >
              <span className="material-symbols-outlined text-white text-xl">notifications</span>
              <div className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-background-dark"></div>
            </button>
          </div>
        </div>

        <div className="px-6 pt-2 pb-32">
          {/* Tarjeta de búsqueda Premium */}
          <div className="bg-[#1c1c1c]/80 backdrop-blur-xl rounded-3xl p-6 space-y-5 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[120px] -rotate-12">map</span>
            </div>

            <div className="relative space-y-2">
              <div className="flex flex-col gap-1.5">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] pl-1">Punto de Origen</p>
                <div className="flex w-full items-center rounded-2xl bg-white/5 border border-white/5 h-14 px-4 gap-3 focus-within:border-accent-green/50 transition-colors">
                  <div className="size-8 rounded-lg bg-accent-emerald/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent-emerald text-[18px]">location_on</span>
                  </div>
                  <input 
                    className="flex-1 bg-transparent border-none text-white focus:ring-0 p-0 text-sm font-bold placeholder:text-white/20" 
                    placeholder="Escribe el origen..." 
                    value={searchCriteria.origin}
                    onChange={(e) => onSearchUpdate({...searchCriteria, origin: e.target.value})}
                  />
                </div>
              </div>

              <div className="absolute right-4 top-[64px] z-10">
                <button 
                  onClick={handleSwap}
                  className="bg-accent-emerald text-primary size-10 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px] font-black">swap_vert</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] pl-1">Destino Final</p>
                <div className="flex w-full items-center rounded-2xl bg-white/5 border border-white/5 h-14 px-4 gap-3 focus-within:border-accent-green/50 transition-colors">
                  <div className="size-8 rounded-lg bg-accent-emerald/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent-emerald text-[18px]">near_me</span>
                  </div>
                  <input 
                    className="flex-1 bg-transparent border-none text-white focus:ring-0 p-0 text-sm font-bold placeholder:text-white/20" 
                    placeholder="¿A dónde vamos hoy?" 
                    value={searchCriteria.destination}
                    onChange={(e) => onSearchUpdate({...searchCriteria, destination: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] pl-1">Fecha de Viaje</p>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl h-14 px-4">
                  <span className="material-symbols-outlined text-accent-emerald text-[18px]">calendar_today</span>
                  <span className="text-sm font-bold text-white">{searchCriteria.date}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] pl-1">Pasajeros</p>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl h-14 px-4">
                  <span className="material-symbols-outlined text-accent-emerald text-[18px]">group</span>
                  <span className="text-sm font-bold text-white">1 Pers.</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate(View.RESULTS)}
              className="w-full bg-accent-emerald hover:bg-emerald-400 text-primary font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 active:scale-[0.98] shadow-xl shadow-emerald-500/20 text-base tracking-tight"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
              BUSCAR RUTAS DISPONIBLES
            </button>
          </div>

          <div className="mt-10">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-none">Rutas Destacadas</h3>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1.5">Explora lo mejor de Ecuador</p>
              </div>
              <button className="text-accent-emerald text-[11px] font-black uppercase tracking-widest bg-accent-emerald/10 px-3 py-1.5 rounded-lg">Ver Todo</button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x">
              <button 
                onClick={() => onSearchUpdate({...searchCriteria, origin: 'Quito', destination: 'Guayaquil'})}
                className="min-w-[240px] snap-start bg-[#1c1c1c] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl text-left transition-transform active:scale-95"
              >
                <div className="h-32 bg-center bg-cover relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=600&auto=format&fit=crop")' }}>
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-black text-white uppercase">8 Horas</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-black text-white">Quito → Guayaquil</p>
                    <span className="text-accent-green font-black text-sm">$12.50</span>
                  </div>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase">Terminal Carcelén</p>
                </div>
              </button>
              <button 
                onClick={() => onSearchUpdate({...searchCriteria, origin: 'Quito', destination: 'Cuenca'})}
                className="min-w-[240px] snap-start bg-[#1c1c1c] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl text-left transition-transform active:scale-95"
              >
                <div className="h-32 bg-center bg-cover relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=600&auto=format&fit=crop")' }}>
                   <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-black text-white uppercase">10 Horas</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-black text-white">Quito → Cuenca</p>
                    <span className="text-accent-green font-black text-sm">$15.00</span>
                  </div>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase">Terminal Quitumbe</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación mejorada */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-[#1c1c1c]/90 backdrop-blur-2xl border border-white/10 h-[76px] rounded-[2.5rem] flex justify-around items-center px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        <button className="flex flex-col items-center gap-1 text-accent-green">
          <span className="material-symbols-outlined text-[26px] fill-1">home</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Explorar</span>
        </button>
        <button onClick={() => onNavigate(View.MY_TRIPS)} className="flex flex-col items-center gap-1 opacity-30 text-white">
          <span className="material-symbols-outlined text-[26px]">confirmation_number</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Mis Viajes</span>
        </button>
        <button onClick={() => onNavigate(View.AI_CHAT)} className="flex flex-col items-center gap-1 opacity-30 text-white">
          <div className="size-10 rounded-full bg-accent-green/20 flex items-center justify-center -mt-8 border-4 border-background-dark shadow-xl">
            <span className="material-symbols-outlined text-[24px] text-accent-green">smart_toy</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter mt-1">BusGo AI</span>
        </button>
        <button onClick={() => onNavigate(View.PROFILE)} className="flex flex-col items-center gap-1 opacity-30 text-white">
          <span className="material-symbols-outlined text-[26px]">person</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default HomeView;
