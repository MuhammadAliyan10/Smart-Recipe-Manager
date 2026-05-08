// src/context/PreferencesContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

type ThemeType = 'light' | 'dark' | 'system';

interface PreferencesContextType {
  theme: ThemeType;
  pushEnabled: boolean;
  setTheme: (theme: ThemeType) => Promise<void>;
  setPushEnabled: (enabled: boolean) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [pushEnabled, setPushEnabledState] = useState(false);
  const { setColorScheme } = useColorScheme();

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('userTheme') as ThemeType | null;
        const storedPush = await AsyncStorage.getItem('userPushEnabled');
        
        if (storedTheme) {
          setThemeState(storedTheme);
          applyTheme(storedTheme);
        } else {
          applyTheme('system');
        }

        if (storedPush !== null) {
          setPushEnabledState(storedPush === 'true');
        }
      } catch (e) {
        console.error("[PREFERENCES] Failed to load:", e);
      }
    };

    loadPreferences();
  }, []);

  const applyTheme = (newTheme: ThemeType) => {
    if (newTheme === 'system') {
      setColorScheme(Appearance.getColorScheme() || 'light');
    } else {
      setColorScheme(newTheme);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    try {
      setThemeState(newTheme);
      applyTheme(newTheme);
      await AsyncStorage.setItem('userTheme', newTheme);
    } catch (e) {
      console.error("[PREFERENCES] Failed to save theme:", e);
    }
  };

  const setPushEnabled = async (enabled: boolean) => {
    try {
      setPushEnabledState(enabled);
      await AsyncStorage.setItem('userPushEnabled', enabled.toString());
    } catch (e) {
      console.error("[PREFERENCES] Failed to save push setting:", e);
    }
  };

  // Listen to system appearance changes if in system mode
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setColorScheme(colorScheme || 'light');
      }
    });

    return () => subscription.remove();
  }, [theme]);

  return (
    <PreferencesContext.Provider value={{ theme, pushEnabled, setTheme, setPushEnabled }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within a PreferencesProvider');
  return context;
};
