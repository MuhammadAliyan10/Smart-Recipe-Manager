// src/screens/PantryScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshCcw } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { fetchPantryItems, deletePantryItem, IngredientItem } from '../api/pantry';

// Components
import ScreenHeader from '../components/ui/ScreenHeader';
import PantryItemCard from '../components/pantry/PantryItemCard';
import PantryEmptyState from '../components/pantry/PantryEmptyState';
import Loader from '../components/ui/Loader';

const PantryScreen = () => {
  const [items, setItems] = useState<IngredientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPantry = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else if (items.length === 0) setIsLoading(true);
    
    setError(null);
    try {
      const data = await fetchPantryItems();
      setItems(data);
    } catch (err: any) {
      setError("Failed to synchronize pantry.");
      console.error("[PANTRY] Load error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [items.length]);

  useFocusEffect(
    useCallback(() => {
      loadPantry();
    }, [loadPantry])
  );

  const handleDelete = async (id: number | string) => {
    // Optimistic UI Update
    const previousItems = [...items];
    setItems(items.filter(item => item.id !== id));

    try {
      await deletePantryItem(id);
      Toast.show({
        type: 'success',
        text1: 'Item Removed',
        text2: 'Pantry inventory updated successfully.',
      });
    } catch (err) {
      // Revert on failure
      setItems(previousItems);
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: 'Could not remove item. Please try again.',
      });
    }
  };

  if (error && items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-10">
        <View className="bg-red-50 p-6 rounded-full mb-6">
          <RefreshCcw size={40} color="#ef4444" />
        </View>
        <Text className="text-xl font-sans-bold text-foreground text-center">Sync Failed</Text>
        <Text className="text-sm font-sans text-muted-foreground text-center mt-3 mb-10 leading-5">
          We couldn't connect to your pantry. Check your connection and try again.
        </Text>
        <TouchableOpacity 
          onPress={() => loadPantry()}
          className="bg-primary px-10 py-4 rounded-xl"
        >
          <Text className="text-white font-sans-bold">Retry Sync</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <Loader visible={isLoading && items.length === 0} message="Opening pantry..." />
      
      <SafeAreaView className="flex-1">
        <ScreenHeader 
          title="Your Pantry" 
          subtitle="Manage your active ingredients" 
        />

        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PantryItemCard 
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              category={item.category}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingTop: 12, 
            paddingBottom: 140 // Ensures last item clears the Tab Bar FAB
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!isLoading ? <PantryEmptyState /> : null}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={() => loadPantry(true)} 
              tintColor="#4F47E5"
              colors={["#4F47E5"]}
            />
          }
        />
      </SafeAreaView>
    </View>
  );
};

export default PantryScreen;
