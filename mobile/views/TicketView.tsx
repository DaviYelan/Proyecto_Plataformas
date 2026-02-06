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
<<<<<<< HEAD
            <Text style={styles.actionButtonText}>💾 Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showToast('Compartido', 'success')}
=======
            <span className="material-symbols-outlined text-lg">share</span>
          </button>
          <button 
            onClick={() => onNavigate(View.HOME)}
            className="text-black font-bold text-sm px-4 py-2 bg-[#2ecc71] rounded-full active:scale-95 transition-transform hover:bg-[#27ae60]"
>>>>>>> origin/develop
          >
            <Text style={styles.actionButtonText}>📤 Compartir</Text>
          </TouchableOpacity>
        </View>

<<<<<<< HEAD
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => onNavigate(ViewType.HOME)}
        >
          <Text style={styles.homeButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
=======
      <div className="flex-1 px-6 pb-32 overflow-y-auto hide-scrollbar flex flex-col items-center">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500">
          <div className="p-7 bg-[#2ecc71] text-black relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-9xl -rotate-12">directions_bus</span>
            </div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Transporte Premium</span>
                <span className="text-xl font-black">{trip?.company || 'BusGo Express'}</span>
              </div>
              <div className="size-14 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/20">
                <img src={trip?.logoUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop'} alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex flex-col">
                <span className="text-3xl font-black">{trip?.origin?.slice(0, 3).toUpperCase() || 'UIO'}</span>
                <span className="text-[10px] font-extrabold uppercase opacity-60">{trip?.origin || 'Origen'}</span>
              </div>
              <div className="flex-1 px-4 flex flex-col items-center">
                <div className="w-full border-t-2 border-primary/20 relative">
                  <span className="material-symbols-outlined absolute left-1/2 -translate-x-1/2 -top-3 text-2xl">arrow_forward</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black">{trip?.destination?.slice(0, 3).toUpperCase() || 'GYE'}</span>
                <span className="text-[10px] font-extrabold uppercase opacity-60 text-right">{trip?.destination || 'Destino'}</span>
              </div>
            </div>
          </div>

          <div className="relative h-8 bg-white flex items-center px-6">
            <div className="absolute -left-4 size-8 rounded-full bg-background-dark"></div>
            <div className="absolute -right-4 size-8 rounded-full bg-background-dark"></div>
            <div className="w-full border-t-[3px] border-dotted border-neutral-100"></div>
          </div>

          <div className="p-8 space-y-8 bg-white text-primary">
            <div className="grid grid-cols-2 gap-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Fecha</p>
                <p className="text-base font-bold">{date}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Embarque</p>
                <p className="text-base font-bold">{trip?.departureTime || 'Horario'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Pasajero</p>
                <p className="text-base font-bold">Viajero Verificado</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Asientos</p>
                <div className="flex flex-wrap gap-1 justify-end">
                  {seats.length > 0 ? seats.map(s => (
                    <span key={s} className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-md font-bold">{s}</span>
                  )) : <span className="text-neutral-300">--</span>}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center pt-4">
              <div className="size-52 bg-neutral-50 rounded-[2rem] p-6 flex items-center justify-center border border-neutral-100 mb-4 shadow-inner relative overflow-hidden">
                <img 
                  src={qrImageUrl} 
                  alt="QR Ticket" 
                  className="size-40 object-contain"
                  onLoad={() => console.log("QR cargado correctamente")}
                />
                <div className={`absolute -bottom-2 px-4 py-1 rounded-full border shadow-sm flex items-center gap-1.5 transition-colors ${trip?.isOfflineAvailable ? 'bg-[#2ecc71] border-[#2ecc71]' : 'bg-white border-neutral-100'}`}>
                   <div className={`size-1.5 rounded-full ${trip?.isOfflineAvailable ? 'bg-black' : 'bg-[#2ecc71]'}`}></div>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${trip?.isOfflineAvailable ? 'text-black' : 'text-neutral-500'}`}>
                      {trip?.isOfflineAvailable ? 'Disponible Offline' : 'Listo para Sincronizar'}
                   </span>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">BG-{ticketId.split('-')[1]}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 w-full max-w-sm">
           <button 
            onClick={handleDownloadClick}
            className={`flex-1 h-14 border rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all ${trip?.isOfflineAvailable ? 'bg-accent-green/10 border-accent-green/30 text-accent-green' : 'bg-white/5 border-white/10 text-white'}`}
           >
              <span className="material-symbols-outlined">{trip?.isOfflineAvailable ? 'cloud_done' : 'download'}</span>
              <span className="text-xs font-bold uppercase tracking-wider">{trip?.isOfflineAvailable ? 'Guardado' : 'Guardar'}</span>
           </button>
           <button 
            onClick={() => onNavigate(View.HELP_CENTER)}
            className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
           >
              <span className="material-symbols-outlined text-white">support_agent</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Ayuda</span>
           </button>
        </div>
      </div>
    </div>
>>>>>>> origin/develop
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
