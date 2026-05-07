// src/screens/PantryScreen.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  RefreshControl, 
  Text, 
  TouchableOpacity, 
  StatusBar,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { RefreshCcw, ShoppingCart, Plus, Search, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { 
  fetchPantryItems, 
  deletePantryItem, 
  addPantryItem, 
  updatePantryItem, 
  IngredientItem 
} from '../api/pantry';

// Components
import ScreenHeader from '../components/ui/ScreenHeader';
import PantryItemCard from '../components/pantry/PantryItemCard';
import PantryEmptyState from '../components/pantry/PantryEmptyState';
import PantryItemFormModal from '../components/pantry/PantryItemFormModal';
import Loader from '../components/ui/Loader';

const PAGE_SIZE = 20;

const PantryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [items, setItems] = useState<IngredientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IngredientItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deep Link Handling
  useEffect(() => {
    if (route.params?.action === 'openManualAdd') {
      setSelectedItem(null);
      setIsModalVisible(true);
      navigation.setParams({ action: undefined });
    }
  }, [route.params?.action]);

  const loadPantry = useCallback(async (reset = false) => {
    if (reset) {
      setIsRefreshing(true);
      setPage(0);
      setHasMore(true);
    } else if (page === 0) {
      setIsLoading(true);
    }
    
    setError(null);
    try {
      const skip = reset ? 0 : page * PAGE_SIZE;
      const data = await fetchPantryItems(skip, PAGE_SIZE);
      
      if (reset) {
        setItems(data);
      } else {
        setItems(prev => [...prev, ...data]);
      }

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
      
      if (!reset) setPage(prev => prev + 1);

    } catch (err: any) {
      setError("Failed to synchronize pantry.");
      console.error("[PANTRY] Load error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [page]);

  useFocusEffect(
    useCallback(() => {
      // Re-fetch only if items are empty to avoid resetting scroll position on tab switch
      if (items.length === 0) {
        loadPantry(true);
      }
    }, [])
  );

  const loadMore = () => {
    if (isFetchingMore || !hasMore || isLoading) return;
    setIsFetchingMore(true);
    loadPantry(false);
  };

  const handleRefresh = () => {
    loadPantry(true);
  };

  const handleDelete = async (id: number | string) => {
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
      setItems(previousItems);
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: 'Could not remove item. Please try again.',
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (selectedItem) {
        await updatePantryItem(selectedItem.id, formData);
        Toast.show({
          type: 'success',
          text1: 'Item Updated',
          text2: `Successfully modified ${formData.name}.`,
        });
      } else {
        await addPantryItem(formData);
        Toast.show({
          type: 'success',
          text1: 'Item Added',
          text2: `${formData.name} is now in your pantry.`,
        });
      }
      setIsModalVisible(false);
      loadPantry(true); // Reset to show the new item at the top
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'There was an error saving the ingredient.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setIsModalVisible(true);
  };

  const openEditModal = (item: IngredientItem) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  if (error && items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-10">
        <View className="bg-red-50 p-6 rounded-full mb-6">
          <RefreshCcw size={40} color="#ef4444" />
        </View>
        <Text className="text-xl font-sans-bold text-foreground text-center">Sync Failed</Text>
        <TouchableOpacity onPress={() => loadPantry(true)} className="bg-primary px-10 py-4 rounded-xl mt-6">
          <Text className="text-white font-sans-bold">Retry Sync</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <Loader visible={isLoading && items.length === 0} message="Opening pantry..." />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScreenHeader 
          title="Your Pantry" 
          subtitle="Manage your active ingredients" 
          rightElement={
            <TouchableOpacity 
              onPress={() => navigation.navigate('ShoppingList')}
              className="bg-secondary/80 p-3 rounded-2xl border border-border/50"
            >
              <ShoppingCart size={20} color="#4F47E5" />
            </TouchableOpacity>
          }
        />

        <View className="px-6 mb-4">
          <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
            <Search size={20} color="#64748b" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search pantry..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-3 font-sans-medium text-foreground"
            />
          </View>
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <PantryItemCard 
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              category={item.category}
              onDelete={handleDelete}
              onEdit={() => openEditModal(item)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!isLoading ? <PantryEmptyState /> : null}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <View className="py-6 items-center">
                <ActivityIndicator size="small" color="#4F47E5" />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#4F47E5" />
          }
        />

        <TouchableOpacity 
          onPress={openAddModal}
          className="absolute bottom-10 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-xl shadow-primary/40 elevation-5"
        >
          <Plus size={32} color="white" />
        </TouchableOpacity>

        <PantryItemFormModal 
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedItem}
          isSubmitting={isSubmitting}
        />
      </SafeAreaView>
    </View>
  );
};

export default PantryScreen;
