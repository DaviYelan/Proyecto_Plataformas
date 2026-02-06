import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { View as ViewType } from '../types';

interface Props {
  onNavigate: (view: ViewType) => void;
}

const notifications = [
  { id: '1', title: 'Viaje confirmado', message: 'Tu viaje a Guayaquil ha sido confirmado', time: 'Hace 2 horas', icon: '✅' },
  { id: '2', title: 'Recordatorio', message: 'Tu viaje es mañana a las 8:00 AM', time: 'Hace 5 horas', icon: '⏰' },
];

const NotificationsView: React.FC<Props> = ({ onNavigate }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => onNavigate(ViewType.HOME)}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Notificaciones</Text>
      <View style={styles.headerSpacer} />
    </View>
    <ScrollView style={styles.scrollView}>
      {notifications.map((notif) => (
        <View key={notif.id} style={styles.notifCard}>
          <Text style={styles.notifIcon}>{notif.icon}</Text>
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>{notif.title}</Text>
            <Text style={styles.notifMessage}>{notif.message}</Text>
            <Text style={styles.notifTime}>{notif.time}</Text>
          </View>
        </View>
      ))}
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
  notifCard: { flexDirection: 'row', backgroundColor: '#1c1c1c', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  notifIcon: { fontSize: 32, marginRight: 16 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  notifMessage: { fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)', marginBottom: 8 },
  notifTime: { fontSize: 12, fontWeight: '500', color: 'rgba(255, 255, 255, 0.4)' },
});

export default NotificationsView;
