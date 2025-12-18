import React, { useState, useMemo, useEffect } from 'react';
import { User, Ticket, PaymentMethod } from '../types';
import { LogOut, LayoutDashboard, Ticket as TicketIcon, User as UserIcon, Settings, Download, Trash2, Menu, X, CreditCard, Heart, Calendar, Clock, TrendingUp, MapPin, Plus, Check } from 'lucide-react';
import * as api from '../services/apiService';
import { jsPDF } from 'jspdf';

interface ClientDashboardProps {
  user: User;
  tickets: Ticket[];
  onLogout: () => void;
  onGoHome: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, tickets, onLogout, onGoHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'payment-methods' | 'profile' | 'settings'>('overview');
  const [currentUserData, setCurrentUserData] = useState(user);

  // Actualizar balance cuando el usuario cambia (desde App.tsx)
  useEffect(() => {
    setCurrentUserData(user);
  }, [user.balance, user.email]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Estados para datos del backend
  const [boletosBackend, setBoletosBackend] = useState<api.BoletoBackend[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Settings State
  const [settings, setSettings] = useState({
      notifications: true,
      newsletter: false,
      twoFactor: false
  });
  
  // Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const boletos = await api.getBoletos();
        // Filtrar boletos del usuario actual por correo
        const userBoletos = boletos.filter(b => 
          b.persona?.correo?.toLowerCase() === user.email?.toLowerCase()
        );
        setBoletosBackend(userBoletos);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.email]);
  
