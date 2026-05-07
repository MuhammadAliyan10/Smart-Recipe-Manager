// src/components/dashboard/InventoryChart.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

interface ChartDataPoint {
  value: number;
  color: string;
  text?: string;
  label: string;
}

interface InventoryChartProps {
  data: ChartDataPoint[];
  total: number;
}

const InventoryChart: React.FC<InventoryChartProps> = ({ data, total }) => {
  return (
    <View className="mx-6 p-6 bg-card border border-border rounded-2xl items-center">
      <View className="w-full mb-6">
        <Text className="text-foreground font-sans-bold text-lg">Inventory Health</Text>
        <Text className="text-muted-foreground font-sans text-xs">Category distribution in pantry</Text>
      </View>

      <View className="items-center justify-center">
        <PieChart
          data={data}
          donut
          showGradient
          sectionAutoFocus
          radius={width * 0.22}
          innerRadius={width * 0.15}
          innerCircleColor={'#ffffff'}
          centerLabelComponent={() => {
            return (
              <View className="items-center justify-center">
                <Text className="text-2xl font-sans-bold text-foreground">{total}</Text>
                <Text className="text-[10px] font-sans text-muted-foreground">Items</Text>
              </View>
            );
          }}
        />
      </View>

      {/* Legend */}
      <View className="flex-row flex-wrap justify-center mt-6 gap-4">
        {data.map((item, index) => (
          <View key={index} className="flex-row items-center">
            <View style={{ backgroundColor: item.color }} className="w-2.5 h-2.5 rounded-full" />
            <Text className="ml-2 text-[10px] font-sans-medium text-muted-foreground">{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default InventoryChart;
