// src/screens/PantryScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  RefreshControl, 
  Text, 
  TouchableOpacity, 
  StatusBar,
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshCcw, ShoppingCart, Plus, Search, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
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

const PantryScreen = () => {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<IngredientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IngredientItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Optimized Search Filtering
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

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
      loadPantry();
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

        {/* Search Bar */}
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
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
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
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingTop: 4, 
            paddingBottom: 140 
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

        {/* Floating Action Button */}
        <TouchableOpacity 
          onPress={openAddModal}
          className="absolute bottom-10 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-xl shadow-primary/40 elevation-5"
          activeOpacity={0.8}
        >
          <Plus size={32} color="white" />
        </TouchableOpacity>

        {/* Entry Modal */}
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
