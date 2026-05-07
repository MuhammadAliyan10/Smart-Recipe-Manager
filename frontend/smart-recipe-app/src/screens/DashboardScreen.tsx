import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { PlusCircle, ShoppingBag, History as HistoryIcon } from 'lucide-react-native';

const DashboardScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="mb-8 mt-10">
        <Text className="text-2xl font-bold text-gray-900">Kitchen Overview</Text>
        <Text className="text-gray-500">Welcome back to your smart pantry</Text>
      </View>

      <View className="flex-row justify-between mb-8">
        <View className="bg-white p-4 rounded-2xl w-[48%] shadow-sm border border-gray-100">
          <ShoppingBag size={24} color="#4F47E5" />
          <Text className="text-2xl font-bold mt-2">12</Text>
          <Text className="text-gray-500 text-sm">Items In Stock</Text>
        </View>
        <View className="bg-white p-4 rounded-2xl w-[48%] shadow-sm border border-gray-100">
          <HistoryIcon size={24} color="#4F47E5" />
          <Text className="text-2xl font-bold mt-2">48</Text>
          <Text className="text-gray-500 text-sm">Total Scanned</Text>
        </View>
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
      <TouchableOpacity className="bg-primary flex-row items-center p-4 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
        <PlusCircle size={24} color="white" />
        <Text className="text-white font-bold ml-3 text-lg">Scan New Receipt</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DashboardScreen;
