// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  pfp_url?: string;
}

interface AuthContextType {
  userToken: string | null;
  user: UserData | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await client.get('/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      return response.data;
    } catch (error: any) {
      console.error("[AUTH] ChefSync profile fetch failed:", error.message);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (userToken) {
      try {
        await fetchUserProfile(userToken);
      } catch (e) {
        // Silent fail for background refresh
      }
    }
  };

  useEffect(() => {
    const loadBootState = async () => {
      try {
        console.log("[BOOT] Checking secure storage...");
        const storedToken = await AsyncStorage.getItem('userToken');
        
        if (storedToken) {
          console.log("[BOOT] Token found. Restoring session.");
          setUserToken(storedToken);
          // Attempt to load profile, but don't block boot if it's just a network error
          try {
            await fetchUserProfile(storedToken);
          } catch (e) {
            console.warn("[BOOT] Profile sync failed, but session kept.");
          }
        } else {
          console.log("[BOOT] No token found. Routing to Auth.");
        }
      } catch (error) {
        console.error("[BOOT] Session restoration critical failure:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBootState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await client.post('/v1/auth/token', params.toString(), {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
      });

      const { access_token } = response.data;
      
      await AsyncStorage.setItem('userToken', access_token);
      setUserToken(access_token);
      await fetchUserProfile(access_token);
      
      console.log("[AUTH] ChefSync login successful. Session persisted.");
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Invalid email or password.';
      console.error('[AUTH] Login error:', message);
      throw new Error(message);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      await client.post('/v1/auth/register', {
        email,
        password,
        full_name: fullName,
      });

      console.log("[AUTH] Registration successful. Triggering auto-login.");
      await login(email, password);
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Could not create account.';
      console.error('[AUTH] Registration error:', message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUser(null);
      console.log("[AUTH] Session cleared.");
    } catch (error) {
      console.error('[AUTH] Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
