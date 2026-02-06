<<<<<<< HEAD
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { View as ViewType } from '../types';
=======

import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { View, BusTrip } from '../types';
import { apiService } from '../services/apiService';
>>>>>>> origin/develop

interface Props {
  onNavigate: (view: ViewType) => void;
  trip: any;
  onSeatsChange: (seats: string[]) => void;
  selectedSeats: string[];
}

const SeatSelectionView: React.FC<Props> = ({ onNavigate, trip, onSeatsChange, selectedSeats }) => {
<<<<<<< HEAD
  const totalSeats = 40;
  const seatsPerRow = 4;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  const toggleSeat = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      onSeatsChange(selectedSeats.filter(s => s !== seatNumber));
=======
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
>>>>>>> origin/develop
    } else {
      onSeatsChange([...selectedSeats, seatNumber]);
    }
  };

<<<<<<< HEAD
  const renderSeat = (seatNumber: number) => {
    const seatStr = seatNumber.toString();
    const isSelected = selectedSeats.includes(seatStr);
    const isOccupied = Math.random() > 0.7; // Simulación
=======
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
>>>>>>> origin/develop

    return (
      <TouchableOpacity
        key={seatNumber}
        style={[
          styles.seat,
          isOccupied && styles.seatOccupied,
          isSelected && styles.seatSelected,
        ]}
        onPress={() => !isOccupied && toggleSeat(seatStr)}
        disabled={isOccupied}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.seatNumber,
          isOccupied && styles.seatNumberOccupied,
          isSelected && styles.seatNumberSelected,
        ]}>
          {seatNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = (rowIndex: number) => {
    const seats = [];
    for (let i = 0; i < seatsPerRow; i++) {
      const seatNumber = rowIndex * seatsPerRow + i + 1;
      if (seatNumber <= totalSeats) {
        if (i === 2) {
          seats.push(<View key={`aisle-${rowIndex}`} style={styles.aisle} />);
        }
        seats.push(renderSeat(seatNumber));
      }
    }
    return (
      <View key={rowIndex} style={styles.row}>
        {seats}
      </View>
    );
  };

  const total = selectedSeats.length * (trip?.price || 25);

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate(ViewType.RESULTS)}
=======
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
>>>>>>> origin/develop
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleccionar Asientos</Text>
        <View style={styles.headerSpacer} />
      </View>

<<<<<<< HEAD
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <Text style={styles.tripRoute}>
            {trip?.origin} → {trip?.destination}
          </Text>
          <Text style={styles.tripDetails}>
            {trip?.time} • {trip?.company}
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendAvailable]} />
            <Text style={styles.legendText}>Disponible</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendSelected]} />
            <Text style={styles.legendText}>Seleccionado</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendOccupied]} />
            <Text style={styles.legendText}>Ocupado</Text>
          </View>
        </View>

        {/* Bus Layout */}
        <View style={styles.busContainer}>
          <View style={styles.driverArea}>
            <Text style={styles.driverIcon}>🚗</Text>
          </View>
          
          <View style={styles.seatsArea}>
            {Array.from({ length: rows }).map((_, index) => renderRow(index))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>
            {selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, selectedSeats.length === 0 && styles.continueButtonDisabled]}
          onPress={() => onNavigate(ViewType.PAYMENT)}
          disabled={selectedSeats.length === 0}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Continuar al pago →</Text>
        </TouchableOpacity>
      </View>
    </View>
=======
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
>>>>>>> origin/develop
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  tripInfo: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  tripRoute: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tripDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendAvailable: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legendSelected: {
    backgroundColor: '#2ecc71',
  },
  legendOccupied: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  busContainer: {
    marginHorizontal: 24,
    backgroundColor: '#1c1c1c',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 120,
  },
  driverArea: {
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingRight: 10,
  },
  driverIcon: {
    fontSize: 32,
  },
  seatsArea: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  aisle: {
    width: 16,
  },
  seat: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatOccupied: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  seatSelected: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  seatNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seatNumberOccupied: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
  seatNumberSelected: {
    color: '#000000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1c',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#2ecc71',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(46, 204, 113, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
});

export default SeatSelectionView;
