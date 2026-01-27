
import React from 'react';
import { User } from '../types';

interface Props {
  onBack: () => void;
  user: User | null;
}

const PersonalInfoView: React.FC<Props> = ({ onBack, user }) => {
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
          <h2 className="text-white text-lg font-bold">Información Personal</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        <div className="space-y-4">
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-lg">
             <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Nombre Completo</p>
             <p className="text-white text-base font-bold">{user?.name}</p>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-lg">
             <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Correo Electrónico</p>
             <p className="text-white text-base font-bold">{user?.email}</p>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-lg">
             <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Número de Teléfono</p>
             <p className="text-white text-base font-bold">{user?.phone || 'No registrado'}</p>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-lg">
             <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Identificación (Cédula/Pasaporte)</p>
             <p className="text-white text-base font-bold">{user?.idNumber || 'No registrado'}</p>
          </div>
        </div>

        <button className="w-full h-14 bg-[#2ecc71] text-black font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#27ae60] shadow-lg shadow-[#2ecc71]/30">
          <span className="material-symbols-outlined">edit</span>
          Editar Información
        </button>

        <p className="text-center text-neutral-600 text-xs px-8">
          Tu información está protegida por nuestra política de privacidad y se utiliza únicamente para la emisión de boletos legales en Ecuador.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoView;
