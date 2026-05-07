// src/components/recipes/RecipeCard.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Clock, Flame, Sparkles } from 'lucide-react-native';

interface RecipeCardProps {
  title: string;
  matchPercentage: number;
  time: string;
  calories: string;
  ingredients: string[];
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  title, 
  matchPercentage, 
  time, 
  calories, 
  ingredients 
}) => {
  return (
    <View className="w-full p-5 mb-4 bg-card border border-border rounded-2xl shadow-sm">
      {/* Top Row: Title & Match */}
      <View className="flex-row justify-between items-start mb-4">
        <Text className="text-foreground font-sans-bold text-lg flex-1 mr-4">
          {title}
        </Text>
        <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex-row items-center">
          <Sparkles size={10} color="#4F47E5" />
          <Text className="text-primary font-sans-bold text-[10px] ml-1">
            {matchPercentage}% Match
          </Text>
        </View>
      </View>

      {/* Middle Row: Meta Info */}
      <View className="flex-row items-center gap-x-6 mb-5">
        <View className="flex-row items-center">
          <Clock size={14} color="#64748b" />
          <Text className="text-muted-foreground font-sans-medium text-xs ml-1.5">
            {time}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Flame size={14} color="#64748b" />
          <Text className="text-muted-foreground font-sans-medium text-xs ml-1.5">
            {calories}
          </Text>
        </View>
      </View>

      {/* Bottom Row: Ingredients Chips */}
      <View className="flex-row flex-wrap gap-2">
        {ingredients.slice(0, 4).map((ingredient, index) => (
          <View 
            key={index} 
            className="bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/30"
          >
            <Text className="text-muted-foreground font-sans-medium text-[10px]">
              {ingredient}
            </Text>
          </View>
        ))}
        {ingredients.length > 4 && (
          <View className="bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/10">
            <Text className="text-muted-foreground font-sans-medium text-[10px]">
              +{ingredients.length - 4} more
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RecipeCard;
