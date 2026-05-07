// src/components/pantry/PantryItemFormModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { X } from 'lucide-react-native';
import { IngredientItem } from '../../api/pantry';

const CATEGORIES = ['Produce', 'Dairy', 'Protein', 'Pantry', 'Spices', 'Snacks', 'Beverages', 'Other'];
const UNITS = ['unit', 'g', 'kg', 'ml', 'L', 'oz', 'lb', 'cup', 'tbsp'];

interface PantryItemFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: IngredientItem | null;
  isSubmitting?: boolean;
}

const PantryItemFormModal: React.FC<PantryItemFormModalProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  initialData,
  isSubmitting 
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('unit');
  const [category, setCategory] = useState('Other');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category || 'Other');
      
      // Parse quantity: e.g., "500 g" -> amount="500", unit="g"
      const qty = initialData.quantity || '';
      const parts = qty.trim().split(' ');
      if (parts.length >= 2) {
        setAmount(parts[0]);
        setUnit(parts.slice(1).join(' ')); // Handle multi-word units if any
      } else {
        setAmount(qty);
        setUnit('unit');
      }
    } else {
      setName('');
      setAmount('');
      setUnit('unit');
      setCategory('Other');
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    const finalQuantity = amount ? `${amount} ${unit}` : unit;
    onSubmit({ 
      name, 
      quantity: finalQuantity, 
      category 
    });
  };

  const renderPill = (item: string, selected: string, onSelect: (val: string) => void) => {
    const isSelected = item === selected;
    return (
      <TouchableOpacity
        key={item}
        onPress={() => onSelect(item)}
        className={`px-5 py-2.5 rounded-full border mr-2 ${isSelected ? 'bg-primary border-primary' : 'bg-background border-border'}`}
      >
        <Text className={`font-sans-bold text-xs ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-end">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="bg-card rounded-t-[40px] p-8 border-t border-border shadow-2xl"
            >
              {/* Drag Handle */}
              <View className="items-center mb-6">
                <View className="w-12 h-1.5 bg-border rounded-full" />
              </View>

              <View className="flex-row justify-between items-center mb-8">
                <Text className="text-foreground font-sans-bold text-2xl">
                  {initialData ? 'Edit Item' : 'Add Item'}
                </Text>
                <TouchableOpacity onPress={onClose} className="bg-secondary p-2 rounded-full">
                  <X size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} className="max-h-[500px]">
                <View className="gap-y-6">
                  {/* Name Input */}
                  <View>
                    <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase ml-1 mb-3 tracking-widest">
                      Ingredient Name
                    </Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g. Tomatoes"
                      placeholderTextColor="#94a3b8"
                      className="bg-background border border-border p-4 rounded-2xl font-sans-medium text-foreground"
                    />
                  </View>

                  {/* Quantity & Unit */}
                  <View>
                    <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase ml-1 mb-3 tracking-widest">
                      Quantity & Unit
                    </Text>
                    <View className="flex-row gap-x-4 mb-4">
                      <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                        className="flex-1 bg-background border border-border p-4 rounded-2xl font-sans-medium text-foreground"
                      />
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
                      {UNITS.map(u => renderPill(u, unit, setUnit))}
                    </ScrollView>
                  </View>

                  {/* Category Selector */}
                  <View>
                    <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase ml-1 mb-3 tracking-widest">
                      Category
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
                      {CATEGORIES.map(c => renderPill(c, category, setCategory))}
                    </ScrollView>
                  </View>
                </View>

                <View className="flex-row gap-x-4 mt-10 mb-6">
                  <TouchableOpacity 
                    onPress={onClose}
                    className="flex-1 py-4 items-center"
                  >
                    <Text className="text-muted-foreground font-sans-bold">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleSave}
                    disabled={isSubmitting || !name.trim()}
                    className={`flex-[2] py-4 rounded-2xl items-center shadow-lg ${
                      !name.trim() ? 'bg-primary/50' : 'bg-primary shadow-primary/20'
                    }`}
                  >
                    <Text className="text-white font-sans-bold text-base">
                      {isSubmitting ? 'Saving...' : 'Save Ingredient'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PantryItemFormModal;
