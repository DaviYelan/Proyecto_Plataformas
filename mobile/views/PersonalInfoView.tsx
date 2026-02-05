import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { User } from '../types';

interface Props {
  onBack: () => void;
  user: User | null;
}

const PersonalInfoView: React.FC<Props> = ({ onBack, user }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Información Personal</Text>
      <View style={styles.headerSpacer} />
    </View>
    <ScrollView style={styles.scrollView}>
      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={user?.name || ''} editable={false} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Correo</Text>
        <TextInput style={styles.input} value={user?.email || ''} editable={false} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput style={styles.input} value={user?.phone || ''} placeholder="No registrado" placeholderTextColor="rgba(255,255,255,0.3)" />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Cédula</Text>
        <TextInput style={styles.input} value={user?.idNumber || ''} placeholder="No registrado" placeholderTextColor="rgba(255,255,255,0.3)" />
      </View>
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16 },
  backButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#FFFFFF' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 48 },
  scrollView: { flex: 1, padding: 24 },
  field: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', marginBottom: 8 },
  input: { height: 48, backgroundColor: '#1c1c1c', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 16, color: '#FFFFFF', fontSize: 16 },
  saveButton: { marginTop: 24, height: 56, backgroundColor: '#2ecc71', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '900', color: '#000000' },
});

export default PersonalInfoView;
