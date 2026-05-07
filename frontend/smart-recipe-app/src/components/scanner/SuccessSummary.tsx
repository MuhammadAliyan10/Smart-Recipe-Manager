// src/components/scanner/SuccessSummary.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle2, ChevronRight } from 'lucide-react-native';

interface SuccessSummaryProps {
  itemCount: number;
  onScanAnother: () => void;
  onViewPantry: () => void;
}

const SuccessSummary: React.FC<SuccessSummaryProps> = ({ 
  itemCount, 
  onScanAnother, 
  onViewPantry 
}) => {
  return (
    <View className="absolute inset-0 bg-black/60 items-center justify-center px-6">
      <View className="bg-white w-full p-8 rounded-3xl shadow-2xl items-center">
        <View className="bg-green-50 p-4 rounded-full mb-6">
          <CheckCircle2 size={52} color="#10b981" />
        </View>

        <Text className="text-2xl font-sans-bold text-foreground text-center">
          Extraction Complete
        </Text>
        
        <Text className="text-base font-sans-medium text-muted-foreground text-center mt-3 mb-10 leading-6">
          <Text className="text-primary font-sans-bold">{itemCount}</Text> items have been successfully identified and added to your pantry.
        </Text>

        <View className="w-full gap-y-3">
          <TouchableOpacity 
            onPress={onViewPantry}
            className="bg-primary py-4 rounded-xl items-center flex-row justify-center"
          >
            <Text className="text-white font-sans-bold text-base mr-2">View My Pantry</Text>
            <ChevronRight size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onScanAnother}
            className="bg-secondary/50 py-4 rounded-xl items-center border border-border"
          >
            <Text className="text-muted-foreground font-sans-bold text-base">Scan Another Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SuccessSummary;
