// src/screens/RecipesScreen.tsx
import React, { useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  StatusBar, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChefHat, Sparkles, Plus, Search } from 'lucide-react-native';
import { generateRecipes, getRecipeHistory, Recipe } from '../api/recipes';

// Components
import ScreenHeader from '../components/ui/ScreenHeader';
import RecipeCard from '../components/recipes/RecipeCard';
import Loader from '../components/ui/Loader';

const PAGE_SIZE = 10;

const RecipesScreen = () => {
  const navigation = useNavigation<any>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [preferences, setPreferences] = useState('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadRecipes = useCallback(async (reset = false) => {
    let isMounted = true;
    if (reset) {
      setIsRefreshing(true);
      setPage(0);
      setHasMore(true);
    } else if (page === 0) {
      setIsLoading(true);
    }

    try {
      const skip = reset ? 0 : page * PAGE_SIZE;
      const data = await getRecipeHistory(skip, PAGE_SIZE);
      
      if (isMounted) {
        if (reset) {
          setRecipes(data);
        } else {
          setRecipes(prev => [...prev, ...data]);
        }

        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
        
        if (!reset) setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("[RECIPES] Fetch failed:", error);
      if (isMounted) Toast.show({ type: 'error', text1: 'Sync Failed', text2: 'Could not load your recipes.' });
    } finally {
      if (isMounted) {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsFetchingMore(false);
      }
    }
    return () => { isMounted = false; };
  }, [page]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      if (recipes.length === 0) {
        loadRecipes(true);
      }
      return () => { isMounted = false; };
    }, [recipes.length, loadRecipes])
  );

  const loadMore = () => {
    if (isFetchingMore || !hasMore || isLoading) return;
    setIsFetchingMore(true);
    loadRecipes(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateRecipes(preferences);
      setRecipes(prev => [...data, ...prev]);
      Toast.show({
        type: 'success',
        text1: 'Recipes Ready!',
        text2: `AI found ${data.length} delicious meals for you.`,
      });
      setPreferences('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Could not generate recipes.";
      Toast.show({ type: 'error', text1: 'Generation Failed', text2: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <Loader visible={isGenerating} message="AI is crafting your menu..." />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScreenHeader 
          title="AI Chef" 
          subtitle="Smart recipes based on your pantry" 
          rightElement={
            <TouchableOpacity 
              onPress={() => navigation.navigate('RecipeForm')}
              className="bg-secondary/80 p-3 rounded-2xl border border-border/50"
            >
              <Plus size={20} color="#4F47E5" />
            </TouchableOpacity>
          }
        />

        <FlatList
          data={recipes}
          keyExtractor={(item, index) => `${item.id || index}-${index}`}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            <View className="mb-6">
              <View className="bg-card border border-border rounded-3xl p-5 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <Search size={18} color="#64748b" />
                  <Text className="text-foreground font-sans-bold ml-2 text-sm">Add Preferences</Text>
                </View>
                <TextInput
                  placeholder="e.g. Italian, Healthy, Spicy..."
                  value={preferences}
                  onChangeText={setPreferences}
                  className="bg-background border border-border px-4 py-4 rounded-2xl font-sans-medium text-sm text-foreground"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <Text className="text-foreground font-sans-bold text-lg mt-8 mb-2">Your Saved Recipes</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingMore ? (
              <View className="py-6 items-center">
                <ActivityIndicator size="small" color="#4F47E5" />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadRecipes(true)} tintColor="#4F47E5" />
          }
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Premium FAB */}
        <TouchableOpacity 
          onPress={handleGenerate}
          activeOpacity={0.9}
          className="absolute bottom-8 self-center bg-primary rounded-full px-8 py-5 flex-row items-center justify-center shadow-2xl shadow-primary/40"
        >
          <Sparkles size={20} color="white" />
          <Text className="text-white font-sans-bold ml-3 text-base">Generate AI Recipes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default RecipesScreen;
