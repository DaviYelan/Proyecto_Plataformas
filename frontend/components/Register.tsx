import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Bus, User as UserIcon, Chrome, Facebook, ArrowRight, CreditCard, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface RegisterProps {
  onClose: () => void;
  onRegisterSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose, onRegisterSuccess, onSwitchToLogin }) => {
  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idType, setIdType] = useState('Cédula');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validation
    if (!firstName.trim() || !lastName.trim() || !idNumber.trim()) {
        setError('Por favor completa todos los campos personales.');
        setIsLoading(false);
        return;
    }
    if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        setIsLoading(false);
        return;
    }
    if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setIsLoading(false);
        return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      const newUser: User = {
        id: `user-${Math.floor(Math.random() * 10000)}`,
        name: firstName,
        lastName: lastName,
        identificationType: idType as any,
        identificationNumber: idNumber,
        email: email,
        role: 'client',
        phone: '',
        balance: 0
      };

      onRegisterSuccess(newUser);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#1e1e1e] w-full max-w-5xl min-h-[600px] max-h-[90vh] rounded-2xl shadow-2xl border border-gray-800 flex overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 relative h-auto">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop"
            alt="BusGo Adventure" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-bold text-white mb-2">Únete a la Aventura</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
               Crea una cuenta para gestionar tus boletos, guardar pasajeros favoritos y obtener descuentos exclusivos en tus viajes por Ecuador.
            </p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#1e1e1e] overflow-y-auto">
          <div className="mb-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
               <div className="bg-[#2ecc71] p-1.5 rounded-lg">
                 <Bus className="h-6 w-6 text-white" />
               </div>
               <span className="text-xl font-bold text-white">BusGo</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
            <p className="text-gray-400 text-sm">Completa tus datos para registrarte.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
             {/* ID Row */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo Identificación</label>
                    <div className="relative group">
                        <select 
                            value={idType}
                            onChange={(e) => setIdType(e.target.value)}
                            className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors appearance-none cursor-pointer"
                        >
                            <option value="Cédula">Cédula</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="Licencia de Conducir">Licencia</option>
                        </select>
                    </div>
                </div>
                <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Número</label>
                     <div className="relative group">
                        <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
                        <input 
                            type="text" 
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            placeholder="1720..."
                            className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600"
                            required
                        />
                     </div>
                </div>
            </div>

            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombres</label>
                    <div className="relative group">
                        <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
                        <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Ej. Juan"
                            className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Apellidos</label>
                    <div className="relative group">
                        <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
                        <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Ej. Pérez"
                            className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Email Field */}
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

            {/* Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl pl-12 pr-10 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600"
                      required
                    />
                  </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Confirmar</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
                        <input 
                        type={showPassword ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#2a2e2a] border border-gray-700 rounded-xl pl-12 pr-10 py-3.5 text-white focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-colors placeholder-gray-600"
                        required
                        />
                         <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-900/50 text-red-400 text-xs p-3 rounded-lg text-center animate-in fade-in">
                    {error}
                </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#2ecc71] hover:bg-[#27ae60] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
             <div className="h-px bg-gray-700 flex-1"></div>
             <span className="text-xs text-gray-500 font-medium">o regístrate con</span>
             <div className="h-px bg-gray-700 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button className="w-full bg-[#2a2e2a] hover:bg-[#323632] border border-gray-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                <Chrome className="h-4 w-4 text-white" /> Google
             </button>
             <button className="w-full bg-[#2a2e2a] hover:bg-[#323632] border border-gray-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                <Facebook className="h-4 w-4 text-blue-500" /> Facebook
             </button>
          </div>

          <div className="mt-6 text-center bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
            <p className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?
              <button 
                type="button"
                onClick={onSwitchToLogin}
                className="ml-2 text-[#2ecc71] font-bold hover:underline focus:outline-none"
              >
                Inicia Sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;