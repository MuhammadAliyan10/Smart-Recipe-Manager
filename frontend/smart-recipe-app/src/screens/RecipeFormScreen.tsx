// src/screens/RecipeFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { createManualRecipe, updateRecipe, Recipe } from '../api/recipes';

const RecipeFormScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const editingRecipe = route.params?.recipe as Recipe | undefined;

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [calories, setCalories] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || '');
      setTime(editingRecipe.time || '');
      setCalories(editingRecipe.calories || '');
      setIngredients(editingRecipe.ingredients?.length > 0 ? editingRecipe.ingredients : ['']);
      setInstructions(editingRecipe.instructions?.length > 0 ? editingRecipe.instructions : ['']);
    }
  }, [editingRecipe]);

  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredient = (index: number) => {
    const newIngs = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngs.length > 0 ? newIngs : ['']);
  };
  const handleUpdateIngredient = (text: string, index: number) => {
    const newIngs = [...ingredients];
    newIngs[index] = text;
    setIngredients(newIngs);
  };

  const handleAddInstruction = () => setInstructions([...instructions, '']);
  const handleRemoveInstruction = (index: number) => {
    const newInst = instructions.filter((_, i) => i !== index);
    setInstructions(newInst.length > 0 ? newInst : ['']);
  };
  const handleUpdateInstruction = (text: string, index: number) => {
    const newInst = [...instructions];
    newInst[index] = text;
    setInstructions(newInst);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Missing Info", "Please provide a title for your recipe.");
      return;
    }

    const cleanIngredients = ingredients.filter(i => i.trim().length > 0);
    const cleanInstructions = instructions.filter(i => i.trim().length > 0);

    if (cleanIngredients.length === 0) {
      Alert.alert("Missing Info", "Please add at least one ingredient.");
      return;
    }

    setIsSubmitting(true);
    let isMounted = true;
    const payload: Partial<Recipe> = {
      title,
      time: time || '30 min',
      calories: calories || '400 kcal',
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      matchPercentage: editingRecipe?.matchPercentage || 100,
      substitutes: editingRecipe?.substitutes || [],
      missing_ingredients: editingRecipe?.missing_ingredients || []
    };

    try {
      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, payload);
        if (isMounted) Toast.show({ type: 'success', text1: 'Recipe Updated', text2: 'Changes saved successfully.' });
      } else {
        await createManualRecipe(payload);
        if (isMounted) Toast.show({ type: 'success', text1: 'Recipe Created', text2: 'New recipe added to your collection.' });
      }
      if (isMounted) navigation.goBack();
    } catch (error) {
      console.error("[RECIPE_FORM] Save failed:", error);
      if (isMounted) Toast.show({ type: 'error', text1: 'Save Failed', text2: 'Could not persist recipe changes.' });
    } finally {
      if (isMounted) setIsSubmitting(false);
    }
    return () => { isMounted = false; };
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-border/50 bg-white">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-foreground font-sans-bold text-lg">
            {editingRecipe ? 'Edit Recipe' : 'Build Recipe'}
          </Text>
          <View className="w-10" />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Basic Info */}
            <View className="mb-10">
              <View className="mb-6">
                <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase tracking-widest mb-2 ml-1">Recipe Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Signature Truffle Pasta"
                  placeholderTextColor="#94a3b8"
                  className="bg-white border border-border px-4 py-4 rounded-2xl font-sans-medium text-foreground text-base"
                />
              </View>

              <View className="flex-row gap-x-4">
                <View className="flex-1">
                  <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase tracking-widest mb-2 ml-1">Cook Time</Text>
                  <TextInput
                    value={time}
                    onChangeText={setTime}
                    placeholder="30 min"
                    placeholderTextColor="#94a3b8"
                    className="bg-white border border-border px-4 py-4 rounded-2xl font-sans-medium text-foreground text-base"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase tracking-widest mb-2 ml-1">Calories</Text>
                  <TextInput
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="450 kcal"
                    placeholderTextColor="#94a3b8"
                    className="bg-white border border-border px-4 py-4 rounded-2xl font-sans-medium text-foreground text-base"
                  />
                </View>
              </View>
            </View>

            {/* Ingredients List */}
            <View className="mb-10">
              <Text className="text-foreground font-sans-bold text-xl mb-4 ml-1">Ingredients</Text>
              {ingredients.map((ing, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <TextInput
                    value={ing}
                    onChangeText={(text) => handleUpdateIngredient(text, index)}
                    placeholder={`Ingredient ${index + 1}`}
                    placeholderTextColor="#94a3b8"
                    className="flex-1 bg-white border border-border px-4 py-4 rounded-2xl font-sans-medium text-foreground"
                  />
                  <TouchableOpacity 
                    onPress={() => handleRemoveIngredient(index)}
                    className="ml-3 p-3 bg-red-50 rounded-xl"
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity 
                onPress={handleAddIngredient}
                className="flex-row items-center justify-center py-4 border border-dashed border-primary/30 rounded-2xl mt-2"
              >
                <Plus size={18} color="#4F47E5" />
                <Text className="text-primary font-sans-bold ml-2">Add Ingredient</Text>
              </TouchableOpacity>
            </View>

            {/* Instructions List */}
            <View className="mb-6">
              <Text className="text-foreground font-sans-bold text-xl mb-4 ml-1">Instructions</Text>
              {instructions.map((inst, index) => (
                <View key={index} className="mb-6">
                  <View className="flex-row items-center justify-between mb-2 px-1">
                    <Text className="text-muted-foreground font-sans-bold text-xs">Step {index + 1}</Text>
                    <TouchableOpacity onPress={() => handleRemoveInstruction(index)}>
                      <Trash2 size={16} color="#ef4444" style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    value={inst}
                    onChangeText={(text) => handleUpdateInstruction(text, index)}
                    placeholder="What's the next step?"
                    placeholderTextColor="#94a3b8"
                    multiline
                    className="bg-white border border-border px-4 py-4 rounded-2xl font-sans-medium text-foreground min-h-[100px]"
                    textAlignVertical="top"
                  />
                </View>
              ))}
              <TouchableOpacity 
                onPress={handleAddInstruction}
                className="flex-row items-center justify-center py-4 border border-dashed border-primary/30 rounded-2xl mt-2"
              >
                <Plus size={18} color="#4F47E5" />
                <Text className="text-primary font-sans-bold ml-2">Add Cooking Step</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Sticky Submit Button - No absolute positioning to ensure stability */}
          <View className="p-6 bg-white border-t border-border/50">
            <TouchableOpacity 
              onPress={handleSave}
              disabled={isSubmitting}
              className="bg-primary h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-primary/20"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save size={20} color="white" />
                  <Text className="text-white font-sans-bold ml-3 text-lg">Save Recipe</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default RecipeFormScreen;
