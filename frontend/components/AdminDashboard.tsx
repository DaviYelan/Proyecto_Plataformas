import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bus, Map, Users, Settings, LogOut, Plus, 
  Trash2, User as UserIcon, Tag, GitCommit, Clock, Menu, X, DollarSign, TrendingUp, Edit, Save, Eye, Download, Check, Truck, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Cooperative, Stopover, Discount, RouteDefinition, Trip, BusUnit } from '../types';
import * as api from '../services/apiService';
import { useToast } from './ui/Toast';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

// --- MOCK DATA ---

const MOCK_CHART_DATA = [
  { name: 'Lun', sales: 4000, revenue: 2400 },
  { name: 'Mar', sales: 3000, revenue: 1398 },
  { name: 'Mie', sales: 2000, revenue: 9800 },
  { name: 'Jue', sales: 2780, revenue: 3908 },
  { name: 'Vie', sales: 1890, revenue: 4800 },
  { name: 'Sab', sales: 2390, revenue: 3800 },
  { name: 'Dom', sales: 3490, revenue: 4300 },
];

// --- MAIN COMPONENT ---

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    const toast = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cooperatives' | 'buses' | 'routes' | 'schedules' | 'users' | 'scales' | 'discounts' | 'settings' | 'profile'>('dashboard');
  const [currentAdmin, setCurrentAdmin] = useState<User>(user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data States
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [buses, setBuses] = useState<BusUnit[]>([]);
  const [routesDef, setRoutesDef] = useState<RouteDefinition[]>([]);
  const [schedules, setSchedules] = useState<Trip[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [scales, setScales] = useState<Stopover[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [boletos, setBoletos] = useState<api.BoletoBackend[]>([]);

  // Función para recargar boletos
  const refreshBoletos = async () => {
    try {
      console.log('Recargando boletos...');
      const boletosData = await api.getBoletos();
      setBoletos(boletosData);
      console.log('Boletos recargados:', boletosData.length);
    } catch (error) {
      console.error('Error al recargar boletos:', error);
    }
  };

  // Auto-actualizar boletos cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshBoletos();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Cargar datos del backend al iniciar
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [coopData, busData, rutaData, horarioData, escalaData, descuentoData, personaData, boletosData] = await Promise.all([
          api.getCooperativas(),
          api.getBuses(),
          api.getRutas(),
          api.getHorarios(),
          api.getEscalas(),
          api.getDescuentos(),
          api.getPersonas(),
          api.getBoletos()
        ]);

        setCooperatives(coopData.map(api.mapCooperativa));
        setBuses(busData.map(api.mapBus));
        setRoutesDef(rutaData.map(api.mapRuta));
        setSchedules(horarioData.map(api.mapHorario));
        setScales(escalaData.map(api.mapEscala));
        setDiscounts(descuentoData.map(api.mapDescuento));
        setUsers(personaData.map(api.mapPersona));
        setBoletos(boletosData);
        
        console.log('Cooperativas cargadas:', coopData.map(api.mapCooperativa));
        console.log('Buses cargados:', busData.map(api.mapBus));
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Handlers
  const handleDelete = async (setter: any, id: string, type: string) => {
    if (window.confirm('¿Confirmar eliminación? Esta acción no se puede deshacer.')) {
                  if (!success) toast.show('Error al eliminar el registro','error');
        const numId = parseInt(id);
        let success = false;
        
        try {
          switch (type) {
            case 'cooperative':
              success = await api.deleteCooperativa(numId);
              if (success) {
                const coopList = await api.getCooperativas();
                setCooperatives(coopList.map(api.mapCooperativa));
              }
              break;
            case 'bus':
              success = await api.deleteBus(numId);
              if (success) {
                const busList = await api.getBuses();
                setBuses(busList.map(api.mapBus));
              }
              break;
            case 'route':
              success = await api.deleteRuta(numId);
              if (success) {
                const rutasList = await api.getRutas();
                setRoutesDef(rutasList.map(api.mapRuta));
              }
              break;
            case 'schedule':
              success = await api.deleteHorario(numId);
              if (success) {
                const horariosList = await api.getHorarios();
                setSchedules(horariosList.map(api.mapHorario));
              }
              break;
            case 'scale':
              success = await api.deleteEscala(numId);
              if (success) {
                const escalasList = await api.getEscalas();
                setScales(escalasList.map(api.mapEscala));
              }
              break;
            case 'discount':
              success = await api.deleteDescuento(numId);
              if (success) {
                const descuentosList = await api.getDescuentos();
                setDiscounts(descuentosList.map(api.mapDescuento));
              }
              break;
            case 'user':
              success = await api.deletePersona(numId);
              if (success) {
                const personasList = await api.getPersonas();
                setUsers(personasList.map(api.mapPersona));
              }
              break;
          }
          
          if (!success) {
            toast.show('Error al eliminar el registro','error');
          }
        } catch (error) {
          console.error('Error al eliminar:', error);
          toast.show('Error al procesar la eliminación','error');
        }
    }
  };

  const handleEdit = (type: string, item: any) => {
      setModalType(type);
      setEditingItem(item);
      setModalOpen(true);
  };

  const handleAdd = (type: string) => {
      setModalType(type);
      setEditingItem(null); // Null means new item
      setModalOpen(true);
  };

  const handleSaveItem = async (formData: any) => {
    try {
      console.log('handleSaveItem llamado con:', { modalType, formData, isEditing: editingItem !== null });
      const isEditing = editingItem !== null;
      let success = false;
      
      switch (modalType) {
        case 'cooperative': {
          const coopData = {
            id_cooperativa: isEditing ? parseInt(editingItem.id) : undefined,
            nombre_cooperativa: formData.name,
            ruc: formData.ruc,
            direccion: formData.address,
            telefono: formData.phone,
            correo_empresarial: formData.email
          };
          
          console.log('Datos de cooperativa a guardar:', coopData);
          
          if (isEditing) {
            success = await api.updateCooperativa(coopData as api.CooperativaBackend);
          } else {
            success = await api.saveCooperativa(coopData);
          }
          
          console.log('Resultado de guardar cooperativa:', success);
          
          if (success) {
            const coopList = await api.getCooperativas();
            setCooperatives(coopList.map(api.mapCooperativa));
          }
          break;
        }
        
        case 'bus': {
          console.log('formData completo:', formData);
          console.log('cooperatives disponibles:', cooperatives);
          const selectedCoop = cooperatives.find(c => c.id === (formData.cooperativeId || '1'));
          console.log('cooperativa seleccionada:', selectedCoop, 'ID buscado:', formData.cooperativeId);
          
          const cooperativaId = selectedCoop ? parseInt(selectedCoop.id) : 1;
          
          if (isEditing) {
            // Para actualizar, el backend espera 'id' no 'id_bus'
            const updateData = {
              id: parseInt(editingItem.id),
              numero_bus: editingItem.numero_bus,
              placa: formData.plate,
              marca: formData.brand,
              modelo: formData.model,
              capacidad_pasajeros: parseInt(formData.capacity) || 0,
              velocidad: parseInt(formData.speedLimit) || 0,
              estado_bus: formData.status === 'active' ? 'Activo' : 'Inactivo',
              cooperativa_id: cooperativaId
            };
            console.log('Datos para actualizar:', updateData);
            success = await api.updateBus(updateData as any);
          } else {
            // Para crear, numero_bus debe ser un número pequeño (no timestamp)
            // Usando Math.floor(Math.random() * 10000) para generar un número entre 0-9999
            const createData: Partial<api.BusBackend> = {
              numero_bus: Math.floor(Math.random() * 10000),
              placa: formData.plate,
              marca: formData.brand,
              modelo: formData.model,
              capacidad_pasajeros: parseInt(formData.capacity) || 0,
              velocidad: parseInt(formData.speedLimit) || 0,
              estado_bus: formData.status === 'active' ? 'Activo' : 'Inactivo',
              cooperativa_id: cooperativaId
            };
            console.log('Datos para crear:', createData);
            success = await api.saveBus(createData);
          }
          
          console.log('Resultado de guardar bus:', success);
          
          if (success) {
            const busList = await api.getBuses();
            setBuses(busList.map(api.mapBus));
          }
          break;
        }
        
        case 'route': {
          const rutaData: any = {
            id_ruta: isEditing ? parseInt(editingItem.id) : undefined,
            origen: formData.origin,
            destino: formData.destination,
            precio_unitario: parseFloat(formData.basePrice) || 0,
            distancia: parseInt(formData.distancekm) || 0,
            tiempo_estimado: formData.estimatedDuration,
            estado_ruta: 'Disponible',
            bus: { id_bus: 1 }
          };
          
          console.log('Datos de ruta a guardar:', rutaData);
          
          if (isEditing) {
            success = await api.updateRuta(rutaData);
          } else {
            success = await api.saveRuta(rutaData);
          }
          
          console.log('Resultado de guardar ruta:', success);
          
          if (success) {
            const rutasList = await api.getRutas();
            setRoutesDef(rutasList.map(api.mapRuta));
          }
          break;
        }
        
        case 'schedule': {
          const routeId = parseInt(formData.routeId) || 1;
          const selectedCooperativeId = formData.cooperativeId;
          
          console.log('=== GUARDANDO HORARIO ===');
          console.log('Cooperativa seleccionada:', selectedCooperativeId);
          console.log('Ruta seleccionada:', routeId);
          console.log('Cooperativas disponibles:', cooperatives);
          console.log('Buses disponibles:', buses);
          console.log('Rutas disponibles:', routesDef);
          
          // SIEMPRE actualizar la ruta con un bus de la cooperativa seleccionada
          if (selectedCooperativeId && routeId) {
            const currentRoute = routesDef.find(r => r.id === String(routeId));
            const currentBus = currentRoute?.busId ? buses.find(b => b.id === currentRoute.busId) : null;
            
            console.log('Ruta actual:', currentRoute);
            console.log('Bus actual de la ruta:', currentBus);
            console.log('Cooperativa del bus actual:', currentBus?.cooperativeId);
            
            // Buscar un bus disponible de la cooperativa seleccionada
            const newBus = buses.find(b => b.cooperativeId === selectedCooperativeId && b.status === 'active');
            
            console.log('Bus buscado para la cooperativa:', selectedCooperativeId);
            console.log('Bus encontrado:', newBus);
            
            // Si no hay bus o es de otra cooperativa, actualizar la ruta
            if (!currentBus || currentBus.cooperativeId !== selectedCooperativeId) {
              if (newBus && currentRoute) {
                console.log('Actualizando ruta con bus de la cooperativa seleccionada');
                const rutaUpdateData: any = {
                  id_ruta: parseInt(currentRoute.id),
                  origen: currentRoute.origin,
                  destino: currentRoute.destination,
                  precio_unitario: currentRoute.basePrice || 0,
                  distancia: currentRoute.distancekm || 0,
                  tiempo_estimado: currentRoute.estimatedDuration,
                  estado_ruta: 'Disponible',
                  bus: { id_bus: parseInt(newBus.id) }
                };
                
                console.log('Datos para actualizar ruta:', rutaUpdateData);
                const updateResult = await api.updateRuta(rutaUpdateData);
                console.log('Resultado de actualización de ruta:', updateResult);
                
                if (!updateResult) {
                  console.error('Error al actualizar la ruta con el nuevo bus');
                }
              } else if (!newBus) {
                console.error('No se encontró un bus disponible para la cooperativa seleccionada');
                toast.show('No hay buses disponibles para la cooperativa "' + (cooperatives.find(c => c.id === selectedCooperativeId)?.name || String(selectedCooperativeId)) + '". Por favor, crea un bus para esta cooperativa primero.','warning');
                return; // Detener el guardado
              }
            } else {
              console.log('El bus de la ruta ya pertenece a la cooperativa seleccionada');
            }
          }
          
          if (isEditing) {
            // Para actualizar: enviar con id_horario
            const updateData: Partial<api.HorarioBackend> = {
              id_horario: parseInt(editingItem.id),
              hora_salida: formData.departureTime || '00:00',
              hora_llegada: formData.arrivalTime || '00:00',
              estado_horario: formData.status === 'active' ? 'Disponible' : 'No disponible',
              ruta: { id_ruta: routeId } as api.RutaBackend
            };
            console.log('Datos de horario para actualizar:', updateData);
            success = await api.updateHorario(updateData as api.HorarioBackend);
            
            if (!success) {
              console.error('Error al actualizar el horario');
              toast.show('Error al actualizar el horario. Por favor verifica que no haya conflictos de horarios.','error');
            }
          } else {
            // Para crear: no enviar id_horario
            const createData: Partial<api.HorarioBackend> = {
              hora_salida: formData.departureTime || '00:00',
              hora_llegada: formData.arrivalTime || '00:00',
              estado_horario: formData.status === 'active' ? 'Disponible' : 'No disponible',
              ruta: { id_ruta: routeId } as api.RutaBackend
            };
            console.log('Datos de horario para crear:', createData);
            success = await api.saveHorario(createData);
          }
          
          console.log('Resultado de guardar horario:', success);
          
          if (success) {
            // Recargar horarios, cooperativas y buses para reflejar los cambios
            const [horariosList, coopList, busList, rutasList] = await Promise.all([
              api.getHorarios(),
              api.getCooperativas(),
              api.getBuses(),
              api.getRutas()
            ]);
            setSchedules(horariosList.map(api.mapHorario));
            setCooperatives(coopList.map(api.mapCooperativa));
            setBuses(busList.map(api.mapBus));
            setRoutesDef(rutasList.map(api.mapRuta));
          }
          break;
        }
        
        case 'scale': {
          const escalaData: Partial<api.EscalaBackend> = {
            id_escala: isEditing ? parseInt(editingItem.id) : undefined,
            lugar_escala: formData.location,
            tiempo: formData.duration
          };
          
          console.log('Datos de escala a guardar:', escalaData);
          
          if (isEditing) {
            success = await api.updateEscala(escalaData as api.EscalaBackend);
          } else {
            success = await api.saveEscala(escalaData);
          }
          
          console.log('Resultado de guardar escala:', success);
          
          if (success) {
            const escalasList = await api.getEscalas();
            setScales(escalasList.map(api.mapEscala));
          }
          break;
        }
        
        case 'discount': {
          const today = new Date().toISOString().split('T')[0];
          const descuentoData: Partial<api.DescuentoBackend> = {
            id_descuento: isEditing ? parseInt(editingItem.id) : undefined,
            nombre_descuento: formData.name,
            descripcion: formData.description,
            porcentaje: parseInt(formData.percentage) || 0,
            estado_descuento: formData.status === 'active' ? 'Activo' : 'Inactivo',
            tipo_descuento: formData.type || 'Promocional',
            fecha_inicio: formData.startDate || today,
            fecha_fin: formData.endDate || today
          };
          
          console.log('Datos de descuento a guardar:', descuentoData);
          
          if (isEditing) {
            success = await api.updateDescuento(descuentoData as api.DescuentoBackend);
          } else {
            success = await api.saveDescuento(descuentoData);
          }
          
          console.log('Resultado de guardar descuento:', success);
          
          if (success) {
            const descuentosList = await api.getDescuentos();
            setDiscounts(descuentosList.map(api.mapDescuento));
          }
          break;
        }
        
        case 'user': {
          const personaData: Partial<api.PersonaBackend> = {
            id_persona: isEditing ? parseInt(editingItem.id) : undefined,
            tipo_identificacion: formData.identificationType || 'Cedula',
            numero_identificacion: formData.identificationNumber,
            nombre: formData.name,
            apellido: formData.lastName,
            genero: formData.gender || 'No_definido',
            correo: formData.email,
            telefono: formData.phone || '',
            direccion: formData.address || '',
            fecha_nacimiento: formData.birthDate || '01/01/2000',
            saldo_disponible: parseFloat(formData.balance) || 0,
            tipo_tarifa: formData.tariffType || 'General',
            usuario: formData.email,
            contrasenia: formData.password || 'defaultPassword123',
            estado_cuenta: 'Activo',
            tipo_cuenta: formData.role === 'admin' ? 'Administrador' : 'Cliente'
          };
          
          console.log('Datos de persona a guardar:', personaData);
          
          if (isEditing) {
            success = await api.updatePersona(personaData as api.PersonaBackend);
          } else {
            success = await api.savePersona(personaData);
          }
          
          console.log('Resultado de guardar persona:', success);
          
          if (success) {
            const personasList = await api.getPersonas();
            setUsers(personasList.map(api.mapPersona));
          }
          break;
        }
      }
      
      console.log('Valor final de success:', success);
      
      if (success) {
        setModalOpen(false);
        setEditingItem(null);
        toast.show('¡Guardado exitosamente!','success');
      } else {
        // No cerrar el modal para que el usuario pueda corregir los datos
        toast.show('Error al guardar. Verifica:\n- Que los horarios no se solapen con otros turnos del mismo bus\n- Que la cooperativa tenga buses disponibles\n- Que todos los campos estén completos','error');
      }
    } catch (error) {
      console.error('Error en handleSaveItem:', error);
      toast.show('Error al procesar la solicitud.','error');
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#2ecc71] mx-auto mb-4" />
          <p className="text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const NavItems = () => (
     <>
        <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); closeSidebar(); }} />
        <SidebarItem icon={<Bus size={20} />} label="Cooperativas" active={activeTab === 'cooperatives'} onClick={() => { setActiveTab('cooperatives'); closeSidebar(); }} />
        <SidebarItem icon={<Truck size={20} />} label="Buses (Flota)" active={activeTab === 'buses'} onClick={() => { setActiveTab('buses'); closeSidebar(); }} />
        <SidebarItem icon={<Map size={20} />} label="Rutas" active={activeTab === 'routes'} onClick={() => { setActiveTab('routes'); closeSidebar(); }} />
        <SidebarItem icon={<Clock size={20} />} label="Horarios" active={activeTab === 'schedules'} onClick={() => { setActiveTab('schedules'); closeSidebar(); }} />
        <SidebarItem icon={<GitCommit size={20} />} label="Escalas" active={activeTab === 'scales'} onClick={() => { setActiveTab('scales'); closeSidebar(); }} />
        <SidebarItem icon={<Users size={20} />} label="Clientes" active={activeTab === 'users'} onClick={() => { setActiveTab('users'); closeSidebar(); }} />
        <SidebarItem icon={<Tag size={20} />} label="Descuentos" active={activeTab === 'discounts'} onClick={() => { setActiveTab('discounts'); closeSidebar(); }} />
        <SidebarItem icon={<Settings size={20} />} label="Configuración" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); closeSidebar(); }} />
        <SidebarItem icon={<UserIcon size={20} />} label="Mi Perfil" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); closeSidebar(); }} />
     </>
  );

  return (
    <div className="min-h-screen bg-[#121212] flex font-sans text-gray-200 pt-16 lg:pt-0">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-[#1e1e1e] border-b border-gray-800 z-30 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="bg-[#2ecc71] p-1 rounded">
               <Bus className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">AdminPanel</span>
         </div>
         <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-300">
            <Menu size={24} />
         </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-[#1e1e1e] border-r border-gray-800 flex-col fixed h-full z-20 overflow-y-auto">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="bg-[#2ecc71] p-1.5 rounded-lg">
            <Bus className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">AdminPanel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2"><NavItems /></nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors text-sm">
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeSidebar}></div>
              <div className="relative w-3/4 max-w-xs bg-[#1e1e1e] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
                  <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <span className="font-bold text-white text-lg">Menú Admin</span>
                    <button onClick={closeSidebar}><X size={24} className="text-gray-400"/></button>
                  </div>
                  <nav className="flex-1 p-4 space-y-2 overflow-y-auto"><NavItems /></nav>
                  <div className="p-4 border-t border-gray-800">
                    <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 bg-red-900/10 px-3 py-3 rounded-lg text-sm font-bold"><LogOut size={16} /> Cerrar Sesión</button>
                  </div>
              </div>
          </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto w-full">
        {activeTab === 'dashboard' && <DashboardOverview boletos={boletos} users={users} routes={routesDef} currentAdmin={currentAdmin} />}
        {activeTab === 'cooperatives' && <ManageCooperatives data={cooperatives} onAdd={() => handleAdd('cooperative')} onEdit={(item: any) => handleEdit('cooperative', item)} onDelete={(id: string) => handleDelete(setCooperatives, id, 'cooperative')} />}
        {activeTab === 'buses' && <ManageBuses data={buses} onAdd={() => handleAdd('bus')} onEdit={(item: any) => handleEdit('bus', item)} onDelete={(id: string) => handleDelete(setBuses, id, 'bus')} />}
        {activeTab === 'routes' && <ManageRoutes data={routesDef} onAdd={() => handleAdd('route')} onEdit={(item: any) => handleEdit('route', item)} onDelete={(id: string) => handleDelete(setRoutesDef, id, 'route')} />}
        {activeTab === 'schedules' && <ManageSchedules data={schedules} onAdd={() => handleAdd('schedule')} onEdit={(item: any) => handleEdit('schedule', item)} onDelete={(id: string) => handleDelete(setSchedules, id, 'schedule')} />}
        {activeTab === 'users' && <ManageUsers data={users} onAdd={() => handleAdd('user')} onEdit={(item: any) => handleEdit('user', item)} onDelete={(id: string) => handleDelete(setUsers, id, 'user')} />}
        {activeTab === 'scales' && <ManageScales data={scales} onAdd={() => handleAdd('scale')} onEdit={(item: any) => handleEdit('scale', item)} onDelete={(id: string) => handleDelete(setScales, id, 'scale')} />}
        {activeTab === 'discounts' && <ManageDiscounts data={discounts} onAdd={() => handleAdd('discount')} onEdit={(item: any) => handleEdit('discount', item)} onDelete={(id: string) => handleDelete(setDiscounts, id, 'discount')} />}
        {activeTab === 'tickets' && (
          <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Gestión de Boletos</h2>
            <div className="text-sm text-gray-400 mb-4">Se actualiza automáticamente cada 30 segundos</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-gray-300 font-semibold">ID</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Cliente</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Ruta</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Asiento</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Precio</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Estado</th>
                    <th className="px-4 py-3 text-gray-300 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {boletos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-400">No hay boletos registrados</td>
                    </tr>
                  ) : (
                    boletos.map((boleto) => (
                      <tr key={boleto.id_boleto} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3 text-gray-300">{boleto.id_boleto}</td>
                        <td className="px-4 py-3 text-gray-300">{boleto.persona?.nombre} {boleto.persona?.apellido}</td>
                        <td className="px-4 py-3 text-gray-300">{boleto.turno?.horario?.ruta?.origen} → {boleto.turno?.horario?.ruta?.destino}</td>
                        <td className="px-4 py-3 text-[#2ecc71] font-semibold">{boleto.numero_asiento}</td>
                        <td className="px-4 py-3 text-gray-300">${boleto.precio_final.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            boleto.estado_boleto === 'Activo' ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-gray-400'
                          }`}>
                            {boleto.estado_boleto}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{new Date(boleto.fecha_compra).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'settings' && <ManageSettings />}
        {activeTab === 'profile' && <AdminProfile user={currentAdmin} onUpdate={(d: any) => setCurrentAdmin(prev => ({...prev, ...d}))} />}
      </main>

      {/* Generic Modal Form Overlay */}
      {modalOpen && (
          <ModalForm 
            type={modalType} 
            data={editingItem}
            cooperatives={cooperatives}
            buses={buses}
            routesDef={routesDef}
            onClose={() => setModalOpen(false)} 
            onSave={handleSaveItem} 
          />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left ${active ? 'bg-[#2ecc71] text-white shadow-lg shadow-green-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const DashboardOverview = ({ boletos, users, routes, currentAdmin }: { boletos: api.BoletoBackend[], users: User[], routes: RouteDefinition[], currentAdmin: User }) => {
    // Calcular estadísticas reales
    const totalSales = boletos.reduce((sum, b) => sum + (b.precio_final || 0), 0);
    const totalTickets = boletos.length;
    const totalClients = users.length;
    const activeRoutes = routes.filter(r => r.status === 'active').length;

    return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Bienvenido {currentAdmin.name}</h1>
          <p className="text-gray-400 mt-1">Resumen de la actividad de hoy.</p>
        </div>
        <button className="bg-[#2a2e2a] hover:bg-[#323632] text-white px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors flex items-center gap-2">
            <Download size={16}/> Descargar Reporte
        </button>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Ventas Totales" value={`$${totalSales.toLocaleString('es-EC', { minimumFractionDigits: 2 })}`} change="+15%" icon={<DollarSign className="text-green-400" />} />
        <StatCard title="Boletos Vendidos" value={totalTickets.toLocaleString()} change="+8%" icon={<TrendingUp className="text-[#2ecc71]" />} />
        <StatCard title="Clientes Registrados" value={totalClients.toLocaleString()} change="+2%" icon={<Users className="text-blue-400" />} />
        <StatCard title="Rutas Activas" value={activeRoutes.toLocaleString()} change="0%" icon={<Map className="text-purple-400" />} />
      </div>

      <div className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 shadow-lg">
         <h3 className="text-lg font-bold text-white mb-6">Ingresos Semanales</h3>
         <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }} itemStyle={{ color: '#2ecc71' }} />
                    <Area type="monotone" dataKey="sales" stroke="#2ecc71" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
    );
};

const StatCard = ({ title, value, change, icon }: any) => (
  <div className="bg-[#1e1e1e] p-5 rounded-xl border border-gray-800 shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-gray-800 rounded-lg">{icon}</div>
      <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">{change}</span>
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-gray-400 text-xs uppercase font-bold">{title}</p>
  </div>
);

const TableWrapper = ({ children }: any) => (
    <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            {children}
        </div>
    </div>
);

const ManageCooperatives = ({ data, onAdd, onEdit, onDelete }: any) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
             <h2 className="text-xl md:text-2xl font-bold text-white">Cooperativas</h2>
             <button onClick={onAdd} className="bg-[#2ecc71] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Agregar</button>
        </div>
        <TableWrapper>
             <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                <thead className="bg-[#252525] text-gray-200 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">RUC</th>
                        <th className="px-6 py-4">Dirección</th>
                        <th className="px-6 py-4">Teléfono</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {data.map((c: Cooperative) => (
                        <tr key={c.id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 font-bold text-white">{c.name}</td>
                            <td className="px-6 py-4 font-mono text-[#2ecc71]">{c.ruc || 'N/A'}</td>
                            <td className="px-6 py-4">{c.address || 'N/A'}</td>
                            <td className="px-6 py-4">{c.phone || 'N/A'}</td>
                            <td className="px-6 py-4">{c.email}</td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => onEdit(c)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Edit size={16}/></button>
                                <button onClick={() => onDelete(c.id)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </TableWrapper>
    </div>
);

const ManageBuses = ({ data, onAdd, onEdit, onDelete }: any) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
             <h2 className="text-xl md:text-2xl font-bold text-white">Flota de Buses</h2>
             <button onClick={onAdd} className="bg-[#2ecc71] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Agregar Bus</button>
        </div>
        <TableWrapper>
             <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                <thead className="bg-[#252525] text-gray-200 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">#Bus (ID)</th>
                        <th className="px-6 py-4">Placa</th>
                        <th className="px-6 py-4">Marca</th>
                        <th className="px-6 py-4">Modelo</th>
                        <th className="px-6 py-4">Capacidad</th>
                        <th className="px-6 py-4">Velocidad</th>
                        <th className="px-6 py-4">Cooperativa</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {data.map((b: BusUnit) => (
                        <tr key={b.id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 font-bold text-white">{b.id}</td>
                            <td className="px-6 py-4 font-mono text-[#2ecc71]">{b.plate}</td>
                            <td className="px-6 py-4">{b.brand}</td>
                            <td className="px-6 py-4">{b.model}</td>
                            <td className="px-6 py-4">{b.capacity} pax</td>
                            <td className="px-6 py-4">{b.speedLimit} km/h</td>
                            <td className="px-6 py-4">{b.cooperative}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs ${b.status === 'active' ? 'bg-green-500/10 text-green-400' : b.status === 'maintenance' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {b.status === 'active' ? 'Activo' : b.status === 'maintenance' ? 'Mantenimiento' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => onEdit(b)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Edit size={16}/></button>
                                <button onClick={() => onDelete(b.id)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </TableWrapper>
    </div>
);

const ManageRoutes = ({ data, onAdd, onEdit, onDelete }: any) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
             <h2 className="text-xl md:text-2xl font-bold text-white">Rutas</h2>
             <button onClick={onAdd} className="bg-[#2ecc71] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Nueva Ruta</button>
        </div>
        <TableWrapper>
             <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                <thead className="bg-[#252525] text-gray-200 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Origen</th>
                        <th className="px-6 py-4">Destino</th>
                        <th className="px-6 py-4">Distancia</th>
                        <th className="px-6 py-4">T. Estimado</th>
                        <th className="px-6 py-4">Precio Base</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {data.map((r: RouteDefinition) => (
                        <tr key={r.id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 text-white font-medium">{r.origin}</td>
                            <td className="px-6 py-4 text-white font-medium">{r.destination}</td>
                            <td className="px-6 py-4">{r.distancekm} km</td>
                            <td className="px-6 py-4">{r.estimatedDuration}</td>
                            <td className="px-6 py-4 font-bold text-[#2ecc71]">${r.basePrice.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs ${r.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {r.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => onEdit(r)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Edit size={16}/></button>
                                <button onClick={() => onDelete(r.id)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </TableWrapper>
    </div>
);

const ManageSchedules = ({ data, onAdd, onEdit, onDelete }: any) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
             <h2 className="text-xl md:text-2xl font-bold text-white">Horarios (Turnos)</h2>
             <button onClick={onAdd} className="bg-[#2ecc71] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Nuevo Turno</button>
        </div>
        <TableWrapper>
             <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                <thead className="bg-[#252525] text-gray-200 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Hora Salida</th>
                        <th className="px-6 py-4">Hora Llegada</th>
                        <th className="px-6 py-4">Ruta</th>
                        <th className="px-6 py-4">Bus</th>
                        <th className="px-6 py-4">Cooperativa</th>
                        <th className="px-6 py-4">Precio</th>
                         <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {data.map((t: Trip) => (
                        <tr key={t.id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 font-bold text-white">{t.departureTime}</td>
                            <td className="px-6 py-4">{t.arrivalTime}</td>
                            <td className="px-6 py-4 text-xs">{t.origin} - {t.destination}</td>
                            <td className="px-6 py-4 font-mono text-gray-300">{t.busId || 'N/A'}</td>
                            <td className="px-6 py-4">{t.operator}</td>
                             <td className="px-6 py-4 text-[#2ecc71]">${t.price.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs ${t.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                    {t.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => onEdit(t)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Edit size={16}/></button>
                                <button onClick={() => onDelete(t.id)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </TableWrapper>
    </div>
);

const ManageUsers = ({ data, onAdd, onEdit, onDelete }: any) => (
  <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
           <h2 className="text-xl md:text-2xl font-bold text-white">Gestión de Usuarios</h2>
           <button onClick={onAdd} className="bg-[#2ecc71] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Nuevo Usuario</button>
      </div>
      <TableWrapper>
           <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
              <thead className="bg-[#252525] text-gray-200 uppercase text-xs">
                  <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Identificación</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Teléfono</th>
                      <th className="px-6 py-4">Tarifa</th>
                      <th className="px-6 py-4">Saldo</th>
                      <th className="px-6 py-4">Rol</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                  {data.map((u: User) => (
                      <tr key={u.id} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-mono text-gray-500">{u.id}</td>
                          <td className="px-6 py-4 text-white font-medium">{u.name} {u.lastName}</td>
                          <td className="px-6 py-4 font-mono">{u.identificationNumber || '-'}</td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">{u.phone || '-'}</td>
                          <td className="px-6 py-4"><span className="bg-gray-700 px-2 py-1 rounded text-xs">{u.tariffType || 'General'}</span></td>
                          <td className="px-6 py-4 font-bold text-[#2ecc71]">${u.balance?.toFixed(2) || '0.00'}</td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>{u.role === 'admin' ? 'Admin' : 'Cliente'}</span></td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => onEdit(u)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Edit size={16}/></button>
                                <button onClick={() => onDelete(u.id)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Trash2 size={16}/></button>
                          </td>
                      </tr>
                  ))}
              </tbody>
           </table>
      </TableWrapper>
  </div>
);

const ManageScales = ({ data, onAdd, onEdit, onDelete }: any) => (
  <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
           <h2 className="text-xl md:text-2xl font-bold text-white">Escalas y Paradas</h2>
           <button onClick={onAdd} className="bg-[#2ecc71] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Nueva Escala</button>
      </div>
      <TableWrapper>
           <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
              <thead className="bg-[#252525] text-gray-200 uppercase text-xs">
                  <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Lugar</th>
                      <th className="px-6 py-4">Tiempo</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                  {data.map((s: Stopover) => (
                      <tr key={s.id} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-mono text-gray-500">{s.id}</td>
                          <td className="px-6 py-4 font-bold text-white">{s.location}</td>
                          <td className="px-6 py-4">{s.arrivalTime}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <button onClick={() => onEdit(s)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Edit size={16}/></button>
                              <button onClick={() => onDelete(s.id)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Trash2 size={16}/></button>
                          </td>
                      </tr>
                  ))}
              </tbody>
           </table>
      </TableWrapper>
  </div>
);

const ManageDiscounts = ({ data, onAdd, onEdit, onDelete }: any) => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
           <h2 className="text-xl md:text-2xl font-bold text-white">Cupones y Descuentos</h2>
           <button onClick={onAdd} className="bg-[#2ecc71] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Crear Descuento</button>
      </div>
      <TableWrapper>
           <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
              <thead className="bg-[#252525] text-gray-200 uppercase text-xs">
                  <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Descripción</th>
                      <th className="px-6 py-4">Porcentaje</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                  {data.map((d: Discount) => (
                      <tr key={d.id} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-mono text-gray-500">{d.id}</td>
                          <td className="px-6 py-4"><span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs">{d.type || 'N/A'}</span></td>
                          <td className="px-6 py-4 font-bold text-white">{d.name}</td>
                          <td className="px-6 py-4 text-xs text-gray-400 max-w-[250px] truncate" title={d.description}>{d.description || 'N/A'}</td>
                          <td className="px-6 py-4 font-bold text-[#2ecc71]">{d.percentage}%</td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs ${d.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                  {d.status === 'active' ? 'Activo' : 'Inactivo'}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <button onClick={() => onEdit(d)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Edit size={16}/></button>
                              <button onClick={() => onDelete(d.id)} className="text-[#2ecc71] hover:text-[#24a038] p-2 rounded transition-colors"><Trash2 size={16}/></button>
                          </td>
                      </tr>
                  ))}
              </tbody>
           </table>
      </TableWrapper>
    </div>
);

const ManageSettings = () => (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
        <h2 className="text-xl md:text-2xl font-bold text-white">Configuración del Sistema</h2>
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div>
                    <h4 className="font-bold text-white">Modo Mantenimiento</h4>
                    <p className="text-sm text-gray-500">Desactiva el acceso a clientes temporalmente.</p>
                </div>
                <input type="checkbox" className="accent-[#2ecc71] w-6 h-6" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div>
                    <h4 className="font-bold text-white">Notificaciones por Email</h4>
                    <p className="text-sm text-gray-500">Enviar correos automáticos de confirmación.</p>
                </div>
                <input type="checkbox" defaultChecked className="accent-[#2ecc71] w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-white">Copias de Seguridad</h4>
                    <p className="text-sm text-gray-500">Realizar backup diario de la base de datos.</p>
                </div>
                <button className="text-[#2ecc71] text-sm font-medium hover:underline">Configurar</button>
            </div>
        </div>
    </div>
);

const AdminProfile = ({ user, onUpdate }: any) => {
    const [formData, setFormData] = useState(user);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
             <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-white">Mi Perfil</h2>
             </div>
             <form onSubmit={handleSubmit} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#2a2e2a] text-white border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#2ecc71]" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Apellido</label>
                        <input type="text" value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-[#2a2e2a] text-white border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#2ecc71]" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#2a2e2a] text-white border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#2ecc71]" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Teléfono</label>
                        <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#2a2e2a] text-white border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#2ecc71]" />
                    </div>
                    <div className="md:col-span-2 pt-4 border-t border-gray-800 mt-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cambiar Contraseña</label>
                        <input type="password" placeholder="Nueva contraseña (dejar en blanco para mantener)" className="w-full bg-[#2a2e2a] text-white border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#2ecc71]" />
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <button type="submit" className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg">
                        {success ? <Check size={18} /> : <Save size={18} />} {success ? 'Guardado' : 'Guardar Cambios'}
                    </button>
                </div>
             </form>
        </div>
    );
};

const ModalForm = ({ type, data, cooperatives, buses, routesDef, onClose, onSave }: any) => {
    const getInitialFormData = () => {
        // Si hay data para editar, usar esos datos
        if (data) {
            // Para schedules, obtener la cooperativa desde la ruta asociada
            if (type === 'schedule' && data.routeId) {
                const route = routesDef.find(r => r.id === data.routeId);
                if (route && route.busId) {
                    const bus = buses.find(b => b.id === route.busId);
                    if (bus && bus.cooperativeId) {
                        return {
                            ...data,
                            cooperativeId: bus.cooperativeId,
                            routeId: data.routeId || '1',
                            status: data.status || 'active'
                        };
                    }
                }
            }
            
            return {
                ...data,
                cooperativeId: data.cooperativeId || cooperatives[0]?.id?.toString() || '1',
                routeId: data.routeId || '1',
                status: data.status || 'active'
            };
        }
        
        // Para crear nuevo
        if (type === 'bus') {
            return { cooperativeId: cooperatives[0]?.id?.toString() || '1', status: 'active' };
        }
        if (type === 'schedule') {
            return { 
                routeId: routesDef[0]?.id?.toString() || '1',
                cooperativeId: cooperatives[0]?.id?.toString() || '1',
                departureTime: '08:00',
                arrivalTime: '12:00',
                status: 'active'
            };
        }
        return {};
    };

    const [formData, setFormData] = useState(getInitialFormData());

    const handleChange = (e: any) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const renderFields = () => {
        switch(type) {
            case 'cooperative':
                return (
                    <>
                        <input name="name" placeholder="Nombre Cooperativa" defaultValue={data?.name} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="ruc" placeholder="RUC" defaultValue={data?.ruc} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="address" placeholder="Dirección" defaultValue={data?.address} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="phone" placeholder="Teléfono" defaultValue={data?.phone} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="email" placeholder="Email" defaultValue={data?.email} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                    </>
                );
            case 'bus':
                return (
                    <>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                             <input name="id" placeholder="# Bus (ID)" defaultValue={data?.id} onChange={handleChange} className="bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" />
                             <input name="plate" placeholder="Placa" defaultValue={data?.plate} onChange={handleChange} className="bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" />
                        </div>
                        <input name="brand" placeholder="Marca" defaultValue={data?.brand} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="model" placeholder="Modelo" defaultValue={data?.model} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                         <div className="grid grid-cols-2 gap-3 mb-3">
                             <input name="capacity" type="number" placeholder="Capacidad" defaultValue={data?.capacity} onChange={handleChange} className="bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" />
                             <input name="speedLimit" type="number" placeholder="Velocidad Límite" defaultValue={data?.speedLimit} onChange={handleChange} className="bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" />
                        </div>
                        <select name="cooperativeId" value={formData.cooperativeId || cooperatives[0]?.id || '1'} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3">
                            {cooperatives.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select name="status" value={formData.status || 'active'} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3">
                            <option value="active">Activo</option>
                            <option value="maintenance">Mantenimiento</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </>
                );
            case 'route':
                return (
                    <>
                        <input name="origin" placeholder="Origen" defaultValue={data?.origin} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="destination" placeholder="Destino" defaultValue={data?.destination} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="distancekm" type="number" placeholder="Distancia (km)" defaultValue={data?.distancekm} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="estimatedDuration" placeholder="Duración Estimada" defaultValue={data?.estimatedDuration} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                        <input name="basePrice" type="number" placeholder="Precio Base" defaultValue={data?.basePrice} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                    </>
                );
            case 'schedule': {
                // Obtener la cooperativa de la ruta seleccionada
                const selectedRoute = formData.routeId ? routesDef.find(r => r.id === formData.routeId) : null;
                const selectedBus = selectedRoute?.busId ? buses.find(b => b.id === selectedRoute.busId) : null;
                const routeCooperativeId = selectedBus?.cooperativeId;
                const routeCooperative = routeCooperativeId ? cooperatives.find(c => c.id === routeCooperativeId) : null;
                
                return (
                    <>
                        <label className="text-gray-400 text-sm mb-1 block">Cooperativa</label>
                        <select name="cooperativeId" value={formData.cooperativeId || cooperatives[0]?.id || '1'} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3">
                            {cooperatives.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        
                        <label className="text-gray-400 text-sm mb-1 block">Ruta</label>
                        <select name="routeId" value={String(formData.routeId) || ''} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3">
                            <option value="">Seleccionar Ruta</option>
                            {routesDef.map(route => (
                                <option key={route.id} value={String(route.id)}>{route.origin} → {route.destination}</option>
                            ))}
                        </select>
                        
                        {routeCooperative && formData.cooperativeId !== routeCooperative.id && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-3 rounded mb-3 text-xs">
                                ⚠️ La ruta seleccionada pertenece a "{routeCooperative.name}". Al guardar, se asociará con la cooperativa: "{cooperatives.find(c => c.id === formData.cooperativeId)?.name}"
                            </div>
                        )}
                        
                        <label className="text-gray-400 text-sm mb-1 block">Horarios</label>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                             <input name="departureTime" type="time" value={formData.departureTime || ''} onChange={handleChange} className="bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" placeholder="Salida" />
                             <input name="arrivalTime" type="time" value={formData.arrivalTime || ''} onChange={handleChange} className="bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" placeholder="Llegada" />
                        </div>
                        
                        <label className="text-gray-400 text-sm mb-1 block">Estado</label>
                        <select name="status" value={formData.status || 'active'} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3">
                            <option value="active">Disponible</option>
                            <option value="inactive">No disponible</option>
                        </select>
                    </>
                );
            }
            case 'user':
                return (
                    <>
                       <input name="name" placeholder="Nombre" defaultValue={data?.name} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                       <input name="lastName" placeholder="Apellido" defaultValue={data?.lastName} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                       <input name="email" placeholder="Email" defaultValue={data?.email} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                       <input name="identificationNumber" placeholder="Cédula/ID" defaultValue={data?.identificationNumber} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                       <select name="role" defaultValue={data?.role || 'client'} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3">
                           <option value="client">Cliente</option>
                           <option value="admin">Administrador</option>
                       </select>
                    </>
                );
            case 'discount':
                return (
                    <>
                       <div className="grid grid-cols-2 gap-3 mb-3">
                            <input name="type" placeholder="Tipo" defaultValue={data?.type} onChange={handleChange} className="bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" />
                            <input name="code" placeholder="Código" defaultValue={data?.code} onChange={handleChange} className="bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" />
                       </div>
                       <input name="name" placeholder="Nombre" defaultValue={data?.name} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                       <textarea name="description" placeholder="Descripción" defaultValue={data?.description} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3 h-20 resize-none" />
                       <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Fecha Inicio</label>
                                <input name="startDate" type="date" defaultValue={data?.startDate} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Fecha Fin</label>
                                <input name="validUntil" type="date" defaultValue={data?.validUntil} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white" />
                            </div>
                       </div>
                       <input name="percentage" type="number" placeholder="Porcentaje %" defaultValue={data?.percentage} onChange={handleChange} className="w-full bg-[#2a2e2a] p-3 rounded border border-gray-700 text-white mb-3" />
                    </>
                );
            default:
                return <p className="text-gray-400">Formulario no configurado para {type}</p>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-[#252525] p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-white capitalize">{data ? 'Editar' : 'Nuevo'} {type}</h3>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
                </div>
                <div className="p-6">
                    {renderFields()}
                </div>
                <div className="p-4 bg-[#252525] border-t border-gray-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">Cancelar</button>
                    <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold rounded shadow-lg">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;