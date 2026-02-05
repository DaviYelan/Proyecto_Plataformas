import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { View as ViewType, SearchCriteria, User } from '../types';

interface Props {
  onNavigate: (view: ViewType) => void;
  searchCriteria: SearchCriteria;
  onSearchUpdate: (criteria: SearchCriteria) => void;
  user: User | null;
}

const HomeView: React.FC<Props> = ({ onNavigate, searchCriteria, onSearchUpdate, user }) => {
  const handleSwap = () => {
    onSearchUpdate({
      ...searchCriteria,
      origin: searchCriteria.destination,
      destination: searchCriteria.origin
    });
  };

  const handleSearch = () => {
    onNavigate(ViewType.RESULTS);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandText}>BusGo Platinum</Text>
          <Text style={styles.greeting}>Hola, {user?.name || 'Usuario'} 👋</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onNavigate(ViewType.NOTIFICATIONS)}
          >
            <Text style={styles.iconText}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Card */}
      <View style={styles.searchCard}>
        <Text style={styles.sectionLabel}>PUNTO DE ORIGEN</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe el origen..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            value={searchCriteria.origin}
            onChangeText={(text) => onSearchUpdate({...searchCriteria, origin: text})}
          />
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapIcon}>⇅</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>DESTINO FINAL</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={styles.input}
            placeholder="¿A dónde vamos hoy?"
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            value={searchCriteria.destination}
            onChangeText={(text) => onSearchUpdate({...searchCriteria, destination: text})}
          />
        </View>

        <Text style={styles.sectionLabel}>FECHA DE VIAJE</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📅</Text>
          <TextInput
            style={styles.input}
            placeholder="Seleccionar fecha"
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            value={searchCriteria.date}
            onChangeText={(text) => onSearchUpdate({...searchCriteria, date: text})}
          />
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍 Buscar Viajes</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => onNavigate(ViewType.MY_TRIPS)}
        >
          <Text style={styles.quickActionIcon}>🎫</Text>
          <Text style={styles.quickActionTitle}>Mis Viajes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => onNavigate(ViewType.AI_CHAT)}
        >
          <Text style={styles.quickActionIcon}>🤖</Text>
          <Text style={styles.quickActionTitle}>Asistente IA</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navTextActive}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => onNavigate(ViewType.MY_TRIPS)}
        >
          <Text style={styles.navIcon}>🎫</Text>
          <Text style={styles.navText}>Mis Viajes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => onNavigate(ViewType.PROFILE)}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2ecc71',
    letterSpacing: 2,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconText: {
    fontSize: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchCard: {
    marginHorizontal: 24,
    backgroundColor: '#1c1c1c',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(46, 204, 113, 0.3)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  swapButton: {
    position: 'absolute',
    right: 24,
    top: 105,
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  swapIcon: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
  },
  searchButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2ecc71',
  },
});

export default HomeView;
