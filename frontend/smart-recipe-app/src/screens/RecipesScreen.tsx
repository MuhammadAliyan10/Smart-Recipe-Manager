// src/screens/RecipesScreen.tsx
import React, { useState } from 'react';
import { View, FlatList, SafeAreaView, StatusBar, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { generateRecipes, Recipe } from '../api/recipes';

// Components
import ScreenHeader from '../components/ui/ScreenHeader';
import RecipeCard from '../components/recipes/RecipeCard';
import GenerateRecipeCTA from '../components/recipes/GenerateRecipeCTA';
import Loader from '../components/ui/Loader';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateRecipes();
      setRecipes(data);
      
      Toast.show({
        type: 'success',
        text1: 'Recipes Ready!',
        text2: `AI found ${data.length} delicious meals for you.`,
      });
    } catch (error: any) {
      console.error("[RECIPES] Generation error:", error);
      
      const errorMessage = error.response?.data?.detail || "Could not generate recipes. Check your connection.";
      
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
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={({ item }) => (
            <RecipeCard 
              title={item.title}
              matchPercentage={item.matchPercentage}
              time={item.time}
              calories={item.calories}
              ingredients={item.ingredients}
            />
          )}
          ListHeaderComponent={
            <GenerateRecipeCTA 
              onPress={handleGenerate} 
              isGenerating={isGenerating} 
            />
          }
          ListEmptyComponent={
            !isGenerating ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: '#94a3b8', fontFamily: 'Figtree_500Medium', textAlign: 'center' }}>
                  No recipes generated yet. Tap the button above to let the AI analyze your pantry.
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
