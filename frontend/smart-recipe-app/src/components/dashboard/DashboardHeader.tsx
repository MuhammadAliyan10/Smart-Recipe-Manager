// src/components/dashboard/DashboardHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag } from 'lucide-react-native';

interface DashboardHeaderProps {
  totalItems: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ totalItems }) => {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = user?.full_name?.split(' ')[0] || 'Guest';

  return (
    <View className="px-6 py-6 flex-row items-center justify-between">
      <View>
        <Text className="text-slate-400 font-sans-bold text-[10px] uppercase tracking-widest mb-1">{getGreeting()}</Text>
        <Text className="text-slate-900 font-sans-bold text-2xl">ChefSync, {firstName}</Text>
      </View>

      <View className="bg-primary/10 flex-row items-center px-4 py-2 rounded-full border border-primary/20 shadow-sm">
        <ShoppingBag size={14} color="#4F47E5" />
        <Text className="text-primary font-sans-bold text-xs ml-2">
          {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
        </Text>
      </View>
    </View>
  );
};

export default DashboardHeader;
