import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { View as ViewType } from '../types';

interface Props {
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
}

const faqs = [
  { q: '¿Cómo puedo cambiar mi boleto?', a: 'Puedes cambiar tu boleto desde la sección Mis Viajes' },
  { q: '¿Cuál es la política de cancelación?', a: 'Puedes cancelar hasta 24 horas antes del viaje' },
  { q: '¿Cómo contacto con soporte?', a: 'Escríbenos a soporte@busgo.com o llama al 1-800-BUSGO' },
];

const HelpCenterView: React.FC<Props> = ({ onBack }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Centro de Ayuda</Text>
      <View style={styles.headerSpacer} />
    </View>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
      {faqs.map((faq, i) => (
        <View key={i} style={styles.faqCard}>
          <Text style={styles.question}>{faq.q}</Text>
          <Text style={styles.answer}>{faq.a}</Text>
        </View>
      ))}
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
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  faqCard: { backgroundColor: '#1c1c1c', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  question: { fontSize: 16, fontWeight: '700', color: '#2ecc71', marginBottom: 8 },
  answer: { fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 20 },
});

export default HelpCenterView;
