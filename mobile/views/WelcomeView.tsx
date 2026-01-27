
import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { View, User } from '../types';
import { apiService } from '../services/apiService';

interface Props {
  onNavigate: (view: View) => void;
  onLogin: (user: User) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const WelcomeView: React.FC<Props> = ({ onNavigate, onLogin, showToast }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Hook de Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('[GOOGLE] Login exitoso:', tokenResponse);
      
      try {
        // Obtener información del usuario usando el access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        const userInfo = await userInfoResponse.json();
        console.log('[GOOGLE] Información del usuario:', userInfo);

        // Buscar si el usuario ya existe en el backend
        const response = await apiService.get('/persona/lista');
        const personas = response.data || response.personas || [];
        
        let userFound = personas.find((p: any) => 
          p.correo === userInfo.email || p.cuenta?.correo === userInfo.email
        );

        // Si no existe, crear un nuevo usuario localmente
        if (!userFound) {
          console.log('[GOOGLE] Usuario no encontrado, creando uno nuevo...');
          userFound = {
            nombre: userInfo.name,
            correo: userInfo.email,
            telefono: '',
            numero_identificacion: ''
          };
        }

        const user: User = {
          name: userFound.nombre || userInfo.name,
          email: userFound.correo || userInfo.email,
          phone: userFound.telefono || '',
          idNumber: userFound.numero_identificacion || userFound.cedula || ''
        };

        onLogin(user);
        showToast(`¡Bienvenido ${user.name}!`, 'success');
        onNavigate(View.HOME);

      } catch (error) {
        console.error('[GOOGLE] Error al procesar login:', error);
        showToast('Error al conectar con el servidor', 'error');
      }
    },
    onError: () => {
      console.error('[GOOGLE] Error en Google Login');
      showToast('Error al iniciar sesión con Google', 'error');
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }
    
    try {
      console.log('[LOGIN] Autenticando con el backend...');
      // Usar el endpoint de autenticación para obtener el token JWT
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contrasenia: password })
      });
      
      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        console.log('[LOGIN] Error de autenticación:', errorData);
        showToast(errorData.mensaje || 'Credenciales incorrectas', 'error');
        return;
      }
      
      const authData = await loginResponse.json();
      console.log('[LOGIN] Autenticación exitosa:', authData);
      
      // Guardar el token JWT en localStorage
      if (authData.token) {
        localStorage.setItem('authToken', authData.token);
        console.log('[LOGIN] Token JWT guardado');
      }
      
      // Obtener datos completos de la persona
      const response = await apiService.get('/persona/lista');
      const personas = response.data?.personas || response.personas || response.data || [];
      const userFound = personas.find((p: any) => 
        p.correo === email || p.cuenta?.correo === email
      );
      
      if (userFound) {
        const user: User = {
          name: userFound.nombre || userFound.nombre_completo || email.split('@')[0],
          email: userFound.correo || userFound.cuenta?.correo,
          phone: userFound.telefono,
          idNumber: userFound.numero_identificacion || userFound.cedula
        };
        onLogin(user);
        showToast('¡Bienvenido de vuelta!', 'success');
        onNavigate(View.HOME);
      } else {
        showToast('Error al cargar datos de usuario', 'error');
      }
    } catch (error) {
      console.error('[LOGIN] Error al iniciar sesión:', error);
      showToast('Error al conectar con el servidor', 'error');
    }
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
                className="w-full h-16 bg-[#2ecc71] text-black text-lg font-black rounded-2xl shadow-2xl shadow-[#2ecc71]/50 active:scale-95 transition-all hover:bg-[#27ae60]"
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
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 pr-14 text-white focus:outline-none focus:border-accent-green transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all active:scale-95 z-10"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <button type="submit" className="w-full h-16 bg-[#2ecc71] text-black font-black rounded-xl text-lg mt-4 shadow-xl shadow-[#2ecc71]/50 hover:bg-[#27ae60] transition-all active:scale-[0.98]">
                Entrar ahora
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121212] px-4 text-white/40 font-bold tracking-widest">O continúa con</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => googleLogin()}
              className="w-full h-14 bg-white hover:bg-gray-100 text-black font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeView;