  // Extraer método de pago del backend
  const backendPaymentMethod = useMemo(() => {
    if (boletosBackend.length > 0 && boletosBackend[0].persona?.metodo_pago) {
      const mp = boletosBackend[0].persona.metodo_pago;
      return {
        id: mp.id_pago,
        type: mp.opcion_pago === 'Tarjeta_credito' ? 'Tarjeta de Crédito' : mp.opcion_pago,
        holder: mp.titular,
        number: '**** **** **** ' + mp.numero_tarjeta.slice(-4),
        expiry: mp.fecha_vencimiento,
        brand: 'visa' as const
      };
    }
    return null;
  }, [boletosBackend]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Actualizar métodos de pago cuando se carguen del backend
  useEffect(() => {
    if (backendPaymentMethod) {
      setPaymentMethods([backendPaymentMethod]);
    } else if (user.paymentMethods && user.paymentMethods.length > 0) {
      setPaymentMethods(user.paymentMethods);
    }
  }, [backendPaymentMethod, user.paymentMethods]);

  // Combinar boletos del backend con los comprados en esta sesión (tickets prop)
  const mappedPurchasedTickets = useMemo(() => {
    return tickets.map((t) => {
      // Convertir fecha de YYYY-MM-DD a DD/MM/YYYY si es necesario
      let tripDateFormatted = t.tripDate || new Date(t.purchaseDate).toLocaleDateString('es-EC');
      if (t.tripDate && t.tripDate.includes('-')) {
        // Convertir YYYY-MM-DD a DD/MM/YYYY
        const parts = t.tripDate.split('-');
        tripDateFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return {
        id_boleto: Number(String(t.id).replace(/\D/g, '')) || Date.now(),
        fecha_compra: new Date(t.purchaseDate).toLocaleDateString('es-EC'),
        numero_asiento: parseInt(t.seats[0]?.number || '0'),
        cantidad_boleto: t.seats.length,
        precio_final: t.totalPrice,
        estado_boleto: 'Pagado',
        persona: { correo: user.email } as any,
        turno: {
          fecha_salida: tripDateFormatted,
          horario: {
            hora_salida: t.trip.departureTime,
            ruta: {
              origen: t.trip.origin,
              destino: t.trip.destination,
              bus: { cooperativa: { nombre_cooperativa: t.trip.operator } },
            },
          },
        },
      } as api.BoletoBackend;
    });
  }, [tickets, user.email]);

  const displayTickets = useMemo(() => {
    return [...boletosBackend, ...mappedPurchasedTickets];
  }, [boletosBackend, mappedPurchasedTickets]);

  // Statistics Calculation usando boletos combinados
  const stats = useMemo(() => {
    const totalTrips = displayTickets.length;
    const now = new Date();
    const activeTickets = displayTickets.filter(b => {
      if (b.turno?.fecha_salida) {
        const [day, month, year] = b.turno.fecha_salida.split('/');
        const tripDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return tripDate >= now;
      }
      return true;
    });
    
    const nextTrip = activeTickets.length > 0 ? activeTickets[0] : null;
    
    const routes = displayTickets.map(b => {
      if (b.turno?.horario?.ruta) {
        return `${b.turno.horario.ruta.origen} - ${b.turno.horario.ruta.destino}`;
      }
      return 'Desconocida';
    });
    const routeCounts = routes.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const favoriteRoute = Object.keys(routeCounts).length > 0 ? Object.keys(routeCounts).reduce((a, b) => routeCounts[a] > routeCounts[b] ? a : b) : 'Ninguna';

    return { 
      totalTrips, 
      activeTicketsCount: activeTickets.length, 
      nextTrip,
      favoriteRoute 
    };
  }, [displayTickets]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentUserData({ ...currentUserData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteCard = (id: number) => {
     if(window.confirm("¿Estás seguro de que deseas eliminar esta tarjeta?")) {
        setPaymentMethods(prev => prev.filter(p => p.id !== id));
     }
  };

  const handleAddCard = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock new card
      const newCard: PaymentMethod = {
          id: Date.now(),
          type: 'Tarjeta de Crédito',
          holder: currentUserData.name,
          number: '**** **** **** ' + Math.floor(1000 + Math.random() * 9000),
          expiry: '12/28',
          brand: Math.random() > 0.5 ? 'visa' : 'mastercard'
      };
      setPaymentMethods([...paymentMethods, newCard]);
      setShowPaymentModal(false);
  };

  const handleDownloadPDF = (boleto: api.BoletoBackend) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Colores
    const greenColor = [46, 204, 113];
    const darkColor = [30, 30, 30];
    const grayColor = [128, 128, 128];
    
    // Header con fondo verde
    doc.setFillColor(greenColor[0], greenColor[1], greenColor[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Logo/Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('AventuraBus', pageWidth / 2, 22, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Boleto Electrónico de Viaje', pageWidth / 2, 35, { align: 'center' });
    
    // Número de boleto
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 45, pageWidth, 20, 'F');
    doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`BOLETO #${boleto.id_boleto}`, pageWidth / 2, 58, { align: 'center' });
    
    // Contenido principal
    let yPos = 80;
    
    // Información de ruta
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL VIAJE', 20, yPos);
    yPos += 12;
    
    // Línea separadora
    doc.setDrawColor(greenColor[0], greenColor[1], greenColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPos - 5, pageWidth - 20, yPos - 5);
    
    // Origen y Destino destacados
    const origen = boleto.turno?.horario?.ruta?.origen || 'N/A';
    const destino = boleto.turno?.horario?.ruta?.destino || 'N/A';
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(origen, 20, yPos + 10);
    doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
    doc.text('→', pageWidth / 2 - 5, yPos + 10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(destino, pageWidth / 2 + 15, yPos + 10);
    yPos += 30;
    
    // Detalles en grid
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    
    const details = [
      ['Fecha de Salida:', boleto.turno?.fecha_salida || 'N/A'],
      ['Hora de Salida:', boleto.turno?.horario?.hora_salida || 'N/A'],
      ['Hora de Llegada:', boleto.turno?.horario?.hora_llegada || 'N/A'],
      ['Asiento:', `#${boleto.numero_asiento}`],
      ['Cooperativa:', boleto.turno?.horario?.ruta?.bus?.cooperativa?.nombre_cooperativa || 'N/A'],
      ['Bus:', `${boleto.turno?.horario?.ruta?.bus?.marca || 'N/A'} - Placa: ${boleto.turno?.horario?.ruta?.bus?.placa || 'N/A'}`],
    ];
    
    details.forEach(([label, value], index) => {
      const xPos = index % 2 === 0 ? 20 : pageWidth / 2;
      const currentY = yPos + Math.floor(index / 2) * 15;
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text(label, xPos, currentY);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(value, xPos, currentY + 6);
      doc.setFont('helvetica', 'normal');
    });
    
    yPos += 55;
    
    // Información del pasajero
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL PASAJERO', 20, yPos);
    yPos += 8;
    doc.setDrawColor(greenColor[0], greenColor[1], greenColor[2]);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 12;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text('Nombre:', 20, yPos);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${boleto.persona?.nombre || 'N/A'} ${boleto.persona?.apellido || ''}`, 20, yPos + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text('Identificación:', pageWidth / 2, yPos);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${boleto.persona?.tipo_identificacion || ''}: ${boleto.persona?.numero_identificacion || 'N/A'}`, pageWidth / 2, yPos + 6);
    
    yPos += 25;
    
    // Box de precio
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, yPos, pageWidth - 40, 35, 3, 3, 'F');
    doc.setFontSize(12);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text('TOTAL PAGADO', pageWidth / 2, yPos + 12, { align: 'center' });
    doc.setFontSize(24);
    doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${boleto.precio_final.toFixed(2)}`, pageWidth / 2, yPos + 28, { align: 'center' });
    
    yPos += 50;
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de compra: ${boleto.fecha_compra}`, 20, yPos);
    doc.text(`Estado: ${boleto.estado_boleto}`, pageWidth - 20, yPos, { align: 'right' });
    
    yPos += 15;
    doc.setFontSize(9);
    doc.text('Este boleto es válido únicamente para la fecha y hora indicada.', pageWidth / 2, yPos, { align: 'center' });
    doc.text('Presente este documento al momento de abordar.', pageWidth / 2, yPos + 5, { align: 'center' });
    
    // Guardar PDF
    doc.save(`Boleto_${boleto.id_boleto}_AventuraBus.pdf`);
  };
  
  const handleSettingChange = (setting: string) => {
      setSettings(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }));
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#1a1a1a] font-sans text-gray-200 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#1e1e1e] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-xl relative">
           <button onClick={toggleSidebar} className="lg:hidden absolute left-4 top-4 p-2 bg-gray-800 rounded-lg text-white">
              <Menu size={20} />
           </button>
           <div className="flex flex-col md:flex-row items-center gap-4 mt-8 md:mt-0 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-[#2ecc71] p-1 shadow-lg shadow-green-500/20">
                 <div className="w-full h-full rounded-full bg-[#1e1e1e] flex items-center justify-center text-2xl font-bold text-[#2ecc71]">
                    {currentUserData.name.charAt(0)}
                 </div>
              </div>
              <div>
                 <h1 className="text-xl md:text-2xl font-bold text-white">Hola, {currentUserData.name}</h1>
                 <p className="text-gray-400 text-sm">Bienvenido a tu panel de control</p>
              </div>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <button onClick={onGoHome} className="flex-1 md:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors text-white border border-gray-700">Reservar</button>
              <button onClick={onLogout} href='/logout' className="flex-1 md:flex-none px-4 py-2 border border-red-900/50 bg-red-900/10 hover:bg-red-900/20 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"><LogOut size={16} /> Salir</button>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
           <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden shadow-lg sticky top-24">
                 <SidebarBtn icon={<LayoutDashboard size={20} />} label="Resumen" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                 <SidebarBtn icon={<TicketIcon size={20} />} label="Historial Viajes" active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} />
                 <SidebarBtn icon={<CreditCard size={20} />} label="Métodos de Pago" active={activeTab === 'payment-methods'} onClick={() => setActiveTab('payment-methods')} />
                 <SidebarBtn icon={<UserIcon size={20} />} label="Mi Perfil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                 <SidebarBtn icon={<Settings size={20} />} label="Configuración" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
              </div>
           </div>

