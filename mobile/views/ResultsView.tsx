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
import { apiService } from '../services/apiService';

interface Props {
  onNavigate: (view: ViewType) => void;
  searchCriteria: SearchCriteria;
  onSelectTrip: (trip: any) => void;
}

const ResultsView: React.FC<Props> = ({ onNavigate, searchCriteria, onSelectTrip }) => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

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
