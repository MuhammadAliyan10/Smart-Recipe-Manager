// src/components/dashboard/RecentScans.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Package, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { IngredientItem } from '../../api/pantry';

interface RecentScansProps {
  items: IngredientItem[];
}

const RecentScans: React.FC<RecentScansProps> = ({ items }) => {
  const navigation = useNavigation<any>();

  return (
    <View className="px-6 mb-10">
      <View className="flex-row justify-between items-end mb-4">
        <View>
          <Text className="text-foreground font-sans-bold text-lg">Recent Items</Text>
          <Text className="text-muted-foreground font-sans text-xs">Recently added to your inventory</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Pantry')}>
          <Text className="text-primary font-sans-bold text-xs">View History</Text>
        </Pressable>
      </View>

      <View className="bg-card border border-border rounded-2xl overflow-hidden">
        {items.length === 0 ? (
          <View className="p-8 items-center justify-center">
            <Text className="text-muted-foreground font-sans text-sm italic">No items scanned yet.</Text>
          </View>
        ) : (
          items.map((scan, index) => (
            <View 
              key={scan.id}
              className={`flex-row items-center px-4 py-4 ${index !== items.length - 1 ? 'border-b border-border/30' : ''}`}
            >
              <View className="bg-secondary/50 p-2.5 rounded-xl">
                <Package size={20} color="#64748b" />
              </View>
              
              <View className="flex-1 ml-4">
                <Text className="text-foreground font-sans-bold text-sm" numberOfLines={1}>{scan.name}</Text>
                <Text className="text-muted-foreground font-sans-medium text-xs mt-0.5">Quantity: {scan.quantity}</Text>
              </View>

              <View className="items-end">
                <ChevronRight size={14} color="#cbd5e1" />
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default RecentScans;
