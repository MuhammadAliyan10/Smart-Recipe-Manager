// src/screens/CookingModeScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { useKeepAwake } from 'expo-keep-awake';
import Toast from 'react-native-toast-message';
import { Recipe } from '../api/recipes';

const { width } = Dimensions.get('window');

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
        text1: 'Congratulations!',
        text2: 'You completed the recipe. Enjoy your meal!',
      });
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      
      {/* Top Navigation Bar */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="bg-secondary/50 p-2 rounded-full"
        >
          <X size={24} color="#64748b" />
        </TouchableOpacity>
        
        <View className="flex-1 px-4">
          <Text className="text-foreground font-sans-bold text-center" numberOfLines={1}>
            Cooking: {recipe.title}
          </Text>
        </View>

        <View className="w-10" /> {/* Spacer */}
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-12">
        <View className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <View 
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-3">
          <Text className="text-muted-foreground font-sans-bold text-xs">
            STEP {currentStepIndex + 1} OF {instructions.length}
          </Text>
          <Text className="text-primary font-sans-bold text-xs uppercase tracking-widest">
            {Math.round(progress)}% Complete
          </Text>
        </View>
      </View>

      {/* Instruction Card */}
      <View className="flex-1 px-6 justify-center">
        <View className="bg-card border border-border/50 p-8 rounded-[40px] shadow-2xl shadow-primary/10 items-center">
          <View className="bg-primary/10 p-5 rounded-full mb-8">
            <CheckCircle2 size={40} color="#4F47E5" />
          </View>
          
          <Text className="text-foreground font-sans-medium text-2xl text-center leading-[38px]">
            {instructions[currentStepIndex]}
          </Text>
        </View>
      </View>

      {/* Navigation Controls */}
      <View className="px-8 py-10 flex-row items-center gap-x-4">
        <TouchableOpacity 
          onPress={handlePrevious}
          disabled={currentStepIndex === 0}
          className={`w-16 h-16 rounded-3xl items-center justify-center border ${
            currentStepIndex === 0 
              ? 'bg-transparent border-border/50' 
              : 'bg-white border-border shadow-sm'
          }`}
        >
          <ChevronLeft size={28} color={currentStepIndex === 0 ? "#cbd5e1" : "#0f172a"} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleNext}
          className="flex-1 h-16 bg-primary rounded-3xl flex-row items-center justify-center shadow-xl shadow-primary/30"
          activeOpacity={0.9}
        >
          <Text className="text-white font-sans-bold text-lg mr-2">
            {currentStepIndex === instructions.length - 1 ? 'Finish Cooking' : 'Next Step'}
          </Text>
          {currentStepIndex !== instructions.length - 1 && (
            <ChevronRight size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CookingModeScreen;
