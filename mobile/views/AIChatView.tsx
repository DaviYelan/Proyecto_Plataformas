
import React, { useState, useRef, useEffect } from 'react';
import { View, Message } from '../types';
import { getAIResponse } from '../geminiService';

interface Props {
  onNavigate: (view: View) => void;
}

const AIChatView: React.FC<Props> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de BusGo. ¿En qué puedo ayudarte con tu viaje por Ecuador hoy? 🏔️',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getAIResponse(input);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

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
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-accent-green flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-outlined text-primary font-bold">smart_toy</span>
            </div>
            <div>
              <h2 className="text-white text-base font-bold">BusGo AI</h2>
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-accent-green animate-pulse"></div>
                <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-accent-green text-primary font-semibold rounded-br-none' 
                : 'bg-surface-dark text-white border border-white/5 rounded-bl-none shadow-xl'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-surface-dark rounded-2xl p-4 rounded-bl-none border border-white/5">
              <div className="flex gap-1">
                <div className="size-1.5 rounded-full bg-accent-green animate-bounce"></div>
                <div className="size-1.5 rounded-full bg-accent-green animate-bounce delay-100"></div>
                <div className="size-1.5 rounded-full bg-accent-green animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pb-12 bg-background-dark border-t border-white/5">
        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
          {['Weather in Quito', 'Buses to Cuenca', 'Is Baños crowded?', 'Safe travel tips'].map(chip => (
            <button 
              key={chip}
              onClick={() => setInput(chip)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs font-bold whitespace-nowrap active:scale-95 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-surface-dark rounded-2xl p-2 border border-white/10 focus-within:border-accent-green transition-colors">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your trip..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-neutral-500 text-sm px-2"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="size-10 bg-accent-green text-primary rounded-xl flex items-center justify-center disabled:opacity-30 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined font-bold">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;
