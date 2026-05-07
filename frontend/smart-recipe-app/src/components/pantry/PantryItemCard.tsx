// src/components/pantry/PantryItemCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { 
  Beef, 
  Milk, 
  Apple, 
  Package, 
  Leaf, 
  Coffee,
  LucideIcon,
  Trash2
} from 'lucide-react-native';

interface PantryItemCardProps {
  id: number | string;
  name: string;
  quantity: string;
  category: string;
  onDelete?: (id: number | string) => void;
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

const PantryItemCard: React.FC<PantryItemCardProps> = ({ id, name, quantity, category, onDelete }) => {
  const Icon = getCategoryIcon(category);

  const confirmDelete = () => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove "${name}" from your pantry?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: () => onDelete?.(id) 
        }
      ]
    );
  };

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

      <View className="flex-row items-center ml-4">
        <Text className="text-muted-foreground font-sans-medium text-xs mr-4">
          {quantity}
        </Text>
        
        <TouchableOpacity 
          onPress={confirmDelete}
          className="p-2 -mr-2"
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PantryItemCard;
