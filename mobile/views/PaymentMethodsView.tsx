<<<<<<< HEAD
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CreditCard, User } from '../types';
=======

import React, { useState, useEffect } from 'react';
import { CreditCard, User } from '../types';
import { apiService } from '../services/apiService';
>>>>>>> origin/develop

interface Props {
  onBack: () => void;
  savedCards: CreditCard[];
  onSaveCard: (card: Omit<CreditCard, 'id'>) => void;
<<<<<<< HEAD
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
=======
  onDeleteCard: (id: string) => void;
  user: User | null;
}

const PaymentMethodsView: React.FC<Props> = ({ onBack, savedCards, onSaveCard, onDeleteCard, user }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', holder: '', expiry: '', cvv: '', brand: 'visa' as const });
  const [backendCards, setBackendCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar tarjetas del backend al montar
  useEffect(() => {
    const loadCardsFromBackend = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        console.log('[CARDS] Cargando tarjetas para usuario:', user.email);
        const response = await apiService.get('/persona/lista');
        const personas = response.data || response.personas || [];
        
        const userFound = personas.find((p: any) => 
          p.correo === user.email || p.cuenta?.correo === user.email
        );

        if (userFound && userFound.metodo_pago) {
          const metodoPago = userFound.metodo_pago;
          
          // Solo mostrar si tiene una tarjeta guardada
          if (metodoPago.numero_tarjeta && metodoPago.numero_tarjeta !== '') {
            const card: CreditCard = {
              id: `backend-${metodoPago.id_pago || '1'}`,
              number: metodoPago.numero_tarjeta.slice(-4),
              holder: metodoPago.titular || 'Titular',
              expiry: metodoPago.fecha_vencimiento || 'MM/YY',
              brand: 'visa'
            };
            setBackendCards([card]);
            console.log('[CARDS] Tarjeta cargada desde backend:', card);
          }
        } else {
          console.log('[CARDS] No se encontraron tarjetas para el usuario');
        }
      } catch (error) {
        console.error('[CARDS] Error al cargar tarjetas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCardsFromBackend();
  }, [user]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      alert('Debes iniciar sesión para guardar una tarjeta');
      return;
    }

    try {
      console.log('[CARDS] Guardando tarjeta en backend...');
      
      // Buscar el usuario en el backend
      const response = await apiService.get('/persona/lista');
      const personas = response.data || response.personas || [];
      
      const userFound = personas.find((p: any) => 
        p.correo === user.email || p.cuenta?.correo === user.email
      );

      if (userFound) {
        // Actualizar el método de pago del usuario
        const updatedPersona = {
          ...userFound,
          metodo_pago: {
            ...userFound.metodo_pago,
            numero_tarjeta: newCard.number,
            titular: newCard.holder,
            fecha_vencimiento: newCard.expiry,
            codigo_seguridad: newCard.cvv,
            opcion_pago: 'Tarjeta_credito'
          }
        };

        await apiService.put(`/persona/modificar/${userFound.id_persona}`, updatedPersona);
        
        // Actualizar la lista local
        const savedCard: CreditCard = {
          id: `backend-${userFound.metodo_pago?.id_pago || Date.now()}`,
          number: newCard.number.slice(-4),
          holder: newCard.holder,
          expiry: newCard.expiry,
          brand: newCard.brand
        };
        
        setBackendCards([savedCard]);
        console.log('[CARDS] Tarjeta guardada exitosamente en backend');
      }
      
      setShowAddForm(false);
      setNewCard({ number: '', holder: '', expiry: '', cvv: '', brand: 'visa' });
    } catch (error) {
      console.error('[CARDS] Error al guardar tarjeta:', error);
      alert('Error al guardar la tarjeta. Intenta de nuevo.');
    }
  };

  const handleDeleteCardLocal = async (cardId: string) => {
    if (!user?.email) return;

    try {
      console.log('[CARDS] Eliminando tarjeta:', cardId);
      
      // Si es una tarjeta del backend, actualizarla
      if (cardId.startsWith('backend-')) {
        const response = await apiService.get('/persona/lista');
        const personas = response.data || response.personas || [];
        
        const userFound = personas.find((p: any) => 
          p.correo === user.email || p.cuenta?.correo === user.email
        );

        if (userFound) {
          const updatedPersona = {
            ...userFound,
            metodo_pago: {
              ...userFound.metodo_pago,
              numero_tarjeta: '',
              titular: '',
              fecha_vencimiento: '',
              codigo_seguridad: ''
            }
          };

          await apiService.put(`/persona/modificar/${userFound.id_persona}`, updatedPersona);
          setBackendCards([]);
          console.log('[CARDS] Tarjeta eliminada del backend');
        }
      }
      
      onDeleteCard(cardId);
    } catch (error) {
      console.error('[CARDS] Error al eliminar tarjeta:', error);
      alert('Error al eliminar la tarjeta');
    }
  };

  // Combinar tarjetas locales y del backend
  const allCards = [...backendCards, ...savedCards.filter(c => !c.id.startsWith('backend-'))];


  return (
    <div className="flex flex-col h-full bg-background-dark font-sans relative">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md pt-12 border-b border-white/5">
        <div className="flex items-center px-4 pb-4 gap-4">
          <button 
            onClick={onBack}
            className="size-10 flex items-center justify-center rounded-full bg-white/5 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <h2 className="text-white text-lg font-bold">Métodos de Pago</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar pb-32">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Tus Tarjetas Guardadas</h3>
          
          {loading ? (
            <div className="text-center py-8 text-neutral-500">
              <span className="text-sm">Cargando tarjetas...</span>
            </div>
          ) : (
            <>
              {allCards.map(card => (
                <div key={card.id} className="relative h-48 w-full bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-8xl text-white">contactless</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteCardLocal(card.id)}
                    className="absolute top-4 right-4 z-20 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  <div className="flex flex-col h-full justify-between relative z-10">
                     <div className="flex justify-between items-start">
                        <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-white">credit_card</span>
                        </div>
                        <span className="text-white font-bold italic tracking-tighter uppercase">{card.brand}</span>
                     </div>
                     <div className="space-y-1">
                        <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Número de Tarjeta</p>
                        <p className="text-white text-lg font-mono tracking-[0.2em]">•••• •••• •••• {card.number}</p>
                     </div>
                     <div className="flex justify-between">
                        <div>
                          <p className="text-white/40 text-[8px] font-bold uppercase">Titular</p>
                          <p className="text-white text-xs font-bold uppercase">{card.holder}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-[8px] font-bold uppercase">Vence</p>
                          <p className="text-white text-xs font-bold">{card.expiry}</p>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!showAddForm ? (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full h-16 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-neutral-400 font-bold hover:border-accent-green hover:text-accent-green transition-all active:scale-95"
            >
               <span className="material-symbols-outlined">add_card</span>
               Agregar Nueva Tarjeta
            </button>
          ) : (
            <form onSubmit={handleAddCard} className="bg-surface-dark border border-white/10 rounded-3xl p-6 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="text-white font-bold text-sm">Nueva Tarjeta</h4>
                 <button type="button" onClick={() => setShowAddForm(false)} className="text-neutral-500">
                   <span className="material-symbols-outlined text-sm">close</span>
                 </button>
               </div>
               <div className="space-y-4">
                 <input 
                   required
                   placeholder="Número de Tarjeta" 
                   className="w-full bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                   value={newCard.number}
                   onChange={e => setNewCard({...newCard, number: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                 />
                 <input 
                   required
                   placeholder="Nombre del Titular" 
                   className="w-full bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                   value={newCard.holder}
                   onChange={e => setNewCard({...newCard, holder: e.target.value})}
                 />
                 <div className="grid grid-cols-2 gap-4">
                   <input 
                     required
                     placeholder="MM/YY" 
                     className="bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                     value={newCard.expiry}
                     onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                   />
                   <input 
                     required
                     placeholder="CVV" 
                     type="password"
                     maxLength={4}
                     className="bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                     value={newCard.cvv}
                     onChange={e => setNewCard({...newCard, cvv: e.target.value.replace(/\D/g, '')})}
                   />
                 </div>
                 <select 
                   className="w-full bg-background-dark border border-white/5 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent-green"
                   value={newCard.brand}
                   onChange={e => setNewCard({...newCard, brand: e.target.value as any})}
                 >
                   <option value="visa">Visa</option>
                   <option value="mastercard">Mastercard</option>
                   <option value="amex">Amex</option>
                 </select>
               </div>
               <button type="submit" className="w-full bg-accent-green text-primary h-12 rounded-xl font-bold mt-2 active:scale-95 transition-transform">
                 Guardar Tarjeta en Backend
               </button>
            </form>
          )}
        </div>

        <div className="pt-4 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Otros Métodos</h3>
          <div className="bg-surface-dark p-4 rounded-xl border border-white/5 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-400">payments</span>
                <span className="text-sm font-bold text-white">PayPal</span>
             </div>
             <span className="text-[10px] font-bold text-neutral-500 italic">Próximamente</span>
          </div>
        </div>
      </div>
    </div>
  );
};
>>>>>>> origin/develop

export default PaymentMethodsView;
