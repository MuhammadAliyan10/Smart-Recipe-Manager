// src/screens/PantryScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, 
  RefreshControl,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { fetchPantryItems, IngredientItem } from '../api/pantry';
import { Search, Filter, Plus } from 'lucide-react-native';

// Components
import ScreenHeader from '../components/ui/ScreenHeader';
import PantryItemCard from '../components/pantry/PantryItemCard';
import PantryEmptyState from '../components/pantry/PantryEmptyState';
import Loader from '../components/ui/Loader';

const PantryScreen = () => {
  const [items, setItems] = useState<IngredientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadItems = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const data = await fetchPantryItems();
      setItems(data);
    } catch (error) {
      console.error("[PANTRY] Load failed:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadItems(true);
  }, [loadItems]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadItems();
  };

  const rightElement = (
    <TouchableOpacity 
      style={{ 
        backgroundColor: 'rgba(79, 71, 229, 0.1)', 
        padding: 10, 
        borderRadius: 100 
      }}
    >
      <Plus size={20} color="#4F47E5" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <Loader visible={isLoading} message="Fetching pantry..." />

      <ScreenHeader 
        title="Your Pantry"
        subtitle={`${items.length} ingredients in stock`}
        rightElement={rightElement}
      />

      <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        {/* Search & Filter Placeholders */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: '#f1f5f9', borderRadius: 12, px: 16, padding: 12, flexDirection: 'row', alignItems: 'center' }}>
            <Search size={16} color="#94a3b8" />
            <Text style={{ marginLeft: 12, color: '#94a3b8', fontSize: 14, fontFamily: 'Figtree_400Regular' }}>Search ingredients...</Text>
          </View>
          <View style={{ backgroundColor: '#f1f5f9', borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center' }}>
            <Filter size={16} color="#94a3b8" />
          </View>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PantryItemCard 
            name={item.name}
            quantity={item.quantity}
            category={item.category}
          />
        )}
        style={{ flex: 1, paddingHorizontal: 24 }}
        contentContainerStyle={{ 
          paddingBottom: 120,
          paddingTop: 10 
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!isLoading ? PantryEmptyState : null}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            tintColor="#4F47E5"
            colors={["#4F47E5"]}
          />
        }
      />
    </SafeAreaView>
  );
};

export default PantryScreen;
