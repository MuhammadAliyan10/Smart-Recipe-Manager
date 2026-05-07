// src/screens/ShoppingListScreen.tsx
import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StatusBar, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Circle, 
  CheckCircle2, 
  Trash2, 
  ArrowLeft, 
  ShoppingBag,
  Plus
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { 
  fetchShoppingList, 
  toggleShoppingItem, 
  deleteShoppingItem, 
  ShoppingItem 
} from '../api/shoppingList';

const ShoppingListScreen = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadItems = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await fetchShoppingList();
      setItems(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Fetch Failed',
        text2: 'Could not load your shopping list.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const handleToggle = async (id: number, currentStatus: boolean) => {
    // Optimistic Update
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, is_purchased: !currentStatus } : item
    ));

    try {
      await toggleShoppingItem(id, !currentStatus);
    } catch (error) {
      // Revert on error
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_purchased: currentStatus } : item
      ));
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not update item status.',
      });
    }
  };

  const handleDelete = async (id: number) => {
    const previousItems = [...items];
    setItems(prev => prev.filter(item => item.id !== id));

    try {
      await deleteShoppingItem(id);
    } catch (error) {
      setItems(previousItems);
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: 'Could not remove item.',
      });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-border/50 bg-white">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-foreground font-sans-bold text-lg">Shopping List</Text>
          <View className="w-10" /> {/* Spacer */}
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => {
              setIsRefreshing(true);
              loadItems(false);
            }} tintColor="#4F47E5" />
          }
          ListHeaderComponent={
            <View className="px-6 pt-6 pb-2">
              <Text className="text-muted-foreground font-sans-medium text-xs uppercase tracking-widest mb-4">
                {items.filter(i => !i.is_purchased).length} Items Remaining
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="px-6 mb-3">
              <View className={`flex-row items-center bg-card border border-border p-4 rounded-2xl ${item.is_purchased ? 'opacity-50' : 'shadow-sm'}`}>
                <TouchableOpacity 
                  onPress={() => handleToggle(item.id, item.is_purchased)}
                  className="mr-4"
                >
                  {item.is_purchased ? (
                    <CheckCircle2 size={24} color="#10b981" />
                  ) : (
                    <Circle size={24} color="#cbd5e1" />
                  )}
                </TouchableOpacity>

                <Text 
                  className={`flex-1 font-sans-medium text-base text-foreground ${item.is_purchased ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.name}
                </Text>

                <TouchableOpacity 
                  onPress={() => handleDelete(item.id)}
                  className="p-2"
                >
                  <Trash2 size={18} color="#ef4444" style={{ opacity: 0.6 }} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            !isLoading ? (
              <View className="items-center justify-center pt-20 px-10">
                <View className="bg-primary/10 p-6 rounded-full mb-6">
                  <ShoppingBag size={48} color="#4F47E5" style={{ opacity: 0.5 }} />
                </View>
                <Text className="text-xl font-sans-bold text-foreground text-center">Your list is empty</Text>
                <Text className="text-sm font-sans text-muted-foreground text-center mt-3 leading-5">
                  Add ingredients from recipes to see them here and simplify your grocery runs.
                </Text>
              </View>
            ) : (
              <View className="pt-20">
                <ActivityIndicator size="large" color="#4F47E5" />
              </View>
            )
          }
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
};

export default ShoppingListScreen;
