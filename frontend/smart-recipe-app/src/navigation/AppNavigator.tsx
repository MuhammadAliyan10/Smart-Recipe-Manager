import React, { useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
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
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import CookingModeScreen from '../screens/CookingModeScreen';
import RecipeFormScreen from '../screens/RecipeFormScreen';

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
    if (fontsLoaded || fontError) {
      if (!isLoading) {
        await SplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded, fontError, isLoading]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
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
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen 
              name="RecipeDetail" 
              component={RecipeDetailScreen} 
              options={{ presentation: 'modal' }} 
            />
            <RootStack.Screen 
              name="ShoppingList" 
              component={ShoppingListScreen} 
            />
            <RootStack.Screen 
              name="CookingMode" 
              component={CookingModeScreen} 
              options={{ presentation: 'fullScreenModal' }} 
            />
            <RootStack.Screen 
              name="RecipeForm" 
              component={RecipeFormScreen} 
              options={{ presentation: 'modal' }} 
            />
          </>
        )}
      </RootStack.Navigator>
    </View>
  );
};

export default AppNavigator;
