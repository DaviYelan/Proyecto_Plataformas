<<<<<<< HEAD
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
=======

import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { View, BusTrip, CreditCard, User } from '../types';
import { apiService } from '../services/apiService';
>>>>>>> origin/develop

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

<<<<<<< HEAD
const PaymentView: React.FC<Props> = ({ 
  onNavigate, 
  trip, 
  seatCount, 
  onComplete, 
  showToast,
  savedCards,
  onSaveCard,
}) => {
=======
const PaymentView: React.FC<Props> = ({ onNavigate, trip, seatCount, onComplete, showToast, savedCards, onSaveCard, user }) => {
  const { isDarkMode } = useTheme();
  const totalPrice = (trip?.price || 0) * seatCount;
  const [isProcessing, setIsProcessing] = useState(false);
>>>>>>> origin/develop
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
<<<<<<< HEAD
  const [saveCard, setSaveCard] = useState(false);
=======
  const [cardholder, setCardholder] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | 'new'>('new');
  const [backendCards, setBackendCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar tarjetas guardadas del backend
  useEffect(() => {
    const loadBackendCards = async () => {
      if (!user) {
        console.log('[PAYMENT] No user logged in');
        setLoading(false);
        return;
      }
      
      console.log('[PAYMENT] Loading cards for user:', user.email);
      
      try {
        const response = await apiService.get('/persona/lista');
        console.log('[PAYMENT] API Response:', response);
        const personas = response.data?.personas || response.personas || response.data || [];
        console.log('[PAYMENT] Total personas:', personas.length);
        
        // Buscar todas las personas con este correo y tomar la que tenga metodo_pago
        const userPersonas = personas.filter((p: any) => p.correo === user.email);
        console.log('[PAYMENT] Personas encontradas con este correo:', userPersonas.length);
        
        const userFound = userPersonas.find((p: any) => p.metodo_pago?.numero_tarjeta) || userPersonas[0];
        console.log('[PAYMENT] Persona seleccionada:', userFound);
        
        if (userFound?.metodo_pago?.numero_tarjeta) {
          console.log('[PAYMENT] Backend card found:', userFound.metodo_pago);
          const metodo_pago = userFound.metodo_pago;
          // Limpiar el número de tarjeta de guiones y espacios, luego tomar los últimos 4
          const cleanCardNumber = metodo_pago.numero_tarjeta.replace(/[-\s]/g, '');
          console.log('[PAYMENT] Clean card number:', cleanCardNumber);
          const lastFour = cleanCardNumber.slice(-4);
          console.log('[PAYMENT] Last 4 digits:', lastFour);
          
          const card: CreditCard = {
            id: `backend-${metodo_pago.id_pago || Date.now()}`,
            number: lastFour,
            holder: metodo_pago.titular || 'Titular',
            expiry: metodo_pago.fecha_vencimiento || 'MM/YY',
            brand: 'visa' // Por defecto
          };
          console.log('[PAYMENT] Card object created:', card);
          setBackendCards([card]);
          // Auto-seleccionar la tarjeta del backend si existe
          setSelectedCardId(card.id);
        } else {
          console.log('[PAYMENT] No backend card found for user - metodo_pago:', userFound?.metodo_pago);
          setBackendCards([]);
        }
      } catch (error) {
        console.error('[PAYMENT] Error loading backend cards:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBackendCards();
  }, [user]);
>>>>>>> origin/develop

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

<<<<<<< HEAD
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
=======
  // Combinar tarjetas del backend y localStorage
  const allCards = [...backendCards, ...savedCards];
  
  console.log('[PAYMENT RENDER] backendCards:', backendCards);
  console.log('[PAYMENT RENDER] savedCards:', savedCards);
  console.log('[PAYMENT RENDER] allCards:', allCards);
  console.log('[PAYMENT RENDER] user:', user);
  console.log('[PAYMENT RENDER] loading:', loading);
  
  // Si se seleccionó una tarjeta guardada, no se necesita validar el formulario
  const isFormValid = selectedCardId !== 'new' || (cardNumber.length === 16 && expiryDate.length === 5 && cvv.length === 3 && cardholder);

  return (
    <div className={`flex flex-col h-full overflow-hidden font-sans ${isDarkMode ? 'bg-[#141414] text-white' : 'bg-white text-black'}`}>
      <header className={`flex items-center p-4 pt-12 pb-4 border-b ${isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-gray-200'}`}>
        <button 
          onClick={() => onNavigate(View.SEAT_SELECTION)}
          className="bg-[#2ecc71] text-black flex size-12 items-center justify-center cursor-pointer rounded-xl hover:bg-[#27ae60] active:scale-95 transition-all shadow-lg shadow-[#2ecc71]/30"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
        </button>
        <h2 className={`text-[18px] font-bold flex-1 text-center pr-12 tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Pago Seguro</h2>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 pb-32">
        <div className="mb-8">
          <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-4 ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Resumen de Pedido</h3>
          <div className={`rounded-2xl p-6 border space-y-4 shadow-xl ${isDarkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className={`text-[17px] font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{trip?.origin} → {trip?.destination}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>
                  {trip?.company} • {trip?.class}
                </p>
              </div>
            </div>
            <div className={`h-[1px] ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}></div>
            <div className="space-y-3 pt-1">
              <div className="flex justify-between text-[14px]">
                <span className={`font-medium ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>Tickets ({seatCount}x)</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Total a Pagar</span>
                <span className="text-[#2ecc71] text-[20px] font-black">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Método de Pago</h3>
          
          {/* Tarjetas Guardadas (Backend + localStorage) */}
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="material-symbols-outlined animate-spin text-[#2ecc71] text-[32px]">refresh</span>
            </div>
          ) : allCards.length > 0 ? (
            <div className="space-y-3">
              {allCards.map(card => (
                <button 
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedCardId === card.id ? 'bg-[#2ecc71]/10 border-[#2ecc71]' : isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`}>credit_card</span>
                    <div className="text-left">
                      <p className={`text-sm font-bold uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>{card.brand} •••• {card.number}</p>
                      <p className={`text-[10px] font-medium uppercase ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{card.holder}</p>
                    </div>
                  </div>
                  {selectedCardId === card.id && (
                    <span className="material-symbols-outlined text-[#2ecc71]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          ) : null}

          <button 
            onClick={() => setSelectedCardId('new')}
            className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${selectedCardId === 'new' ? 'bg-[#2ecc71]/10 border-[#2ecc71]' : isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-gray-50 border-gray-200'}`}
          >
            <span className={`material-symbols-outlined ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`}>add</span>
            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Usar Nueva Tarjeta</span>
          </button>

          {selectedCardId === 'new' && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <p className={`text-[13px] font-bold ml-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Nombre del Titular</p>
                <input 
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                  className={`w-full h-14 border rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#2ecc71] transition-colors ${isDarkMode ? 'bg-[#1c1c1c] border-white/10 text-white placeholder:text-neutral-600' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
                  placeholder="Juan Perez" 
                />
              </div>
              <div className="space-y-2">
                <p className={`text-[13px] font-bold ml-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Número de Tarjeta</p>
                <input 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  type="text"
                  inputMode="numeric"
                  className={`w-full h-14 border rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#2ecc71] transition-colors ${isDarkMode ? 'bg-[#1c1c1c] border-white/10 text-white placeholder:text-neutral-600' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
                  placeholder="1234 5678 9101 1121" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  className={`h-14 border rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#2ecc71] ${isDarkMode ? 'bg-[#1c1c1c] border-white/10 text-white' : 'bg-white border-gray-200 text-black'}`}
                  placeholder="MM/YY" 
                />
                <input 
                  value={cvv}
                  onChange={handleCvvChange}
                  className={`h-14 border rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#2ecc71] ${isDarkMode ? 'bg-[#1c1c1c] border-white/10 text-white' : 'bg-white border-gray-200 text-black'}`}
                  placeholder="CVV" 
                />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer group pt-2">
                <div className={`size-6 rounded-md border flex items-center justify-center transition-all ${saveForFuture ? 'bg-[#2ecc71] border-[#2ecc71]' : isDarkMode ? 'border-white/10' : 'border-gray-300'}`}>
                  {saveForFuture && <span className="material-symbols-outlined text-black text-sm font-bold">check</span>}
                  <input type="checkbox" className="hidden" checked={saveForFuture} onChange={() => setSaveForFuture(!saveForFuture)} />
                </div>
                <span className={`text-xs font-medium select-none ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}>Guardar esta tarjeta para futuros viajes</span>
              </label>
            </div>
          )}
        </div>
        
        {/* Botón de Pagar Movido Aquí */}
        <div className="mt-8 pb-6">
          <button 
            disabled={isProcessing || !isFormValid}
            onClick={handlePayment}
            className="w-full h-16 bg-[#2ecc71] text-black font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#2ecc71]/50 hover:bg-[#27ae60] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined animate-spin">refresh</span>
                 <span>Procesando Pago...</span>
              </div>
            ) : `PAGAR $${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </div>

    </div>
>>>>>>> origin/develop
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
