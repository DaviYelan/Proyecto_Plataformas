
import React from 'react';
import { View, BusTrip, SearchCriteria } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  onSelectTrip: (trip: BusTrip) => void;
  searchCriteria: SearchCriteria;
}

const MOCK_TRIPS_TEMPLATE: BusTrip[] = [
  {
    id: '1',
    company: 'Trans Esmeraldas',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrQZiaSINWgcumfiIzHavM5R9KqXEMYjIxSz6r5kmozBCn5XQbPToR_gkZ3XIhUmtD-5Wbm4rJlHm6j58f-gnzZduwSR60-KfZfXop8LV1UJTQSeq9jp4yLdoxCxZw0m2yXcbY3V9RGSHKsFUU1q8MuaeoQdPd8vKDu39HE9ram9izRLjOIyycuDEWwG4KMIjFmtEH8q_GkmGeYqIXhlqCStwICYz6wDXWxA1l2lV5tildF38Pce54KcBwxUOqYlGhoIAU9EY-Tg3q',
    rating: 4.8,
    reviewsCount: 120,
    departureTime: '08:30 PM',
    arrivalTime: '04:30 AM',
    duration: '8h 00m',
    origin: 'Quitumbe',
    destination: 'Guayaquil',
    price: 15.00,
    class: 'Executive Class',
    amenities: ['wifi', 'ac_unit', 'bolt']
  },
  {
    id: '2',
    company: 'Flota Imbabura',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5f0DbWLGU466N9B197hVzdD_cqdhAr4uq7bkvGfPoiWIYlWE86LIpujaizg0MpRtdPDhc5c2EYdXP2m1nZ3oCRqGCl74gRtmsPwk2bUBwQLLGjx_2L7g1vrm3HaLWMW7h0Rb795SY7Ea4Ao2Egvg58ZLIPUOchT4gwObuGUk7OJG0C_TrBuFTp_00vqD9infbn_ve1mQK8e5pAUidJjvwAbQr_FVdtDXrmp7Z9pjsLQD9xjcbIqTk6x0fY86y1z7tIiQVbGx-R5Hx',
    rating: 4.5,
    reviewsCount: 85,
    departureTime: '09:00 PM',
    arrivalTime: '05:00 AM',
    duration: '8h 00m',
    origin: 'Carcelén',
    destination: 'Guayaquil',
    price: 16.50,
    class: 'Luxury Cama',
    amenities: ['wifi', 'airline_seat_recline_extra', 'movie']
  }
];

const ResultsView: React.FC<Props> = ({ onNavigate, onSelectTrip, searchCriteria }) => {
  // Simulate results based on search criteria
  const results = MOCK_TRIPS_TEMPLATE.map(t => ({
    ...t,
    origin: searchCriteria.origin || t.origin,
    destination: searchCriteria.destination || t.destination
  }));

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md pt-12">
        <div className="flex items-center px-4 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate(View.HOME)}
              className="flex size-10 items-center justify-center rounded-full bg-white/10 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl text-white">arrow_back</span>
            </button>
            <div>
              <h2 className="text-base font-bold text-white">
                {searchCriteria.origin || 'Quito'} to {searchCriteria.destination || 'Guayaquil'}
              </h2>
              <p className="text-xs text-neutral-500 font-medium">{searchCriteria.date} • 1 Passenger</p>
            </div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full bg-white/10">
            <span className="material-symbols-outlined text-xl text-white">calendar_today</span>
          </button>
        </div>

        <div className="flex gap-2 px-4 py-4 overflow-x-auto hide-scrollbar">
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-accent-green text-primary px-4">
            <span className="text-xs font-bold uppercase tracking-wider">Price</span>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-white/10 px-4 border border-white/5">
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Time</span>
            <span className="material-symbols-outlined text-base text-white/30">expand_more</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 space-y-4 overflow-y-auto hide-scrollbar">
        {results.map(trip => (
          <div 
            key={trip.id}
            onClick={() => onSelectTrip(trip)}
            className="flex flex-col gap-4 rounded-2xl bg-surface-dark p-5 border border-white/5 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                  <img src={trip.logoUrl} alt={trip.company} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{trip.company}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-accent-green text-xs fill-1">star</span>
                    <span className="text-xs font-medium text-neutral-500">{trip.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-accent-green">${trip.price.toFixed(2)}</span>
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Available</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">{trip.departureTime}</span>
                <span className="text-[11px] font-medium text-neutral-500">{trip.origin}</span>
              </div>
              <div className="flex-1 px-4 flex flex-col items-center">
                <span className="text-[10px] font-bold text-neutral-400 mb-1">{trip.duration}</span>
                <div className="w-full h-px bg-white/10 relative">
                  <div className="absolute -top-1 left-0 size-2 rounded-full border border-accent-green bg-background-dark"></div>
                  <div className="absolute -top-1 right-0 size-2 rounded-full bg-accent-green"></div>
                </div>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-lg font-bold text-white">{trip.arrivalTime}</span>
                <span className="text-[11px] font-medium text-neutral-500">{trip.destination}</span>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ResultsView;
