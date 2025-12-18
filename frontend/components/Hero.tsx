import React, { useState } from 'react';
import { MapPin, Calendar, Search } from 'lucide-react';
import { SearchParams } from '../types';

interface HeroProps {
  onSearch: (params: SearchParams) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: 'Puyo',
    destination: 'Zamora',
    departDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    isRoundTrip: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const toggleTripType = (isRound: boolean) => {
    setSearchParams(prev => ({ ...prev, isRoundTrip: isRound }));
  };

  const handleSearchClick = () => {
    if (!searchParams.origin || !searchParams.destination) {
      alert("Por favor ingresa un origen y un destino");
      return;
    }
    onSearch(searchParams);
  };

  return (
    <div className="relative h-screen min-h-[750px] flex items-center justify-center pt-16">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat fixed-bg"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2200&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#1a1a1a]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-2xl tracking-tight leading-tight">
          Descubre el <br className="md:hidden" /> Ecuador.
        </h1>
        <p className="text-lg sm:text-xl md:text-3xl text-gray-200 mb-8 md:mb-12 font-medium drop-shadow-lg max-w-2xl mx-auto">
          Tu Aventura Comienza Aquí.
        </p>
        
        {/* Booking Widget */}
        <div className="w-full bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-2xl shadow-2xl mx-auto">
          
          {/* Trip Type Toggles */}
          <div className="flex justify-center md:justify-start gap-1 mb-6 bg-black/40 p-1.5 rounded-xl w-full md:w-fit">
            <button 
              onClick={() => toggleTripType(true)}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${searchParams.isRoundTrip ? 'bg-[#2ecc71] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              Ida y Vuelta
            </button>
            <button 
              onClick={() => toggleTripType(false)}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${!searchParams.isRoundTrip ? 'bg-[#2ecc71] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              Solo Ida
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 text-left">
            
            {/* Origin */}
            <div className="lg:col-span-3 relative group">
              <label className="block text-xs text-gray-400 mb-1.5 ml-1 font-bold uppercase tracking-wider">Origen</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#2ecc71] transition-colors" />
                <input 
                  type="text" 
                  name="origin"
                  value={searchParams.origin}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2e2a] text-white pl-12 pr-4 py-3.5 rounded-xl border border-gray-600/50 focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 outline-none transition-all placeholder-gray-500 font-medium text-base"
                  placeholder="Ciudad de origen"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="lg:col-span-3 relative group">
              <label className="block text-xs text-gray-400 mb-1.5 ml-1 font-bold uppercase tracking-wider">Destino</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#2ecc71] transition-colors" />
                <input 
                  type="text" 
                  name="destination"
                  value={searchParams.destination}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2e2a] text-white pl-12 pr-4 py-3.5 rounded-xl border border-gray-600/50 focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 outline-none transition-all placeholder-gray-500 font-medium text-base"
                  placeholder="Ciudad de destino"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="lg:col-span-2 relative group">
              <label className="block text-xs text-gray-400 mb-1.5 ml-1 font-bold uppercase tracking-wider">Fecha Salida</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#2ecc71] transition-colors" />
                <input 
                  type="date" 
                  name="departDate"
                  value={searchParams.departDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2e2a] text-white pl-12 pr-3 py-3.5 rounded-xl border border-gray-600/50 focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 outline-none transition-all font-medium appearance-none text-base"
                />
              </div>
            </div>

            {/* Return Date (Conditional) */}
            {searchParams.isRoundTrip ? (
              <div className="lg:col-span-2 relative group">
                <label className="block text-xs text-gray-400 mb-1.5 ml-1 font-bold uppercase tracking-wider">Fecha Regreso</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#2ecc71] transition-colors" />
                  <input 
                    type="date" 
                    name="returnDate"
                    value={searchParams.returnDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#2a2e2a] text-white pl-12 pr-3 py-3.5 rounded-xl border border-gray-600/50 focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 outline-none transition-all font-medium appearance-none text-base"
                  />
                </div>
              </div>
            ) : (
               <div className="lg:col-span-2 flex items-end">
                   <div className="w-full h-[54px] bg-[#2a2e2a]/50 rounded-xl border border-dashed border-gray-600/50 flex items-center justify-center text-gray-500 text-sm italic cursor-not-allowed hidden lg:flex">
                        (Opcional)
                   </div>
               </div>
            )}

            {/* Search Button */}
             <div className="lg:col-span-2 flex items-end pt-2 lg:pt-0">
                <button 
                  onClick={handleSearchClick}
                  className="w-full h-[54px] bg-[#2ecc71] hover:bg-[#27ae60] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg hover:shadow-[#2ecc71]/30 transition-all flex items-center justify-center gap-2 text-base"
                >
                    <Search className="h-5 w-5" />
                    Buscar
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;