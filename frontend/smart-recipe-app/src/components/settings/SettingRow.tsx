// src/components/settings/SettingRow.tsx
import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

interface SettingRowProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  value, 
  onPress, 
  danger = false 
}) => {
  return (
    <Pressable 
      onPress={onPress}
      className="bg-white"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View className="flex-row items-center px-6 py-4 border-b border-border/50">
        <View 
          className={`p-2 rounded-lg ${danger ? 'bg-destructive/10' : 'bg-secondary/50'}`}
        >
          <Icon size={18} color={danger ? '#ef4444' : '#64748b'} />
        </View>
        
        <View className="flex-1 ml-4">
          <Text className={`text-base font-sans-medium ${danger ? 'text-destructive' : 'text-foreground'}`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-xs font-sans text-muted-foreground mt-0.5">
              {subtitle}
            </Text>
          )}
        </View>

        <View className="flex-row items-center">
          {value && (
            <Text className="text-sm font-sans text-muted-foreground mr-2">
              {value}
            </Text>
          )}
          <ChevronRight size={16} color="#cbd5e1" />
        </View>
      </View>
    </Pressable>
  );
};

export default SettingRow;
