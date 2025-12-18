
export interface Destination {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  iconName: 'Shield' | 'Armchair' | 'Clock';
}

export interface SearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  isRoundTrip: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  chartData?: { month: string; visitors: number }[]; // Optional data for visualization
}

// "Trip" acts as the Schedule instance (Horario)
export interface Trip {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  oldPrice?: number;
  operator: string;
  type: 'Ejecutivo' | 'Normal' | 'VIP' | 'Servicio Plus';
  seatsAvailable: number;
  amenities: string[];
  routeId?: string; // Link to the physical route
  busId?: string;
  status?: 'active' | 'delayed' | 'cancelled' | 'completed';
}

// "RouteDefinition" acts as the physical path (Ruta)
export interface RouteDefinition {
  id: string;
  origin: string;
  destination: string;
  distancekm: number;
  estimatedDuration: string;
  basePrice: number;
  status: 'active' | 'inactive';
}

export interface Seat {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'selected';
  isWindow: boolean;
  floor: 1 | 2;
}

export interface Ticket {
  id: string;
  trip: Trip;
  seats: Seat[];
  purchaseDate: string;
  passengerName: string;
  totalPrice: number;
}

export type UserRole = 'admin' | 'client' | 'guest';

export interface PaymentMethod {
  id: number;
  type: string;
  holder: string;
  number: string;
  expiry: string;
  brand?: 'visa' | 'mastercard' | 'amex';
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  
  // Detailed Profile Fields
  name: string;
  lastName?: string;
  identificationType?: 'Cedula' | 'Pasaporte' | 'RUC';
  identificationNumber?: string;
  birthDate?: string;
  address?: string;
  gender?: 'Masculino' | 'Femenino' | 'Otro' | 'No definido';
  
  // Client Specific
  tariffType?: 'General' | 'Estudiante' | 'Tercera Edad' | 'Discapacidad';
  balance?: number;
  paymentMethods?: PaymentMethod[];
}

export interface Cooperative {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  fleetSize: number;
  status: 'active' | 'inactive';
}

export interface Stopover {
  id: string;
  routeId: string;
  location: string;
  arrivalTime: string;
  departureTime: string;
  type: 'Tecnica' | 'Alimentacion' | 'Recogida';
}

export interface Discount {
  id: string;
  name: string;
  type: 'Temporada' | 'Fidelidad' | 'Cupón' | 'Especial'; // New
  description: string; // New
  code: string;
  percentage: number;
  startDate: string; // New
  validUntil: string; // Renamed to F. Fin logically, keeping validUntil for compatibility or mapped
  status: 'active' | 'expired';
}

export interface BusUnit {
  id: string;
  plate: string;
  brand: string;
  model: string;
  capacity: number;
  speedLimit: number; // Velocidad
  cooperative: string;
  status: 'active' | 'maintenance' | 'inactive';
}
