import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CreditCard, User } from '../types';

interface Props {
  onBack: () => void;
  savedCards: CreditCard[];
  onSaveCard: (card: Omit<CreditCard, 'id'>) => void;
  onDeleteCard: (cardId: string) => void;
  user: User | null;
}

const PaymentMethodsView: React.FC<Props> = ({ onBack, savedCards, onDeleteCard }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Métodos de Pago</Text>
      <View style={styles.headerSpacer} />
    </View>
    <ScrollView style={styles.scrollView}>
      {savedCards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💳</Text>
          <Text style={styles.emptyText}>No tienes tarjetas guardadas</Text>
        </View>
      ) : (
        savedCards.map((card) => (
          <View key={card.id} style={styles.cardItem}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNumber}>**** **** **** {card.number}</Text>
              <Text style={styles.cardHolder}>{card.holder}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteCard(card.id)}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
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
  cardItem: { flexDirection: 'row', backgroundColor: '#1c1c1c', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  cardInfo: { flex: 1 },
  cardNumber: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  cardHolder: { fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)' },
  deleteButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  deleteIcon: { fontSize: 24 },
});

export default PaymentMethodsView;
