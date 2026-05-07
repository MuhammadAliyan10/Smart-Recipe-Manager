// src/components/scanner/ProcessingState.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const ProcessingState = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Analyzing Receipt...",
    "Extracting items...",
    "Categorizing data...",
    "Synchronizing pantry..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="absolute inset-0 bg-background/90 items-center justify-center px-10">
      <View className="bg-white p-10 rounded-3xl shadow-2xl items-center border border-border">
        <ActivityIndicator size="large" color="#4F47E5" />
        
        <Text className="text-xl font-sans-bold text-foreground mt-8 text-center">
          {messages[messageIndex]}
        </Text>
        
        <Text className="text-sm font-sans text-muted-foreground mt-3 text-center leading-5">
          Our AI is reading your receipt and organizing your kitchen. This may take a moment.
        </Text>
      </View>
    </View>
  );
};

export default ProcessingState;
