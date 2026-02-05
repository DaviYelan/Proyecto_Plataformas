import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { View as ViewType } from '../types';

interface Props {
  onNavigate: (view: ViewType) => void;
  trip: any;
  seats: string[];
  date: string;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  onDownload: () => void;
}

const TicketView: React.FC<Props> = ({ onNavigate, trip, seats = [], date, showToast }) => {
  const ticketId = `BG-${Math.floor(1000 + Math.random() * 9000)}`;
  const total = seats.length * (trip?.price || 25);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boleto Digital</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => onNavigate(ViewType.HOME)}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.ticketCard}>
          <View style={styles.successBadge}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>Compra Exitosa</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Text style={styles.ticketId}>#{ticketId}</Text>
            <Text style={styles.route}>
              {trip?.origin} → {trip?.destination}
            </Text>
            <Text style={styles.date}>{date}</Text>
          </View>

          <View style={styles.qrContainer}>
            <Text style={styles.qrPlaceholder}>📱</Text>
            <Text style={styles.qrText}>Código QR</Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Empresa</Text>
              <Text style={styles.detailValue}>{trip?.company || 'Ecuador Premium'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hora</Text>
              <Text style={styles.detailValue}>{trip?.time || '08:00 AM'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Asientos</Text>
              <Text style={styles.detailValue}>{seats.join(', ')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Pagado</Text>
              <Text style={styles.detailValueHighlight}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showToast('Boleto guardado', 'success')}
          >
            <Text style={styles.actionButtonText}>💾 Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showToast('Compartido', 'success')}
          >
            <Text style={styles.actionButtonText}>📤 Compartir</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => onNavigate(ViewType.HOME)}
        >
          <Text style={styles.homeButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center', justifyContent: 'center' },
  closeIcon: { fontSize: 20, color: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  ticketCard: { marginHorizontal: 24, backgroundColor: '#1c1c1c', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 16 },
  successBadge: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(46, 204, 113, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 24 },
  successIcon: { fontSize: 16, color: '#2ecc71' },
  successText: { fontSize: 14, fontWeight: '700', color: '#2ecc71' },
  ticketInfo: { alignItems: 'center', marginBottom: 24 },
  ticketId: { fontSize: 12, fontWeight: '600', color: 'rgba(255, 255, 255, 0.4)', marginBottom: 8 },
  route: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  date: { fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)' },
  qrContainer: { alignItems: 'center', paddingVertical: 24, marginBottom: 24, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  qrPlaceholder: { fontSize: 80, marginBottom: 8 },
  qrText: { fontSize: 12, fontWeight: '600', color: 'rgba(255, 255, 255, 0.4)' },
  details: { gap: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  detailValueHighlight: { fontSize: 18, fontWeight: '900', color: '#2ecc71' },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginBottom: 16 },
  actionButton: { flex: 1, height: 48, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  homeButton: { marginHorizontal: 24, height: 56, backgroundColor: '#2ecc71', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  homeButtonText: { fontSize: 16, fontWeight: '900', color: '#000000' },
});

export default TicketView;
