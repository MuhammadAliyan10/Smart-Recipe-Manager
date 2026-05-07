// src/components/dashboard/InventoryChart.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

const InventoryChart = () => {
  const pieData = [
    { value: 40, color: '#4F47E5', gradientCenterColor: '#6366f1', text: '40%' }, // Produce
    { value: 30, color: '#10b981', gradientCenterColor: '#34d399', text: '30%' }, // Dairy
    { value: 20, color: '#f59e0b', gradientCenterColor: '#fbbf24', text: '20%' }, // Protein
    { value: 10, color: '#94a3b8', gradientCenterColor: '#cbd5e1', text: '10%' }, // Other
  ];

  return (
    <View className="mx-6 p-6 bg-card border border-border rounded-2xl items-center">
      <View className="w-full mb-6">
        <Text className="text-foreground font-sans-bold text-lg">Inventory Health</Text>
        <Text className="text-muted-foreground font-sans text-xs">Category distribution in pantry</Text>
      </View>

      <View className="items-center justify-center">
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={width * 0.22}
          innerRadius={width * 0.15}
          innerCircleColor={'#ffffff'}
          centerLabelComponent={() => {
            return (
              <View className="items-center justify-center">
                <Text className="text-2xl font-sans-bold text-foreground">12</Text>
                <Text className="text-[10px] font-sans text-muted-foreground">Items</Text>
              </View>
            );
          }}
        />
      </View>

      {/* Legend */}
      <View className="flex-row flex-wrap justify-center mt-6 gap-4">
        <LegendItem color="#4F47E5" label="Produce" />
        <LegendItem color="#10b981" label="Dairy" />
        <LegendItem color="#f59e0b" label="Protein" />
        <LegendItem color="#94a3b8" label="Other" />
      </View>
    </View>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <View className="flex-row items-center">
    <View style={{ backgroundColor: color }} className="w-2.5 h-2.5 rounded-full" />
    <Text className="ml-2 text-[10px] font-sans-medium text-muted-foreground">{label}</Text>
  </View>
);

export default InventoryChart;
