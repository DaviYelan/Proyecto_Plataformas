
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import Features from './components/Features';
import Footer from './components/Footer';
import TravelAssistant from './components/TravelAssistant';
import SearchResults from './components/SearchResults';
import MyTickets from './components/MyTickets';
import Help from './components/Help';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import { SearchParams, Trip, Ticket, User } from './types';

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

  const handleSearch = (params: SearchParams) => {
    // Basic filtering logic (Case insensitive)
    const results = MOCK_TRIPS.filter(trip => 
      trip.origin.toLowerCase().includes(params.origin.toLowerCase()) && 
      trip.destination.toLowerCase().includes(params.destination.toLowerCase())
    );

    let finalResults = results;
    if (finalResults.length === 0) {
        if (params.origin.toLowerCase().includes('quito') || params.destination.toLowerCase().includes('guayaquil')) {
           finalResults = MOCK_TRIPS.filter(t => t.origin === 'Quito' && t.destination === 'Guayaquil');
        } else if (params.origin.toLowerCase().includes('puyo') || params.destination.toLowerCase().includes('zamora')) {
           finalResults = MOCK_TRIPS.filter(t => t.origin === 'Puyo' && t.destination === 'Zamora');
        } else {
           finalResults = MOCK_TRIPS.slice(0, 3);
        }
    }
    
    setFilteredTrips(finalResults);
    setCurrentSearchParams(params);
    setIsSearchOpen(true);
    closeAllModals();
  };

  const handleDestinationSelect = (destination: string) => {
    const params: SearchParams = {
      origin: 'Quito',
      destination: destination,
      departDate: new Date().toISOString().split('T')[0],
      returnDate: '',
      isRoundTrip: false
    };
    
    const results = MOCK_TRIPS.filter(t => t.destination.includes(destination));
    setFilteredTrips(results.length > 0 ? results : MOCK_TRIPS.slice(0, 2));
    setCurrentSearchParams(params);
    setIsSearchOpen(true);
  };

  const handleTicketPurchased = (ticket: Ticket) => {
    setPurchasedTickets(prev => [ticket, ...prev]);
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
        balance: user.balance !== undefined ? user.balance : 0,
        paymentMethods: [
            { id: 1, type: 'Tarjeta de Crédito', holder: user.name + ' ' + (user.lastName || 'Demo'), number: '**** **** **** 5343', expiry: '12/30', brand: 'visa' }
        ]
    };

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

        if (data && data.authenticated && data.user) {
          const u = data.user;
          const role: User['role'] = (u.tipo_cuenta === 'Administrador') ? 'admin' : 'client';
          const mappedUser: User = {
            id: String(u.id ?? ''),
            email: u.correo ?? '',
            role,
            phone: u.telefono ?? '',
            name: u.nombre ?? 'Usuario',
            lastName: u.apellido ?? '',
          };
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
