// src/screens/PantryScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Refrigerator, Search, Filter, Plus } from 'lucide-react-native';

const PantryScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-10 pb-4 border-b border-border/50">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-sans-bold text-foreground">Your Pantry</Text>
            <Text className="text-sm font-sans text-muted-foreground mt-1">Manage your active ingredients</Text>
          </View>
          <TouchableOpacity className="bg-primary/10 p-2.5 rounded-full">
            <Plus size={20} color="#4F47E5" />
          </TouchableOpacity>
        </View>

        {/* Search & Filter Placeholders */}
        <View className="flex-row mt-6 gap-x-3">
          <View className="flex-1 bg-muted/50 rounded-xl px-4 py-3 flex-row items-center">
            <Search size={16} color="#94a3b8" />
            <Text className="ml-3 text-muted-foreground font-sans text-sm">Search ingredients...</Text>
          </View>
          <View className="bg-muted/50 rounded-xl px-4 py-3 items-center justify-center">
            <Filter size={16} color="#94a3b8" />
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}
      >
        <View className="bg-primary/5 p-8 rounded-full mb-6">
          <Refrigerator size={64} color="#4F47E5" opacity={0.5} />
        </View>
        <Text className="text-lg font-sans-bold text-foreground text-center">Your Pantry is Empty</Text>
        <Text className="text-sm font-sans text-muted-foreground text-center mt-2 leading-5">
          Scan a grocery receipt or add items manually to start tracking your inventory health.
        </Text>
        
        <TouchableOpacity className="bg-primary px-8 py-4 rounded-xl mt-8 shadow-lg shadow-primary/20">
          <Text className="text-white font-sans-bold">Add First Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PantryScreen;
