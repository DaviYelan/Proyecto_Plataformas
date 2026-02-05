import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  trip: any;
  onBack: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const TrackTripView: React.FC<Props> = ({ trip, onBack, showToast }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Rastrear Viaje</Text>
      <View style={styles.headerSpacer} />
    </View>
    <View style={styles.content}>
      <Text style={styles.mapPlaceholder}>🗺️</Text>
      <Text style={styles.mapText}>Mapa en tiempo real</Text>
      <View style={styles.infoCard}>
        <Text style={styles.route}>{trip?.origin} → {trip?.destination}</Text>
        <Text style={styles.status}>Estado: En ruta 🚌</Text>
        <Text style={styles.eta}>Llegada estimada: 2h 30min</Text>
      </View>
      <TouchableOpacity style={styles.refreshButton} onPress={() => showToast('Actualizado', 'success')}>
        <Text style={styles.refreshButtonText}>🔄 Actualizar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16 },
  backButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#FFFFFF' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 48 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  mapPlaceholder: { fontSize: 80, marginBottom: 16 },
  mapText: { fontSize: 16, fontWeight: '600', color: 'rgba(255, 255, 255, 0.4)', marginBottom: 40 },
  infoCard: { width: '100%', backgroundColor: '#1c1c1c', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 24 },
  route: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  status: { fontSize: 16, fontWeight: '600', color: '#2ecc71', marginBottom: 8 },
  eta: { fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)' },
  refreshButton: { width: '100%', height: 56, backgroundColor: '#2ecc71', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  refreshButtonText: { fontSize: 16, fontWeight: '900', color: '#000000' },
});

export default TrackTripView;
