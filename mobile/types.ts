
export enum View {
  WELCOME = 'welcome',
  REGISTER = 'register',
  HOME = 'home',
  RESULTS = 'results',
  SEAT_SELECTION = 'seat-selection',
  PAYMENT = 'payment',
  TICKET = 'ticket',
  AI_CHAT = 'ai-chat',
  PROFILE = 'profile',
  ADMIN = 'admin',
  MY_TRIPS = 'my-trips',
  NOTIFICATIONS = 'notifications',
  PERSONAL_INFO = 'personal-info',
  PAYMENT_METHODS = 'payment-methods',
  HELP_CENTER = 'help-center',
  TRACK_TRIP = 'track-trip'
}

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

export interface CreditCard {
  id: string;
  number: string;
  holder: string;
  expiry: string;
  brand: 'visa' | 'mastercard' | 'amex';
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  idNumber?: string;
  savedCards?: CreditCard[];
}

export interface SearchCriteria {
  origin: string;
  destination: string;
  date: string;
}

export interface BusTrip {
  id: string;
  company: string;
  logoUrl: string;
  rating: number;
  reviewsCount: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  origin: string;
  destination: string;
  price: number;
  class: string;
  amenities: string[];
  status?: string;
  bookedSeats?: string[];
  bookingDate?: string;
  isOfflineAvailable?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'route' | 'forecast';
  data?: any;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'promo';
  timestamp: Date;
  read: boolean;
}
