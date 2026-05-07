// src/components/dashboard/DashboardHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag } from 'lucide-react-native';

const DashboardHeader = () => {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View className="px-6 flex-row justify-between items-center">
      <View>
        <Text className="text-muted-foreground font-sans-medium text-sm">
          {getGreeting()},
        </Text>
        <Text className="text-foreground font-sans-bold text-2xl">
          {user?.full_name?.split(' ')[0] || 'Guest'}
        </Text>
      </View>
      
      <View className="bg-primary/10 flex-row items-center px-3 py-2 rounded-full border border-primary/20">
        <ShoppingBag size={14} color="#4F47E5" />
        <Text className="text-primary font-sans-bold text-xs ml-1.5">
          12 Items
        </Text>
      </View>
    </View>
  );
};

export default DashboardHeader;
