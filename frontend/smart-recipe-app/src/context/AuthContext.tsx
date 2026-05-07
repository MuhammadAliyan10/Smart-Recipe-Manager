import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBootState = async () => {
      try {
        console.log("[BOOT SEQUENCE] Checking secure storage...");
        const storedToken = await AsyncStorage.getItem('userToken');
        
        if (storedToken) {
          console.log("[BOOT SEQUENCE] Token found. Restoring session.");
          setUserToken(storedToken);
        } else {
          console.log("[BOOT SEQUENCE] No token found. Routing to Auth.");
        }
      } catch (error) {
        console.error("[BOOT FATAL] AsyncStorage failed to read:", error);
        // If storage fails, we assume unauthenticated to prevent infinite loading
        setUserToken(null); 
      } finally {
        console.log("[BOOT SEQUENCE] State resolved. Killing loading spinner.");
        setIsLoading(false); 
      }
    };

    loadBootState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await client.post('/v1/auth/token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { access_token } = response.data;
      await AsyncStorage.setItem('userToken', access_token);
      setUserToken(access_token);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      await client.post('/v1/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      // Optionally login automatically after registration
      await login(email, password);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
