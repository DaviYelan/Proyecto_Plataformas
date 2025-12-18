import React, { useState, useMemo } from 'react';
import { X, Calendar, Filter, ArrowRight, Wifi, Tv, Wind, Usb, Coffee, ChevronDown, ShieldCheck, Armchair, Clock, Bus } from 'lucide-react';
import { Trip, SearchParams, Seat, Ticket, User } from '../types';
import SeatSelection from './SeatSelection';
import Payment from './Payment';

interface SearchResultsProps {
  results: Trip[];
  searchParams: SearchParams;
  onClose: () => void;
  onTicketPurchased: (ticket: Ticket) => void;
  user: User | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, searchParams, onClose, onTicketPurchased, user }) => {
  const [step, setStep] = useState<'list' | 'seats' | 'payment'>('list');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Filter States
  const [priceLimit, setPriceLimit] = useState<number>(50);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<'morning' | 'afternoon' | 'night' | null>(null);
  const [sortOrder, setSortOrder] = useState<'price_asc' | 'time_asc'>('price_asc');

  // Extract unique companies from results for the filter list
  const availableCompanies = useMemo(() => {
    return Array.from(new Set(results.map(r => r.operator)));
  }, [results]);

  // Filter and Sort Logic
  const filteredAndSortedResults = useMemo(() => {
    let data = [...results];

    // 1. Filter by Price
    data = data.filter(trip => trip.price <= priceLimit);

    // 2. Filter by Company
    if (selectedCompanies.length > 0) {
      data = data.filter(trip => selectedCompanies.includes(trip.operator));
    }

    // 3. Filter by Time
    if (selectedTime) {
      data = data.filter(trip => {
        const hour = parseInt(trip.departureTime.split(':')[0]);
        if (selectedTime === 'morning') return hour >= 5 && hour < 12;
        if (selectedTime === 'afternoon') return hour >= 12 && hour < 19;
        if (selectedTime === 'night') return hour >= 19 || hour < 5;
        return true;
      });
    }

    // 4. Sort
    data.sort((a, b) => {
      if (sortOrder === 'price_asc') {
        return a.price - b.price;
      } else {
        return a.departureTime.localeCompare(b.departureTime);
      }
    });

    return data;
  }, [results, priceLimit, selectedCompanies, selectedTime, sortOrder]);


  // Handlers
  const toggleCompany = (company: string) => {
    setSelectedCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  const toggleTime = (time: 'morning' | 'afternoon' | 'night') => {
    setSelectedTime(prev => prev === time ? null : time);
  };

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip);
    setStep('seats');
  };

  const handleSeatsConfirm = (seats: Seat[]) => {
    setSelectedSeats(seats);
    setStep('payment');
  };
  
  const handlePaymentSuccess = (ticket: Ticket) => {
    onTicketPurchased(ticket);
    onClose();
  };

  // Helper to render amenities icons
  const renderAmenity = (type: string) => {
    switch (type) {
      case 'wifi': return <div title="Wifi" className="flex items-center gap-1"><Wifi className="h-3 w-3" /> <span className="text-[10px]">WiFi</span></div>;
      case 'tv': return <div title="TV" className="flex items-center gap-1"><Tv className="h-3 w-3" /> <span className="text-[10px]">TV</span></div>;
      case 'ac': return <div title="A/C" className="flex items-center gap-1"><Wind className="h-3 w-3" /> <span className="text-[10px]">A/C</span></div>;
      case 'usb': return <div title="USB" className="flex items-center gap-1"><Usb className="h-3 w-3" /> <span className="text-[10px]">USB</span></div>;
      case 'snack': return <div title="Snack" className="flex items-center gap-1"><Coffee className="h-3 w-3" /> <span className="text-[10px]">Snack</span></div>;
      case '160': return <div title="160 Grados" className="flex items-center gap-1"><Armchair className="h-3 w-3" /> <span className="text-[10px]">160°</span></div>;
      case 'wc': return <div title="Baño" className="flex items-center gap-1"><span className="text-[10px] font-bold border border-current px-0.5 rounded">WC</span> <span className="text-[10px]">Baño</span></div>;
      default: return null;
    }
  };

  // 1. PAYMENT VIEW
  if (step === 'payment' && selectedTrip) {
    return (
      <div className="fixed inset-0 z-[60] bg-[#121212] overflow-hidden animate-in fade-in duration-300">
        <Payment 
          trip={selectedTrip} 
          selectedSeats={selectedSeats}
          onBack={() => setStep('seats')}
          onSuccess={handlePaymentSuccess}
          user={user}
        />
      </div>
    );
  }

  // 2. SEAT SELECTION VIEW
  if (step === 'seats' && selectedTrip) {
    return (
      <div className="fixed inset-0 z-[60] bg-[#121212] overflow-hidden animate-in fade-in duration-300">
         <SeatSelection 
           trip={selectedTrip} 
           onBack={() => setStep('list')} 
           onNext={handleSeatsConfirm}
         />
      </div>
    );
  }

  // 3. LIST VIEW (Default)
  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 font-sans text-gray-200">
      
      {/* Header (Dark Theme) */}
      <div className="sticky top-0 z-20 bg-[#1e1e1e] border-b border-gray-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 text-gray-400 text-xs mb-1">
              <span>Ida</span>
              <span>•</span>
              <span>1 Pasajero</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-white">
              {searchParams.origin} <ArrowRight className="h-6 w-6 text-[#2ecc71]" /> {searchParams.destination}
            </h2>
            <div className="text-sm text-gray-400 mt-1 capitalize">
              {new Date(searchParams.departDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all text-sm font-medium flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-[#2ecc71]" /> Modificar Búsqueda
            </button>
            <button onClick={onClose} className="md:hidden p-2 bg-gray-800 rounded-lg text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-[#1e1e1e] p-5 rounded-xl shadow-lg border border-gray-800 sticky top-32">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Filtros</h3>
                <button 
                  onClick={() => {
                    setPriceLimit(50);
                    setSelectedCompanies([]);
                    setSelectedTime(null);
                  }}
                  className="text-xs text-[#2ecc71] font-medium hover:underline"
                >
                  Borrar todo
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-gray-500">$</span> Precio Máximo: ${priceLimit}
                </h4>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="0.50"
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(parseFloat(e.target.value))}
                  className="w-full accent-[#2ecc71] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" 
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$5</span>
                  <span>$50+</span>
                </div>
              </div>

              {/* Company Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Bus className="h-4 w-4 text-gray-500" /> Empresa
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                  {availableCompanies.length > 0 ? availableCompanies.map(company => (
                    <label key={company} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedCompanies.includes(company)}
                        onChange={() => toggleCompany(company)}
                        className="rounded border-gray-600 bg-gray-700 text-[#2ecc71] focus:ring-[#2ecc71] focus:ring-offset-gray-900" 
                      />
                      {company}
                    </label>
                  )) : (
                    <p className="text-xs text-gray-500">No hay opciones disponibles</p>
                  )}
                </div>
              </div>

               {/* Time Filter */}
               <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" /> Horario de Salida
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => toggleTime('morning')}
                    className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${selectedTime === 'morning' ? 'border-[#2ecc71] bg-[#2ecc71]/10 text-[#2ecc71]' : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'}`}
                  >
                     <span className="text-xs mb-1">🌅</span>
                     <span className="text-[10px] font-medium">Mañana</span>
                  </button>
                  <button 
                     onClick={() => toggleTime('afternoon')}
                     className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${selectedTime === 'afternoon' ? 'border-[#2ecc71] bg-[#2ecc71]/10 text-[#2ecc71]' : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'}`}
                  >
                     <span className="text-xs mb-1">☀️</span>
                     <span className="text-[10px] font-medium">Tarde</span>
                  </button>
                  <button 
                     onClick={() => toggleTime('night')}
                     className={`col-span-2 flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${selectedTime === 'night' ? 'border-[#2ecc71] bg-[#2ecc71]/10 text-[#2ecc71]' : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'}`}
                  >
                     <span className="text-xs mb-1">🌙</span>
                     <span className="text-[10px] font-medium">Noche</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1">
            {/* List Header */}
            <div className="bg-[#1e1e1e] p-4 rounded-xl shadow-lg border border-gray-800 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-white text-lg">{filteredAndSortedResults.length} viajes encontrados</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Ordenar por:</span>
                <div className="relative group">
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="appearance-none flex items-center gap-2 font-medium text-gray-300 bg-gray-800 pl-3 pr-8 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors focus:outline-none cursor-pointer"
                  >
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="time_asc">Horario: Más temprano</option>
                  </select>
                  <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {filteredAndSortedResults.length === 0 ? (
                <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-gray-800">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Sin resultados</h3>
                  <p className="text-gray-400">Intenta ajustar tus filtros para encontrar viajes.</p>
                  <button 
                    onClick={() => {
                      setPriceLimit(50);
                      setSelectedCompanies([]);
                      setSelectedTime(null);
                    }}
                    className="mt-4 text-[#2ecc71] hover:underline font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                filteredAndSortedResults.map((trip) => (
                  <div key={trip.id} className="bg-[#1e1e1e] rounded-xl shadow-lg hover:shadow-xl hover:border-[#2ecc71]/30 border border-gray-800 transition-all duration-200 overflow-hidden group">
                    <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6">
                      
                      {/* Left: Info & Timeline */}
                      <div className="flex-1">
                        {/* Operator Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-[#2ecc71]">
                              <Bus className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-base">{trip.operator}</h4>
                              <p className="text-xs text-gray-400">{trip.type}</p>
                            </div>
                          </div>
                          {trip.seatsAvailable < 10 && (
                             <span className="bg-[#2ecc71]/10 text-[#2ecc71] text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 border border-[#2ecc71]/20">
                               ⚡ Directo
                             </span>
                          )}
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-4 md:gap-8">
                          <div className="text-center w-16">
                            <span className="block text-2xl font-bold text-white">{trip.departureTime}</span>
                            <span className="text-xs text-gray-400 font-medium">{trip.origin}</span>
                          </div>
                          
                          <div className="flex-1 flex flex-col items-center relative px-2">
                             <span className="text-[10px] text-gray-500 mb-1">{trip.duration}</span>
                             <div className="w-full h-[2px] bg-gray-700 relative">
                               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                               <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 p-1 bg-[#1e1e1e]">
                                  <Bus className="h-3 w-3 text-gray-500" />
                               </div>
                               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                             </div>
                          </div>

                          <div className="text-center w-16">
                            <span className="block text-2xl font-bold text-white">{trip.arrivalTime}</span>
                            <span className="text-xs text-gray-400 font-medium">{trip.destination}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Amenities (Desktop only usually, but responsive here) */}
                      <div className="hidden md:flex flex-col justify-center border-l border-gray-800 pl-6 pr-6 min-w-[140px]">
                        <span className="text-[10px] uppercase font-bold text-gray-500 mb-3 tracking-wider">Comodidades</span>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-gray-400">
                          {trip.amenities.map(amenity => (
                            <div key={amenity}>{renderAmenity(amenity)}</div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Price & CTA */}
                      <div className="flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                         <div className="text-right md:text-center mb-0 md:mb-3">
                           {trip.oldPrice && (
                             <span className="block text-xs text-gray-600 line-through">${trip.oldPrice.toFixed(2)}</span>
                           )}
                           <div className="text-3xl font-bold text-[#2ecc71]">
                             <span className="text-lg text-gray-500 font-normal mr-1">$</span>
                             {trip.price.toFixed(2)}
                           </div>
                           <span className="text-[10px] text-gray-500 block">por pasajero</span>
                         </div>
                         
                         <button 
                           onClick={() => handleTripSelect(trip)}
                           className="px-6 py-2.5 rounded-lg border-2 border-[#2ecc71] text-[#2ecc71] font-bold hover:bg-[#2ecc71] hover:text-white transition-all text-sm w-full"
                         >
                           Seleccionar
                         </button>
                      </div>

                    </div>
                    
                    {/* Mobile Amenities Footer */}
                    <div className="md:hidden bg-[#252525] px-5 py-2 border-t border-gray-800 flex gap-4 text-gray-400 overflow-x-auto">
                      {trip.amenities.map(amenity => (
                        <div key={amenity}>{renderAmenity(amenity)}</div>
                      ))}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="bg-[#1a1a1a] py-12 mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full flex items-center justify-center mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-white mb-1">Pago Seguro 100%</h4>
            <p className="text-xs text-gray-500 max-w-xs">Tus transacciones están protegidas con la última tecnología de encriptación.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full flex items-center justify-center mb-3">
              <X className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-white mb-1">Cancelación Flexible</h4>
            <p className="text-xs text-gray-500 max-w-xs">Cambia tus planes sin preocupaciones hasta 24 horas antes de tu viaje.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full flex items-center justify-center mb-3">
              <Armchair className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-white mb-1">Soporte 24/7</h4>
            <p className="text-xs text-gray-500 max-w-xs">Nuestro equipo está disponible todo el día para ayudarte en tu viaje.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;