
import React from 'react';
import { View } from '../types';

interface Props {
  onNavigate: (view: View) => void;
}

const AdminView: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark p-6 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-white text-2xl font-black italic tracking-tighter">ADMIN PANEL</h2>
        <button onClick={() => onNavigate(View.HOME)} className="text-accent-green font-bold text-sm">Exit</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5">
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Total Revenue</p>
          <p className="text-2xl font-black text-white">$12,450</p>
          <p className="text-accent-green text-[10px] font-bold mt-1">+15% this week</p>
        </div>
        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5">
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Active Trips</p>
          <p className="text-2xl font-black text-white">48</p>
          <p className="text-neutral-500 text-[10px] font-bold mt-1">Across Ecuador</p>
        </div>
      </div>

      <div className="bg-surface-dark rounded-2xl border border-white/5 p-4 flex-1">
        <h3 className="text-white font-bold mb-4">Live Route Map</h3>
        <div className="w-full h-64 bg-background-dark rounded-xl flex items-center justify-center border border-white/5">
           <span className="material-symbols-outlined text-4xl text-white/20">map</span>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="text-white font-bold">Recent Alerts</h3>
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
             <span className="material-symbols-outlined text-red-500">warning</span>
             <div>
               <p className="text-xs text-red-500 font-bold">Delay: Flota Imbabura (Q-G)</p>
               <p className="text-[10px] text-neutral-500">Due to heavy rain in Alausí.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
