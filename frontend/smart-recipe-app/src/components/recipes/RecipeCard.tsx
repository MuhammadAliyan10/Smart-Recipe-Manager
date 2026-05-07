// src/components/recipes/RecipeCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock, Flame, Sparkles, ChevronRight } from 'lucide-react-native';
import { Recipe } from '../../api/recipes';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('RecipeDetail', { recipe })}
      activeOpacity={0.7}
      className="w-full p-5 mb-4 bg-card border border-border rounded-2xl shadow-sm"
    >
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

      {/* Bottom Row: Ingredients Chips & Action */}
      <View className="flex-row justify-between items-end">
        <View className="flex-1 flex-row flex-wrap gap-2">
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
            <View 
              key={index} 
              className="bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/30"
            >
              <Text className="text-muted-foreground font-sans-medium text-[10px]">
                {ingredient}
              </Text>
            </View>
          ))}
          {recipe.ingredients.length > 3 && (
            <View className="bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/10">
              <Text className="text-muted-foreground font-sans-medium text-[10px]">
                +{recipe.ingredients.length - 3}
              </Text>
            </View>
          )}
        </View>
        
        <View className="bg-secondary/20 p-2 rounded-full">
          <ChevronRight size={16} color="#64748b" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;
