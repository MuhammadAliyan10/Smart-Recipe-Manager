// src/screens/DashboardScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { ScrollView, View, SafeAreaView, StatusBar, Platform, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchPantryItems, IngredientItem } from '../api/pantry';

// Components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import QuickActions from '../components/dashboard/QuickActions';
import InventoryChart from '../components/dashboard/InventoryChart';
import RecentScans from '../components/dashboard/RecentScans';
import Loader from '../components/ui/Loader';

const DashboardScreen = () => {
  const [items, setItems] = useState<IngredientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const data = await fetchPantryItems();
      setItems(data);
    } catch (error) {
      console.error("[DASHBOARD] Fetch failed:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData(items.length === 0);
    }, [loadData])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  // Data Derivations
  const totalItems = useMemo(() => items.length, [items]);
  
  const recentItems = useMemo(() => items.slice(0, 3), [items]);

  const chartData = useMemo(() => {
    if (items.length === 0) {
      return [{ value: 1, color: '#f1f5f9', label: 'Empty' }];
    }

    const categories: Record<string, number> = {};
    items.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });

    const colors = ['#4F47E5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    
    return Object.entries(categories).map(([label, count], index) => ({
      value: count,
      color: colors[index % colors.length],
      label: label || 'Other',
      text: `${Math.round((count / items.length) * 100)}%`
    }));
  }, [items]);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <Loader visible={isLoading && items.length === 0} message="Syncing kitchen..." />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#4F47E5" />
          }
          contentContainerStyle={{ 
            paddingBottom: 40,
            paddingTop: Platform.OS === 'ios' ? 0 : 20 
          }}
        >
          <View style={{ rowGap: 24 }}>
            <DashboardHeader totalItems={totalItems} />
            
            <QuickActions />

            <InventoryChart data={chartData} total={totalItems} />

            <RecentScans items={recentItems} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DashboardScreen;
