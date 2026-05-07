// src/components/settings/SettingRow.tsx
import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

interface SettingRowProps {
  icon: LucideIcon;
  title: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  onPress, 
  danger = false 
}) => {
  return (
    <Pressable 
      onPress={onPress}
      className="bg-card"
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View className="flex-row items-center px-6 py-4 border-b border-border/40">
        <View 
          className={`p-2 rounded-lg ${danger ? 'bg-red-50' : 'bg-secondary/50'}`}
        >
          <Icon size={18} color={danger ? '#ef4444' : '#64748b'} />
        </View>
        
        <View className="flex-1 ml-4">
          <Text className={`text-sm font-sans-semibold ${danger ? 'text-destructive' : 'text-foreground'}`}>
            {title}
          </Text>
        </View>

        <View className="flex-row items-center">
          {value && (
            <Text className="text-xs font-sans-medium text-muted-foreground mr-2">
              {value}
            </Text>
          )}
          {!danger && <ChevronRight size={14} color="#cbd5e1" />}
        </View>
      </View>
    </Pressable>
  );
};

export default SettingRow;
