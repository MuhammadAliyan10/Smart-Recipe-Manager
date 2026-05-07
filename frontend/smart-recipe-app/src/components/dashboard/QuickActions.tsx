// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Camera, Plus, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const QuickActions = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-row px-6 gap-x-3">
      {/* Scan Receipt */}
      <Pressable 
        onPress={() => navigation.navigate('Scan')}
        className="flex-1 bg-primary rounded-2xl p-4 items-center justify-center aspect-square shadow-lg shadow-primary/20"
      >
        <Camera size={24} color="white" />
        <Text className="text-white font-sans-bold text-xs mt-2 text-center">Scan Receipt</Text>
      </Pressable>

      {/* Manual Add */}
      <Pressable 
        onPress={() => {
          Toast.show({
            type: 'info',
            text1: 'Coming Soon',
            text2: 'Manual entry is currently being polished.',
          });
        }}
        className="flex-1 bg-card border border-border rounded-2xl p-4 items-center justify-center aspect-square"
      >
        <Plus size={24} color="#64748b" />
        <Text className="text-muted-foreground font-sans-bold text-xs mt-2 text-center">Manual Add</Text>
      </Pressable>

      {/* AI Recipe */}
      <Pressable 
        onPress={() => navigation.navigate('Recipes')}
        className="flex-1 bg-card border border-border rounded-2xl p-4 items-center justify-center aspect-square"
      >
        <Sparkles size={24} color="#64748b" />
        <Text className="text-muted-foreground font-sans-bold text-xs mt-2 text-center">AI Recipe</Text>
      </Pressable>
    </View>
  );
};

export default QuickActions;
