import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { View as ViewType, User } from '../types';

interface Props {
  onNavigate: (view: ViewType) => void;
  user: User | null;
  onLogout: () => void;
}

const ProfileView: React.FC<Props> = ({ onNavigate, user, onLogout }) => {
  const menuItems = [
    { icon: '👤', label: 'Información Personal', view: ViewType.PERSONAL_INFO },
    { icon: '💳', label: 'Métodos de Pago', view: ViewType.PAYMENT_METHODS },
    { icon: '🎫', label: 'Mis Viajes', view: ViewType.MY_TRIPS },
    { icon: '❓', label: 'Centro de Ayuda', view: ViewType.HELP_CENTER },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
        </View>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => onNavigate(item.view)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(ViewType.HOME)}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(ViewType.MY_TRIPS)}>
          <Text style={styles.navIcon}>🎫</Text>
          <Text style={styles.navText}>Mis Viajes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>👤</Text>
          <Text style={styles.navTextActive}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  scrollView: { flex: 1 },
  profileCard: { marginHorizontal: 24, marginBottom: 24, backgroundColor: '#1c1c1c', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2ecc71', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#000000' },
  userName: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  userEmail: { fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)' },
  menuContainer: { marginHorizontal: 24, marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1c1c1c', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  menuIcon: { fontSize: 24, marginRight: 16 },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  menuArrow: { fontSize: 24, color: 'rgba(255, 255, 255, 0.3)' },
  logoutButton: { marginHorizontal: 24, marginBottom: 100, height: 56, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  logoutButtonText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#1c1c1c', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)', paddingVertical: 12, paddingHorizontal: 24, justifyContent: 'space-around' },
  navItem: { alignItems: 'center', paddingVertical: 8 },
  navIcon: { fontSize: 24, marginBottom: 4, opacity: 0.5 },
  navIconActive: { fontSize: 24, marginBottom: 4 },
  navText: { fontSize: 10, fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)' },
  navTextActive: { fontSize: 10, fontWeight: '700', color: '#2ecc71' },
});

export default ProfileView;
