import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { toastConfig } from './src/components/ui/ToastConfig';
import "./global.css";

console.log("App Bootstrapping...");

export default function App() {
  console.log("App Component Rendering");
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppNavigator />
        <Toast config={toastConfig} />
      </AuthProvider>
    </NavigationContainer>
  );
}
