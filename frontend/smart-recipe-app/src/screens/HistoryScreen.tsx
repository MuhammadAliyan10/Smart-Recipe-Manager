import React from 'react';
import { View, Text, FlatList } from 'react-native';

const HistoryScreen = () => {
  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-gray-900 mt-10 mb-6">Scan History</Text>
      <FlatList
        data={[]}
        renderItem={null}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-gray-400">No items scanned yet.</Text>
          </View>
        }
      />
    </View>
  );
};

export default HistoryScreen;
