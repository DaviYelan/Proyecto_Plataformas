
import React from 'react';
import { View, BusTrip } from '../types';

interface Props {
  onNavigate: (view: View) => void;
  trip: BusTrip | null;
  onSeatsChange: (seats: string[]) => void;
  selectedSeats: string[];
}

const SeatSelectionView: React.FC<Props> = ({ onNavigate, trip, onSeatsChange, selectedSeats }) => {
  const occupiedSeats = ['03', '04', '13', '14', '23', '24'];
  
  const handleToggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      onSeatsChange(selectedSeats.filter(s => s !== seatId));
    } else {
      onSeatsChange([...selectedSeats, seatId]);
    }
  };

  const renderSeat = (id: string) => {
    const isOccupied = occupiedSeats.includes(id);
    const isSelected = selectedSeats.includes(id);
    
    let baseClass = "col-span-1 h-12 w-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ";
    if (isOccupied) baseClass += "bg-primary dark:bg-neutral-800 text-neutral-600 cursor-not-allowed opacity-50";
    else if (isSelected) baseClass += "bg-accent-emerald text-white shadow-lg shadow-emerald-500/30 scale-105";
    else baseClass += "bg-white dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 text-primary dark:text-white hover:scale-95";

    const statusLabel = isOccupied ? 'Occupied' : isSelected ? 'Selected' : 'Available';
    const ariaLabel = `Seat ${id}, ${statusLabel}`;

    return (
      <button 
        key={id}
        onClick={() => handleToggleSeat(id)}
        className={baseClass}
        aria-label={ariaLabel}
        aria-pressed={isSelected}
        disabled={isOccupied}
      >
        {id}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-primary dark:text-white">
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 pt-12 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(View.RESULTS)}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-neutral-200 dark:active:bg-neutral-800 transition-colors"
            aria-label="Back to results"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Select Seats</h1>
            <p className="text-xs text-neutral-500 font-medium">{trip?.origin} → {trip?.destination} • {trip?.departureTime}</p>
          </div>
        </div>
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800"
          aria-label="Bus information"
        >
          <span className="material-symbols-outlined text-[20px]">info</span>
        </button>
      </nav>

      <div className="px-4 py-6" aria-label="Seat legend">
        <div className="flex justify-between items-center bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-white border border-neutral-300 dark:border-neutral-600" aria-hidden="true"></div>
            <span className="text-xs font-semibold text-neutral-500">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-primary dark:bg-neutral-800" aria-hidden="true"></div>
            <span className="text-xs font-semibold text-neutral-500">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-accent-emerald" aria-hidden="true"></div>
            <span className="text-xs font-semibold text-neutral-500">Selected</span>
          </div>
        </div>
      </div>

      <main className="flex-1 px-8 pb-32 overflow-y-auto hide-scrollbar">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8" aria-hidden="true">
            <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-4"></div>
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="material-symbols-outlined text-[20px]">steering_wheel_heat</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">Front of Bus</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-y-6" role="grid" aria-label="Bus seat grid">
            {['01', '02', 'gap', '03', '04', '05', '06', 'gap', '07', '08', '09', '10', 'gap', '11', '12', '13', '14', 'gap', '15', '16', '17', '18', 'gap', '19', '20', '21', '22', 'gap', '23', '24'].map((id, index) => (
              id === 'gap' ? <div key={`gap-${index}`} className="col-span-1 flex items-center justify-center" aria-hidden="true"><span className="material-symbols-outlined text-neutral-200 dark:text-neutral-800 rotate-90 scale-75">straight</span></div> : renderSeat(id)
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center opacity-40" aria-label="Rear of bus amenities">
            <div className="flex items-center gap-4 text-neutral-300 dark:text-neutral-700">
              <span className="material-symbols-outlined text-4xl">wc</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mt-2">Restrooms</p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-white via-white to-white/90 dark:from-background-dark dark:via-background-dark dark:to-background-dark/90 backdrop-blur-sm border-t border-neutral-100 dark:border-neutral-800 z-[60]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-accent-emerald text-xl font-bold">{selectedSeats.length}</span>
                <span className="text-primary dark:text-white font-bold text-base">Seats Selected</span>
              </div>
              <p className="text-neutral-500 text-sm font-medium">Total: <span className="text-primary dark:text-white font-bold text-lg">${(selectedSeats.length * (trip?.price || 0)).toFixed(2)}</span></p>
            </div>
          </div>
          
          <button 
            disabled={selectedSeats.length === 0}
            onClick={() => onNavigate(View.PAYMENT)}
            className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all text-base ${
              selectedSeats.length > 0 
                ? 'bg-accent-emerald hover:bg-emerald-400 text-primary shadow-emerald-500/30' 
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <span>Continue to Payment</span>
            <span className="material-symbols-outlined text-xl" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionView;
