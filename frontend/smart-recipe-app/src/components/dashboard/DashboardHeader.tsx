// src/components/dashboard/DashboardHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag } from 'lucide-react-native';
import ScreenHeader from '../ui/ScreenHeader';

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

  const rightElement = (
    <View 
      style={{ 
        backgroundColor: 'rgba(79, 71, 229, 0.1)', 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 12, 
        paddingVertical: 8, 
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(79, 71, 229, 0.2)'
      }}
    >
      <ShoppingBag size={14} color="#4F47E5" />
      <Text 
        style={{ 
          color: '#4F47E5', 
          fontWeight: '700', 
          fontSize: 12, 
          marginLeft: 6,
          fontFamily: 'Figtree_700Bold'
        }}
      >
        {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
      </Text>
    </View>
  );

  return (
    <ScreenHeader 
      title={user?.full_name?.split(' ')[0] || 'Guest'}
      subtitle={`${getGreeting()}, welcome back!`}
      rightElement={rightElement}
    />
  );
};

export default DashboardHeader;
