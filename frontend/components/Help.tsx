import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown } from 'lucide-react';

interface HelpProps {
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#1e1e1e] w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e1e1e]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#2ecc71]/20 text-[#2ecc71] rounded-full flex items-center justify-center">
               <HelpCircle className="h-5 w-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">Centro de Ayuda</h2>
               <p className="text-xs text-gray-400">Preguntas frecuentes y soporte</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#121212]">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Preguntas Frecuentes</h3>
            
            <details className="group bg-[#1e1e1e] border border-gray-700 rounded-xl overflow-hidden">
               <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-white hover:bg-gray-800 transition-colors">
                 ¿Cómo puedo comprar un boleto?
                 <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
               </summary>
               <div className="p-4 pt-0 text-sm text-gray-400 leading-relaxed border-t border-gray-700/50 mt-2">
                 Simplemente ingresa tu origen, destino y fecha en la página principal. Selecciona el viaje que prefieras, elige tus asientos y completa el pago de forma segura con tarjeta de crédito o débito.
               </div>
            </details>

            <details className="group bg-[#1e1e1e] border border-gray-700 rounded-xl overflow-hidden">
               <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-white hover:bg-gray-800 transition-colors">
                 ¿Es seguro comprar en BusGo?
                 <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
               </summary>
               <div className="p-4 pt-0 text-sm text-gray-400 leading-relaxed border-t border-gray-700/50 mt-2">
                 Sí, utilizamos encriptación SSL de última generación para proteger todos tus datos personales y financieros. Trabajamos con procesadores de pago certificados.
               </div>
            </details>

            <details className="group bg-[#1e1e1e] border border-gray-700 rounded-xl overflow-hidden">
               <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-white hover:bg-gray-800 transition-colors">
                 ¿Puedo cambiar o cancelar mi boleto?
                 <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
               </summary>
               <div className="p-4 pt-0 text-sm text-gray-400 leading-relaxed border-t border-gray-700/50 mt-2">
                 Las políticas dependen de cada cooperativa de transporte. Generalmente, puedes realizar cambios hasta 24 horas antes del viaje contactando a nuestro soporte.
               </div>
            </details>

            <details className="group bg-[#1e1e1e] border border-gray-700 rounded-xl overflow-hidden">
               <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-white hover:bg-gray-800 transition-colors">
                 ¿Necesito imprimir mi boleto?
                 <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
               </summary>
               <div className="p-4 pt-0 text-sm text-gray-400 leading-relaxed border-t border-gray-700/50 mt-2">
                 No es necesario. Puedes presentar el boleto digital que enviamos a tu correo electrónico o mostrarlo desde la sección "Mis Boletos" en tu celular.
               </div>
            </details>
          </div>

          <div className="pt-6 border-t border-gray-800">
             <h3 className="text-lg font-bold text-white mb-4">¿Necesitas más ayuda?</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#2a2e2a] p-4 rounded-xl border border-gray-700 text-center">
                   <p className="font-bold text-white mb-1">Llámanos</p>
                   <p className="text-[#2ecc71] font-medium">1800-BUSGO</p>
                   <p className="text-xs text-gray-500 mt-2">Lun-Dom, 8am - 8pm</p>
                </div>
                <div className="bg-[#2a2e2a] p-4 rounded-xl border border-gray-700 text-center">
                   <p className="font-bold text-white mb-1">Escríbenos</p>
                   <p className="text-[#2ecc71] font-medium">soporte@busgo.com</p>
                   <p className="text-xs text-gray-500 mt-2">Respuesta en 24h</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Help;