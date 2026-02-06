import React, { useState } from 'react';
<<<<<<< HEAD
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { View as ViewType, User } from '../types';
import { apiService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
=======
import { useGoogleLogin } from '@react-oauth/google';
import { View, User } from '../types';
import { apiService } from '../services/apiService';
>>>>>>> origin/develop

interface Props {
  onNavigate: (view: ViewType) => void;
  onLogin: (user: User) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const WelcomeView: React.FC<Props> = ({ onNavigate, onLogin, showToast }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

<<<<<<< HEAD
  const handleLogin = async () => {
=======
  // Hook de Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('[GOOGLE] Login exitoso:', tokenResponse);
      
      try {
        // Obtener información del usuario usando el access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        const userInfo = await userInfoResponse.json();
        console.log('[GOOGLE] Información del usuario:', userInfo);

        // Buscar si el usuario ya existe en el backend
        const response = await apiService.get('/persona/lista');
        const personas = response.data || response.personas || [];
        
        let userFound = personas.find((p: any) => 
          p.correo === userInfo.email || p.cuenta?.correo === userInfo.email
        );

        // Si no existe, crear un nuevo usuario localmente
        if (!userFound) {
          console.log('[GOOGLE] Usuario no encontrado, creando uno nuevo...');
          userFound = {
            nombre: userInfo.name,
            correo: userInfo.email,
            telefono: '',
            numero_identificacion: ''
          };
        }

        const user: User = {
          name: userFound.nombre || userInfo.name,
          email: userFound.correo || userInfo.email,
          phone: userFound.telefono || '',
          idNumber: userFound.numero_identificacion || userFound.cedula || ''
        };

        onLogin(user);
        showToast(`¡Bienvenido ${user.name}!`, 'success');
        onNavigate(View.HOME);

      } catch (error) {
        console.error('[GOOGLE] Error al procesar login:', error);
        showToast('Error al conectar con el servidor', 'error');
      }
    },
    onError: () => {
      console.error('[GOOGLE] Error en Google Login');
      showToast('Error al iniciar sesión con Google', 'error');
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
>>>>>>> origin/develop
    if (!email || !password) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }
<<<<<<< HEAD

    try {
      console.log('[LOGIN] Autenticando...');
      const payload = {
        correo: email.trim(),
        contrasenia: password
      };

      const resp: any = await apiService.post('/auth/login', payload);
      const token = resp?.token || resp?.data?.token;
      const userResp = resp?.user || resp?.data?.user;

      // Check for network errors first
      if (resp?.error) {
        console.error('[LOGIN] Network error:', resp.mensaje);
        showToast(resp.mensaje || 'No se pudo conectar al servidor', 'error');
        return;
      }

      if (!token) {
        const msg = resp?.mensaje || resp?.data?.mensaje || 'Email o contraseña incorrectos';
        showToast(msg, 'error');
        return;
      }

      try {
        await AsyncStorage.setItem('authToken', token);
      } catch (e) {
        console.warn('Could not save token:', e);
      }

      const user: User = {
        name: (userResp?.correo || email).split('@')[0] || 'Usuario',
        email: userResp?.correo || email,
        phone: userResp?.telefono || undefined,
        idNumber: userResp?.numero_identificacion || undefined
      };
      onLogin(user);
      showToast('¡Bienvenido!', 'success');
      onNavigate(ViewType.HOME);
=======
    
    try {
      console.log('[LOGIN] Autenticando con el backend...');
      // Usar el endpoint de autenticación para obtener el token JWT
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contrasenia: password })
      });
      
      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        console.log('[LOGIN] Error de autenticación:', errorData);
        showToast(errorData.mensaje || 'Credenciales incorrectas', 'error');
        return;
      }
      
      const authData = await loginResponse.json();
      console.log('[LOGIN] Autenticación exitosa:', authData);
      
      // Guardar el token JWT en localStorage
      if (authData.token) {
        localStorage.setItem('authToken', authData.token);
        console.log('[LOGIN] Token JWT guardado');
      }
      
      // Obtener datos completos de la persona
      const response = await apiService.get('/persona/lista');
      const personas = response.data?.personas || response.personas || response.data || [];
      const userFound = personas.find((p: any) => 
        p.correo === email || p.cuenta?.correo === email
      );
      
      if (userFound) {
        const user: User = {
          name: userFound.nombre || userFound.nombre_completo || email.split('@')[0],
          email: userFound.correo || userFound.cuenta?.correo,
          phone: userFound.telefono,
          idNumber: userFound.numero_identificacion || userFound.cedula
        };
        onLogin(user);
        showToast('¡Bienvenido de vuelta!', 'success');
        onNavigate(View.HOME);
      } else {
        showToast('Error al cargar datos de usuario', 'error');
      }
>>>>>>> origin/develop
    } catch (error) {
      console.error('[LOGIN] Error al iniciar sesión:', error);
      showToast('Error al conectar con el servidor', 'error');
    }
  };

  if (!showLoginForm) {
    return (
      <View style={styles.backgroundContainer}>
        <View style={styles.container}>
          <View style={styles.welcomeContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.busIcon}>🚌</Text>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>BusGo</Text>
              <Text style={styles.titleAccent}>Ecuador</Text>
              <Text style={styles.subtitle}>
                La forma más exclusiva de viajar por el país.
              </Text>
            </View>

<<<<<<< HEAD
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setShowLoginForm(true)}
                activeOpacity={0.9}
=======
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setShowLoginForm(true)}
                className="w-full h-16 bg-[#2ecc71] text-black text-lg font-black rounded-2xl shadow-2xl shadow-[#2ecc71]/50 active:scale-95 transition-all hover:bg-[#27ae60]"
>>>>>>> origin/develop
              >
                <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => onNavigate(ViewType.REGISTER)}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Ingresa</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowLoginForm(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
<<<<<<< HEAD

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Contraseña"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
                activeOpacity={0.9}
              >
                <Text style={styles.submitButtonText}>Entrar ahora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
=======
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 pr-14 text-white focus:outline-none focus:border-accent-green transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all active:scale-95 z-10"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <button type="submit" className="w-full h-16 bg-[#2ecc71] text-black font-black rounded-xl text-lg mt-4 shadow-xl shadow-[#2ecc71]/50 hover:bg-[#27ae60] transition-all active:scale-[0.98]">
                Entrar ahora
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121212] px-4 text-white/40 font-bold tracking-widest">O continúa con</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => googleLogin()}
              className="w-full h-14 bg-white hover:bg-gray-100 text-black font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>
        )}
      </div>
    </div>
>>>>>>> origin/develop
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 120,
    paddingTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  busIcon: {
    fontSize: 40,
  },
  titleContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 58,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 58,
  },
  titleAccent: {
    fontSize: 58,
    fontWeight: '900',
    color: '#2ecc71',
    letterSpacing: -2,
    lineHeight: 58,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#FFFFFF',
    marginTop: 20,
    lineHeight: 26,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: 20,
  },
  primaryButton: {
    height: 56,
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  secondaryButton: {
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 48,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  form: {
    gap: 16,
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingRight: 56,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  eyeIcon: {
    fontSize: 22,
  },
  submitButton: {
    height: 64,
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
  },
});

export default WelcomeView;
