
import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { View, BusTrip, User } from '../types';
import { apiService } from '../services/apiService';

interface Props {
  onNavigate: (view: View) => void;
  onSelectTrip: (trip: BusTrip) => void;
  onTrackTrip: (trip: BusTrip) => void;
  myTrips: BusTrip[];
  user: User | null;
}

const MyTripsView: React.FC<Props> = ({ onNavigate, onSelectTrip, onTrackTrip, myTrips, user }) => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const { isDarkMode } = useTheme();
  const [backendTrips, setBackendTrips] = useState<BusTrip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTripsFromBackend();
    }
  }, [user]);

  const loadTripsFromBackend = async () => {
    if (!user?.email) {
      console.log('[TRIPS] No hay usuario autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[TRIPS] Cargando viajes para usuario:', user.email);
      console.log('[TRIPS] Objeto usuario completo:', user);
      
      // Primero obtener los datos del usuario para vincular sus boletos
      const personaResponse = await apiService.get('/persona/lista');
      console.log('[TRIPS] Respuesta de /persona/lista:', personaResponse);
      
      const personas = personaResponse.data || personaResponse.personas || personaResponse || [];
      console.log('[TRIPS] Total de personas encontradas:', personas.length);
      
      const userFound = personas.find((p: any) => 
        p.correo === user.email || p.cuenta?.correo === user.email
      );

      if (!userFound) {
        console.error('[TRIPS] Usuario NO encontrado en backend con email:', user.email);
        console.log('[TRIPS] Emails disponibles:', personas.map((p: any) => p.correo || p.cuenta?.correo));
        setLoading(false);
        return;
      }

      console.log('[TRIPS] ✓ Usuario encontrado, id_persona:', userFound.id_persona);
      console.log('[TRIPS] Datos del usuario:', userFound);

      // Cargar todos los boletos
      const boletosResponse = await apiService.get('/boleto/lista');
      console.log('[TRIPS] Respuesta de /boleto/lista:', boletosResponse);
      
      const boletos = boletosResponse.data || boletosResponse.boletos || boletosResponse || [];
      console.log('[TRIPS] Total de boletos en backend:', boletos.length);
      
      if (boletos.length > 0) {
        console.log('[TRIPS] Estructura del primer boleto:', boletos[0]);
      }
      
      // Filtrar solo los boletos de este usuario
      const userBoletos = boletos.filter((boleto: any) => {
        const boletoPersonaId = boleto.persona?.id_persona;
        const match = boletoPersonaId === userFound.id_persona;
        if (match) {
          console.log('[TRIPS] ✓ Boleto #' + boleto.id_boleto + ' coincide con usuario');
        }
        return match;
      });

      console.log('[TRIPS] ✓✓✓ Boletos del usuario:', userBoletos.length);
      
      if (userBoletos.length === 0) {
        console.warn('[TRIPS] ⚠ No se encontraron boletos para id_persona:', userFound.id_persona);
        setBackendTrips([]);
        setLoading(false);
        return;
      }

      // Convertir boletos a BusTrip y determinar si son pasados o próximos
      const trips: BusTrip[] = userBoletos.map((boleto: any) => {
        // Parsear la fecha del boleto (fecha_compra está en formato DD/MM/YYYY)
        const [day, month, year] = (boleto.fecha_compra || '01/01/2025').split('/');
        const tripDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Determinar si el viaje es pasado o próximo
        const isPast = tripDate < today;
        const status = isPast ? 'Completado' : 'Confirmado';

        // Obtener información de la ruta desde el turno
        const turno = boleto.turno;
        const horario = turno?.horario;
        const ruta = horario?.ruta;
        const bus = ruta?.bus;
        const cooperativa = bus?.cooperativa;

        return {
          id: boleto.id_boleto?.toString() || '',
          company: cooperativa?.nombre_cooperativa || 'BusGo Premium',
          logoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100',
          rating: 4.5,
          reviewsCount: 100,
          departureTime: horario?.hora_salida || '08:00 AM',
          arrivalTime: horario?.hora_llegada || '04:00 PM',
          duration: ruta?.tiempo_estimado || '8h',
          origin: ruta?.origen || 'Origen',
          destination: ruta?.destino || 'Destino',
          price: parseFloat(boleto.precio_final || '0'),
          class: 'Executive',
          amenities: [],
          bookedSeats: [boleto.numero_asiento?.toString() || '1'],
          bookingDate: new Date(tripDate).toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }),
          status: status,
          isOfflineAvailable: true
        };
      });
      
      setBackendTrips(trips);
      console.log('[TRIPS] Viajes cargados:', trips.length, '- Pasados:', trips.filter(t => t.status === 'Completado').length, '- Próximos:', trips.filter(t => t.status !== 'Completado').length);
    } catch (error) {
      console.error('[TRIPS] Error al cargar boletos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combinar viajes del localStorage con los del backend (evitar duplicados)
  const allTrips = [...backendTrips, ...myTrips.filter(mt => 
    !backendTrips.some(bt => bt.id === mt.id)
  )];
  
  const filteredTrips = allTrips.filter(t => 
    tab === 'upcoming' ? t.status !== 'Completado' : t.status === 'Completado'
  );

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-background-dark' : 'bg-white'} font-sans`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md pt-12 border-b ${isDarkMode ? 'bg-background-dark/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        <div className="px-6 pb-4">
          <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Mis Viajes</h2>
          <p className={`text-xs font-medium uppercase tracking-widest mt-1 ${isDarkMode ? 'text-neutral-500' : 'text-gray-500'}`}>Gestiona tus boletos</p>
        </div>
        
        <div className={`flex px-6 gap-8 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
          <button 
            onClick={() => setTab('upcoming')}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${tab === 'upcoming' ? 'text-[#2ecc71]' : 'text-neutral-500'}`}
          >
            Próximos
            {tab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2ecc71] rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setTab('past')}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${tab === 'past' ? 'text-[#2ecc71]' : 'text-neutral-500'}`}
          >
            Pasados
            {tab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2ecc71] rounded-t-full"></div>}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 pb-32 hide-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71] mb-4"></div>
            <p className="text-neutral-500 font-bold">Cargando viajes...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
            <span className="material-symbols-outlined text-6xl mb-4">no_travel</span>
            <p className="font-bold text-lg">No hay viajes registrados</p>
            <p className="text-sm text-neutral-600 mt-2">
              {!user ? 'Inicia sesión para ver tus viajes' : `En ${tab === 'upcoming' ? 'próximos' : 'pasados'}`}
            </p>
          </div>
        ) : (
          filteredTrips.map(trip => (
            <div key={trip.id} className="bg-[#1c1c1c] rounded-2xl p-5 border border-white/5 space-y-4 shadow-xl relative overflow-hidden">
              {trip.isOfflineAvailable && (
                <div className="absolute top-0 right-0 bg-accent-green/20 px-3 py-1 rounded-bl-xl border-l border-b border-accent-green/30 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-accent-green text-[14px]">offline_pin</span>
                  <span className="text-[8px] font-black text-accent-green uppercase tracking-tighter">Sincronizado</span>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
                    <img src={trip.logoUrl} alt={trip.company} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{trip.company}</h3>
                    <p className="text-[10px] text-accent-green font-bold uppercase tracking-widest">{trip.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">${trip.price.toFixed(2)}</p>
                  <p className="text-neutral-500 text-[10px] font-medium">{trip.bookingDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-lg font-black">{trip.origin}</p>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tighter">{trip.departureTime}</p>
                </div>
                <div className="flex-1 px-4 flex flex-col items-center opacity-30">
                  <div className="w-full h-px bg-white/10 relative">
                    <span className="material-symbols-outlined absolute left-1/2 -translate-x-1/2 -top-2.5 text-accent-green text-sm">directions_bus</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg font-black">{trip.destination}</p>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tighter">{trip.arrivalTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => onSelectTrip(trip)}
                  className="h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-lg">confirmation_number</span>
                  Boleto
                </button>
                {tab === 'upcoming' && (
                  <button 
                    onClick={() => onTrackTrip(trip)}
                    className="h-12 bg-accent-green/10 hover:bg-accent-green/20 border border-accent-green/20 rounded-xl text-accent-green text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-lg">map</span>
                    Rastrear
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] backdrop-blur-2xl border-t h-[84px] flex justify-around items-center px-4 pb-6 z-50 ${isDarkMode ? 'bg-background-dark/95 border-white/5' : 'bg-white/95 border-gray-200'}`}>
        <button onClick={() => onNavigate(View.HOME)} className={`flex flex-col items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">INICIO</span>
        </button>
        <button onClick={() => onNavigate(View.AI_CHAT)} className={`flex flex-col items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">BUSGO AI</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-[#2ecc71]">
          <span className="material-symbols-outlined text-[24px] fill-1">confirmation_number</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">VIAJES</span>
        </button>
        <button onClick={() => onNavigate(View.PROFILE)} className={`flex flex-col items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">PERFIL</span>
        </button>
      </div>
    </div>
  );
};

export default MyTripsView;
