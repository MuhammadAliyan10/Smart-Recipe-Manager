import React, { useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Figtree_400Regular, 
  Figtree_500Medium, 
  Figtree_600SemiBold, 
  Figtree_700Bold 
} from '@expo-google-fonts/figtree';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import MainTabs from './MainTabs';

SplashScreen.preventAutoHideAsync();

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => {
  const { userToken, isLoading } = useAuth();
  
  const [fontsLoaded, fontError] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    console.log("[NAV] Layout Triggered", { fontsLoaded, fontError: !!fontError, isLoading });
    if (fontsLoaded || fontError) {
      if (!isLoading) {
        console.log("[NAV] Hiding Splash Screen");
        await SplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded, fontError, isLoading]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (fontError) {
    console.error("[NAV] Font Loading Error:", fontError);
  }

  // Fallback to avoid black screen if fonts take too long
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', itemsCenter: 'center' }}>
        <ActivityIndicator size="large" color="#4F47E5" />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} onLayout={onLayoutRootView}>
        <ActivityIndicator size="large" color="#4F47E5" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {userToken == null ? (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <RootStack.Screen name="Main" component={MainTabs} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppNavigator;
