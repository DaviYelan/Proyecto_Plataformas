const API_BASE = '';

// Tipos de respuesta del backend
export interface CooperativaBackend {
  id_cooperativa: number;
  nombre_cooperativa: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo_empresarial: string;
}

export interface BusBackend {
  id_bus: number;
  numero_bus: number;
  placa: string;
  marca: string;
  modelo: string;
  capacidad_pasajeros: number;
  Velocidad: number;
  estado_bus: string;
  cooperativa: CooperativaBackend;
}

export interface RutaBackend {
  id_ruta: number;
  origen: string;
  destino: string;
  precio_unitario: number;
  distancia: number;
  tiempo_estimado: string;
  estado_ruta: string;
  bus: BusBackend;
}

export interface HorarioBackend {
  id_horario: number;
  hora_salida: string;
  hora_llegada: string;
  estado_horario: string;
  ruta: RutaBackend;
}

export interface EscalaBackend {
  id_escala: number;
  lugar_escala: string;
  tiempo: string;
}

export interface TurnoBackend {
  id_turno: number;
  fecha_salida: string;
  numero_turno: number;
  estado_turno: string;
  horario: HorarioBackend;
}

export interface MetodoPagoBackend {
  id_pago: number;
  saldo: number;
  numero_tarjeta: string;
  titular: string;
  fecha_vencimiento: string;
  codigo_seguridad: string;
  opcion_pago: string;
}

export interface BoletoBackend {
  id_boleto: number;
  fecha_compra: string;
  numero_asiento: number;
  cantidad_boleto: number;
  precio_final: number;
  estado_boleto: string;
  persona: PersonaBackend;
  turno?: TurnoBackend;
  descuento?: DescuentoBackend;
}

export interface DescuentoBackend {
  id_descuento: number;
  nombre_descuento: string;
  descripcion: string;
  porcentaje: number;
  estado_descuento: string;
  tipo_descuento: string;
}

export interface CuentaBackend {
  id_cuenta: number;
  correo: string;
  estado_cuenta: string;
  tipo_cuenta: string;
}

export interface PersonaBackend {
  id_persona: number;
  tipo_identificacion: string;
  numero_identificacion: string;
  nombre: string;
  apellido: string;
  genero: string;
  correo: string;
  telefono: string;
  direccion: string;
  fecha_nacimiento: string;
  saldo_disponible: number;
  tipo_tarifa: string;
  cuenta: CuentaBackend;
  metodo_pago?: MetodoPagoBackend;
}

// Funciones de API

// ========== COOPERATIVAS ==========
export const getCooperativas = async (): Promise<CooperativaBackend[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/cooperativa/lista`);
    const data = await response.json();
    return data.cooperativas || data || [];
  } catch (error) {
    console.error('Error al obtener cooperativas:', error);
    return [];
  }
};

export const saveCooperativa = async (cooperativa: Partial<CooperativaBackend>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/cooperativa/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cooperativa)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al guardar cooperativa:', error);
    return false;
  }
};

export const updateCooperativa = async (cooperativa: CooperativaBackend): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/cooperativa/actualizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cooperativa)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al actualizar cooperativa:', error);
    return false;
  }
};

export const deleteCooperativa = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/cooperativa/eliminar/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar cooperativa:', error);
    return false;
  }
};

// ========== BUSES ==========
export const getBuses = async (): Promise<BusBackend[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/bus/lista`);
    const data = await response.json();
    return data.buses || data || [];
  } catch (error) {
    console.error('Error al obtener buses:', error);
    return [];
  }
};

export const saveBus = async (bus: Partial<BusBackend>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/bus/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bus)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al guardar bus:', error);
    return false;
  }
};

export const updateBus = async (bus: BusBackend): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/bus/actualizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bus)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al actualizar bus:', error);
    return false;
  }
};

export const deleteBus = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/bus/eliminar/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar bus:', error);
    return false;
  }
};

// ========== RUTAS ==========
export const getRutas = async (): Promise<RutaBackend[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/ruta/lista`);
    const data = await response.json();
    return data.rutas || data || [];
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    return [];
  }
};

export const saveRuta = async (ruta: Partial<RutaBackend>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/ruta/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruta)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al guardar ruta:', error);
    return false;
  }
};

export const updateRuta = async (ruta: RutaBackend): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/ruta/actualizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruta)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al actualizar ruta:', error);
    return false;
  }
};

export const deleteRuta = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/ruta/eliminar/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar ruta:', error);
    return false;
  }
};

// ========== HORARIOS ==========
export const getHorarios = async (): Promise<HorarioBackend[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/horario/lista`);
    const data = await response.json();
    return data.horarios || data || [];
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return [];
  }
};

export const saveHorario = async (horario: Partial<HorarioBackend>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/horario/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(horario)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al guardar horario:', error);
    return false;
  }
};

export const deleteHorario = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/horario/eliminar/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    return false;
  }
};

// ========== BOLETOS ==========
export const getBoletos = async (): Promise<BoletoBackend[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/boleto/lista`);
    const data = await response.json();
    return data.boletos || data || [];
  } catch (error) {
    console.error('Error al obtener boletos:', error);
    return [];
  }
};

// ========== ESCALAS ==========
export const getEscalas = async (): Promise<EscalaBackend[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/escala/lista`);
    const data = await response.json();
    return data.escalas || data || [];
  } catch (error) {
    console.error('Error al obtener escalas:', error);
    return [];
  }
};

export const saveEscala = async (escala: Partial<EscalaBackend>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/escala/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(escala)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al guardar escala:', error);
    return false;
  }
};

