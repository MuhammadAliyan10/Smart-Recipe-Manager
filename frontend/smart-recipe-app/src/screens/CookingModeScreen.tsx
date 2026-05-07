// src/screens/CookingModeScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useKeepAwake } from 'expo-keep-awake';
import Toast from 'react-native-toast-message';
import { Recipe } from '../api/recipes';

const CookingModeScreen = () => {
  useKeepAwake();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { recipe } = route.params as { recipe: Recipe };
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const instructions = recipe.instructions;
  const progress = ((currentStepIndex + 1) / instructions.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < instructions.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      Toast.show({ 
        type: 'success', 
        text1: 'Chef Status Unlocked!', 
        text2: 'Recipe completed perfectly.' 
      });
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        
        {/* Header Navigation & Progress (Top 15%) */}
        <View className="h-[15%] px-6 justify-center">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="w-12 h-12 bg-secondary/50 rounded-full items-center justify-center border border-border/50"
            >
              <X size={24} color="#0f172a" />
            </TouchableOpacity>
            
            <View className="flex-1 items-center px-4">
              <Text className="text-foreground font-sans-bold text-base text-center" numberOfLines={1}>
                {recipe.title}
              </Text>
            </View>

            <View className="w-12" /> {/* Spacer */}
          </View>

          {/* Progress Bar */}
          <View className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <View 
              className="h-full bg-primary" 
              style={{ width: `${progress}%` }} 
            />
          </View>
        </View>

        {/* Instruction Content (Middle 60%) */}
        <View className="h-[60%] px-10 justify-center">
          <View className="items-center mb-8">
            <View className="bg-primary/10 px-6 py-2 rounded-full">
              <Text className="text-primary font-sans-bold text-xs uppercase tracking-widest">
                Step {currentStepIndex + 1} of {instructions.length}
              </Text>
            </View>
          </View>
          
          <Text className="text-foreground font-sans-medium text-3xl text-center leading-[48px]">
            {instructions[currentStepIndex]}
          </Text>
        </View>

        {/* Footer Controls (Bottom 25%) */}
        <View className="h-[25%] px-8 justify-end pb-12">
          <View className="flex-row items-center justify-between">
            {currentStepIndex > 0 ? (
              <TouchableOpacity 
                onPress={handlePrevious}
                className="px-8 py-4 border border-border rounded-full flex-row items-center"
              >
                <ChevronLeft size={20} color="#64748b" />
                <Text className="text-muted-foreground font-sans-bold ml-2">Previous</Text>
              </TouchableOpacity>
            ) : (
              <View className="w-20" />
            )}

            <TouchableOpacity 
              onPress={handleNext}
              activeOpacity={0.9}
              className="bg-primary px-10 py-5 rounded-full flex-row items-center shadow-lg shadow-primary/30"
            >
              <Text className="text-white font-sans-bold text-lg">
                {currentStepIndex === instructions.length - 1 ? 'Finish' : 'Next Step'}
              </Text>
              {currentStepIndex < instructions.length - 1 && (
                <View className="ml-2">
                  <ChevronRight size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
};

export default CookingModeScreen;
