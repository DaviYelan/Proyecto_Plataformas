<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { View as ViewType, SearchCriteria } from '../types';
=======

import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { View, BusTrip, SearchCriteria } from '../types';
>>>>>>> origin/develop
import { apiService } from '../services/apiService';

interface Props {
  onNavigate: (view: ViewType) => void;
  searchCriteria: SearchCriteria;
  onSelectTrip: (trip: any) => void;
}

const ResultsView: React.FC<Props> = ({ onNavigate, searchCriteria, onSelectTrip }) => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await apiService.get('/ruta/lista');
      const rutas = response.data?.rutas || response.rutas || response.data || [];
      
      const tripsData = rutas.map((ruta: any) => ({
        id: ruta.id_ruta?.toString() || Math.random().toString(),
        origin: ruta.origen || searchCriteria.origin,
        destination: ruta.destino || searchCriteria.destination,
        time: '08:00 AM',
        duration: '6h 30m',
        price: parseFloat(ruta.precio_base || '25'),
        company: 'Ecuador Premium',
        rating: 4.5,
        seats: 15,
      }));

      setTrips(tripsData);
    } catch (error) {
      console.error('Error loading trips:', error);
      setTrips([
        {
          id: '1',
          origin: searchCriteria.origin,
          destination: searchCriteria.destination,
          time: '08:00 AM',
          duration: '6h 30m',
          price: 25,
          company: 'Ecuador Premium',
          rating: 4.5,
          seats: 15,
        },
        {
          id: '2',
          origin: searchCriteria.origin,
          destination: searchCriteria.destination,
          time: '11:30 AM',
          duration: '6h 45m',
          price: 28,
          company: 'Ecuador Premium',
          rating: 4.7,
          seats: 8,
        },
      ]);
=======
const ResultsView: React.FC<Props> = ({ onNavigate, onSelectTrip, searchCriteria }) => {
  const { isDarkMode } = useTheme();
  const [results, setResults] = useState<BusTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, [searchCriteria]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      console.log('[ROUTES] Buscando rutas:', searchCriteria);
      
      const response = await apiService.get('/ruta/lista');
      console.log('[ROUTES] Respuesta del backend:', response);
      
      const rutas = response.data || response.rutas || response || [];
      console.log('[ROUTES] Total de rutas en backend:', rutas.length);
      
      // Filtrar rutas que coincidan con origen y destino
      const filteredRutas = rutas.filter((ruta: any) => {
        const matchOrigin = !searchCriteria.origin || 
          ruta.origen?.toLowerCase().includes(searchCriteria.origin.toLowerCase()) ||
          searchCriteria.origin.toLowerCase().includes(ruta.origen?.toLowerCase());
        
        const matchDestination = !searchCriteria.destination || 
          ruta.destino?.toLowerCase().includes(searchCriteria.destination.toLowerCase()) ||
          searchCriteria.destination.toLowerCase().includes(ruta.destino?.toLowerCase());
        
        return matchOrigin && matchDestination && ruta.estado_ruta === 'Disponible';
      });
      
      console.log('[ROUTES] Rutas filtradas:', filteredRutas.length);
      
      if (filteredRutas.length === 0) {
        console.warn('[ROUTES] No se encontraron rutas para:', searchCriteria.origin, '->', searchCriteria.destination);
      }
      
      // Convertir rutas del backend al formato BusTrip
      const trips: BusTrip[] = filteredRutas.map((ruta: any, index: number) => {
        const bus = ruta.bus;
        const cooperativa = bus?.cooperativa;
        
        return {
          id: ruta.id_ruta?.toString() || index.toString(),
          company: cooperativa?.nombre_cooperativa || 'BusGo Premium',
          logoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100',
          rating: 4.5 + (Math.random() * 0.5),
          reviewsCount: 50 + Math.floor(Math.random() * 150),
          departureTime: '08:00 AM', // Esto vendría del horario
          arrivalTime: '04:00 PM',   // Esto vendría del horario
          duration: ruta.tiempo_estimado || '8h 00m',
          origin: ruta.origen || searchCriteria.origin,
          destination: ruta.destino || searchCriteria.destination,
          price: parseFloat(ruta.precio_unitario) || 15.00,
          class: bus?.modelo ? `${bus.marca} ${bus.modelo}` : 'Executive Class',
          amenities: ['wifi', 'ac_unit', 'bolt']
        };
      });
      
      console.log('[ROUTES] Viajes creados:', trips.length);
      setResults(trips);
      
      // Si no hay resultados, mostrar datos mock
      if (trips.length === 0) {
        console.log('[ROUTES] Usando datos mock como fallback');
        setResults(MOCK_TRIPS_TEMPLATE.map(t => ({
          ...t,
          origin: searchCriteria.origin || t.origin,
          destination: searchCriteria.destination || t.destination
        })));
      }
    } catch (error) {
      console.error('[ROUTES] Error al cargar rutas:', error);
      // Fallback a datos mock si falla
      setResults(MOCK_TRIPS_TEMPLATE.map(t => ({
        ...t,
        origin: searchCriteria.origin || t.origin,
        destination: searchCriteria.destination || t.destination
      })));
>>>>>>> origin/develop
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Buscando viajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate(ViewType.HOME)}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultados</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Route Info */}
      <View style={styles.routeInfo}>
        <Text style={styles.routeText}>
          {searchCriteria.origin} → {searchCriteria.destination}
        </Text>
        <Text style={styles.dateText}>{searchCriteria.date}</Text>
      </View>

      {/* Trips List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.tripCard}
            onPress={() => onSelectTrip(trip)}
            activeOpacity={0.8}
          >
            <View style={styles.tripHeader}>
              <View>
                <Text style={styles.companyName}>{trip.company}</Text>
                <Text style={styles.tripTime}>{trip.time}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>desde</Text>
                <Text style={styles.price}>${trip.price}</Text>
              </View>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>⏱️</Text>
                <Text style={styles.detailText}>{trip.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>⭐</Text>
                <Text style={styles.detailText}>{trip.rating}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>💺</Text>
                <Text style={styles.detailText}>{trip.seats} disponibles</Text>
              </View>
            </View>

            <View style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Seleccionar asientos →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
=======

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-background-dark' : 'bg-white'}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md pt-12 ${isDarkMode ? 'bg-background-dark/80' : 'bg-white/80'}`}>
        <div className="flex items-center px-4 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate(View.HOME)}
              className={`flex size-10 items-center justify-center rounded-full active:scale-95 transition-transform ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}
            >
              <span className={`material-symbols-outlined text-xl ${isDarkMode ? 'text-white' : 'text-black'}`}>arrow_back</span>
            </button>
            <div>
              <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {searchCriteria.origin || 'Quito'} to {searchCriteria.destination || 'Guayaquil'}
              </h2>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{searchCriteria.date} • 1 Passenger</p>
            </div>
          </div>
          <button className={`flex size-10 items-center justify-center rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
            <span className={`material-symbols-outlined text-xl ${isDarkMode ? 'text-white' : 'text-black'}`}>calendar_today</span>
          </button>
        </div>

        <div className="flex gap-2 px-4 py-4 overflow-x-auto hide-scrollbar">
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-[#2ecc71] text-black px-4">
            <span className="text-xs font-bold uppercase tracking-wider">Price</span>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-white/10 px-4 border border-white/5">
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Time</span>
            <span className="material-symbols-outlined text-base text-white/30">expand_more</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 space-y-4 overflow-y-auto hide-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71] mb-4"></div>
            <p className="text-neutral-500 font-bold">Buscando rutas disponibles...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
            <span className="material-symbols-outlined text-6xl mb-4">route</span>
            <p className="font-bold text-lg">No hay rutas disponibles</p>
            <p className="text-sm text-neutral-600 mt-2">
              Para {searchCriteria.origin} → {searchCriteria.destination}
            </p>
          </div>
        ) : (
          results.map(trip => (
          <div 
            key={trip.id}
            onClick={() => onSelectTrip(trip)}
            className={`flex flex-col gap-4 rounded-2xl p-5 border active:scale-[0.98] transition-transform cursor-pointer ${isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-white border-gray-200 shadow-lg'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className={`size-12 rounded-xl flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <img src={trip.logoUrl} alt={trip.company} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{trip.company}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[#2ecc71] text-xs fill-1">star</span>
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{trip.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-[#2ecc71]">${trip.price.toFixed(2)}</span>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Available</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex flex-col">
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{trip.departureTime}</span>
                <span className={`text-[11px] font-medium ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{trip.origin}</span>
              </div>
              <div className="flex-1 px-4 flex flex-col items-center">
                <span className={`text-[10px] font-bold mb-1 ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'}`}>{trip.duration}</span>
                <div className={`w-full h-px relative ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`}>
                  <div className={`absolute -top-1 left-0 size-2 rounded-full border border-[#2ecc71] ${isDarkMode ? 'bg-background-dark' : 'bg-white'}`}></div>
                  <div className="absolute -top-1 right-0 size-2 rounded-full bg-[#2ecc71]"></div>
                </div>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{trip.arrivalTime}</span>
                <span className={`text-[11px] font-medium ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{trip.destination}</span>
              </div>
            </div>
          </div>
        )))}
      </main>
    </div>
>>>>>>> origin/develop
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  routeInfo: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  routeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2ecc71',
  },
  scrollView: {
    flex: 1,
  },
  tripCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tripTime: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2ecc71',
  },
  tripDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  selectButton: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2ecc71',
    textAlign: 'center',
  },
});

export default ResultsView;
