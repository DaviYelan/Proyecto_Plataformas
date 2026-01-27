
import React, { useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { View, SearchCriteria, User } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  searchCriteria: SearchCriteria;
  onSearchUpdate: (criteria: SearchCriteria) => void;
  user: User | null;
}

const HomeView: React.FC<Props> = ({ onNavigate, searchCriteria, onSearchUpdate, user }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleSwap = () => {
    onSearchUpdate({
      ...searchCriteria,
      origin: searchCriteria.destination,
      destination: searchCriteria.origin
    });
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-background-dark' : 'bg-white'} relative overflow-hidden`}>
      {/* Elementos decorativos de fondo para evitar que se vea totalmente negro */}
      <div className="absolute top-[-10%] right-[-10%] size-64 bg-accent-emerald/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[20%] left-[-10%] size-64 bg-accent-green/5 rounded-full blur-[100px]"></div>

      <div className="relative z-10 flex flex-col h-full overflow-y-auto hide-scrollbar">
        {/* Barra superior */}
        <div className="flex items-center p-6 pt-12 justify-between w-full">
          <div className="flex flex-col">
            <span className="text-accent-emerald text-[10px] font-black uppercase tracking-[0.2em] mb-1">BusGo Platinum</span>
            <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'} leading-tight`}>Hola, {user?.name || 'Usuario'} 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className={`size-11 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-200 border-gray-300 text-black'}`}
            >
              <span className="material-symbols-outlined text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button 
              onClick={() => onNavigate(View.NOTIFICATIONS)}
              className={`size-11 rounded-2xl flex items-center justify-center border active:scale-95 transition-transform relative ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-200 border-gray-300 text-black'}`}
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <div className={`absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 ${isDarkMode ? 'border-background-dark' : 'border-white'}`}></div>
            </button>
          </div>
        </div>

        <div className="px-6 pt-2 pb-32">
          {/* Tarjeta de búsqueda Premium */}
          <div className={`backdrop-blur-xl rounded-3xl p-6 space-y-5 shadow-2xl border relative overflow-hidden ${isDarkMode ? 'bg-[#1c1c1c]/80 border-white/5' : 'bg-gray-50/80 border-gray-200'}`}>
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[120px] -rotate-12">map</span>
            </div>

            <div className="relative space-y-2">
              <div className="flex flex-col gap-1.5">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] pl-1 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Punto de Origen</p>
                <div className={`flex w-full items-center rounded-2xl h-14 px-4 gap-3 transition-colors border-2 ${isDarkMode ? 'bg-white/5 border-[#2ecc71]/30' : 'bg-gray-100 border-[#2ecc71]/30'}`}>
                  <div className="size-8 rounded-lg flex items-center justify-center bg-[#2ecc71]/20">
                    <span className="material-symbols-outlined text-[#2ecc71] text-[18px]">location_on</span>
                  </div>
                  <input 
                    className={`flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm font-bold ${isDarkMode ? 'text-white placeholder:text-white/20' : 'text-black placeholder:text-black/30'}`} 
                    placeholder="Escribe el origen..." 
                    value={searchCriteria.origin}
                    onChange={(e) => onSearchUpdate({...searchCriteria, origin: e.target.value})}
                  />
                </div>
              </div>

              <div className="absolute right-4 top-[64px] z-10">
                <button 
                  onClick={handleSwap}
                  className="bg-[#2ecc71] text-black size-10 rounded-2xl flex items-center justify-center shadow-lg shadow-[#2ecc71]/30 hover:bg-[#27ae60] active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px] font-black">swap_vert</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] pl-1 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Destino Final</p>
                <div className={`flex w-full items-center rounded-2xl h-14 px-4 gap-3 transition-colors border-2 ${isDarkMode ? 'bg-white/5 border-[#2ecc71]/30' : 'bg-gray-100 border-[#2ecc71]/30'}`}>
                  <div className="size-8 rounded-lg flex items-center justify-center bg-[#2ecc71]/20">
                    <span className="material-symbols-outlined text-[#2ecc71] text-[18px]">near_me</span>
                  </div>
                  <input 
                    className={`flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm font-bold ${isDarkMode ? 'text-white placeholder:text-white/20' : 'text-black placeholder:text-black/30'}`} 
                    placeholder="¿A dónde vamos hoy?" 
                    value={searchCriteria.destination}
                    onChange={(e) => onSearchUpdate({...searchCriteria, destination: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] pl-1 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Fecha de Viaje</p>
                <div 
                  onClick={() => dateInputRef.current?.showPicker()}
                  className={`flex items-center gap-3 rounded-2xl h-14 px-4 border-2 cursor-pointer ${isDarkMode ? 'bg-white/5 border-[#2ecc71]/30' : 'bg-gray-100 border-[#2ecc71]/30'}`}
                >
                  <div className="size-8 rounded-lg flex items-center justify-center bg-[#2ecc71]/20">
                    <span className="material-symbols-outlined text-[#2ecc71] text-[18px]">calendar_today</span>
                  </div>
                  <input 
                    ref={dateInputRef}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="sr-only"
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split('-');
                      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                      const formatted = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
                      onSearchUpdate({...searchCriteria, date: formatted});
                    }}
                  />
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{searchCriteria.date}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] pl-1 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>Pasajeros</p>
                <div className={`flex items-center gap-3 rounded-2xl h-14 px-4 border-2 ${isDarkMode ? 'bg-white/5 border-[#2ecc71]/30' : 'bg-gray-100 border-[#2ecc71]/30'}`}>
                  <div className="size-8 rounded-lg flex items-center justify-center bg-[#2ecc71]/20">
                    <span className="material-symbols-outlined text-[#2ecc71] text-[18px]">group</span>
                  </div>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>1 Pers.</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate(View.RESULTS)}
              className="w-full bg-[#2ecc71] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 active:scale-[0.98] shadow-2xl shadow-[#2ecc71]/60 text-base tracking-tight hover:bg-[#27ae60] hover:shadow-[#2ecc71]/80"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
              BUSCAR RUTAS DISPONIBLES
            </button>
          </div>

          <div className="mt-10">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-black'} tracking-tight leading-none`}>Rutas Destacadas</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Explora lo mejor de Ecuador</p>
              </div>
              <button className="text-accent-emerald text-[11px] font-black uppercase tracking-widest bg-accent-emerald/10 px-3 py-1.5 rounded-lg">Ver Todo</button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x">
              <button 
                onClick={() => onSearchUpdate({...searchCriteria, origin: 'Quito', destination: 'Guayaquil'})}
                className={`min-w-[240px] snap-start rounded-[2rem] overflow-hidden shadow-2xl text-left transition-transform active:scale-95 ${isDarkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-gray-100 border-gray-200'} border`}
              >
                <div className="h-32 bg-center bg-cover relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=600&auto=format&fit=crop")' }}>
                  <div className={`absolute top-3 right-3 backdrop-blur-md px-2 py-1 rounded-lg border text-[10px] font-black uppercase ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white/40 border-white/50 text-black'}`}>8 Horas</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Quito → Guayaquil</p>
                    <span className="text-accent-green font-black text-sm">$12.50</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Terminal Carcelén</p>
                </div>
              </button>
              <button 
                onClick={() => onSearchUpdate({...searchCriteria, origin: 'Quito', destination: 'Cuenca'})}
                className={`min-w-[240px] snap-start rounded-[2rem] overflow-hidden shadow-2xl text-left transition-transform active:scale-95 ${isDarkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-gray-100 border-gray-200'} border`}
              >
                <div className="h-32 bg-center bg-cover relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=600&auto=format&fit=crop")' }}>
                   <div className={`absolute top-3 right-3 backdrop-blur-md px-2 py-1 rounded-lg border text-[10px] font-black uppercase ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white/40 border-white/50 text-black'}`}>10 Horas</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Quito → Cuenca</p>
                    <span className="text-accent-green font-black text-sm">$15.00</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Terminal Quitumbe</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación mejorada */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] backdrop-blur-2xl border h-[76px] rounded-[2.5rem] flex justify-around items-center px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 ${isDarkMode ? 'bg-[#1c1c1c]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <button className="flex flex-col items-center gap-1 text-[#2ecc71]">
          <span className={`material-symbols-outlined text-[26px] fill-1`}>home</span>
          <span className={`text-[9px] font-black uppercase tracking-tighter text-[#2ecc71]`}>INICIO</span>
        </button>
        <button onClick={() => onNavigate(View.AI_CHAT)} className={`flex flex-col items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[26px]">smart_toy</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">BUSGO AI</span>
        </button>
        <button onClick={() => onNavigate(View.MY_TRIPS)} className={`flex flex-col items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[26px]">confirmation_number</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">VIAJES</span>
        </button>
        <button onClick={() => onNavigate(View.PROFILE)} className={`flex flex-col items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[26px]">person</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">PERFIL</span>
        </button>
      </div>
    </div>
  );
};

export default HomeView;
