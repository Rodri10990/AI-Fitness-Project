import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { apiService } from '../services/apiService';

export const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setStatus('testing');
    setError('');
    
    try {
      await apiService.getConversation();
      setStatus('connected');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Connection failed');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Connection</Text>
      <View style={[styles.statusIndicator, styles[status]]}>
        <Text style={styles.statusText}>
          {status === 'testing' && 'Testing...'}
          {status === 'connected' && 'Connected ✓'}
          {status === 'error' && 'Disconnected ✗'}
        </Text>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.retryButton} onPress={testConnection}>
        <Text style={styles.retryText}>Test Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusIndicator: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  testing: { backgroundColor: '#FFF3CD' },
  connected: { backgroundColor: '#D4EDDA' },
  error: { backgroundColor: '#F8D7DA' },
  statusText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  error: {
    color: '#721c24',
    fontSize: 12,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});