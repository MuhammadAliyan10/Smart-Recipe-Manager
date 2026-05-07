// src/screens/RecipesScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ChefHat, Sparkles, Flame, Clock } from 'lucide-react-native';

const RecipesScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-10 pb-4 border-b border-border/50">
        <Text className="text-2xl font-sans-bold text-foreground">AI Recipes</Text>
        <Text className="text-sm font-sans text-muted-foreground mt-1">Culinary magic based on your pantry</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Featured Card Placeholder */}
        <View className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 overflow-hidden">
          <View className="absolute -top-4 -right-4 bg-primary/10 w-24 h-24 rounded-full" />
          <View className="flex-row items-center mb-4">
            <Sparkles size={20} color="#4F47E5" />
            <Text className="ml-2 text-primary font-sans-bold text-xs uppercase tracking-widest">AI Suggestion</Text>
          </View>
          <Text className="text-xl font-sans-bold text-foreground mb-2">Generate Your First Recipe</Text>
          <Text className="text-sm font-sans text-muted-foreground mb-6 leading-5">
            Our AI will analyze your 12 pantry items to suggest a healthy, delicious meal you can cook right now.
          </Text>
          
          <TouchableOpacity className="bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/20">
            <Text className="text-white font-sans-bold">Generate with AI</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Placeholder */}
        <Text className="text-sm font-sans-bold text-foreground uppercase tracking-widest mb-4">Categories</Text>
        <View className="flex-row gap-x-4 mb-8">
          <CategoryItem icon={Flame} label="Quick" />
          <CategoryItem icon={Clock} label="Under 30m" />
          <CategoryItem icon={ChefHat} label="Expert" />
        </View>

        {/* Empty State Help */}
        <View className="items-center py-10">
          <ChefHat size={48} color="#94a3b8" opacity={0.3} />
          <Text className="text-muted-foreground font-sans text-center mt-4">No saved recipes yet.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CategoryItem = ({ icon: Icon, label }: any) => (
  <View className="flex-1 bg-card border border-border rounded-xl p-4 items-center justify-center">
    <Icon size={20} color="#64748b" />
    <Text className="mt-2 text-[10px] font-sans-bold text-muted-foreground text-center">{label}</Text>
  </View>
);

export default RecipesScreen;
