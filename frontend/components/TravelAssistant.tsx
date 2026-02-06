import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Loader2, Bot } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTravelAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const TravelAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente de viaje de BusGo. ¿A dónde te gustaría ir hoy? Puedo ayudarte a planear tu ruta o recomendarte lugares.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getTravelAdvice(userMessage.text);
    
    const modelMessage: ChatMessage = { 
      role: 'model', 
      text: response.text,
      chartData: response.chartData
    };
    
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-[#2ecc71] hover:bg-[#27ae60] text-white p-4 rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 flex items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles className="h-6 w-6" />
        <span className="font-semibold hidden sm:inline">Asistente IA</span>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[380px] md:max-w-[420px] h-[600px] bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#27ae60] to-[#2ecc71] p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-white" />
              <div>
                <h3 className="text-white font-bold">Asistente BusGo</h3>
                <p className="text-green-50 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Powered by Gemini
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212] scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#2ecc71] text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                }`}>
                  {msg.text}
                </div>
                
                {/* Chart Rendering if data exists */}
                {msg.chartData && msg.chartData.length > 0 && (
                  <div className="mt-3 w-full bg-gray-900 rounded-xl p-3 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Afluencia Estimada de Visitantes</p>
                    <div className="h-32 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={msg.chartData}>
                          <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                          <XAxis dataKey="month" hide />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#2ecc71' }}
                          />
                          <Area type="monotone" dataKey="visitors" stroke="#2ecc71" fillOpacity={1} fill="url(#colorVisitors)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-700 flex items-center gap-2">
                   <Loader2 className="h-4 w-4 animate-spin text-[#2ecc71]" />
                   <span className="text-gray-400 text-xs">Escribiendo...</span>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#1e1e1e] border-t border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregunta sobre destinos..."
                className="w-full bg-gray-900 text-white pl-4 pr-12 py-3 rounded-xl border border-gray-700 focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none text-sm placeholder-gray-500"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 p-1.5 bg-[#2ecc71] text-white rounded-lg hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-500 mt-2">
              La IA puede cometer errores. Verifica la información importante.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TravelAssistant;