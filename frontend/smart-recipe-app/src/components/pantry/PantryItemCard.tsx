// src/components/pantry/PantryItemCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { 
  Beef, 
  Milk, 
  Apple, 
  Package, 
  Leaf, 
  Coffee,
  LucideIcon
} from 'lucide-react-native';

interface PantryItemCardProps {
  name: string;
  quantity: string;
  category: string;
}

const getCategoryIcon = (category: string): LucideIcon => {
  const cat = category.toLowerCase();
  if (cat.includes('produce') || cat.includes('fruit') || cat.includes('veg')) return Apple;
  if (cat.includes('dairy')) return Milk;
  if (cat.includes('protein') || cat.includes('meat')) return Beef;
  if (cat.includes('drink') || cat.includes('beverage')) return Coffee;
  if (cat.includes('grain') || cat.includes('pantry')) return Package;
  return Package;
};

const PantryItemCard: React.FC<PantryItemCardProps> = ({ name, quantity, category }) => {
  const Icon = getCategoryIcon(category);

  return (
    <View className="flex-row items-center justify-between p-4 mb-3 bg-card border border-border rounded-xl">
      <View className="flex-row items-center flex-1">
        <View className="bg-primary/10 p-2.5 rounded-lg">
          <Icon size={20} color="#4F47E5" />
        </View>
        
        <View className="ml-4 flex-1">
          <Text className="text-foreground font-sans-bold text-sm" numberOfLines={1}>
            {name}
          </Text>
          <View className="bg-secondary px-2 py-0.5 rounded-md self-start mt-1">
            <Text className="text-[10px] font-sans-medium text-muted-foreground uppercase">
              {category}
            </Text>
          </View>
        </View>
      </View>

      <View className="items-end ml-4">
        <Text className="text-muted-foreground font-sans-medium text-xs">
          {quantity}
        </Text>
      </View>
    </View>
  );
};

export default PantryItemCard;
