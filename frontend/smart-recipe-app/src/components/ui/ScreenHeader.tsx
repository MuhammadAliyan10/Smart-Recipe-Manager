// src/components/ui/ScreenHeader.tsx
import React from 'react';
import { View, Text, Platform } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  rightElement?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, rightElement }) => {
  return (
    <View 
      style={{ 
        paddingHorizontal: 24, 
        paddingTop: Platform.OS === 'ios' ? 15 : 30, 
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text 
          style={{ 
            fontSize: 20, 
            fontWeight: '700', 
            color: '#0f172a', 
            fontFamily: 'Figtree_700Bold' 
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text 
          style={{ 
            fontSize: 12, 
            color: '#64748b', 
            marginTop: 2, 
            fontFamily: 'Figtree_500Medium' 
          }}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
      
      {rightElement && (
        <View>
          {rightElement}
        </View>
      )}
    </View>
  );
};

export default ScreenHeader;
