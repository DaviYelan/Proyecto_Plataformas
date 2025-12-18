import React, { useState } from 'react';
import { Bus, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3b3f3b] pt-16 pb-8 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-[#2ecc71] p-1 rounded">
                 <Bus className="h-5 w-5 text-white" />
               </div>
               <span className="text-lg font-bold text-white">BusGo</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Tu compañero de viaje en las rutas de Ecuador. Conectamos destinos con seguridad, confort y la mejor tecnología.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Compañía</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Nuestra Flota</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Trabaja Aquí</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Blog de Viajes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Estado del Boleto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Política de Cookies</a></li>
              <li><a href="#" className="hover:text-[#2ecc71] transition-colors">Libro de Reclamaciones</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2024 BusGo. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
             <span className="text-gray-500 text-xs">Hecho con ❤️ en Ecuador</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;