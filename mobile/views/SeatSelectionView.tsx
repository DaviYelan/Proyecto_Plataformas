
import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { View, BusTrip } from '../types';
import { apiService } from '../services/apiService';

interface Props {
  onNavigate: (view: View) => void;
  trip: BusTrip | null;
  onSeatsChange: (seats: string[]) => void;
  selectedSeats: string[];
}

const SeatSelectionView: React.FC<Props> = ({ onNavigate, trip, onSeatsChange, selectedSeats }) => {
  const { isDarkMode } = useTheme();
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar asientos ocupados desde el backend
  useEffect(() => {
    const loadOccupiedSeats = async () => {
      if (!trip) {
        console.log('[SEATS] No hay viaje seleccionado');
        setLoading(false);
        return;
      }

      try {
        console.log('[SEATS] =================================');
        console.log('[SEATS] Iniciando carga de asientos ocupados');
        console.log('[SEATS] Ruta seleccionada:', trip);
        console.log('[SEATS] ID de ruta:', trip.id);
        console.log('[SEATS] =================================');
        
        // Obtener todos los boletos
        const boletosResponse = await apiService.get('/boleto/lista');
        console.log('[SEATS] Respuesta del backend:', boletosResponse);
        
        const boletos = boletosResponse.data?.boletos || boletosResponse.boletos || boletosResponse.data || [];
        console.log('[SEATS] Total de boletos encontrados:', boletos.length);
        
        if (boletos.length === 0) {
          console.log('[SEATS] ⚠️ No hay boletos en el sistema');
          setOccupiedSeats([]);
          setLoading(false);
          return;
        }

        // Mostrar estructura del primer boleto para debugging
        if (boletos.length > 0) {
          console.log('[SEATS] Estructura del primer boleto:', boletos[0]);
        }

        // Filtrar boletos para esta ruta específica y que estén vendidos
        const boletosRuta = boletos.filter((boleto: any) => {
          const rutaId = boleto.turno?.horario?.ruta?.id_ruta?.toString();
          const rutaOrigen = boleto.turno?.horario?.ruta?.origen;
          const rutaDestino = boleto.turno?.horario?.ruta?.destino;
          const estadoBoleto = boleto.estado_boleto;
          const numeroAsiento = boleto.numero_asiento;
          
          console.log('[SEATS] Inspeccionando boleto:', {
            id_boleto: boleto.id_boleto,
            numero_asiento: numeroAsiento,
            estado_boleto: estadoBoleto,
            ruta_id: rutaId,
            origen: rutaOrigen,
            destino: rutaDestino,
            trip_id: trip.id,
            trip_origen: trip.origin,
            trip_destino: trip.destination,
            coincide_ruta_id: rutaId === trip.id,
            coincide_origen_destino: rutaOrigen === trip.origin && rutaDestino === trip.destination,
            tiene_turno: !!boleto.turno,
            tiene_horario: !!boleto.turno?.horario,
            tiene_ruta: !!boleto.turno?.horario?.ruta
          });
          
          // Coincidir por ID exacto O por origen/destino
          const coincideId = rutaId === trip.id;
          const coincideRuta = rutaOrigen === trip.origin && rutaDestino === trip.destination;
          const match = (coincideId || coincideRuta) && estadoBoleto === 'Vendido';
          
          if (match) {
            console.log('[SEATS] ✅ Boleto coincide - Asiento ocupado:', numeroAsiento);
          }
          
          return match;
        });

        console.log('[SEATS] Total boletos para esta ruta:', boletosRuta.length);

        // Extraer números de asiento ocupados
        const asientosOcupados = boletosRuta.map((boleto: any) => {
          const numeroAsiento = boleto.numero_asiento;
          // Formatear a dos dígitos con cero adelante
          const asientoFormateado = String(numeroAsiento).padStart(2, '0');
          console.log('[SEATS] Formateando asiento:', numeroAsiento, '->', asientoFormateado);
          return asientoFormateado;
        });

        console.log('[SEATS] =================================');
        console.log('[SEATS] 🎯 ASIENTOS OCUPADOS FINALES:', asientosOcupados);
        console.log('[SEATS] =================================');
        setOccupiedSeats(asientosOcupados);
      } catch (error) {
        console.error('[SEATS] ❌ ERROR al cargar asientos ocupados:', error);
        console.error('[SEATS] Detalles del error:', error);
        // En caso de error, usar array vacío
        setOccupiedSeats([]);
      } finally {
        setLoading(false);
      }
    };

    loadOccupiedSeats();
  }, [trip]);
  
  const handleToggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      onSeatsChange(selectedSeats.filter(s => s !== seatId));
    } else {
      onSeatsChange([...selectedSeats, seatId]);
    }
  };

  const renderSeat = (id: string) => {
    const isOccupied = occupiedSeats.includes(id);
    const isSelected = selectedSeats.includes(id);
    
    let baseClass = "col-span-1 h-12 w-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ";
    if (isOccupied) {
      baseClass += isDarkMode 
        ? "bg-neutral-800 text-neutral-600 cursor-not-allowed opacity-50"
        : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60";
    } else if (isSelected) {
      baseClass += "bg-[#2ecc71] text-black shadow-lg shadow-[#2ecc71]/50 scale-105";
    } else {
      baseClass += isDarkMode
        ? "bg-surface-dark border border-neutral-800 text-white hover:scale-95"
        : "bg-white border-2 border-gray-300 text-black hover:scale-95 hover:border-[#2ecc71]";
    }

    const statusLabel = isOccupied ? 'Occupied' : isSelected ? 'Selected' : 'Available';
    const ariaLabel = `Seat ${id}, ${statusLabel}`;

    return (
      <button 
        key={id}
        onClick={() => handleToggleSeat(id)}
        className={baseClass}
        aria-label={ariaLabel}
        aria-pressed={isSelected}
        disabled={isOccupied}
      >
        {id}
      </button>
    );
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-background-dark text-white' : 'bg-white text-black'}`}>
      <nav className={`sticky top-0 z-50 backdrop-blur-md px-4 py-4 pt-12 flex items-center justify-between border-b ${isDarkMode ? 'bg-background-dark/80 border-neutral-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(View.RESULTS)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? 'active:bg-neutral-800' : 'active:bg-gray-200'}`}
            aria-label="Back to results"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Select Seats</h1>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{trip?.origin} → {trip?.destination} • {trip?.departureTime}</p>
          </div>
        </div>
        <button 
          className={`w-10 h-10 flex items-center justify-center rounded-full border ${isDarkMode ? 'border-neutral-800' : 'border-gray-200'}`}
          aria-label="Bus information"
        >
          <span className="material-symbols-outlined text-[20px]">info</span>
        </button>
      </nav>

      <div className="px-4 py-6" aria-label="Seat legend">
        <div className={`flex justify-between items-center p-4 rounded-xl shadow-sm border ${isDarkMode ? 'bg-surface-dark border-neutral-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-sm border ${isDarkMode ? 'bg-white border-neutral-600' : 'bg-white border-gray-300'}`} aria-hidden="true"></div>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-neutral-500' : 'text-gray-600'}`}>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-sm ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-300'}`} aria-hidden="true"></div>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-neutral-500' : 'text-gray-600'}`}>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#2ecc71]" aria-hidden="true"></div>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-neutral-500' : 'text-gray-600'}`}>Selected</span>
          </div>
        </div>
      </div>

      <main className="flex-1 px-8 pb-32 overflow-y-auto hide-scrollbar">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8" aria-hidden="true">
            <div className={`w-20 h-1 rounded-full mb-4 ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
              <span className="material-symbols-outlined text-[20px]">steering_wheel_heat</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">Front of Bus</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="material-symbols-outlined animate-spin text-[#2ecc71] text-[42px]">refresh</span>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-y-6" role="grid" aria-label="Bus seat grid">
              {['01', '02', 'gap', '03', '04', '05', '06', 'gap', '07', '08', '09', '10', 'gap', '11', '12', '13', '14', 'gap', '15', '16', '17', '18', 'gap', '19', '20', '21', '22', 'gap', '23', '24'].map((id, index) => (
                id === 'gap' ? <div key={`gap-${index}`} className="col-span-1 flex items-center justify-center" aria-hidden="true"><span className={`material-symbols-outlined rotate-90 scale-75 ${isDarkMode ? 'text-neutral-800' : 'text-gray-300'}`}>straight</span></div> : renderSeat(id)
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-col items-center opacity-40" aria-label="Rear of bus amenities">
            <div className={`flex items-center gap-4 ${isDarkMode ? 'text-neutral-700' : 'text-gray-400'}`}>
              <span className="material-symbols-outlined text-4xl">wc</span>
            </div>
            <p className={`text-[10px] uppercase tracking-widest font-bold mt-2 ${isDarkMode ? 'text-neutral-400' : 'text-gray-500'}`}>Restrooms</p>
          </div>
        </div>
      </main>

      <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 pb-10 backdrop-blur-md border-t z-[60] ${isDarkMode ? 'bg-background-dark/95 border-neutral-800' : 'bg-white/95 border-gray-200'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-black ${isDarkMode ? 'text-[#2ecc71]' : 'text-[#2ecc71]'}`}>{selectedSeats.length}</span>
              <span className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>Seats Selected</span>
            </div>
            <div className="text-right">
              <p className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Total</p>
              <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>${(selectedSeats.length * (trip?.price || 0)).toFixed(2)}</p>
            </div>
          </div>
          
          <button 
            disabled={selectedSeats.length === 0}
            onClick={() => onNavigate(View.PAYMENT)}
            className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all text-base ${
              selectedSeats.length > 0 
                ? 'bg-[#2ecc71] hover:bg-[#27ae60] text-black shadow-[#2ecc71]/50' 
                : isDarkMode ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Continue to Payment</span>
            <span className="material-symbols-outlined text-xl" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionView;
