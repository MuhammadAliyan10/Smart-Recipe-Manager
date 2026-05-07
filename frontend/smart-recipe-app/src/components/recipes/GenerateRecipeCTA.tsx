// src/components/recipes/GenerateRecipeCTA.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface GenerateRecipeCTAProps {
  onPress: () => void;
  isGenerating?: boolean;
  label?: string;
}

const GenerateRecipeCTA: React.FC<GenerateRecipeCTAProps> = ({ 
  onPress, 
  isGenerating = false,
  label = "Generate AI Recipes"
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={isGenerating}
      activeOpacity={0.9}
      style={{
        backgroundColor: '#4F47E5',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4F47E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        opacity: isGenerating ? 0.7 : 1
      }}
    >
      {isGenerating ? (
        <ActivityIndicator color="white" style={{ marginRight: 12 }} />
      ) : (
        <Sparkles size={20} color="white" style={{ marginRight: 12 }} />
      )}
      
      <Text 
        style={{
          color: 'white',
          fontSize: 18,
          fontFamily: 'Figtree_700Bold'
        }}
      >
        {isGenerating ? "Crafting Recipes..." : label}
      </Text>
    </TouchableOpacity>
  );
};

export default GenerateRecipeCTA;
