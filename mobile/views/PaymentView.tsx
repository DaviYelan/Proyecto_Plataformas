import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { View as ViewType, CreditCard, User } from '../types';

interface Props {
  onNavigate: (view: ViewType) => void;
  trip: any;
  seatCount: number;
  onComplete: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  savedCards: CreditCard[];
  onSaveCard: (card: Omit<CreditCard, 'id'>) => void;
  user: User | null;
}

const PaymentView: React.FC<Props> = ({ 
  onNavigate, 
  trip, 
  seatCount, 
  onComplete, 
  showToast,
  savedCards,
  onSaveCard,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const total = seatCount * (trip?.price || 25);

  const handlePayment = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    if (saveCard) {
      onSaveCard({
        number: cardNumber.slice(-4),
        holder: cardHolder,
        expiry: expiryDate,
        brand: 'visa',
      });
    }

    onComplete();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate(ViewType.SEAT_SELECTION)}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pago</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ruta</Text>
            <Text style={styles.summaryValue}>
              {trip?.origin} → {trip?.destination}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Asientos</Text>
            <Text style={styles.summaryValue}>{seatCount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Precio unitario</Text>
            <Text style={styles.summaryValue}>${trip?.price || 25}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Datos de Pago</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Número de Tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Titular de la Tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="JUAN PEREZ"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Fecha de Vencimiento</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={expiryDate}
                onChangeText={setExpiryDate}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setSaveCard(!saveCard)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkboxBox, saveCard && styles.checkboxChecked]}>
              {saveCard && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>Guardar tarjeta para futuros pagos</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Cards */}
        {savedCards.length > 0 && (
          <View style={styles.savedCardsCard}>
            <Text style={styles.savedCardsTitle}>Tarjetas Guardadas</Text>
            {savedCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.savedCard}
                onPress={() => {
                  setCardNumber(`**** **** **** ${card.number}`);
                  setCardHolder(card.holder);
                  setExpiryDate(card.expiry);
                }}
              >
                <Text style={styles.savedCardNumber}>**** **** **** {card.number}</Text>
                <Text style={styles.savedCardHolder}>{card.holder}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          activeOpacity={0.9}
        >
          <Text style={styles.payButtonText}>Pagar ${total.toFixed(2)} 💳</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  summaryCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryTotal: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2ecc71',
  },
  formCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  checkmark: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  savedCardsCard: {
    marginHorizontal: 24,
    marginBottom: 120,
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  savedCardsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  savedCard: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
  },
  savedCardNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  savedCardHolder: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
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
  payButton: {
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
  payButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
  },
});

export default PaymentView;
