
import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { View, User } from '../types';
import { apiService } from '../services/apiService';

interface Props {
  onNavigate: (view: View) => void;
  user: User | null;
  onLogout: () => void;
}

const ProfileView: React.FC<Props> = ({ onNavigate, user, onLogout }) => {
  const { isDarkMode } = useTheme();
  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Cargar saldo del usuario al montar el componente
  useEffect(() => {
    const loadBalance = async () => {
      if (!user?.email) {
        setLoadingBalance(false);
        return;
      }

      try {
        console.log('[BALANCE] Cargando saldo para:', user.email);
        const response = await apiService.get('/persona/lista');
        const personas = response.data || response.personas || [];
        
        const userFound = personas.find((p: any) => 
          p.correo === user.email || p.cuenta?.correo === user.email
        );

        if (userFound) {
          // El saldo está en saldo_disponible según la estructura del backend
          const userBalance = parseFloat(userFound.saldo_disponible) || 0;
          setBalance(userBalance);
          console.log('[BALANCE] Saldo cargado desde backend:', userBalance);
        } else {
          console.log('[BALANCE] Usuario no encontrado en backend');
        }
      } catch (error) {
        console.error('[BALANCE] Error al cargar saldo:', error);
      } finally {
        setLoadingBalance(false);
      }
    };

    loadBalance();
  }, [user]);
  
  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-background-dark' : 'bg-white'} font-sans`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md pt-12 border-b ${isDarkMode ? 'bg-background-dark/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center px-4 pb-4 gap-4">
          <button 
            onClick={() => onNavigate(View.HOME)}
            className={`size-10 flex items-center justify-center rounded-full active:scale-90 transition-transform ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-200 text-black'}`}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Mi Perfil</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 hide-scrollbar">
        <div className="flex flex-col items-center mb-10">
          <div className="size-24 rounded-full border-4 border-[#2ecc71] p-1 mb-4 shadow-2xl shadow-[#2ecc71]/20">
            <div className="size-full rounded-full bg-surface-dark flex items-center justify-center text-[#2ecc71] text-4xl overflow-hidden">
               <span className="material-symbols-outlined text-5xl">account_circle</span>
            </div>
          </div>
          <h3 className="text-white text-xl font-bold">{user?.name || 'Viajero'}</h3>
          <p className="text-neutral-500 text-sm font-medium">{user?.email || 'Usuario Verificado'}</p>
        </div>

        {/* Tarjeta de Saldo */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-[#2ecc71] to-[#27ae60] p-6 shadow-2xl shadow-[#2ecc71]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm font-bold uppercase tracking-wider">Saldo Disponible</span>
            <span className="material-symbols-outlined text-white/80">account_balance_wallet</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-4xl font-black">
              {loadingBalance ? '...' : `$${balance.toFixed(2)}`}
            </span>
            <span className="text-white/60 text-lg font-bold">USD</span>
          </div>
          <button className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Recargar Saldo
          </button>
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
                  <span className="material-symbols-outlined text-[#2ecc71]">notifications</span>
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
      <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] backdrop-blur-2xl border-t h-[84px] flex justify-around items-center px-4 pb-6 z-50 ${isDarkMode ? 'bg-background-dark/95 border-white/5' : 'bg-white/95 border-gray-200'}`}>
        <button onClick={() => onNavigate(View.HOME)} className={`flex flex-col items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">INICIO</span>
        </button>
        <button onClick={() => onNavigate(View.AI_CHAT)} className={`flex flex-col items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">BUSGO AI</span>
        </button>
        <button onClick={() => onNavigate(View.MY_TRIPS)} className={`flex flex-col items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">VIAJES</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-[#2ecc71]">
          <span className="material-symbols-outlined text-[24px] fill-1">person</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">PERFIL</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
