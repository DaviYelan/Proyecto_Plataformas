import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { View as ViewType } from '../types';

interface Props {
  onNavigate: (view: ViewType) => void;
}

const AIChatView: React.FC<Props> = ({ onNavigate }) => {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: '¡Hola! Soy tu asistente de BusGo. ¿En qué puedo ayudarte con tu viaje por Ecuador hoy? 🏔️' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, 
      { id: Date.now().toString(), role: 'user', content: input },
      { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Gracias por tu mensaje. Estoy procesando tu consulta...' }
    ]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate(ViewType.HOME)}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asistente IA</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Escribe tu mensaje..." placeholderTextColor="rgba(255, 255, 255, 0.3)" value={input} onChangeText={setInput} />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendIcon}>📤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16 },
  backButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#FFFFFF' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 48 },
  messagesContainer: { flex: 1, padding: 16 },
  message: { padding: 16, borderRadius: 16, marginBottom: 12, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#2ecc71' },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: '#1c1c1c' },
  messageText: { fontSize: 14, color: '#FFFFFF' },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  input: { flex: 1, height: 48, backgroundColor: '#1c1c1c', borderRadius: 24, paddingHorizontal: 16, color: '#FFFFFF', marginRight: 8 },
  sendButton: { width: 48, height: 48, backgroundColor: '#2ecc71', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 20 },
});

export default AIChatView;
