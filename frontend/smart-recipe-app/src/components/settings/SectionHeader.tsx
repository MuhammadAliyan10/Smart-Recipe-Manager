// src/components/settings/SectionHeader.tsx
import React from 'react';
import { Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <View className="px-6 pt-6 pb-2">
      <Text className="text-xs font-sans-bold text-muted-foreground uppercase tracking-widest">
        {title}
      </Text>
    </View>
  );
};

export default SectionHeader;
