import React from 'react';
import { View, Text } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';
import { CheckCircle2, AlertCircle } from 'lucide-react-native';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View className="w-[90%] bg-background border border-border rounded-2xl p-4 flex-row items-center shadow-lg">
      <View className="bg-emerald-50 p-2 rounded-full mr-3">
        <CheckCircle2 size={20} color="#10b981" />
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-sans-bold text-sm">{text1}</Text>
        {text2 && <Text className="text-muted-foreground font-sans text-xs mt-1">{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View className="w-[90%] bg-background border border-destructive/20 rounded-2xl p-4 flex-row items-center shadow-lg">
      <View className="bg-destructive/10 p-2 rounded-full mr-3">
        <AlertCircle size={20} color="#ef4444" />
      </View>
      <View className="flex-1">
        <Text className="text-destructive font-sans-bold text-sm">{text1}</Text>
        {text2 && <Text className="text-muted-foreground font-sans text-xs mt-1">{text2}</Text>}
      </View>
    </View>
  ),
};
