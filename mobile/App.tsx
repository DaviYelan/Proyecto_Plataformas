
import React, { useState } from 'react';
import { View, User, SearchCriteria, ToastMessage } from './types';
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.WELCOME);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    origin: 'Quito',
    destination: 'Guayaquil',
    date: '24 Oct, 2023'
  });

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
        return <HomeView onNavigate={setCurrentView} searchCriteria={searchCriteria} onSearchUpdate={setSearchCriteria} />;
      case View.RESULTS:
        return <ResultsView onNavigate={setCurrentView} searchCriteria={searchCriteria} onSelectTrip={(trip) => { setSelectedTrip(trip); setCurrentView(View.SEAT_SELECTION); }} />;
      case View.SEAT_SELECTION:
        return <SeatSelectionView onNavigate={setCurrentView} trip={selectedTrip} onSeatsChange={setSelectedSeats} selectedSeats={selectedSeats} />;
      case View.PAYMENT:
        return <PaymentView onNavigate={setCurrentView} trip={selectedTrip} seatCount={selectedSeats.length} onComplete={() => setCurrentView(View.TICKET)} showToast={showToast} savedCards={[]} onSaveCard={() => {}} />;
      case View.TICKET:
        return <TicketView onNavigate={setCurrentView} trip={selectedTrip} seats={selectedSeats} date={searchCriteria.date} showToast={showToast} onDownload={() => {}} />;
      case View.AI_CHAT:
        return <AIChatView onNavigate={setCurrentView} />;
      case View.PROFILE:
        return <ProfileView onNavigate={setCurrentView} user={user} onLogout={() => { setUser(null); setCurrentView(View.WELCOME); }} />;
      case View.MY_TRIPS:
        return <MyTripsView onNavigate={setCurrentView} myTrips={[]} onSelectTrip={(trip) => { setSelectedTrip(trip); setCurrentView(View.TICKET); }} onTrackTrip={(trip) => { setSelectedTrip(trip); setCurrentView(View.TRACK_TRIP); }} />;
      case View.NOTIFICATIONS:
        return <NotificationsView onNavigate={setCurrentView} />;
      case View.HELP_CENTER:
        return <HelpCenterView onBack={() => setCurrentView(View.PROFILE)} onNavigate={setCurrentView} />;
      case View.PERSONAL_INFO:
        return <PersonalInfoView onBack={() => setCurrentView(View.PROFILE)} user={user} />;
      case View.PAYMENT_METHODS:
        return <PaymentMethodsView onBack={() => setCurrentView(View.PROFILE)} savedCards={[]} onSaveCard={() => {}} onDeleteCard={() => {}} />;
      case View.TRACK_TRIP:
        return <TrackTripView trip={selectedTrip} onBack={() => setCurrentView(View.MY_TRIPS)} showToast={showToast} />;
      default:
        return <WelcomeView onNavigate={setCurrentView} onLogin={setUser} showToast={showToast} />;
    }
  };

  return (
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
  );
};

export default App;
