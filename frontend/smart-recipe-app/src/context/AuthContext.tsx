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
    } catch (error) {
      console.error("[AUTH] Profile fetch failed. Session might be expired.");
      await logout();
    }
  };

  const refreshUser = async () => {
    if (userToken) {
      await fetchUserProfile(userToken);
    }
  };

  useEffect(() => {
    const loadBootState = async () => {
      try {
        console.log("[BOOT] Restoring session from storage...");
        const storedToken = await AsyncStorage.getItem('userToken');
        
        if (storedToken) {
          setUserToken(storedToken);
          await fetchUserProfile(storedToken);
        }
      } catch (error) {
        console.error("[BOOT] Session restoration failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBootState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // FastAPI OAuth2PasswordRequestForm requires x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('username', email); // backend expects 'username' for the identifier
      params.append('password', password);

      const response = await client.post('/v1/auth/token', params.toString(), {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
      });

      const { access_token } = response.data;
      
      // Persist token
      await AsyncStorage.setItem('userToken', access_token);
      setUserToken(access_token);
      
      // Load user profile
      await fetchUserProfile(access_token);
      
      console.log("[AUTH] Login successful. Session persisted.");
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Invalid email or password.';
      console.error('[AUTH] Login error:', message);
      throw new Error(message);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      // Standard JSON request for registration
      await client.post('/v1/auth/register', {
        email,
        password,
        full_name: fullName,
      });

      console.log("[AUTH] Registration successful. Triggering auto-login.");
      
      // Automatic login after successful registration
      await login(email, password);
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Could not create account. Email may already be in use.';
      console.error('[AUTH] Registration error:', message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUser(null);
      console.log("[AUTH] Session cleared. User logged out.");
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
