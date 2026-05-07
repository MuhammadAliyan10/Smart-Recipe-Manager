import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Alert, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Camera as CameraIcon, RotateCcw, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react-native';
import client from '../api/client';

interface Ingredient {
  name: string;
  quantity: string;
  category: string;
  confidence_score: number;
}

interface ExtractionResponse {
  saved_items: Ingredient[];
  unrecognized_text: string;
}

const RecipeScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractionResponse | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View className="flex-1 bg-white justify-center items-center" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-8">
        <AlertCircle size={48} color="#4F47E5" />
        <Text className="text-xl font-bold mt-4 text-center">Camera Access Required</Text>
        <Text className="text-gray-500 text-center mt-2 mb-6">
          We need your permission to use the camera to scan receipts and ingredients.
        </Text>
        <TouchableOpacity 
          onPress={requestPermission}
          className="bg-primary px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const captureAndScan = async () => {
    if (!cameraRef.current || isScanning) return;

    setIsScanning(true);
    try {
      // 1. Capture Picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (!photo) throw new Error("Failed to capture photo");

      // 2. Compress & Resize Image for Backend
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // 3. Prepare FormData
      const formData = new FormData();
      formData.append('file', {
        uri: manipulatedImage.uri,
        name: 'scan.jpg',
        type: 'image/jpeg',
      } as any);

      // 4. API Request
      const response = await client.post<ExtractionResponse>('/v1/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      setExtractedData(response.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Scanning Error",
        error.response?.data?.detail || "Failed to analyze image. Please try again."
      );
    } finally {
      setIsScanning(false);
    }
  };

  const renderIngredient = ({ item }: { item: Ingredient }) => (
    <View className="bg-white p-4 rounded-2xl mb-3 flex-row items-center border border-gray-100 shadow-sm">
      <View className="bg-indigo-50 p-3 rounded-xl">
        <CheckCircle2 size={20} color="#4F47E5" />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{item.name}</Text>
        <View className="flex-row items-center mt-1">
          <View className="bg-gray-100 px-2 py-1 rounded-md mr-2">
            <Text className="text-xs text-gray-600 font-medium capitalize">{item.category}</Text>
          </View>
          <Text className="text-sm text-gray-500 font-semibold">{item.quantity}</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#D1D5DB" />
    </View>
  );

  if (extractedData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="p-6 flex-1">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">Scan Results</Text>
            <TouchableOpacity 
              onPress={() => setExtractedData(null)}
              className="bg-indigo-100 p-2 rounded-full"
            >
              <RotateCcw size={20} color="#4F47E5" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={extractedData.saved_items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderIngredient}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="mt-12 items-center">
                <Text className="text-gray-400">No ingredients were detected.</Text>
              </View>
            }
            ListFooterComponent={
              extractedData.unrecognized_text ? (
                <View className="mt-6 p-4 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                  <Text className="text-xs font-bold text-gray-400 uppercase mb-2">Unrecognized Content</Text>
                  <Text className="text-gray-500 text-sm leading-5">{extractedData.unrecognized_text}</Text>
                </View>
              ) : null
            }
          />

          <TouchableOpacity 
            onPress={() => setExtractedData(null)}
            className="bg-primary py-4 rounded-2xl items-center mt-4 shadow-lg shadow-indigo-200"
          >
            <Text className="text-white font-bold text-lg">Scan Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        ref={cameraRef}
        className="flex-1"
        facing="back"
      >
        <View className="flex-1 justify-between p-10 py-20">
          <View className="bg-black/40 p-4 rounded-2xl border border-white/20">
            <Text className="text-white text-center font-bold text-lg">AI Scanner Active</Text>
            <Text className="text-white/60 text-center text-sm mt-1">Position items within the frame</Text>
          </View>

          <View className="items-center">
            {isScanning ? (
              <View className="bg-white/90 p-6 rounded-full">
                <ActivityIndicator size="large" color="#4F47E5" />
                <Text className="text-primary font-bold mt-2">Analyzing...</Text>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={captureAndScan}
                activeOpacity={0.8}
                className="bg-white w-20 h-20 rounded-full border-8 border-white/30 justify-center items-center shadow-2xl"
              >
                <CameraIcon size={32} color="#4F47E5" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default RecipeScreen;
