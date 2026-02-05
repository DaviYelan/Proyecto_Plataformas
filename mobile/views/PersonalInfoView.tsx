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

<<<<<<< HEAD
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
=======
      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        <div className="space-y-4">
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-lg">
             <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Nombre Completo</p>
             <p className="text-white text-base font-bold">{user?.name}</p>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-lg">
             <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Correo Electrónico</p>
             <p className="text-white text-base font-bold">{user?.email}</p>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-lg">
             <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Número de Teléfono</p>
             <p className="text-white text-base font-bold">{user?.phone || 'No registrado'}</p>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-lg">
             <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Identificación (Cédula/Pasaporte)</p>
             <p className="text-white text-base font-bold">{user?.idNumber || 'No registrado'}</p>
          </div>
        </div>

        <button className="w-full h-14 bg-[#2ecc71] text-black font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#27ae60] shadow-lg shadow-[#2ecc71]/30">
          <span className="material-symbols-outlined">edit</span>
          Editar Información
        </button>

        <p className="text-center text-neutral-600 text-xs px-8">
          Tu información está protegida por nuestra política de privacidad y se utiliza únicamente para la emisión de boletos legales en Ecuador.
        </p>
      </div>
    </div>
  );
};
>>>>>>> origin/develop

export default PersonalInfoView;
