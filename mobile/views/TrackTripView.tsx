import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  trip: any;
  onBack: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const TrackTripView: React.FC<Props> = ({ trip, onBack, showToast }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Rastrear Viaje</Text>
      <View style={styles.headerSpacer} />
    </View>
    <View style={styles.content}>
      <Text style={styles.mapPlaceholder}>🗺️</Text>
      <Text style={styles.mapText}>Mapa en tiempo real</Text>
      <View style={styles.infoCard}>
        <Text style={styles.route}>{trip?.origin} → {trip?.destination}</Text>
        <Text style={styles.status}>Estado: En ruta 🚌</Text>
        <Text style={styles.eta}>Llegada estimada: 2h 30min</Text>
      </View>
      <TouchableOpacity style={styles.refreshButton} onPress={() => showToast('Actualizado', 'success')}>
        <Text style={styles.refreshButtonText}>🔄 Actualizar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16 },
  backButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#FFFFFF' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 48 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  mapPlaceholder: { fontSize: 80, marginBottom: 16 },
  mapText: { fontSize: 16, fontWeight: '600', color: 'rgba(255, 255, 255, 0.4)', marginBottom: 40 },
  infoCard: { width: '100%', backgroundColor: '#1c1c1c', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 24 },
  route: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  status: { fontSize: 16, fontWeight: '600', color: '#2ecc71', marginBottom: 8 },
  eta: { fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.6)' },
  refreshButton: { width: '100%', height: 56, backgroundColor: '#2ecc71', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  refreshButtonText: { fontSize: 16, fontWeight: '900', color: '#000000' },
});
=======
  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sigue mi viaje en BusGo',
        text: `Estoy en un bus de ${trip?.company} hacia ${trip?.destination}. Sígueme aquí:`,
        url: window.location.href
      }).then(() => showToast("Enlace compartido", "success"))
      .catch(() => showToast("Error al compartir", "error"));
    } else {
      showToast("Enlace de seguimiento copiado", "success");
    }
  };

  const handlePanicButton = () => {
    showToast("SOS: Alerta enviada a contactos de emergencia y central BusGo", "error");
  };

  const toggleAlert = () => {
    setIsAlertEnabled(!isAlertEnabled);
    showToast(isAlertEnabled ? "Alerta de parada desactivada" : "Te avisaremos 10 min antes de llegar a la parada", "info");
  };

  return (
    <div className="flex flex-col h-full bg-background-dark font-sans">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md pt-12 border-b border-white/5">
        <div className="flex items-center px-4 pb-4 gap-4">
          <button 
            onClick={onBack}
            className="size-10 flex items-center justify-center rounded-full bg-white/5 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <div>
            <h2 className="text-white text-lg font-bold">Rastreo en Vivo</h2>
            <p className="text-[10px] text-[#2ecc71] font-bold uppercase tracking-widest">Bus {trip?.id?.slice(-4).toUpperCase() || 'E-452'}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 bg-[#0b0e14]">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
          
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
            <path 
              d="M 50 800 Q 150 600 300 400 T 200 100" 
              fill="transparent" 
              stroke="white" 
              strokeWidth="2" 
              strokeDasharray="8 8" 
              strokeOpacity="0.1"
            />
            <path 
              d="M 50 800 Q 150 600 240 480" 
              fill="transparent" 
              stroke="#2ECC71" 
              strokeWidth="3"
            />
            <circle cx="240" cy="480" r="12" fill="#2ECC71" className="animate-pulse shadow-lg shadow-emerald-500/50" />
            <circle cx="240" cy="480" r="4" fill="#141414" />
            
            {/* User Position Simulation */}
            <circle cx="210" cy="510" r="8" fill="#3B82F6" className="shadow-lg shadow-blue-500/50" />
            <circle cx="210" cy="510" r="2" fill="white" />
          </svg>

          <div className="absolute bottom-[10%] left-[10%] text-center">
            <div className="size-4 rounded-full bg-white mb-2 mx-auto"></div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{trip?.origin}</p>
          </div>
          <div className="absolute top-[10%] right-[40%] text-center">
            <div className="size-4 border-2 border-white rounded-full mb-2 mx-auto"></div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{trip?.destination}</p>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex flex-col gap-3">
          <button 
            onClick={handleShareTrip}
            className="size-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-2xl"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
          <button 
            onClick={toggleAlert}
            className={`size-12 backdrop-blur-xl border rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-2xl ${isAlertEnabled ? 'bg-[#2ecc71] text-black border-[#2ecc71]' : 'bg-white/10 text-white border-white/10'}`}
          >
            <span className="material-symbols-outlined">{isAlertEnabled ? 'notifications_active' : 'notifications'}</span>
          </button>
        </div>

        <button 
          onClick={handlePanicButton}
          className="absolute bottom-40 right-6 size-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined font-black">emergency</span>
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="bg-[#1c1c1c] border border-white/5 rounded-[2rem] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-[#2ecc71]/10 border border-[#2ecc71]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#2ecc71]">near_me</span>
                </div>
                <div>
                  <p className="text-white font-bold text-base">Próxima Parada</p>
                  <p className="text-neutral-500 text-xs font-medium">Alausí, Chimborazo • 15 min</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#2ecc71] font-black text-xl">45%</p>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">En Ruta</p>
              </div>
            </div>

            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-[#2ecc71] rounded-full shadow-[0_0_12px_rgba(46,204,113,0.5)] transition-all duration-1000" style={{ width: '45%' }}></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                <span className="material-symbols-outlined text-neutral-500 text-sm">schedule</span>
                <div>
                  <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">Llegada</p>
                  <p className="text-white font-bold text-sm">05:45 PM</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                <span className="material-symbols-outlined text-neutral-500 text-sm">speed</span>
                <div>
                  <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">Velocidad</p>
                  <p className="text-white font-bold text-sm">82 km/h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
>>>>>>> origin/develop

export default TrackTripView;
