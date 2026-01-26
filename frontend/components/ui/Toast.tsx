import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextValue {
  show: (message: string, type?: ToastType, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [duration, setDuration] = useState<number>(3000);

  const show = useCallback((msg: string, t: ToastType = 'info', d: number = 3000) => {
    setMessage(msg);
    setType(t);
    setDuration(d);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [visible, duration]);

  const bg = type === 'success'
    ? 'bg-green-600'
    : type === 'error'
    ? 'bg-red-600'
    : type === 'warning'
    ? 'bg-yellow-600'
    : 'bg-gray-700';

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Toast container */}
      <div className="pointer-events-none fixed inset-0 z-[100] flex items-end justify-center p-4">
        {visible && (
          <div className={`pointer-events-auto max-w-lg w-full sm:w-auto text-white ${bg} shadow-lg rounded-xl px-4 sm:px-6 py-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200`}>
            <div className="flex-1 text-sm sm:text-base">{message}</div>
            <button
              onClick={() => setVisible(false)}
              className="ml-2 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};
