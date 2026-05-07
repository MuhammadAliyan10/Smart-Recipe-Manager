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
  RotateCcw, 
  CheckCircle2, 
  ShoppingCart, 
  Check, 
  Trash2, 
  ChefHat, 
  AlertCircle, 
  Pencil 
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
      Toast.show({ type: 'success', text1: 'Added to Cart!', text2: `${missingCount} items added.` });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Export Failed' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteRecipe = () => {
    Alert.alert("Delete", "Remove this recipe?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { 
          await deleteRecipe(recipe.id); 
          navigation.goBack(); 
        } catch (e) { 
          Toast.show({ type: 'error', text1: 'Failed to delete' }); 
        }
      }}
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      
      {/* Top Navigation Bar */}
      <SafeAreaView className="bg-white border-b border-border/50">
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-12 h-12 bg-secondary/50 rounded-full items-center justify-center border border-border/50">
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <View className="flex-row">
            <TouchableOpacity onPress={() => navigation.navigate('RecipeForm', { recipe })} className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100 mr-3">
              <Pencil size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteRecipe} className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-red-50">
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-8 pt-8 pb-10 bg-white border-b border-border/50">
          <Text className="text-slate-900 font-sans-bold text-3xl text-center leading-[42px] mt-4 mb-4">
            {recipe.title}
          </Text>

          {/* Meta Badges */}
          <View className="flex-row items-center justify-center gap-x-3 mb-2">
            <View className="bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 flex-row items-center">
              <Clock size={14} color="#4F47E5" />
              <Text className="text-indigo-700 font-sans-bold text-[11px] ml-2">{recipe.time}</Text>
            </View>
            <View className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex-row items-center">
              <Flame size={14} color="#f97316" />
              <Text className="text-orange-700 font-sans-bold text-[11px] ml-2">{recipe.calories}</Text>
            </View>
            <View className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex-row items-center">
              <Sparkles size={14} color="#10b981" />
              <Text className="text-emerald-700 font-sans-bold text-[11px] ml-2">{recipe.matchPercentage}% Match</Text>
            </View>
          </View>
        </View>

        <View className="px-8 pt-10">
          {/* Shopping List Integration */}
          {missingCount > 0 ? (
            <View className="bg-amber-50/50 border border-amber-100 rounded-[35px] p-8 mb-10">
              <View className="flex-row items-center mb-6">
                <AlertCircle size={22} color="#f59e0b" />
                <Text className="text-amber-800 font-sans-bold text-xl ml-3">What You Need</Text>
              </View>
              <View className="mb-8">
                {recipe.missing_ingredients.map((item, index) => (
                  <View key={index} className="flex-row items-center mb-3">
                    <View className="w-2 h-2 rounded-full bg-amber-400 mr-4" />
                    <Text className="text-amber-900 font-sans-medium text-base">{item}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity onPress={handleAddToShoppingList} disabled={isExporting || hasExported} className={`h-16 rounded-2xl flex-row items-center justify-center border ${hasExported ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-500 border-amber-600'}`}>
                {isExporting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : hasExported ? (
                  <View className="flex-row items-center">
                    <Check size={18} color="#059669" />
                    <Text className="text-emerald-700 font-sans-bold ml-2">Added to List ✓</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <ShoppingCart size={18} color="#ffffff" />
                    <Text className="text-white font-sans-bold ml-2">Add to Shopping List</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-emerald-50 border border-emerald-100 rounded-[30px] p-6 flex-row items-center mb-10 shadow-sm">
              <Check size={24} color="#10b981" />
              <Text className="text-emerald-700 font-sans-bold ml-4 text-base">You have everything ready!</Text>
            </View>
          )}

          {/* Full Ingredient List */}
          <View className="mb-12">
            <Text className="text-slate-900 font-sans-bold text-2xl mb-6">Ingredients</Text>
            <View className="flex-row flex-wrap gap-3">
              {recipe.ingredients.map((item, index) => (
                <View key={index} className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex-row items-center">
                  <View className="mr-3">
                    <CheckCircle2 size={16} color="#10b981" />
                  </View>
                  <Text className="text-slate-800 font-sans-medium text-sm">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Smart Substitutes */}
          {recipe.substitutes && recipe.substitutes.length > 0 && (
            <View className="mb-12 bg-indigo-50/30 rounded-[35px] p-8 border border-indigo-100">
              <View className="flex-row items-center mb-6">
                <RotateCcw size={22} color="#4F47E5" />
                <Text className="text-indigo-900 font-sans-bold text-xl ml-3">Smart Substitutes</Text>
              </View>
              <View>
                {recipe.substitutes.map((sub, index) => (
                  <View key={index} className="flex-row items-center bg-white p-5 rounded-[25px] border border-indigo-100 shadow-sm mb-4">
                    <View className="flex-1">
                      <Text className="text-slate-400 font-sans-bold text-[9px] uppercase tracking-wider mb-1">Out of</Text>
                      <Text className="text-slate-900 font-sans-bold text-sm">{sub.original}</Text>
                    </View>
                    <View className="flex-row px-4">
                      <ArrowLeft size={16} color="#4F47E5" style={{ transform: [{ rotate: '180deg' }] }} />
                    </View>
                    <View className="flex-1 items-end">
                      <Text className="text-indigo-600 font-sans-bold text-[9px] uppercase tracking-wider mb-1">Try using</Text>
                      <Text className="text-indigo-800 font-sans-bold text-sm text-right">{sub.substitute}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Cooking Instructions */}
          <View className="mb-32">
            <Text className="text-slate-900 font-sans-bold text-2xl mb-8">Instructions</Text>
            <View className="ml-2 pl-6 border-l-2 border-slate-100">
              {recipe.instructions.map((step, index) => (
                <View key={index} className="relative mb-10">
                  <View className="absolute -left-[35px] top-1.5 w-5 h-5 rounded-full bg-primary border-4 border-white shadow-md" />
                  <Text className="text-primary font-sans-bold text-xs mb-2 uppercase tracking-[1.5px]">Step {index + 1}</Text>
                  <Text className="text-slate-700 font-sans-medium text-base leading-relaxed">{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Start Cooking CTA */}
      <SafeAreaView className="bg-white border-t border-border/50 px-8 py-6">
        <TouchableOpacity 
          onPress={() => navigation.navigate('CookingMode', { recipe })} 
          className="bg-primary h-20 rounded-3xl flex-row items-center justify-center shadow-2xl shadow-primary/40" 
          activeOpacity={0.9}
        >
          <ChefHat size={24} color="white" />
          <Text className="text-white font-sans-bold text-lg ml-3">Start Cooking Mode</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default RecipeDetailScreen;
