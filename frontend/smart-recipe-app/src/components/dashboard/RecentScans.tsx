// src/components/dashboard/RecentScans.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Package, ChevronRight } from 'lucide-react-native';

const RecentScans = () => {
  const scans = [
    { id: '1', name: 'Fresh Milk', quantity: '2L', time: '2h ago' },
    { id: '2', name: 'Greek Yogurt', quantity: '500g', time: '4h ago' },
    { id: '3', name: 'Organic Eggs', quantity: '12pk', time: 'Yesterday' },
  ];

  return (
    <View className="px-6 mb-10">
      <View className="flex-row justify-between items-end mb-4">
        <View>
          <Text className="text-foreground font-sans-bold text-lg">Recent Scans</Text>
          <Text className="text-muted-foreground font-sans text-xs">Recently added to your inventory</Text>
        </View>
        <Text className="text-primary font-sans-bold text-xs">View All</Text>
      </View>

      <View className="bg-card border border-border rounded-2xl overflow-hidden">
        {scans.map((scan, index) => (
          <View 
            key={scan.id}
            className={`flex-row items-center px-4 py-4 ${index !== scans.length - 1 ? 'border-b border-border/30' : ''}`}
          >
            <View className="bg-secondary/50 p-2.5 rounded-xl">
              <Package size={20} color="#64748b" />
            </View>
            
            <View className="flex-1 ml-4">
              <Text className="text-foreground font-sans-bold text-sm">{scan.name}</Text>
              <Text className="text-muted-foreground font-sans-medium text-xs mt-0.5">Quantity: {scan.quantity}</Text>
            </View>

            <View className="items-end">
              <Text className="text-muted-foreground font-sans text-[10px] mb-1">{scan.time}</Text>
              <ChevronRight size={14} color="#cbd5e1" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecentScans;
