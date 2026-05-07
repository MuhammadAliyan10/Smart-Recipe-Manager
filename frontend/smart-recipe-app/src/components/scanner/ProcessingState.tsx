// src/components/scanner/ProcessingState.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { Sparkles, BrainCircuit, Search, Database } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ProcessingState = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: Search, label: "Scanning Text", subtext: "OCR is analyzing receipt pixels..." },
    { icon: BrainCircuit, label: "AI Extraction", subtext: "Identifying ingredients and quantities..." },
    { icon: Database, label: "Syncing Pantry", subtext: "Updating your kitchen inventory..." },
    { icon: Sparkles, label: "Almost Ready", subtext: "Finalizing your recipe matches..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[step].icon;

  return (
    <View className="absolute inset-0 bg-black/40 items-center justify-center px-8">
      <View 
        className="bg-white rounded-[40px] p-10 items-center shadow-2xl border border-white/20"
        style={{ width: width - 64 }} // Enforces consistent horizontal margins
      >
        <View className="bg-primary/5 p-8 rounded-full mb-8 border border-primary/10">
          <CurrentIcon size={48} color="#4F47E5" />
        </View>

        <View className="h-10 items-center justify-center">
          <Text className="text-2xl font-sans-bold text-foreground text-center">
            {steps[step].label}
          </Text>
        </View>
        
        <Text className="text-sm font-sans text-muted-foreground mt-4 text-center leading-6 min-h-[48px]">
          {steps[step].subtext}
        </Text>

        <View className="w-full mt-12 bg-secondary/50 h-1.5 rounded-full overflow-hidden">
          <View 
            className="h-full bg-primary" 
            style={{ width: `${(step + 1) * 25}%` }} 
          />
        </View>

        <View className="flex-row mt-8 items-center">
          <ActivityIndicator size="small" color="#4F47E5" />
          <Text className="text-[10px] font-sans-bold text-primary uppercase tracking-[2px] ml-3">
            AI is processing
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProcessingState;
