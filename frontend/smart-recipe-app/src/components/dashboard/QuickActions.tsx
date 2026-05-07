// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Camera, Plus, Sparkles } from 'lucide-react-native';

interface QuickActionsProps {
  onScan?: () => void;
  onManual?: () => void;
  onAI?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onScan, onManual, onAI }) => {
  return (
    <View className="flex-row px-6 gap-x-3">
      {/* Scan Receipt */}
      <Pressable 
        onPress={onScan}
        className="flex-1 bg-primary rounded-2xl p-4 items-center justify-center aspect-square shadow-lg shadow-primary/20"
      >
        <Camera size={24} color="white" />
        <Text className="text-white font-sans-bold text-xs mt-2 text-center">Scan Receipt</Text>
      </Pressable>

      {/* Manual Add */}
      <Pressable 
        onPress={onManual}
        className="flex-1 bg-card border border-border rounded-2xl p-4 items-center justify-center aspect-square"
      >
        <Plus size={24} color="#64748b" />
        <Text className="text-muted-foreground font-sans-bold text-xs mt-2 text-center">Manual Add</Text>
      </Pressable>

      {/* AI Recipe */}
      <Pressable 
        onPress={onAI}
        className="flex-1 bg-card border border-border rounded-2xl p-4 items-center justify-center aspect-square"
      >
        <Sparkles size={24} color="#64748b" />
        <Text className="text-muted-foreground font-sans-bold text-xs mt-2 text-center">AI Recipe</Text>
      </Pressable>
    </View>
  );
};

export default QuickActions;
