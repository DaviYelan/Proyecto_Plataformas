import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { View as ViewType, BusTrip, User } from '../types';

interface Props {
  onNavigate: (view: ViewType) => void;
  myTrips: BusTrip[];
  onSelectTrip: (trip: BusTrip) => void;
  onTrackTrip: (trip: BusTrip) => void;
  user: User | null;
}

const MyTripsView: React.FC<Props> = ({ onNavigate, myTrips, onSelectTrip }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => onNavigate(ViewType.HOME)}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Mis Viajes</Text>
      <View style={styles.headerSpacer} />
    </View>
    <ScrollView style={styles.scrollView}>
      {myTrips.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎫</Text>
          <Text style={styles.emptyText}>No tienes viajes reservados</Text>
        </View>
      ) : (
        myTrips.map((trip, i) => (
          <TouchableOpacity key={i} style={styles.tripCard} onPress={() => onSelectTrip(trip)}>
            <Text style={styles.tripRoute}>{trip.origin} → {trip.destination}</Text>
            <Text style={styles.tripDate}>{trip.departureTime}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16 },
  backButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#FFFFFF' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 48 },
  scrollView: { flex: 1, padding: 24 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, fontWeight: '600', color: 'rgba(255, 255, 255, 0.4)' },
  tripCard: { backgroundColor: '#1c1c1c', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  tripRoute: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  tripDate: { fontSize: 14, fontWeight: '500', color: '#2ecc71' },
});

export default MyTripsView;
