import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Bus, Facebook, Chrome } from 'lucide-react';
import { User, UserRole } from '../types';
import { GoogleIcon } from './ui/Icons';

interface LoginProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/iniciar_sesion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          correo: email,
          contrasenia: password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Obtener datos completos del usuario desde el backend
        try {
          const personaResp = await fetch(`${API_URL}/api/persona/lista`, {
            credentials: "include",
          });
          if (personaResp.ok) {
            const personasData = await personaResp.json();
            const personas = personasData.personas || [];
            const userPersona = personas.find((p: any) => p.cuenta?.correo?.toLowerCase() === email.toLowerCase());
            
            if (userPersona) {
              const mappedUser = {
                id: String(userPersona.id_persona || userData.id || ''),
                email: userPersona.correo || userData.correo || email,
                name: userPersona.nombre || userData.nombre || '',
                lastName: userPersona.apellido || userData.apellido || '',
                phone: userPersona.telefono || '',
                role: (userPersona.cuenta?.tipo_cuenta === 'Administrador') ? 'admin' : 'client',
                balance: userPersona.saldo_disponible || 0,
                paymentMethods: userPersona.metodo_pago ? [{
                  id: userPersona.metodo_pago.id_pago,
                  type: userPersona.metodo_pago.opcion_pago === 'Tarjeta_credito' ? 'Tarjeta de Crédito' : userPersona.metodo_pago.opcion_pago,
                  holder: userPersona.metodo_pago.titular,
                  number: '**** **** **** ' + userPersona.metodo_pago.numero_tarjeta.slice(-4),
                  expiry: userPersona.metodo_pago.fecha_vencimiento,
                  brand: 'visa' as const
                }] : []
              };
              
              onLoginSuccess(mappedUser);
            }
          }
        } catch (apiErr) {
          console.error('Error al obtener datos del usuario:', apiErr);
          // Fallback: pasar datos básicos aunque no se obtuvieron los completos
          const basicUser = {
            id: userData.id || '',
            email: userData.correo || email,
            name: userData.nombre || '',
            lastName: userData.apellido || '',
            role: (userData.tipo_cuenta === 'Administrador') ? 'admin' : 'client'
          };
          onLoginSuccess(basicUser);
        }
      } else if (response.status === 423) {
        const data = await response.json();
        setError(data.mensaje || "Cuenta bloqueada");
      } else {
        setError("Correo o contraseña incorrectos");
      }

    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#1e1e1e] w-full max-w-5xl h-[650px] rounded-2xl shadow-2xl border border-gray-800 flex overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop" 
            alt="Bus Aventura" 
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-bold text-white mb-2">Tu viaje comienza aquí</h2>
            <p className="text-gray-300">Conecta con los mejores destinos del Ecuador al mejor precio.</p>
             <div className="mt-4 p-3 bg-black/40 rounded-lg text-xs text-gray-400 border border-gray-700">
                <p className="font-bold text-gray-300">Demo Login:</p>
                <p>Admin: admin@busgo.com</p>
                <p>Cliente: (cualquier correo)</p>
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#1e1e1e]">
          <div className="mb-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
               <div className="bg-[#2ecc71] p-1.5 rounded-lg">
                 <Bus className="h-6 w-6 text-white" />
               </div>
               <span className="text-xl font-bold text-white">BusGo</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
            <p className="text-gray-400 text-sm">Ingresa tus credenciales para acceder a tu cuenta.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce tu contraseña"
                  className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl pl-12 pr-12 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-[#2ecc71] hover:underline font-medium">
                Olvidé mi contraseña
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#2ecc71] hover:bg-[#27ae60] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
             <div className="h-px bg-gray-700 flex-1"></div>
             <span className="text-xs text-gray-500 font-medium">o</span>
             <div className="h-px bg-gray-700 flex-1"></div>
          </div>

          <div className="space-y-3">
             <button 
                onClick={handleGoogleLogin}
                className="w-full bg-[#2a2e2a] hover:bg-[#323632] border border-gray-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
             >
                <GoogleIcon className="h-5 w-5" /> Continuar con Google
             </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            ¿No tienes una cuenta? <button onClick={onSwitchToRegister} className="text-[#2ecc71] font-bold hover:underline">Regístrate aquí</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;