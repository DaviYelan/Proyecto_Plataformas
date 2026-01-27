
import React from 'react';
import { View, BusTrip } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  trip: BusTrip | null;
  seats: string[];
  date: string;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  onDownload: () => void;
}

const TicketView: React.FC<Props> = ({ onNavigate, trip, seats = [], date, showToast, onDownload }) => {
  const ticketId = `BG-${Math.floor(1000 + Math.random() * 9000)}-${trip?.origin?.slice(0, 1).toUpperCase() || 'X'}`;

  // Usamos una URL de API para el QR en lugar de un componente que pueda suspender
  const qrData = encodeURIComponent(`Boleto: ${ticketId} | Ruta: ${trip?.origin} a ${trip?.destination} | Asientos: ${seats.join(', ')}`);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}&bgcolor=ffffff&color=141414`;

  const handleDownloadClick = () => {
    onDownload();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Boleto BusGo - ${trip?.company || 'BusGo'}`,
        text: `Mi boleto de ${trip?.origin} a ${trip?.destination} para el ${date}.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      showToast("Función de compartir no disponible", "info");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-hidden font-sans">
      <header className="flex items-center p-6 pt-12 justify-between">
        <h2 className="text-white text-xl font-bold">Boleto Digital</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-lg">share</span>
          </button>
          <button 
            onClick={() => onNavigate(View.HOME)}
            className="text-accent-green font-bold text-sm px-4 py-2 bg-accent-green/10 rounded-full active:scale-95 transition-transform"
          >
            Listo
          </button>
        </div>
      </header>

      <div className="flex-1 px-6 pb-32 overflow-y-auto hide-scrollbar flex flex-col items-center">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500">
          <div className="p-7 bg-accent-green text-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-9xl -rotate-12">directions_bus</span>
            </div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Transporte Premium</span>
                <span className="text-xl font-black">{trip?.company || 'BusGo Express'}</span>
              </div>
              <div className="size-14 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/20">
                <img src={trip?.logoUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop'} alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex flex-col">
                <span className="text-3xl font-black">{trip?.origin?.slice(0, 3).toUpperCase() || 'UIO'}</span>
                <span className="text-[10px] font-extrabold uppercase opacity-60">{trip?.origin || 'Origen'}</span>
              </div>
              <div className="flex-1 px-4 flex flex-col items-center">
                <div className="w-full border-t-2 border-primary/20 relative">
                  <span className="material-symbols-outlined absolute left-1/2 -translate-x-1/2 -top-3 text-2xl">arrow_forward</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black">{trip?.destination?.slice(0, 3).toUpperCase() || 'GYE'}</span>
                <span className="text-[10px] font-extrabold uppercase opacity-60 text-right">{trip?.destination || 'Destino'}</span>
              </div>
            </div>
          </div>

          <div className="relative h-8 bg-white flex items-center px-6">
            <div className="absolute -left-4 size-8 rounded-full bg-background-dark"></div>
            <div className="absolute -right-4 size-8 rounded-full bg-background-dark"></div>
            <div className="w-full border-t-[3px] border-dotted border-neutral-100"></div>
          </div>

          <div className="p-8 space-y-8 bg-white text-primary">
            <div className="grid grid-cols-2 gap-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Fecha</p>
                <p className="text-base font-bold">{date}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Embarque</p>
                <p className="text-base font-bold">{trip?.departureTime || 'Horario'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Pasajero</p>
                <p className="text-base font-bold">Viajero Verificado</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Asientos</p>
                <div className="flex flex-wrap gap-1 justify-end">
                  {seats.length > 0 ? seats.map(s => (
                    <span key={s} className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-md font-bold">{s}</span>
                  )) : <span className="text-neutral-300">--</span>}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center pt-4">
              <div className="size-52 bg-neutral-50 rounded-[2rem] p-6 flex items-center justify-center border border-neutral-100 mb-4 shadow-inner relative overflow-hidden">
                <img 
                  src={qrImageUrl} 
                  alt="QR Ticket" 
                  className="size-40 object-contain"
                  onLoad={() => console.log("QR cargado correctamente")}
                />
                <div className={`absolute -bottom-2 px-4 py-1 rounded-full border shadow-sm flex items-center gap-1.5 transition-colors ${trip?.isOfflineAvailable ? 'bg-accent-green border-accent-green' : 'bg-white border-neutral-100'}`}>
                   <div className={`size-1.5 rounded-full ${trip?.isOfflineAvailable ? 'bg-white' : 'bg-accent-green'}`}></div>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${trip?.isOfflineAvailable ? 'text-white' : 'text-neutral-500'}`}>
                      {trip?.isOfflineAvailable ? 'Disponible Offline' : 'Listo para Sincronizar'}
                   </span>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">BG-{ticketId.split('-')[1]}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 w-full max-w-sm">
           <button 
            onClick={handleDownloadClick}
            className={`flex-1 h-14 border rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all ${trip?.isOfflineAvailable ? 'bg-accent-green/10 border-accent-green/30 text-accent-green' : 'bg-white/5 border-white/10 text-white'}`}
           >
              <span className="material-symbols-outlined">{trip?.isOfflineAvailable ? 'cloud_done' : 'download'}</span>
              <span className="text-xs font-bold uppercase tracking-wider">{trip?.isOfflineAvailable ? 'Guardado' : 'Guardar'}</span>
           </button>
           <button 
            onClick={() => onNavigate(View.HELP_CENTER)}
            className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
           >
              <span className="material-symbols-outlined text-white">support_agent</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Ayuda</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
