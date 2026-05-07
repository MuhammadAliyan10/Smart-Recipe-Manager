import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

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

// Response interceptor to handle 401 Unauthorized
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

export default client;
