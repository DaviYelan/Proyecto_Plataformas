import React, { useState, useEffect } from 'react';
import { Menu, X, Bus, User as UserIcon, LogIn, HelpCircle, Map } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onMyTicketsClick: () => void;
  onHelpClick: () => void;
  onHomeClick: () => void;
  onDestinationsClick: () => void;
  onLoginClick: () => void;
  onDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onMyTicketsClick, 
  onHelpClick, 
  onHomeClick, 
  onDestinationsClick, 
  onLoginClick, 
  onDashboardClick 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <button onClick={onHomeClick} className="flex items-center gap-2 group z-50 relative">
              <div className="bg-[#2ecc71] p-1.5 rounded-lg group-hover:bg-[#27ae60] transition-colors">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide group-hover:text-gray-200 transition-colors">BusGo</span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={onDestinationsClick} className="text-[#2ecc71] hover:text-[#27ae60] transition-colors text-sm font-medium">Destinos</button>
              {user?.role !== 'admin' && (
                <button onClick={onMyTicketsClick} className="text-[#2ecc71] hover:text-[#27ae60] transition-colors text-sm font-medium">Mis Boletos</button>
              )}
              <button onClick={onHelpClick} className="text-[#2ecc71] hover:text-[#27ae60] transition-colors text-sm font-medium">Ayuda</button>
              
              {user ? (
                 <button 
                   onClick={onDashboardClick}
                   className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-md font-medium transition-all shadow border border-gray-700 hover:border-gray-600 text-sm flex items-center gap-2"
                 >
                   <UserIcon size={16} className={user.role === 'admin' ? 'text-purple-400' : 'text-[#2ecc71]'} />
                   {user.role === 'admin' ? 'Panel Admin' : 'Mi Cuenta'}
                 </button>
              ) : (
                 <button 
                   onClick={onLoginClick}
                   className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-5 py-2 rounded-md font-medium transition-all shadow-lg hover:shadow-[#2ecc71]/20 text-sm"
                 >
                   Login / Registrarse
                 </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden z-50">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-[#1a1a1a] transition-transform duration-300 md:hidden flex flex-col pt-24 px-6 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => { onDestinationsClick(); setIsMobileMenuOpen(false); }} 
              className="flex items-center gap-4 w-full text-left px-4 py-4 text-lg font-medium text-white hover:bg-gray-800 rounded-xl border border-transparent hover:border-gray-700 transition-all"
            >
              <Map className="text-[#2ecc71]" size={24} /> Destinos
            </button>
            
            {user?.role !== 'admin' && (
              <button 
                onClick={() => { onMyTicketsClick(); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-4 w-full text-left px-4 py-4 text-lg font-medium text-white hover:bg-gray-800 rounded-xl border border-transparent hover:border-gray-700 transition-all"
              >
                <Bus className="text-[#2ecc71]" size={24} /> Mis Boletos
              </button>
            )}
            
            <button 
              onClick={() => { onHelpClick(); setIsMobileMenuOpen(false); }} 
              className="flex items-center gap-4 w-full text-left px-4 py-4 text-lg font-medium text-white hover:bg-gray-800 rounded-xl border border-transparent hover:border-gray-700 transition-all"
            >
              <HelpCircle className="text-[#2ecc71]" size={24} /> Ayuda
            </button>
            
            <div className="h-px bg-gray-800 my-4"></div>

            {user ? (
               <button 
                onClick={() => { onDashboardClick(); setIsMobileMenuOpen(false); }}
                className="w-full bg-gray-800 text-white px-5 py-4 rounded-xl font-bold flex items-center justify-center gap-3 border border-gray-700 shadow-lg"
               >
                 <div className="bg-[#2ecc71] p-1 rounded-full">
                    <UserIcon size={20} className="text-white" />
                 </div>
                 {user.role === 'admin' ? 'Panel Admin' : 'Mi Cuenta'}
               </button>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                className="w-full bg-[#2ecc71] active:bg-[#27ae60] text-white px-5 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
              >
                <LogIn size={20} /> Iniciar Sesión
              </button>
            )}
          </div>
          
          <div className="mt-auto mb-8 text-center">
            <p className="text-gray-500 text-sm">© 2024 BusGo</p>
          </div>
      </div>
    </>
  );
};

export default Header;