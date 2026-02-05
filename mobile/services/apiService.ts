<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL configuration - always use local IP, not tunnel
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.20.137.45:8099/api';

console.log('[API] Configurando con URL:', API_BASE_URL);

// Mock data para desarrollo
const MOCK_DATA = {
  '/persona/lista': {
    data: {
      personas: [
        {
          id_persona: 1,
          nombre: 'Juan Pérez',
          correo: 'nerod@gmail.com',
          telefono: '+593987654321',
          numero_identificacion: '1234567890',
          saldo_disponible: 100
        }
      ]
    }
  },
  '/ruta/lista': {
    data: {
      rutas: [
        { id_ruta: 1, origen: 'Quito', destino: 'Guayaquil', precio_base: 25 },
        { id_ruta: 2, origen: 'Quito', destino: 'Cuenca', precio_base: 35 }
      ]
    }
  }
};

// Token de autenticación del backend
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
=======
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

// Token de autenticación del backend
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
>>>>>>> origin/develop
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiService = {
  async get(endpoint: string) {
    try {
      console.log(`[API] GET ${API_BASE_URL}${endpoint}`);
<<<<<<< HEAD
      const headers = await getAuthHeaders();
      
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers
        });
        console.log(`[API] Response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[API] Error response:`, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
=======
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getAuthHeaders()
      });
      console.log(`[API] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Error response:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
>>>>>>> origin/develop
      
      const data = await response.json();
      console.log(`[API] Response data:`, data);
      return data;
<<<<<<< HEAD
      } catch (networkError) {
        console.warn(`[API] Network error, using mock data for ${endpoint}`);
        return MOCK_DATA[endpoint as keyof typeof MOCK_DATA] || { data: [] };
      }
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      // Return mock data as fallback
      return MOCK_DATA[endpoint as keyof typeof MOCK_DATA] || { data: [] };
=======
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
>>>>>>> origin/develop
    }
  },

  async post(endpoint: string, data: any) {
    try {
      console.log(`[API] POST ${API_BASE_URL}${endpoint}`, data);
<<<<<<< HEAD
      const headers = await getAuthHeaders();
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });
        console.log(`[API] Response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[API] Error response:`, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log(`[API] Response data:`, result);
        return result;
      } catch (networkError) {
        console.warn(`[API] Network error on POST ${endpoint}:`, networkError);
        console.error(`[API] Cannot connect to ${API_BASE_URL}${endpoint}`);
        return { 
          success: false, 
          error: true,
          mensaje: 'No se pudo conectar al servidor. Verifica tu conexión de red.',
          networkError: (networkError as Error).message 
        };
      }
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      return { 
        success: false, 
        error: true,
        mensaje: 'Error al conectar con el servidor' 
      };
=======
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      console.log(`[API] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Error response:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`[API] Response data:`, result);
      return result;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
>>>>>>> origin/develop
    }
  },

  async put(endpoint: string, data: any) {
    try {
      console.log(`[API] PUT ${API_BASE_URL}${endpoint}`, data);
<<<<<<< HEAD
      const headers = await getAuthHeaders();
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data)
        });
        console.log(`[API] Response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[API] Error response:`, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log(`[API] Response data:`, result);
        return result;
      } catch (networkError) {
        console.warn(`[API] Network error on PUT ${endpoint}`);
        return { success: true, data: {} };
      }
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      return { success: true, data: {} };
=======
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      console.log(`[API] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Error response:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`[API] Response data:`, result);
      return result;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
>>>>>>> origin/develop
    }
  },

  async delete(endpoint: string) {
    try {
      console.log(`[API] DELETE ${API_BASE_URL}${endpoint}`);
<<<<<<< HEAD
      const headers = await getAuthHeaders();
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'DELETE',
          headers
        });
        console.log(`[API] Response status: ${response.status}`);
      
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[API] Error response:`, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log(`[API] Response data:`, result);
        return result;
      } catch (networkError) {
        console.warn(`[API] Network error on DELETE ${endpoint}`);
        return { success: true, data: {} };
      }
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      return { success: true, data: {} };
    }
  }
=======
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      console.log(`[API] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Error response:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`[API] Response data:`, result);
      return result;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  },
>>>>>>> origin/develop
};
