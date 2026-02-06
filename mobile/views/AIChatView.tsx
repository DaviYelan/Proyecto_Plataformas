<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { View as ViewType } from '../types';
=======

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { View, Message } from '../types';
import { getAIResponse } from '../geminiService';
>>>>>>> origin/develop

interface Props {
  onNavigate: (view: ViewType) => void;
}

const AIChatView: React.FC<Props> = ({ onNavigate }) => {
<<<<<<< HEAD
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: '¡Hola! Soy tu asistente de BusGo. ¿En qué puedo ayudarte con tu viaje por Ecuador hoy? 🏔️' }
=======
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de BusGo. ¿En qué puedo ayudarte con tu viaje por Ecuador hoy? 🏔️',
      timestamp: new Date()
    }
>>>>>>> origin/develop
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
<<<<<<< HEAD
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate(ViewType.HOME)}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asistente IA</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.messagesContainer}>
=======
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-background-dark' : 'bg-white'}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md pt-12 border-b ${isDarkMode ? 'bg-background-dark/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center px-4 pb-4 gap-4">
          <button 
            onClick={() => onNavigate(View.HOME)}
            className={`size-10 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? 'bg-white/5 active:bg-white/10 text-white' : 'bg-gray-200 active:bg-gray-300 text-black'}`}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#2ecc71] flex items-center justify-center shadow-lg shadow-[#2ecc71]/20">
              <span className="material-symbols-outlined text-black font-bold">smart_toy</span>
            </div>
            <div>
              <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>BusGo AI</h2>
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-[#2ecc71] animate-pulse"></div>
                <span className="text-[10px] text-[#2ecc71] font-bold uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar"
      >
>>>>>>> origin/develop
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
