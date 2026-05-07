// src/screens/RecipeDetailScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  Sparkles, 
  Utensils, 
  RotateCcw, 
  CheckCircle2,
  ShoppingCart,
  Check,
  Trash2,
  ChefHat,
  AlertCircle
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Recipe, deleteRecipe } from '../api/recipes';
import { addToShoppingList } from '../api/shoppingList';

const RecipeDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { recipe } = route.params as { recipe: Recipe };

  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const missingCount = recipe.missing_ingredients?.length || 0;

  const handleAddToShoppingList = async () => {
    if (hasExported || missingCount === 0) return;
    
    setIsExporting(true);
    try {
      await addToShoppingList(recipe.missing_ingredients);
      
      setHasExported(true);
      Toast.show({
        type: 'success',
        text1: 'Added to Cart!',
        text2: `${missingCount} missing items added to your shopping list.`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Export Failed',
        text2: 'Could not add ingredients to shopping list.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteRecipe = () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to remove this recipe from your history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id);
              Toast.show({
                type: 'success',
                text1: 'Recipe Deleted',
                text2: 'Removed from your history.',
              });
              navigation.goBack();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: 'Could not remove recipe. Please try again.',
              });
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      
      {/* Header Image/Background Placeholder */}
      <View className="h-64 bg-primary/5 items-center justify-center border-b border-border/50">
        <Utensils size={64} color="#4F47E5" style={{ opacity: 0.1 }} />
        
        {/* Navigation Actions */}
        <View className="absolute top-12 left-6 right-6 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-border/50"
          >
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDeleteRecipe}
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-red-100"
          >
            <Trash2 size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 -mt-10 bg-background rounded-t-[40px] px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Stats */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <View className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex-row items-center">
              <Sparkles size={12} color="#10b981" />
              <Text className="text-emerald-600 font-sans-bold text-xs ml-1.5 uppercase tracking-wider">
                {recipe.matchPercentage}% Ingredient Match
              </Text>
            </View>
          </View>
          
          <Text className="text-foreground font-sans-bold text-3xl mb-6">
            {recipe.title}
          </Text>

          <View className="flex-row items-center gap-x-8 pb-6 border-b border-border/50">
            <View className="flex-row items-center">
              <View className="bg-orange-500/10 p-2 rounded-xl mr-3">
                <Clock size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-muted-foreground font-sans text-[10px] uppercase">Time</Text>
                <Text className="text-foreground font-sans-bold text-sm">{recipe.time}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="bg-red-500/10 p-2 rounded-xl mr-3">
                <Flame size={20} color="#ef4444" />
              </View>
              <View>
                <Text className="text-muted-foreground font-sans text-[10px] uppercase">Calories</Text>
                <Text className="text-foreground font-sans-bold text-sm">{recipe.calories}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SMART INGREDIENTS SECTION */}
        <View className="mb-10">
          {/* Section A: What You Need (Missing) */}
          {missingCount > 0 ? (
            <View className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <AlertCircle size={20} color="#f59e0b" />
                <Text className="text-amber-800 font-sans-bold text-lg ml-3">What You Need</Text>
              </View>
              
              <View className="gap-y-3 mb-6">
                {recipe.missing_ingredients.map((item, index) => (
                  <View key={index} className="flex-row items-center">
                    <View className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-3" />
                    <Text className="text-amber-900 font-sans-medium text-sm">{item}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                onPress={handleAddToShoppingList}
                disabled={isExporting || hasExported}
                className={`flex-row items-center justify-center py-4 rounded-2xl border ${
                  hasExported 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-amber-500 border-amber-600 shadow-sm shadow-amber-200'
                }`}
              >
                {isExporting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : hasExported ? (
                  <>
                    <Check size={18} color="#059669" />
                    <Text className="text-emerald-700 font-sans-bold ml-2">Missing Items Added ✓</Text>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} color="#ffffff" />
                    <Text className="text-white font-sans-bold ml-2">Add Missing to Shopping List</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 flex-row items-center mb-6">
              <Check size={20} color="#10b981" />
              <Text className="text-emerald-700 font-sans-bold ml-3 flex-1">
                You have everything needed to cook this!
              </Text>
            </View>
          )}

          {/* Section B: Core Ingredients (What You Have) */}
          <View>
            <Text className="text-foreground font-sans-bold text-xl mb-5">Core Ingredients</Text>
            <View className="flex-row flex-wrap gap-2">
              {recipe.ingredients.map((item, index) => (
                <View 
                  key={index} 
                  className="bg-secondary/50 px-4 py-2.5 rounded-2xl border border-border/40 flex-row items-center"
                >
                  <CheckCircle2 size={14} color="#10b981" className="mr-2" />
                  <Text className="text-foreground font-sans-medium text-sm">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Substitutes Section */}
        {recipe.substitutes && recipe.substitutes.length > 0 && (
          <View className="mb-10 bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100">
            <View className="flex-row items-center mb-4">
              <RotateCcw size={20} color="#4F47E5" />
              <Text className="text-indigo-900 font-sans-bold text-lg ml-3">Smart Substitutes</Text>
            </View>
            
            <View className="gap-y-3">
              {recipe.substitutes.map((sub, index) => (
                <View key={index} className="flex-row items-center bg-white/80 p-4 rounded-2xl border border-indigo-200/50 shadow-sm">
                  <View className="flex-1">
                    <Text className="text-muted-foreground font-sans text-[10px] uppercase">Out of</Text>
                    <Text className="text-foreground font-sans-bold text-sm">{sub.original}</Text>
                  </View>
                  <View className="px-4">
                    <Text className="text-indigo-400 font-sans-bold">→</Text>
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="text-indigo-600 font-sans text-[10px] uppercase text-right">Try using</Text>
                    <Text className="text-indigo-700 font-sans-bold text-sm text-right">{sub.substitute}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Instructions Timeline Section */}
        <View className="mb-20">
          <Text className="text-foreground font-sans-bold text-xl mb-6">Instructions</Text>
          
          <View className="ml-2 mt-2 pl-4 border-l-2 border-muted">
            {recipe.instructions.map((step, index) => (
              <View key={index} className="relative pl-6 mb-8">
                {/* Timeline Dot */}
                <View 
                  className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background"
                  style={{ 
                    borderWidth: 3, 
                    borderColor: '#ffffff',
                    shadowColor: '#4F47E5',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4
                  }} 
                />
                
                <Text className="text-primary font-sans-bold text-sm mb-1 uppercase tracking-wider">
                  Step {index + 1}
                </Text>
                <Text className="text-foreground font-sans text-base leading-relaxed">
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <SafeAreaView className="bg-white border-t border-border/50 px-6 py-4">
        <TouchableOpacity 
          onPress={() => navigation.navigate('CookingMode', { recipe })}
          className="bg-primary py-5 rounded-2xl flex-row items-center justify-center shadow-xl shadow-primary/20"
          activeOpacity={0.9}
        >
          <ChefHat size={20} color="white" className="mr-3" />
          <Text className="text-white font-sans-bold text-base">Start Cooking Mode</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default RecipeDetailScreen;
