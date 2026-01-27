
import React from 'react';
import { View, AppNotification } from '../types';

interface Props {
  onNavigate: (view: View) => void;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'Trip Confirmed!',
    message: 'Your trip from Quito to Guayaquil is confirmed. Safe travels!',
    type: 'info',
    timestamp: new Date(),
    read: false
  },
  {
    id: '2',
    title: 'Route Delay Alert',
    message: 'Heavier traffic expected on Route 35 near Baños. Plan accordingly.',
    type: 'alert',
    timestamp: new Date(Date.now() - 3600000),
    read: false
  },
  {
    id: '3',
    title: 'Weekend Promo 🚌',
    message: 'Get 20% off all trips to the Coast this weekend only!',
    type: 'promo',
    timestamp: new Date(Date.now() - 86400000),
    read: true
  }
];

const NotificationsView: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md pt-12 border-b border-white/5">
        <div className="flex items-center px-4 pb-4 gap-4">
          <button 
            onClick={() => onNavigate(View.HOME)}
            className="size-10 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <div>
            <h2 className="text-white text-lg font-bold">Notifications</h2>
            <p className="text-[10px] text-accent-green font-bold uppercase tracking-widest">2 Unread Alerts</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="p-4 space-y-3">
          {MOCK_NOTIFICATIONS.map(notif => (
            <div 
              key={notif.id}
              className={`p-5 rounded-2xl border flex gap-4 transition-all active:scale-[0.99] ${
                notif.read 
                  ? 'bg-surface-dark/40 border-white/5 opacity-60' 
                  : 'bg-surface-dark border-white/10 shadow-lg shadow-black/20'
              }`}
            >
              <div className={`size-12 rounded-xl shrink-0 flex items-center justify-center ${
                notif.type === 'alert' ? 'bg-red-500/10 text-red-500' :
                notif.type === 'promo' ? 'bg-amber-500/10 text-amber-500' :
                'bg-accent-green/10 text-accent-green'
              }`}>
                <span className="material-symbols-outlined">
                  {notif.type === 'alert' ? 'warning' : notif.type === 'promo' ? 'redeem' : 'notifications_active'}
                </span>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-white text-sm font-bold">{notif.title}</h3>
                  <span className="text-[9px] text-neutral-500 font-bold uppercase">1h ago</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{notif.message}</p>
                {!notif.read && (
                  <div className="pt-1">
                    <div className="size-1.5 bg-accent-green rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-10 flex flex-col items-center gap-2 opacity-20">
           <span className="material-symbols-outlined text-4xl">inventory_2</span>
           <p className="text-[10px] font-black uppercase tracking-[0.2em]">End of feed</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