export const deleteEscala = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/escala/eliminar/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar escala:', error);
    return false;
  }
};

// ========== DESCUENTOS ==========
export const getDescuentos = async (): Promise<DescuentoBackend[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/descuento/lista`);
    const data = await response.json();
    return data.descuentos || data || [];
  } catch (error) {
    console.error('Error al obtener descuentos:', error);
    return [];
  }
};

export const saveDescuento = async (descuento: Partial<DescuentoBackend>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/descuento/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(descuento)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al guardar descuento:', error);
    return false;
  }
};

export const deleteDescuento = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/descuento/eliminar/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar descuento:', error);
    return false;
  }
};

// ========== PERSONAS/CLIENTES ==========
export const getPersonas = async (): Promise<PersonaBackend[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/persona/lista`);
    const data = await response.json();
    return data.personas || data || [];
  } catch (error) {
    console.error('Error al obtener personas:', error);
    return [];
  }
};

export const savePersona = async (persona: Partial<PersonaBackend>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/persona/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(persona)
    });
    return response.ok;
  } catch (error) {
    console.error('Error al guardar persona:', error);
    return false;
  }
};

export const deletePersona = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/persona/eliminar/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    return false;
  }
};

// ========== UTILIDADES DE MAPEO ==========
// Mapear datos del backend a tipos del frontend

import { Cooperative, BusUnit, RouteDefinition, Trip, Stopover, Discount, User } from '../types';

export const mapCooperativa = (c: CooperativaBackend): Cooperative => ({
  id: String(c.id_cooperativa),
  name: c.nombre_cooperativa,
  ruc: c.ruc,
  address: c.direccion,
  phone: c.telefono,
  email: c.correo_empresarial,
  rating: 4.5,
  fleetSize: 0,
  status: 'active'
});

export const mapBus = (b: BusBackend): BusUnit => ({
  id: String(b.id_bus),
  plate: b.placa,
  brand: b.marca,
  model: b.modelo,
  capacity: b.capacidad_pasajeros,
  speedLimit: b.Velocidad,
  cooperative: b.cooperativa?.nombre_cooperativa || '',
  status: b.estado_bus === 'Activo' ? 'active' : 'inactive'
});

export const mapRuta = (r: RutaBackend): RouteDefinition => ({
  id: String(r.id_ruta),
  origin: r.origen,
  destination: r.destino,
  distancekm: r.distancia,
  estimatedDuration: r.tiempo_estimado,
  basePrice: r.precio_unitario,
  status: r.estado_ruta === 'Disponible' ? 'active' : 'inactive'
});

export const mapHorario = (h: HorarioBackend): Trip => ({
  id: String(h.id_horario),
  origin: h.ruta?.origen || '',
  destination: h.ruta?.destino || '',
  departureTime: h.hora_salida,
  arrivalTime: h.hora_llegada,
  duration: h.ruta?.tiempo_estimado || '',
  price: h.ruta?.precio_unitario || 0,
  operator: h.ruta?.bus?.cooperativa?.nombre_cooperativa || '',
  type: 'Normal',
  seatsAvailable: h.ruta?.bus?.capacidad_pasajeros || 0,
  amenities: [],
  routeId: String(h.ruta?.id_ruta || ''),
  busId: String(h.ruta?.bus?.id_bus || ''),
  status: h.estado_horario === 'Disponible' ? 'active' : 'cancelled'
});

export const mapEscala = (e: EscalaBackend): Stopover => ({
  id: String(e.id_escala),
  routeId: '',
  location: e.lugar_escala,
  arrivalTime: e.tiempo,
  departureTime: e.tiempo,
  type: 'Tecnica'
});

export const mapDescuento = (d: DescuentoBackend): Discount => ({
  id: String(d.id_descuento),
  name: d.nombre_descuento,
  type: d.tipo_descuento as 'Temporada' | 'Fidelidad' | 'Cupón' | 'Especial',
  description: d.descripcion,
  code: '',
  percentage: d.porcentaje,
  startDate: '',
  validUntil: '',
  status: d.estado_descuento === 'Activo' ? 'active' : 'expired'
});

export const mapPersona = (p: PersonaBackend): User => ({
  id: String(p.id_persona),
  name: p.nombre,
  lastName: p.apellido,
  email: p.correo,
  role: p.cuenta?.tipo_cuenta === 'Administrador' ? 'admin' : 'client',
  phone: p.telefono,
  identificationNumber: p.numero_identificacion,
  identificationType: p.tipo_identificacion as any,
  address: p.direccion,
  gender: p.genero as any,
  birthDate: p.fecha_nacimiento,
  tariffType: p.tipo_tarifa as any,
  balance: p.saldo_disponible
});

// ========== BÚSQUEDA DE VIAJES ==========
export const searchTrips = async (origin: string, destination: string): Promise<HorarioBackend[]> => {
  try {
    const horariosResp = await fetch(`${API_BASE}/api/horario/lista`);
    const horariosData = await horariosResp.json();
    const horarios: HorarioBackend[] = horariosData.horarios || [];
    
    // Filtrar horarios por origen y destino
    const filtered = horarios.filter(h => {
      const ruta = h.ruta;
      if (!ruta) return false;
      
      const matchOrigin = !origin || ruta.origen.toLowerCase().includes(origin.toLowerCase());
      const matchDestination = !destination || ruta.destino.toLowerCase().includes(destination.toLowerCase());
      
      return matchOrigin && matchDestination && h.estado_horario === 'Disponible';
    });
    
    return filtered;
  } catch (error) {
    console.error('Error al buscar viajes:', error);
    return [];
  }
};
