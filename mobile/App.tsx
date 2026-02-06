<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View as RNView, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
=======

import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './ThemeContext';
>>>>>>> origin/develop
import { View, User, SearchCriteria, ToastMessage, CreditCard, BusTrip } from './types';
import { apiService } from './services/apiService';
import WelcomeView from './views/WelcomeView';
import RegisterView from './views/RegisterView';
import HomeView from './views/HomeView';
import ResultsView from './views/ResultsView';
import SeatSelectionView from './views/SeatSelectionView';
import PaymentView from './views/PaymentView';
import TicketView from './views/TicketView';
import AIChatView from './views/AIChatView';
import ProfileView from './views/ProfileView';
import MyTripsView from './views/MyTripsView';
import NotificationsView from './views/NotificationsView';
import HelpCenterView from './views/HelpCenterView';
import PersonalInfoView from './views/PersonalInfoView';
import PaymentMethodsView from './views/PaymentMethodsView';
import TrackTripView from './views/TrackTripView';

// Client ID de Google OAuth del backend
const GOOGLE_CLIENT_ID = "398023968695-nachrecn38n44ge4voflia7m2g553p2v.apps.googleusercontent.com";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.WELCOME);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    origin: 'Quito',
    destination: 'Guayaquil',
    date: '27 Jan, 2026'
  });
  const [savedCards, setSavedCards] = useState<CreditCard[]>([]);
  const [myTrips, setMyTrips] = useState<BusTrip[]>([]);

<<<<<<< HEAD
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedCards = await AsyncStorage.getItem('savedCards');
        const storedTrips = await AsyncStorage.getItem('myTrips');
        if (storedCards) {
          try {
            setSavedCards(JSON.parse(storedCards));
          } catch (e) {
            console.error('Error parsing cards:', e);
          }
        }
        if (storedTrips) {
          try {
            setMyTrips(JSON.parse(storedTrips));
          } catch (e) {
            console.error('Error parsing trips:', e);
          }
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    const timer = setTimeout(loadStoredData, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saveCards = async () => {
      if (savedCards.length > 0) {
        try {
          await AsyncStorage.setItem('savedCards', JSON.stringify(savedCards));
        } catch (error) {
          console.error('Error saving cards:', error);
        }
      }
    };
    saveCards();
  }, [savedCards]);

  useEffect(() => {
    const saveTrips = async () => {
      if (myTrips.length > 0) {
        try {
          await AsyncStorage.setItem('myTrips', JSON.stringify(myTrips));
        } catch (error) {
          console.error('Error saving trips:', error);
        }
      }
    };
    saveTrips();
  }, [myTrips]);

  useEffect(() => {
    if (user && currentView === View.WELCOME) {
      setCurrentView(View.HOME);
    }
  }, [user, currentView]);
=======
  // Cargar datos guardados al iniciar
  useEffect(() => {
    const storedCards = localStorage.getItem('savedCards');
    const storedTrips = localStorage.getItem('myTrips');
    if (storedCards) setSavedCards(JSON.parse(storedCards));
    if (storedTrips) setMyTrips(JSON.parse(storedTrips));
  }, []);

  // Guardar tarjetas cuando cambien
  useEffect(() => {
    if (savedCards.length > 0) {
      localStorage.setItem('savedCards', JSON.stringify(savedCards));
    }
  }, [savedCards]);

  // Guardar viajes cuando cambien
  useEffect(() => {
    if (myTrips.length > 0) {
      localStorage.setItem('myTrips', JSON.stringify(myTrips));
    }
  }, [myTrips]);
