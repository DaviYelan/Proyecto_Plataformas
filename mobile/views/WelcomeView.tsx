import React, { useState } from 'react';
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

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

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

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setShowLoginForm(true)}
                activeOpacity={0.9}
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
