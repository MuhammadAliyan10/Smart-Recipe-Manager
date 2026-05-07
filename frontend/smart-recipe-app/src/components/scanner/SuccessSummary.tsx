// src/components/scanner/SuccessSummary.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { CheckCircle2, ArrowRight, Refrigerator, Camera } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ScannedItem {
  name: string;
  category: string;
}

interface SuccessSummaryProps {
  data: {
    saved_items: ScannedItem[];
    unrecognized_text?: string;
  };
  onDone: () => void;
}

const SuccessSummary: React.FC<SuccessSummaryProps> = ({ data, onDone }) => {
  // Defensive check to prevent "Cannot read property 'length' of undefined"
  const items = data?.saved_items || [];
  const itemCount = items.length;

  return (
    <View className="absolute inset-0 bg-black/60 items-center justify-center px-6">
      <View 
        className="bg-white rounded-[40px] overflow-hidden shadow-2xl"
        style={{ width: width - 48, maxHeight: '80%' }}
      >
        <View className="bg-emerald-500 py-10 items-center">
          <View className="bg-white/20 p-4 rounded-full border border-white/30">
            <CheckCircle2 size={52} color="white" />
          </View>
          <Text className="text-white font-sans-bold text-3xl mt-6">Scan Success</Text>
          <View className="bg-white/20 px-4 py-1.5 rounded-full mt-3 border border-white/20">
            <Text className="text-white font-sans-bold text-xs uppercase tracking-widest">
              {itemCount} Items Found
            </Text>
          </View>
        </View>

        <View className="p-8">
          <Text className="text-lg font-sans-bold text-foreground mb-4">Items Added:</Text>
          
          <View className="max-h-48 mb-8">
            <ScrollView showsVerticalScrollIndicator={false}>
              {itemCount > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {items.map((item, index) => (
                    <View key={index} className="bg-secondary/50 px-4 py-2 rounded-full border border-border flex-row items-center">
                      <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                      <Text className="text-foreground font-sans-medium text-xs">{item.name}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="py-4 items-center">
                  <Text className="text-muted-foreground font-sans text-sm italic">No items recognized.</Text>
                </View>
              )}
            </ScrollView>
          </View>

          <View className="gap-y-3">
            <TouchableOpacity 
              onPress={onDone}
              activeOpacity={0.9}
              className="bg-primary py-5 rounded-2xl items-center flex-row justify-center shadow-lg shadow-primary/20"
            >
              <Refrigerator size={20} color="white" className="mr-3" />
              <Text className="text-white font-sans-bold text-base">View in Pantry</Text>
              <ArrowRight size={18} color="white" className="ml-2" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onDone}
              className="py-4 rounded-2xl items-center flex-row justify-center border border-border bg-secondary/30"
            >
              <Camera size={18} color="#64748b" className="mr-2" />
              <Text className="text-muted-foreground font-sans-semibold text-sm">Scan Another Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SuccessSummary;
