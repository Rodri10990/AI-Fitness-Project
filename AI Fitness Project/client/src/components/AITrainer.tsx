import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export function AITrainer() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([{
      role: 'assistant',
      content: 'Hey! I\'m your AI fitness trainer. I can create personalized workouts, answer fitness questions, and help you reach your goals. What would you like to work on today?'
    }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Use your Expo/React Native API URL
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`${API_URL}/api/trainer/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          userId: user.id
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);

      if (data.workoutGenerated) {
        // Show success message
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'system',
            content: '✅ Workout saved to your library!'
          }]);
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble processing that. Please try again.' 
      }]);
    } finally {
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.role === 'user' ? '#007AFF' : '#F0F0F0',
              padding: 12,
              borderRadius: 16,
              marginVertical: 4,
              maxWidth: '80%',
            }}
          >
            <Text style={{ 
              color: message.role === 'user' ? 'white' : 'black' 
            }}>
              {message.content}
            </Text>
          </View>
        ))}
        
        {loading && (
          <View style={{ padding: 12 }}>
            <ActivityIndicator size="small" />
          </View>
        )}
      </ScrollView>

      <View style={{ 
        flexDirection: 'row', 
        padding: 16, 
        borderTopWidth: 1, 
        borderTopColor: '#E0E0E0' 
      }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#DDD',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 8,
          }}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything about fitness..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            backgroundColor: '#007AFF',
            borderRadius: 24,
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}