
import React, { useState } from 'react';
import { View, User } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  onLogin: (user: User) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const WelcomeView: React.FC<Props> = ({ onNavigate, onLogin, showToast }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ 
      name: email.split('@')[0] || 'Juan Pérez', 
      email: email || 'juan.perez@busgo.ec',
      phone: '0991234567',
      idNumber: '1723456789'
    });
    showToast(`¡Bienvenido de vuelta!`, "success");
    onNavigate(View.HOME);
  };

  return (
    <div className="relative flex flex-col h-full bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200" 
          className="w-full h-full object-cover opacity-50 scale-105"
          alt="Ecuador Travel"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-end px-8 pb-16">
        {!showLoginForm ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8">
              <div className="w-16 h-16 rounded-2xl bg-accent-green flex items-center justify-center shadow-[0_0_50px_rgba(46,204,113,0.4)]">
                <span className="material-symbols-outlined text-black text-4xl font-black">directions_bus</span>
              </div>
            </div>

            <div className="mb-10">
              <h1 className="text-white tracking-tighter text-[52px] font-black leading-[1] mb-4">
                Ecuador <br/><span className="text-accent-green">Premium.</span>
              </h1>
              <p className="text-neutral-300 text-lg font-medium leading-relaxed max-w-[280px]">
                La forma más exclusiva de viajar por el país.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setShowLoginForm(true)}
                className="w-full h-16 bg-accent-green text-black text-lg font-black rounded-2xl shadow-2xl active:scale-95 transition-all"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => onNavigate(View.REGISTER)}
                className="w-full h-16 bg-white/5 backdrop-blur-xl border border-white/10 text-white text-base font-bold rounded-2xl active:scale-95 transition-all"
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-500 bg-[#121212] border-t border-white/10 -mx-8 px-8 pt-10 pb-12 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Ingresa</h2>
              <button onClick={() => setShowLoginForm(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-accent-green transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Contraseña" 
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white focus:outline-none focus:border-accent-green transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="submit" className="w-full h-16 bg-accent-green text-black font-black rounded-xl text-lg mt-4">
                Entrar ahora
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeView;
