
import React, { useState } from 'react';
import { View } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  onBack: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const RegisterView: React.FC<Props> = ({ onNavigate, onBack, showToast }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("¡Cuenta creada exitosamente!", "success");
    onNavigate(View.HOME);
  };

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-y-auto hide-scrollbar">
      <div className="sticky top-0 z-50 flex items-center bg-background-dark/80 backdrop-blur-md p-4 pt-12 pb-2">
        <button 
          onClick={onBack}
          className="text-white flex size-12 items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h2 className="text-white text-lg font-bold flex-1 text-center pr-12">Crear Cuenta</h2>
      </div>

      <div className="px-6 flex flex-col gap-1">
        <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight pb-1 pt-6">Empieza tu viaje</h1>
        <p className="text-neutral-400 text-base font-normal leading-normal pb-6">
          Únete a la mejor forma de viajar por Ecuador con comodidad premium.
        </p>
      </div>

      <form className="flex flex-col gap-2 pb-10" onSubmit={handleSubmit}>
        <div className="px-6 py-2">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Documentos de Identidad</p>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2 ml-1">Tipo de Documento</p>
              <div className="relative">
                <select className="appearance-none flex w-full rounded-xl text-white focus:outline-0 border border-white/10 bg-surface-dark h-14 px-4 text-base font-normal focus:border-accent-green transition-all">
                  <option value="cedula">Cédula de Identidad</option>
                  <option value="passport">Pasaporte</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-4 text-neutral-400 pointer-events-none">expand_more</span>
              </div>
            </label>
            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2 ml-1">Número de Documento</p>
              <input 
                required
                className="flex w-full rounded-xl text-white border border-white/10 bg-surface-dark h-14 placeholder:text-neutral-600 p-4 text-base font-normal focus:outline-none focus:border-accent-green transition-all" 
                placeholder="17XXXXXXXX" 
                type="text" 
              />
            </label>
          </div>
        </div>

        <div className="px-6 py-2">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Datos Personales</p>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <p className="text-white text-sm font-medium pb-2 ml-1">Nombre</p>
              <input required className="flex w-full rounded-xl text-white border border-white/10 bg-surface-dark h-14 placeholder:text-neutral-600 p-4 text-base font-normal focus:outline-none focus:border-accent-green transition-all" placeholder="Juan" type="text" />
            </label>
            <label className="flex flex-col">
              <p className="text-white text-sm font-medium pb-2 ml-1">Apellido</p>
              <input required className="flex w-full rounded-xl text-white border border-white/10 bg-surface-dark h-14 placeholder:text-neutral-600 p-4 text-base font-normal focus:outline-none focus:border-accent-green transition-all" placeholder="Pérez" type="text" />
            </label>
          </div>
        </div>

        <div className="px-6 py-2">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2 ml-1">Correo Electrónico</p>
              <input required className="flex w-full rounded-xl text-white border border-white/10 bg-surface-dark h-14 placeholder:text-neutral-600 p-4 text-base font-normal focus:outline-none focus:border-accent-green transition-all" placeholder="juan.perez@ejemplo.ec" type="email" />
            </label>
            <label className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-2 pr-1">
                <p className="text-white text-sm font-medium ml-1">Contraseña</p>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#2ecc71] text-[10px] font-bold uppercase tracking-widest"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              <div className="relative">
                <input 
                  required
                  className="flex w-full rounded-xl text-white border border-white/10 bg-surface-dark h-14 placeholder:text-neutral-600 p-4 pr-12 text-base font-normal focus:outline-none focus:border-accent-green transition-all" 
                  placeholder="••••••••••••" 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-neutral-500 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>
          </div>
        </div>

        <div className="px-6 py-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input required className="rounded text-[#2ecc71] focus:ring-[#2ecc71] bg-transparent border-white/10 size-5" type="checkbox" />
            <span className="text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors">
              Acepto los <span className="text-[#2ecc71] font-bold">Términos y Condiciones</span> y la <span className="text-[#2ecc71] font-bold">Política de Privacidad</span>.
            </span>
          </label>
        </div>

        <div className="px-6 pt-4 pb-12">
          <button 
            type="submit"
            className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-black font-black h-16 rounded-xl shadow-xl shadow-[#2ecc71]/50 transition-all active:scale-[0.98]"
          >
            Registrarme
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterView;
