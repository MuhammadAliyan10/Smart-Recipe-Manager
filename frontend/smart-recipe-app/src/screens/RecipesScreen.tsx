// src/screens/RecipesScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StatusBar, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { generateRecipes, getRecipeHistory, Recipe } from '../api/recipes';
import { ChefHat, Info } from 'lucide-react-native';

// Components
import ScreenHeader from '../components/ui/ScreenHeader';
import RecipeCard from '../components/recipes/RecipeCard';
import GenerateRecipeCTA from '../components/recipes/GenerateRecipeCTA';
import Loader from '../components/ui/Loader';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [preferences, setPreferences] = useState('');

  const fetchHistory = async () => {
    try {
      const data = await getRecipeHistory();
      setRecipes(data);
    } catch (error) {
      console.error("[RECIPES] History fetch failed:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateRecipes(preferences);
      
      // Update local state with new recipes at the top
      setRecipes(prev => [...data, ...prev]);
      
      Toast.show({
        type: 'success',
        text1: 'Recipes Ready!',
        text2: `AI found ${data.length} delicious meals for you.`,
      });
      
      // Clear preferences after generation
      setPreferences('');
      
    } catch (error: any) {
      console.error("[RECIPES] Generation error:", error);
      const errorMessage = error.response?.data?.detail || "Could not generate recipes.";
      Toast.show({
        type: 'error',
        text1: 'Generation Failed',
        text2: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <Loader visible={isGenerating} message="AI is crafting your menu..." />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader 
          title="AI Chef" 
          subtitle="Smart recipes based on your pantry" 
        />

        <FlatList
          data={recipes}
          keyExtractor={(item, index) => `${item.id || index}-${index}`}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          ListHeaderComponent={
            <View className="mb-6">
              {/* Preference Input Card */}
              <View className="bg-secondary/30 p-5 rounded-3xl mb-6 border border-border/50">
                <View className="flex-row items-center mb-3">
                  <ChefHat size={18} color="#4F47E5" />
                  <Text className="text-foreground font-sans-bold ml-2 text-base">What are you craving?</Text>
                </View>
                
                <TextInput
                  placeholder="e.g. Italian, Healthy, Quick snacks, Spicy..."
                  value={preferences}
                  onChangeText={setPreferences}
                  className="bg-white px-4 py-4 rounded-2xl border border-border font-sans-medium text-sm mb-4 text-foreground"
                  placeholderTextColor="#94a3b8"
                />

                <GenerateRecipeCTA 
                  onPress={handleGenerate} 
                  isGenerating={isGenerating} 
                  label={preferences ? "Generate Custom Recipes" : "Generate AI Recipes"}
                />

                <View className="flex-row items-center mt-4 px-1">
                  <Info size={12} color="#64748b" />
                  <Text className="text-[10px] text-muted-foreground font-sans-medium ml-1.5">
                    AI will prioritize your pantry and these preferences.
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center px-1 mb-2">
                <Text className="text-foreground font-sans-bold text-lg">Your Menu</Text>
                {recipes.length > 0 && (
                  <Text className="text-muted-foreground font-sans-medium text-xs">{recipes.length} Saved</Text>
                )}
              </View>
            </View>
          }
          ListEmptyComponent={
            !isGenerating && !isLoadingHistory ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: '#94a3b8', fontFamily: 'Figtree_500Medium', textAlign: 'center' }}>
                  Your menu is empty. Tell the AI what you want and tap generate!
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingTop: 12, 
            paddingBottom: 40 
            
          }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
};

export default RecipesScreen;
