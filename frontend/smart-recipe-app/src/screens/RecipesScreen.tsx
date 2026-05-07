// src/screens/RecipesScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, 
  StatusBar, 
  Dimensions,
  Platform
} from 'react-native';
import { ChefHat } from 'lucide-react-native';

// Components
import ScreenHeader from '../components/ui/ScreenHeader';
import RecipeCard, { Recipe } from '../components/recipes/RecipeCard';
import GenerateRecipeCTA from '../components/recipes/GenerateRecipeCTA';
import Loader from '../components/ui/Loader';

const { height } = Dimensions.get('window');

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          title: 'Mediterranean Quinoa Salad',
          matchPercentage: 98,
          time: '15 min',
          calories: '340 kcal',
          ingredients: ['Quinoa', 'Cucumber', 'Feta', 'Olives', 'Lemon']
        },
        {
          id: '2',
          title: 'Lemon Garlic Roasted Chicken',
          matchPercentage: 85,
          time: '45 min',
          calories: '520 kcal',
          ingredients: ['Chicken Breast', 'Lemon', 'Garlic', 'Rosemary']
        },
        {
          id: '3',
          title: 'Creamy Mushroom Pasta',
          matchPercentage: 92,
          time: '20 min',
          calories: '610 kcal',
          ingredients: ['Penne', 'Mushrooms', 'Cream', 'Parmesan', 'Parsley']
        }
      ];
      setRecipes(mockRecipes);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <Loader visible={isGenerating} message="AI Chef is thinking..." />

      <ScreenHeader 
        title="AI Chef"
        subtitle="Smart recipes based on your pantry"
      />

      {recipes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, marginTop: -60 }}>
          <View style={{ backgroundColor: 'rgba(79, 71, 229, 0.05)', padding: 40, borderRadius: 100, marginBottom: 32 }}>
            <ChefHat size={80} color="#4F47E5" opacity={0.3} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#0f172a', textAlign: 'center', fontFamily: 'Figtree_700Bold' }}>
            Ready to cook something?
          </Text>
          <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 12, marginBottom: 40, lineHeight: 22, fontFamily: 'Figtree_400Regular' }}>
            Tap the button below to analyze your current pantry and generate personalized meal suggestions.
          </Text>
          <View style={{ width: '100%' }}>
            <GenerateRecipeCTA onPress={handleGenerate} />
          </View>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          style={{ flex: 1, paddingHorizontal: 24 }}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <View style={{ marginTop: 16, marginBottom: 40 }}>
              <GenerateRecipeCTA 
                onPress={handleGenerate} 
                label="Regenerate Suggestions" 
                isSecondary 
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default RecipesScreen;
