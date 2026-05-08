// src/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';

/**
 * Dynamic API URL resolution.
 * On physical devices, 'localhost' points to the phone itself.
 * We use the host debugger address to point back to your computer.
 */
const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':').shift();
  
  if (localhost) {
    return `http://${localhost}:8000`;
  }
  
  // Fallback for web or production
  return 'http://localhost:8000';
};

const client = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000, // 15 second timeout for mobile resilience
});

// Request interceptor to attach JWT
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global Error & Response Handling
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Handle Global Network Failures (Store/Transit scenarios)
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      Toast.show({
        type: 'error',
        text1: 'No Internet Connection',
        text2: 'Please check your network and try again.',
        position: 'bottom',
        visibilityTime: 4000,
      });
    }

    // 2. Handle Session Expiry (401)
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('userToken');
      // Logic to redirect to Auth would happen in the AuthContext/AppNavigator
    }

    return Promise.reject(error);
  }
);

export default client;