>>>>>>> origin/develop

  const handleSaveCard = (card: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = {
      ...card,
      id: Date.now().toString()
    };
    setSavedCards(prev => [...prev, newCard]);
    showToast('Tarjeta guardada exitosamente', 'success');
  };

  const handleDeleteCard = (cardId: string) => {
    setSavedCards(prev => prev.filter(c => c.id !== cardId));
    showToast('Tarjeta eliminada', 'info');
  };

  const handleCompletePayment = async () => {
    if (selectedTrip && selectedSeats.length > 0 && user) {
      try {
<<<<<<< HEAD
        const personasResponse = await apiService.get('/persona/lista');
        const personas = personasResponse.data?.personas || personasResponse.personas || personasResponse.data || [];
        const persona = personas.find((p: any) => p.correo === user.email);

=======
        console.log('[PAYMENT] Obteniendo datos de persona y turno...');
        
        // Obtener datos completos de la persona
        const personasResponse = await apiService.get('/persona/lista');
        const personas = personasResponse.data?.personas || personasResponse.personas || personasResponse.data || [];
        const persona = personas.find((p: any) => p.correo === user.email);
        
>>>>>>> origin/develop
        if (!persona) {
          showToast('Error: No se encontró el usuario', 'error');
          return;
        }
<<<<<<< HEAD

=======
        
        console.log('[PAYMENT] Persona encontrada:', persona);
        console.log('[PAYMENT] ID de persona:', persona.id_persona);
        
>>>>>>> origin/develop
        if (!persona.id_persona) {
          showToast('Error: El usuario no tiene ID válido', 'error');
          return;
        }
<<<<<<< HEAD

        const turnosResponse = await apiService.get('/turno/lista');
        const turnos = turnosResponse.data?.turnos || turnosResponse.turnos || turnosResponse.data || [];

=======
        
        // Obtener turnos disponibles para esta ruta
        const turnosResponse = await apiService.get('/turno/lista');
        const turnos = turnosResponse.data?.turnos || turnosResponse.turnos || turnosResponse.data || [];
        console.log('[PAYMENT] Total turnos:', turnos.length);
        console.log('[PAYMENT] Buscando turno para ruta ID:', selectedTrip.id);
        console.log('[PAYMENT] Origen:', selectedTrip.origin, 'Destino:', selectedTrip.destination);
        
        // Buscar turno que tenga un horario con la ruta seleccionada (por ID o por origen/destino)
>>>>>>> origin/develop
        const turno = turnos.find((t: any) => {
          const rutaId = t.horario?.ruta?.id_ruta?.toString();
          const rutaOrigen = t.horario?.ruta?.origen;
          const rutaDestino = t.horario?.ruta?.destino;
          const estadoTurno = t.estado_turno;
<<<<<<< HEAD

          const coincideId = rutaId === selectedTrip.id;
          const coincideRuta = rutaOrigen === selectedTrip.origin && rutaDestino === selectedTrip.destination;

          return (coincideId || coincideRuta) && estadoTurno === 'Disponible';
        });

        if (!turno) {
          showToast('Error: No hay turnos disponibles para esta ruta', 'error');
          return;
        }

        const asientosNumeros = selectedSeats.map(seat => parseInt(seat));

=======
          
          // Coincidir por ID exacto O por origen/destino
          const coincideId = rutaId === selectedTrip.id;
          const coincideRuta = rutaOrigen === selectedTrip.origin && rutaDestino === selectedTrip.destination;
          
          return (coincideId || coincideRuta) && estadoTurno === 'Disponible';
        });
        
        console.log('[PAYMENT] Turno encontrado:', turno);
        
        if (!turno) {
          console.log('[PAYMENT] No se encontró turno disponible');
          showToast('Error: No hay turnos disponibles para esta ruta', 'error');
          return;
        }
        
        // Crear boleto con la estructura correcta del backend
        const fechaActual = new Date();
        const fechaFormateada = `${String(fechaActual.getDate()).padStart(2, '0')}/${String(fechaActual.getMonth() + 1).padStart(2, '0')}/${fechaActual.getFullYear()}`;
        
        // Convertir asientos a números
        const asientosNumeros = selectedSeats.map(seat => parseInt(seat));
        
>>>>>>> origin/develop
        const boletoData = {
          persona: {
            id_persona: persona.id_persona
          },
          turno: {
            id_turno: turno.id_turno
          },
          asientos: asientosNumeros,
          precio_unitario: selectedTrip.price
        };
<<<<<<< HEAD

        await apiService.post('/boleto/guardar', boletoData);

=======
        
        console.log('[PAYMENT] Enviando boleto:', boletoData);
        console.log('[PAYMENT] Asientos:', asientosNumeros);
        console.log('[PAYMENT] Precio unitario:', selectedTrip.price);
        await apiService.post('/boleto/guardar', boletoData);
        
>>>>>>> origin/develop
        const newTrip: BusTrip = {
          ...selectedTrip,
          bookedSeats: selectedSeats,
          bookingDate: new Date().toISOString(),
          status: 'confirmed'
        };
        setMyTrips(prev => [...prev, newTrip]);
        showToast('¡Pago exitoso! Boleto guardado', 'success');
        setCurrentView(View.TICKET);
      } catch (error) {
        console.error('Error al guardar boleto:', error);
        showToast('Error al procesar el pago', 'error');
      }
    }
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const renderView = () => {
    switch (currentView) {
      case View.WELCOME:
        return <WelcomeView onNavigate={setCurrentView} onLogin={setUser} showToast={showToast} />;
      case View.REGISTER:
        return <RegisterView onNavigate={setCurrentView} onBack={() => setCurrentView(View.WELCOME)} showToast={showToast} />;
      case View.HOME:
        return <HomeView onNavigate={setCurrentView} searchCriteria={searchCriteria} onSearchUpdate={setSearchCriteria} user={user} />;
      case View.RESULTS:
<<<<<<< HEAD
        return <ResultsView onNavigate={setCurrentView} searchCriteria={searchCriteria} onSelectTrip={(trip) => {
          setSelectedTrip(trip);
          setSelectedSeats([]);
          setCurrentView(View.SEAT_SELECTION);
=======
        return <ResultsView onNavigate={setCurrentView} searchCriteria={searchCriteria} onSelectTrip={(trip) => { 
          setSelectedTrip(trip); 
          setSelectedSeats([]); // Limpiar asientos seleccionados al elegir un nuevo viaje
          setCurrentView(View.SEAT_SELECTION); 
>>>>>>> origin/develop
        }} />;
      case View.SEAT_SELECTION:
        return <SeatSelectionView onNavigate={setCurrentView} trip={selectedTrip} onSeatsChange={setSelectedSeats} selectedSeats={selectedSeats} />;
      case View.PAYMENT:
        return <PaymentView onNavigate={setCurrentView} trip={selectedTrip} seatCount={selectedSeats.length} onComplete={handleCompletePayment} showToast={showToast} savedCards={savedCards} onSaveCard={handleSaveCard} user={user} />;
      case View.TICKET:
        return <TicketView onNavigate={setCurrentView} trip={selectedTrip} seats={selectedSeats} date={searchCriteria.date} showToast={showToast} onDownload={() => {}} />;
      case View.AI_CHAT:
        return <AIChatView onNavigate={setCurrentView} />;
      case View.PROFILE:
        return <ProfileView onNavigate={setCurrentView} user={user} onLogout={() => { setUser(null); setCurrentView(View.WELCOME); }} />;
      case View.MY_TRIPS:
        return <MyTripsView onNavigate={setCurrentView} myTrips={myTrips} onSelectTrip={(trip) => { setSelectedTrip(trip); setSelectedSeats(trip.bookedSeats || []); setCurrentView(View.TICKET); }} onTrackTrip={(trip) => { setSelectedTrip(trip); setCurrentView(View.TRACK_TRIP); }} user={user} />;
      case View.NOTIFICATIONS:
        return <NotificationsView onNavigate={setCurrentView} />;
      case View.HELP_CENTER:
        return <HelpCenterView onBack={() => setCurrentView(View.PROFILE)} onNavigate={setCurrentView} />;
      case View.PERSONAL_INFO:
        return <PersonalInfoView onBack={() => setCurrentView(View.PROFILE)} user={user} />;
      case View.PAYMENT_METHODS:
        return <PaymentMethodsView onBack={() => setCurrentView(View.PROFILE)} savedCards={savedCards} onSaveCard={handleSaveCard} onDeleteCard={handleDeleteCard} user={user} />;
      case View.TRACK_TRIP:
        return <TrackTripView trip={selectedTrip} onBack={() => setCurrentView(View.MY_TRIPS)} showToast={showToast} />;
      default:
        return <WelcomeView onNavigate={setCurrentView} onLogin={setUser} showToast={showToast} />;
    }
  };

  return (
<<<<<<< HEAD
    <SafeAreaView style={styles.container}>
      <RNView style={styles.mainContainer}>
        {toast && (
          <RNView style={styles.toastContainer}>
            <RNView style={[
              styles.toast,
              toast.type === 'success' ? styles.toastSuccess : styles.toastInfo
            ]}>
              <Text style={styles.toastText}>{toast.text}</Text>
            </RNView>
          </RNView>
        )}
        <RNView style={styles.contentContainer}>
          {renderView()}
        </RNView>
      </RNView>
    </SafeAreaView>
=======
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <div className="flex justify-center items-center min-h-screen bg-black">
          <div className="relative w-full max-w-[430px] h-screen sm:h-[932px] overflow-hidden bg-[#0A0A0A] shadow-2xl flex flex-col font-sans border-x border-white/5 animate-fade-in">
            {toast && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[200] w-[85%]">
                <div className={`px-5 py-4 rounded-2xl bg-black/80 backdrop-blur-xl border flex items-center gap-3 ${
                  toast.type === 'success' ? 'border-accent-green/30 text-accent-green' : 'text-white border-white/10'
                }`}>
                  <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'info'}</span>
                  <p className="text-sm font-bold">{toast.text}</p>
                </div>
              </div>
            )}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {renderView()}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </GoogleOAuthProvider>
>>>>>>> origin/develop
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  toastContainer: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 200,
    paddingHorizontal: 30,
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 1,
    width: '100%'
  },
  toastSuccess: {
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  toastInfo: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
});

export default App;
