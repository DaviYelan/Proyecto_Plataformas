
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import Destinations from './Destinations';
import Features from './Features';
import Footer from './Footer';
import TravelAssistant from './TravelAssistant';
import SearchResults from './SearchResults';
import MyTickets from './MyTickets';
import Help from './Help';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';
import { SearchParams, Trip, Ticket, User } from '../types';
import * as api from '../services/apiService';

// Mock Data for trips
const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    origin: 'Quito',
    destination: 'Guayaquil',
    departureTime: '08:30',
    arrivalTime: '16:30',
    duration: '8h 00m',
    price: 12.00,
    oldPrice: 15.00,
    operator: 'Trans Esmeraldas',
    type: 'Ejecutivo',
    seatsAvailable: 15,
    amenities: ['wifi', 'ac', '160']
  },
  {
    id: '2',
    origin: 'Quito',
    destination: 'Guayaquil',
    departureTime: '10:00',
    arrivalTime: '18:30',
    duration: '8h 30m',
    price: 10.50,
    operator: 'Flota Imbabura',
    type: 'Normal',
    seatsAvailable: 22,
    amenities: ['tv', 'usb']
  },
  {
    id: '3',
    origin: 'Quito',
    destination: 'Guayaquil',
    departureTime: '14:00',
    arrivalTime: '22:15',
    duration: '8h 15m',
    price: 13.00,
    operator: 'Panamericana',
    type: 'Servicio Plus',
    seatsAvailable: 8,
    amenities: ['wifi', 'wc', 'snack']
  },
  {
    id: '4',
    origin: 'Puyo',
    destination: 'Zamora',
    departureTime: '06:30',
    arrivalTime: '11:30',
    duration: '5h',
    price: 12.50,
    operator: 'Amazonas Express',
    type: 'Normal',
    seatsAvailable: 15,
    amenities: ['tv']
  },
  {
    id: '5',
    origin: 'Puyo',
    destination: 'Zamora',
    departureTime: '14:00',
    arrivalTime: '18:45',
    duration: '4h 45m',
    price: 15.00,
    operator: 'Touris San Francisco',
    type: 'Ejecutivo',
    seatsAvailable: 8,
    amenities: ['wifi', 'ac']
  },
  {
    id: '6',
    origin: 'Quito',
    destination: 'Baños de Agua Santa',
    departureTime: '07:00',
    arrivalTime: '10:30',
    duration: '3h 30m',
    price: 8.00,
    operator: 'Baños Express',
    type: 'Normal',
    seatsAvailable: 20,
    amenities: ['wifi', 'tv']
  },
  {
    id: '7',
    origin: 'Quito',
    destination: 'Cuenca',
    departureTime: '20:00',
    arrivalTime: '05:00',
    duration: '9h',
    price: 18.00,
    operator: 'Azuay Trans',
    type: 'Ejecutivo',
    seatsAvailable: 12,
    amenities: ['160', 'ac', 'snack']
  },
  {
    id: '8',
    origin: 'Quito',
    destination: 'Laguna de Quilotoa',
    departureTime: '06:00',
    arrivalTime: '09:30',
    duration: '3h 30m',
    price: 7.50,
    operator: 'Cotopaxi Tours',
    type: 'Normal',
    seatsAvailable: 25,
    amenities: ['usb']
  }
];

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'admin' | 'client'>('landing');
  
  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMyTickets, setShowMyTickets] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Data States
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams | null>(null);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [purchasedTickets, setPurchasedTickets] = useState<Ticket[]>([]);

  const handleSearch = async (params: SearchParams) => {
    try {
      // Buscar horarios disponibles desde el backend
      const horarios = await api.searchTrips(params.origin, params.destination);
      
      // Mapear horarios a trips
      const trips = horarios.map(api.mapHorario);
      
      setFilteredTrips(trips);
      setCurrentSearchParams(params);
      setIsSearchOpen(true);
      closeAllModals();
    } catch (error) {
      console.error('Error buscando viajes:', error);
      setFilteredTrips([]);
      setCurrentSearchParams(params);
      setIsSearchOpen(true);
      closeAllModals();
    }
  };

  const handleDestinationSelect = async (destination: string) => {
    const params: SearchParams = {
      origin: '',
      destination: destination,
      departDate: new Date().toISOString().split('T')[0],
      returnDate: '',
      isRoundTrip: false
    };
    
    await handleSearch(params);
  };

  const handleTicketPurchased = async (ticket: Ticket) => {
    if (!currentUser) return;

    try {
      // Los boletos ya se guardan en Payment.tsx con toda la info completa
      // Solo necesitamos actualizar el estado local
      setPurchasedTickets(prev => [ticket, ...prev]);
      
      // Actualizar saldo del usuario en estado local (ya se guardó en localStorage en Payment.tsx)
      const savedBalance = localStorage.getItem(`user_balance_${currentUser.email}`);
      if (savedBalance) {
        setCurrentUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            balance: Number.parseFloat(savedBalance)
          };
        });
      }
      
      setView('client');
    } catch (error) {
      console.error('Error al procesar compra:', error);
      alert('Error al procesar la compra. Por favor intente nuevamente.');
    }
  };

  const closeAllModals = () => {
    setShowMyTickets(false);
    setShowHelp(false);
    setShowLogin(false);
    setShowRegister(false);
    // Don't close search here usually, handled separately
  };

  const handleDestinationsClick = () => {
    closeAllModals();
    if (view !== 'landing') {
        setView('landing');
        setTimeout(() => {
            const element = document.getElementById('destinos');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    } else {
        const element = document.getElementById('destinos');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  const handleLoginSuccess = (user: User) => {
    // Populate with mock profile data for demo
    const detailedUser: User = {
        ...user,
        lastName: user.lastName || 'Demo',
        identificationType: user.identificationType || 'Cedula',
        identificationNumber: user.identificationNumber || '1720304050',
        birthDate: user.birthDate || '1995-05-15',
        address: user.address || 'Av. Amazonas y Naciones Unidas',
        gender: user.gender || 'Masculino',
        tariffType: user.tariffType || 'General',
        balance: user.balance ?? 0,
        paymentMethods: [
            { id: 1, type: 'Tarjeta de Crédito', holder: user.name + ' ' + (user.lastName || 'Demo'), number: '**** **** **** 5343', expiry: '12/30', brand: 'visa' }
        ]
    };
    
    // Cargar saldo desde localStorage si existe
    const savedBalance = localStorage.getItem(`user_balance_${user.email}`);
    if (savedBalance) {
      detailedUser.balance = Number.parseFloat(savedBalance);
    }

    setCurrentUser(detailedUser);
    setShowLogin(false);
    setShowRegister(false);
    if (user.role === 'admin') {
      setView('admin');
    } else {
      setView('client');
    }
  };

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout en Flask para limpiar la sesión
      await fetch('/logout', { method: 'GET', credentials: 'include' });
    } catch (e) {
      console.error('Error al hacer logout:', e);
    }
    // Limpiar state y redirigir al navegador
    setCurrentUser(null);
    setView('landing');
    window.location.href = '/';
  };

  // Inicialización basada en la URL y la sesión del backend (Flask)
  useEffect(() => {
    const initFromSession = async () => {
      try {
        const resp = await fetch('/api/session', { credentials: 'include' });
        const data = await resp.json();
        const path = window.location.pathname || '/';

        if (data?.authenticated && data?.user) {
          const u = data.user;
          const role: User['role'] = (u.tipo_cuenta === 'Administrador') ? 'admin' : 'client';

          // Intentar enriquecer con datos completos (persona/metodo_pago)
          let mappedUser: User = {
            id: String(u.id ?? ''),
            email: u.correo ?? '',
            role,
            phone: u.telefono ?? '',
            name: u.nombre ?? 'Usuario',
            lastName: u.apellido ?? '',
          };

          try {
            const personaResp = await fetch('/api/persona/lista', { credentials: 'include' });
            if (personaResp.ok) {
              const personasData = await personaResp.json();
              const personas = personasData.personas || [];
              const persona = personas.find((p: any) => p.id_persona === u.id || p.cuenta?.correo === u.correo);
              if (persona) {
                const mp = persona.metodo_pago;
                mappedUser = {
                  ...mappedUser,
                  phone: persona.telefono || mappedUser.phone,
                  name: persona.nombre || mappedUser.name,
                  lastName: persona.apellido || mappedUser.lastName,
                  balance: persona.saldo_disponible ?? mappedUser.balance,
                  paymentMethods: mp ? [{
                    id: mp.id_pago,
                    type: mp.opcion_pago === 'Tarjeta_credito' ? 'Tarjeta de Crédito' : mp.opcion_pago,
                    holder: mp.titular,
                    number: '**** **** **** ' + (mp.numero_tarjeta || '').slice(-4),
                    expiry: mp.fecha_vencimiento,
                    brand: 'visa',
                  }] : [],
                };
              }
            }
          } catch (err) {
            console.error('Error obteniendo persona:', err);
          }
          
          // Cargar saldo desde localStorage si existe (tiene prioridad sobre el backend)
          const savedBalance = localStorage.getItem(`user_balance_${mappedUser.email}`);
          if (savedBalance) {
            mappedUser.balance = Number.parseFloat(savedBalance);
          }

          setCurrentUser(mappedUser);

          if (path.startsWith('/administrador') && role === 'admin') {
            setView('admin');
          } else if (path.startsWith('/cliente') && role !== 'admin') {
            setView('client');
          }
        } else {
          // No autenticado: mantener landing aunque se visite /cliente o /administrador
          setView('landing');
        }
      } catch (e) {
        // En caso de error, mantener landing para que la app siga usable
        console.error('Error al inicializar sesión:', e);
        setView('landing');
      }
    };

    initFromSession();
  }, []);

  // RENDER VIEWS

  if (view === 'admin' && currentUser?.role === 'admin') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (view === 'client' && currentUser) {
    return (
      <>
        <Header 
          user={currentUser}
          onMyTicketsClick={() => {/* Handled inside ClientDashboard usually, but keeping header consistent */}}
          onHelpClick={() => { setShowHelp(true); }}
          onHomeClick={() => setView('landing')}
          onDestinationsClick={handleDestinationsClick}
          onLoginClick={() => {}}
          onDashboardClick={() => {}} // Already on dashboard
        />
        <ClientDashboard 
          user={currentUser} 
          tickets={purchasedTickets} 
          onLogout={handleLogout}
          onGoHome={() => setView('landing')}
        />
        {showHelp && <Help onClose={() => setShowHelp(false)} />}
      </>
    );
  }

  // DEFAULT LANDING VIEW
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden font-sans relative">
      <Header 
        user={currentUser}
        onMyTicketsClick={() => { 
          closeAllModals(); // Close first, then open
          if(currentUser) {
             setView('client');
          } else {
             setShowMyTickets(true); 
          }
        }}
        onHelpClick={() => { closeAllModals(); setShowHelp(true); }} // Close first, then open
        onHomeClick={() => { closeAllModals(); window.scrollTo({top:0, behavior:'smooth'}); }}
        onDestinationsClick={handleDestinationsClick}
        onLoginClick={() => { closeAllModals(); setShowLogin(true); }}
        onDashboardClick={() => {
           if (currentUser?.role === 'admin') setView('admin');
           else setView('client');
        }}
      />
      <main>
        <Hero onSearch={handleSearch} />
        <Destinations onSelectDestination={handleDestinationSelect} />
        <Features />
      </main>
      <Footer />
      <TravelAssistant />

      {/* Overlays */}
      {isSearchOpen && currentSearchParams && (
        <SearchResults 
          results={filteredTrips} 
          searchParams={currentSearchParams} 
          onClose={() => setIsSearchOpen(false)}
          onTicketPurchased={handleTicketPurchased}
          user={currentUser}
          onUserUpdate={setCurrentUser}
        />
      )}

      {/* Only show simplified MyTickets if not logged in, otherwise redirect to dashboard */}
      {showMyTickets && !currentUser && (
        <MyTickets 
          tickets={purchasedTickets} 
          onClose={() => setShowMyTickets(false)} 
        />
      )}

      {showHelp && (
        <Help onClose={() => setShowHelp(false)} />
      )}

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          onRegisterSuccess={handleLoginSuccess}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};

export default App;
