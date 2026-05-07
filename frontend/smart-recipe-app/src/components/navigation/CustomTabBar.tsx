// src/components/navigation/CustomTabBar.tsx
import React from 'react';
import { View, Pressable, Text, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LayoutGrid, Refrigerator, Scan, ChefHat, Settings } from 'lucide-react-native';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View 
      className="flex-row bg-background items-center border-t border-border/50 pb-8 pt-2"
      style={{
        height: 85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 20,
      }}
    >
      {/* 
        Slot 1: Dashboard
        Slot 2: Pantry
        Slot 3: Scan FAB
        Slot 4: Recipes
        Slot 5: Settings
      */}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === 'Scan') {
          return (
            <View key={route.key} className="flex-1 items-center justify-center">
              <Pressable
                onPress={onPress}
                className="absolute -top-10"
                style={{ zIndex: 100 }}
              >
                <View 
                  className="w-16 h-16 bg-primary rounded-full items-center justify-center border-4 border-white shadow-lg shadow-primary/40"
                  style={{ elevation: 10 }}
                >
                  <Scan size={28} color="white" />
                </View>
              </Pressable>
            </View>
          );
        }

        const getIcon = (name: string, color: string) => {
          switch (name) {
            case 'Dashboard': return <LayoutGrid size={22} color={color} />;
            case 'Pantry': return <Refrigerator size={22} color={color} />;
            case 'Recipes': return <ChefHat size={22} color={color} />;
            case 'Settings': return <Settings size={22} color={color} />;
            default: return null;
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            {getIcon(route.name, isFocused ? '#4F47E5' : '#94a3b8')}
          </Pressable>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
