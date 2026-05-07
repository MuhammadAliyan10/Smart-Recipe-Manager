// src/components/pantry/PantryEmptyState.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Refrigerator } from 'lucide-react-native';

const { height } = Dimensions.get('window');

const PantryEmptyState = () => {
  return (
    <View 
      className="items-center justify-center px-10"
      style={{ height: height * 0.6 }}
    >
      <View className="bg-muted/30 p-10 rounded-full mb-6">
        <Refrigerator size={80} color="#94a3b8" opacity={0.4} />
      </View>
      
      <Text className="text-xl font-sans-bold text-foreground text-center">
        Your pantry is empty
      </Text>
      
      <Text className="text-sm font-sans text-muted-foreground text-center mt-3 leading-5">
        Tap the Scan button below to add your first grocery receipt and start tracking your kitchen health.
      </Text>
    </View>
  );
};

export default PantryEmptyState;
