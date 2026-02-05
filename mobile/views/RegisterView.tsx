import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { View as ViewType } from '../types';
import { Picker } from '@react-native-picker/picker';

interface Props {
  onNavigate: (view: ViewType) => void;
  onBack: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const RegisterView: React.FC<Props> = ({ onNavigate, onBack, showToast }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [documentType, setDocumentType] = useState('cedula');
  const [documentNumber, setDocumentNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = () => {
    if (!documentNumber || !firstName || !lastName || !email || !password) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }
    if (!acceptedTerms) {
      showToast('Debes aceptar los términos y condiciones', 'error');
      return;
    }
    showToast('¡Cuenta creada exitosamente!', 'success');
    onNavigate(ViewType.HOME);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Empieza tu viaje</Text>
          <Text style={styles.subtitle}>
            Únete a la mejor forma de viajar por Ecuador con comodidad premium.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DOCUMENTOS DE IDENTIDAD</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Tipo de Documento</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={documentType}
                onValueChange={setDocumentType}
                style={styles.picker}
                dropdownIconColor="#FFFFFF"
              >
                <Picker.Item label="Cédula de Identidad" value="cedula" />
                <Picker.Item label="Pasaporte" value="passport" />
              </Picker>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Número de Documento</Text>
            <TextInput
              style={styles.input}
              placeholder="17XXXXXXXX"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={documentNumber}
              onChangeText={setDocumentNumber}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATOS PERSONALES</Text>
          
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Juan"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Pérez"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="juan.perez@ejemplo.ec"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.togglePassword}>
                  {showPassword ? 'OCULTAR' : 'VER'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
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
          </View>
        </View>

        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkboxBox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text style={styles.termsLink}>Términos y Condiciones</Text> y la{' '}
              <Text style={styles.termsLink}>Política de Privacidad</Text>.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>Registrarme</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#A3A3A3',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  pickerContainer: {
    height: 56,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
  },
  picker: {
    color: '#FFFFFF',
    height: 56,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfField: {
    flex: 1,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  togglePassword: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2ecc71',
    letterSpacing: 1.5,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 56,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 56,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    width: 28,
    height: 28,
  },
  eyeIcon: {
    fontSize: 20,
  },
  termsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  checkmark: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#737373',
    lineHeight: 20,
  },
  termsLink: {
    color: '#2ecc71',
    fontWeight: '700',
  },
  submitContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },
  submitButton: {
    height: 64,
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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

export default RegisterView;
