
import React from 'react';
import { View, User } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  user: User | null;
  onLogout: () => void;
}

const ProfileView: React.FC<Props> = ({ onNavigate, user, onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark font-sans">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md pt-12 border-b border-white/5">
        <div className="flex items-center px-4 pb-4 gap-4">
          <button 
            onClick={() => onNavigate(View.HOME)}
            className="size-10 flex items-center justify-center rounded-full bg-white/5 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <h2 className="text-white text-lg font-bold">Mi Perfil</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 hide-scrollbar">
        <div className="flex flex-col items-center mb-10">
          <div className="size-24 rounded-full border-4 border-accent-green p-1 mb-4 shadow-2xl shadow-emerald-500/20">
            <div className="size-full rounded-full bg-surface-dark flex items-center justify-center text-accent-green text-4xl overflow-hidden">
               <span className="material-symbols-outlined text-5xl">account_circle</span>
            </div>
          </div>
          <h3 className="text-white text-xl font-bold">{user?.name || 'Viajero'}</h3>
          <p className="text-neutral-500 text-sm font-medium">{user?.email || 'Usuario Verificado'}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Configuración de Cuenta</h4>
            <div className="rounded-2xl bg-surface-dark border border-white/5 divide-y divide-white/5 overflow-hidden shadow-xl">
              <button 
                onClick={() => onNavigate(View.PERSONAL_INFO)}
                className="w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-neutral-400">person</span>
                  <span className="text-sm font-bold text-white/90">Información Personal</span>
                </div>
                <span className="material-symbols-outlined text-neutral-600 text-sm">arrow_forward_ios</span>
              </button>
              <button 
                onClick={() => onNavigate(View.PAYMENT_METHODS)}
                className="w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-neutral-400">payment</span>
                  <span className="text-sm font-bold text-white/90">Métodos de Pago</span>
                </div>
                <span className="material-symbols-outlined text-neutral-600 text-sm">arrow_forward_ios</span>
              </button>
              <button 
                onClick={() => onNavigate(View.MY_TRIPS)}
                className="w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-neutral-400">directions_bus</span>
                  <span className="text-sm font-bold text-white/90">Historial de Viajes</span>
                </div>
                <span className="material-symbols-outlined text-neutral-600 text-sm">arrow_forward_ios</span>
              </button>
              <button 
                onClick={() => onNavigate(View.NOTIFICATIONS)}
                className="w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent-green">notifications</span>
                  <span className="text-sm font-bold text-white/90">Notificaciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-red-500 rounded-full text-[10px] font-bold text-white">2</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Soporte y Legal</h4>
            <div className="rounded-2xl bg-surface-dark border border-white/5 divide-y divide-white/5 overflow-hidden shadow-xl">
              <button 
                onClick={() => onNavigate(View.HELP_CENTER)}
                className="w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-neutral-400">help_center</span>
                  <span className="text-sm font-bold text-white/90">Centro de Ayuda</span>
                </div>
                <span className="material-symbols-outlined text-neutral-600 text-sm">arrow_forward_ios</span>
              </button>
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">logout</span>
                  <span className="text-sm font-bold text-red-500">Cerrar Sesión</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background-dark/95 backdrop-blur-2xl border-t border-white/5 h-[84px] flex justify-around items-center px-4 pb-6 z-50">
        <button onClick={() => onNavigate(View.HOME)} className="flex flex-col items-center gap-1.5 opacity-30">
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Inicio</span>
        </button>
        <button onClick={() => onNavigate(View.AI_CHAT)} className="flex flex-col items-center gap-1.5 opacity-30">
          <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">BusGo AI</span>
        </button>
        <button onClick={() => onNavigate(View.MY_TRIPS)} className="flex flex-col items-center gap-1.5 opacity-30">
          <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Viajes</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-accent-green">
          <span className="material-symbols-outlined text-[24px] fill-1">person</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
