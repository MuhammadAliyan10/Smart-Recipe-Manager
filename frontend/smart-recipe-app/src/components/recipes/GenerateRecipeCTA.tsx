// src/components/recipes/GenerateRecipeCTA.tsx
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface GenerateRecipeCTAProps {
  onPress: () => void;
  label?: string;
  isSecondary?: boolean;
}

const GenerateRecipeCTA: React.FC<GenerateRecipeCTAProps> = ({ 
  onPress, 
  label = "Generate AI Recipes",
  isSecondary = false
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        backgroundColor: isSecondary ? '#f1f5f9' : '#4F47E5',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: isSecondary ? 1 : 0,
        borderColor: '#e2e8f0',
        shadowColor: '#4F47E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isSecondary ? 0 : 0.2,
        shadowRadius: 8,
        elevation: isSecondary ? 0 : 4,
      }}
    >
      <Sparkles size={18} color={isSecondary ? '#64748b' : 'white'} />
      <Text 
        style={{
          marginLeft: 10,
          color: isSecondary ? '#64748b' : 'white',
          fontSize: 16,
          fontWeight: '700',
          fontFamily: 'Figtree_700Bold'
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default GenerateRecipeCTA;
