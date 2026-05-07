// src/components/recipes/RecipeCard.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Clock, Flame, Sparkles } from 'lucide-react-native';

export interface Recipe {
  id: string;
  title: string;
  matchPercentage: number;
  time: string;
  calories: string;
  ingredients: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <View className="w-full p-5 mb-4 bg-card border border-border rounded-2xl shadow-sm">
      {/* Top Row: Title & Match */}
      <View className="flex-row justify-between items-start mb-4">
        <Text className="text-foreground font-sans-bold text-lg flex-1 mr-4">
          {recipe.title}
        </Text>
        <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex-row items-center">
          <Sparkles size={10} color="#4F47E5" />
          <Text className="text-primary font-sans-bold text-[10px] ml-1">
            {recipe.matchPercentage}% Match
          </Text>
        </View>
      </View>

      {/* Middle Row: Meta Info */}
      <View className="flex-row items-center gap-x-6 mb-5">
        <View className="flex-row items-center">
          <Clock size={14} color="#64748b" />
          <Text className="text-muted-foreground font-sans-medium text-xs ml-1.5">
            {recipe.time}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Flame size={14} color="#64748b" />
          <Text className="text-muted-foreground font-sans-medium text-xs ml-1.5">
            {recipe.calories}
          </Text>
        </View>
      </View>

      {/* Bottom Row: Ingredients */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {recipe.ingredients.map((ingredient, index) => (
          <View 
            key={index} 
            className="bg-secondary/50 px-3 py-1.5 rounded-lg mr-2 border border-border/30"
          >
            <Text className="text-muted-foreground font-sans-medium text-[10px]">
              {ingredient}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecipeCard;