           {isSidebarOpen && (
             <div className="fixed inset-0 z-50 lg:hidden flex">
               <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeSidebar}></div>
               <div className="relative w-3/4 max-w-xs bg-[#1e1e1e] h-full shadow-2xl p-4 flex flex-col animate-in slide-in-from-left duration-200">
                  <div className="flex justify-between items-center mb-6"><span className="text-lg font-bold text-white">Menú</span><button onClick={closeSidebar} className="p-2 text-gray-400 hover:text-white"><X size={24} /></button></div>
                  <div className="space-y-2">
                     <SidebarBtn icon={<LayoutDashboard size={20} />} label="Resumen" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); closeSidebar(); }} />
                     <SidebarBtn icon={<TicketIcon size={20} />} label="Historial Viajes" active={activeTab === 'tickets'} onClick={() => { setActiveTab('tickets'); closeSidebar(); }} />
                     <SidebarBtn icon={<CreditCard size={20} />} label="Métodos de Pago" active={activeTab === 'payment-methods'} onClick={() => { setActiveTab('payment-methods'); closeSidebar(); }} />
                     <SidebarBtn icon={<UserIcon size={20} />} label="Mi Perfil" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); closeSidebar(); }} />
                     <SidebarBtn icon={<Settings size={20} />} label="Configuración" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); closeSidebar(); }} />
                  </div>
               </div>
             </div>
           )}

           <div className="flex-1 w-full">
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Resumen de Actividad</h2>
                   {loading ? (
                     <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2ecc71]"></div></div>
                   ) : (
                   <>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard title="Total Viajes" value={stats.totalTrips} icon={<TicketIcon className="text-[#2ecc71]" size={20} />} />
                      <StatCard title="Boletos Activos" value={stats.activeTicketsCount} icon={<Calendar className="text-blue-400" size={20} />} />
                      <StatCard title="Ruta Favorita" value={stats.favoriteRoute} icon={<Heart className="text-red-400" size={20} />} smallValue />
                      <StatCard title="Saldo" value={`$${currentUserData.balance?.toFixed(2) || '0.00'}`} icon={<TrendingUp className="text-green-400" size={20} />} />
                   </div>
                   {stats.nextTrip ? (
                      <div className="bg-gradient-to-r from-[#1e1e1e] to-[#252525] p-6 rounded-xl border border-gray-700 shadow-lg mt-6">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MapPin className="text-[#2ecc71]" /> Próximo Viaje</h3>
                         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left w-full md:w-auto">
                               <p className="text-sm text-gray-400">Origen</p><p className="text-2xl font-bold text-white">{stats.nextTrip.turno?.horario?.ruta?.origen || 'N/A'}</p><p className="text-3xl font-bold text-[#2ecc71] my-1 rotate-90 md:rotate-0">→</p><p className="text-sm text-gray-400">Destino</p><p className="text-2xl font-bold text-white">{stats.nextTrip.turno?.horario?.ruta?.destino || 'N/A'}</p>
                            </div>
                            <div className="bg-[#121212] p-4 rounded-lg w-full md:min-w-[250px] border border-gray-800">
                               <div className="flex items-center gap-3 mb-2"><Calendar size={16} className="text-gray-500" /><span className="text-gray-300 text-sm">Fecha: {stats.nextTrip.turno?.fecha_salida || stats.nextTrip.fecha_compra}</span></div>
                               <div className="flex items-center gap-3 mb-2"><Clock size={16} className="text-gray-500" /><span className="text-gray-300 text-sm">Hora: {stats.nextTrip.turno?.horario?.hora_salida || 'N/A'}</span></div>
                               <div className="flex items-center gap-3"><UserIcon size={16} className="text-gray-500" /><span className="text-gray-300 text-sm">Operador: {stats.nextTrip.turno?.horario?.ruta?.bus?.cooperativa?.nombre_cooperativa || 'N/A'}</span></div>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div className="bg-[#1e1e1e] p-8 rounded-xl border border-gray-800 text-center"><p className="text-gray-500">No tienes viajes programados próximamente.</p></div>
                   )}
                   </>
                   )}
                </div>
              )}

              {activeTab === 'tickets' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                   <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Historial de Viajes</h2>
                        {loading ? (
                            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2ecc71]"></div></div>
                        ) : displayTickets.length === 0 ? (
                            <div className="bg-[#1e1e1e] rounded-xl p-12 text-center border border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-2">No tienes historial</h3>
                                <p className="text-gray-500 mb-6">Tus viajes pasados y futuros aparecerán aquí.</p>
                                <button onClick={onGoHome} className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-6 py-2 rounded-lg font-bold transition-colors">Explorar Destinos</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {displayTickets.map((boleto) => (
                                    <div key={boleto.id_boleto} className="bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-md hover:border-[#2ecc71]/30 transition-all p-4 md:p-5 flex flex-col lg:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2"><span className="bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-0.5 rounded text-xs font-bold border border-[#2ecc71]/20">{boleto.turno?.horario?.ruta?.bus?.cooperativa?.nombre_cooperativa || 'Operador'}</span><span className="text-gray-500 text-xs">#{boleto.id_boleto}</span></div>
                                            <div className="flex items-center gap-3 text-lg font-bold text-white">{boleto.turno?.horario?.ruta?.origen || 'Origen'} <span className="text-gray-600">→</span> {boleto.turno?.horario?.ruta?.destino || 'Destino'}</div>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400"><span className="flex items-center gap-1"><Calendar size={14} /> {boleto.fecha_compra}</span><span className="flex items-center gap-1"><Clock size={14} /> {boleto.turno?.horario?.hora_salida || 'N/A'}</span></div>
                                        </div>
                                        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 border-t lg:border-t-0 border-gray-800 pt-4 lg:pt-0">
                                            <span className="text-xl font-bold text-white">${boleto.precio_final.toFixed(2)}</span>
                                            <button onClick={() => handleDownloadPDF(boleto)} className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-700"><Download size={12} /> <span className="hidden sm:inline">Descargar</span> PDF</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                   </div>
                </div>
              )}

              {activeTab === 'payment-methods' && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3"><CreditCard className="text-[#2ecc71]" /> Métodos de Pago</h2>
                        <button onClick={() => setShowPaymentModal(true)} className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Agregar Tarjeta</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paymentMethods.length === 0 ? (
                        <div className="col-span-full bg-[#1e1e1e] p-12 text-center rounded-xl border border-gray-800">
                            <p className="text-gray-500">No tienes métodos de pago guardados.</p>
                        </div>
                    ) : (
                        paymentMethods.map(method => (
                            <div key={method.id} className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-6 flex flex-col justify-between hover:border-gray-600 transition-colors shadow-lg relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                       {method.brand === 'visa' ? <span className="font-bold text-xs">VISA</span> : <span className="font-bold text-xs">MC</span>}
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <p className="text-gray-400 text-sm uppercase mb-1">{method.type}</p>
                                    <p className="font-mono text-xl text-white tracking-widest mb-4">{method.number}</p>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <div>
                                            <p className="uppercase text-[10px] mb-0.5">Titular</p>
                                            <p className="text-gray-300">{method.holder.toUpperCase()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="uppercase text-[10px] mb-0.5">Expira</p>
                                            <p className="text-gray-300">{method.expiry}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                                    <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-xs font-bold transition-colors border border-gray-700">Editar</button>
                                    <button onClick={() => handleDeleteCard(method.id)} className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 py-2 rounded text-xs font-bold transition-colors border border-red-900/30">Eliminar</button>
                                </div>
                            </div>
                        ))
                    )}
                    </div>
                 </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="bg-[#1e1e1e] rounded-t-xl border border-gray-800 overflow-hidden shadow-2xl">
                      <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 flex items-center gap-3">
                         <div className="bg-white/20 p-2 rounded-full"><UserIcon className="text-white h-5 w-5" /></div>
                         <div><h2 className="text-white font-bold text-lg">Editar Perfil</h2><p className="text-green-100 text-xs">Actualiza tu información personal</p></div>
                      </div>
                      <form onSubmit={handleSaveProfile} className="p-4 md:p-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <FormInput label="Tipo de Identificación" type="select" name="identificationType" value={currentUserData.identificationType || 'Cedula'} onChange={handleInputChange} options={['Cedula', 'Pasaporte', 'RUC']} />
                            <FormInput label="Número de Identificación" name="identificationNumber" value={currentUserData.identificationNumber || ''} onChange={handleInputChange} placeholder="1150567789" />
                            <FormInput label="Nombres" name="name" value={currentUserData.name} onChange={handleInputChange} />
                            <FormInput label="Apellidos" name="lastName" value={currentUserData.lastName || ''} onChange={handleInputChange} placeholder="Apellidos" />
                            <FormInput label="Fecha de Nacimiento" type="date" name="birthDate" value={currentUserData.birthDate || ''} onChange={handleInputChange} />
                            <FormInput label="Dirección" name="address" value={currentUserData.address || ''} onChange={handleInputChange} placeholder="Ingrese la dirección" />
                            <FormInput label="Género" type="select" name="gender" value={currentUserData.gender || 'No definido'} onChange={handleInputChange} options={['No definido', 'Masculino', 'Femenino', 'Otro']} />
                            <FormInput label="Teléfono" name="phone" value={currentUserData.phone || ''} onChange={handleInputChange} placeholder="0991234567" />
                            <FormInput label="Correo Electrónico" name="email" value={currentUserData.email} onChange={handleInputChange} />
                            <div className="group">
                               <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Nueva Contraseña</label>
                               <input type="password" placeholder="........." className="w-full bg-[#2a2e2a] text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] outline-none transition-all" />
                            </div>
                            <div className="group">
                               <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Tipo tarifa</label>
                               <div className="w-full bg-[#252525] text-gray-300 border border-gray-700 rounded-lg px-4 py-3 text-sm flex items-center">{currentUserData.tariffType || 'General'}</div>
                            </div>
                            <div className="group">
                               <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Saldo Disponible</label>
                               <div className="w-full bg-[#252525] text-green-400 font-bold border border-gray-700 rounded-lg px-4 py-3 text-sm flex items-center">${currentUserData.balance?.toFixed(2) || '0.00'}</div>
                            </div>
                         </div>
                      </form>
                      <div className="p-4 bg-[#1e1e1e] border-t border-gray-800 flex flex-col sm:flex-row justify-center gap-4 pb-8">
                         <button onClick={onGoHome} className="bg-red-900/80 hover:bg-red-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"><Trash2 size={16} className="rotate-180" /> Cancelar</button>
                         <button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto">
                            {saveSuccess ? <Check size={16}/> : <Settings size={16} />} {saveSuccess ? 'Guardado' : 'Guardar Cambios'}
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'settings' && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Configuración</h2>
                    <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 p-6 space-y-6">
                        <div className="flex items-center justify-between p-3 bg-[#2a2e2a] rounded-lg">
                            <div><h4 className="font-bold text-white text-sm md:text-base">Notificaciones de Viaje</h4><p className="text-xs text-gray-500">Recibir alertas sobre retrasos.</p></div>
                            <input type="checkbox" checked={settings.notifications} onChange={() => handleSettingChange('notifications')} className="accent-[#2ecc71] w-5 h-5"/>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#2a2e2a] rounded-lg">
                            <div><h4 className="font-bold text-white text-sm md:text-base">Boletín Informativo</h4><p className="text-xs text-gray-500">Recibir ofertas y noticias.</p></div>
                            <input type="checkbox" checked={settings.newsletter} onChange={() => handleSettingChange('newsletter')} className="accent-[#2ecc71] w-5 h-5"/>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#2a2e2a] rounded-lg">
                            <div><h4 className="font-bold text-white text-sm md:text-base">Autenticación de 2 Pasos</h4><p className="text-xs text-gray-500">Mayor seguridad para tu cuenta.</p></div>
                            <input type="checkbox" checked={settings.twoFactor} onChange={() => handleSettingChange('twoFactor')} className="accent-[#2ecc71] w-5 h-5"/>
                        </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Mock Add Card Modal */}
      {showPaymentModal && (
          <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-[#1e1e1e] rounded-xl p-6 w-full max-w-md border border-gray-800 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Agregar Tarjeta</h3>
                  <form onSubmit={handleAddCard} className="space-y-4">
                      <FormInput label="Nombre del Titular" required />
                      <FormInput label="Número de Tarjeta" placeholder="0000 0000 0000 0000" required />
                      <div className="grid grid-cols-2 gap-4">
                          <FormInput label="Expiración (MM/YY)" required />
                          <FormInput label="CVC" required />
                      </div>
                      <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-2 text-gray-400 hover:text-white border border-gray-700 rounded-lg">Cancelar</button>
                          <button type="submit" className="flex-1 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold rounded-lg">Agregar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

const SidebarBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-6 py-4 border-l-4 transition-all text-left ${active ? 'bg-[#2a2e2a] border-[#2ecc71] text-white' : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}>{icon} {label}</button>
);

const StatCard = ({ title, value, icon, smallValue }: any) => (
  <div className="bg-[#1e1e1e] p-5 rounded-xl border border-gray-800 shadow-lg">
      <div className="flex justify-between items-start mb-2"><span className="text-gray-400 text-xs uppercase font-bold">{title}</span>{icon}</div>
      <div className={`${smallValue ? 'text-lg' : 'text-3xl'} font-bold text-white truncate`} title={typeof value === 'string' ? value : undefined}>{value}</div>
  </div>
);

const FormInput = ({ label, type = "text", options, ...props }: any) => (
    <div className="group">
        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">{label}</label>
        {type === 'select' ? (
            <select className="w-full bg-[#2a2e2a] text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-[#2ecc71] outline-none" {...props}>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input type={type} className="w-full bg-[#2a2e2a] text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-[#2ecc71] outline-none placeholder-gray-600" {...props} />
        )}
    </div>
);

export default ClientDashboard;