// src/screens/ScanScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import client from '../api/client';

// Components
import CameraOverlay from '../components/scanner/CameraOverlay';
import ProcessingState from '../components/scanner/ProcessingState';
import SuccessSummary from '../components/scanner/SuccessSummary';

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

const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [flashMode, setFlashMode] = useState(false);
  const [scanResults, setScanResults] = useState<ExtractionResponse | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<any>();

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <View style={{ backgroundColor: 'rgba(79, 71, 229, 0.05)', padding: 32, borderRadius: 100, marginBottom: 24, justifyContent: 'center', alignItems: 'center' }}>
            <AlertCircle size={64} color="#4F47E5" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#0f172a', textAlign: 'center', fontFamily: 'Figtree_700Bold' }}>
            Camera Access Required
          </Text>
          <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 12, marginBottom: 40, lineHeight: 22, fontFamily: 'Figtree_400Regular' }}>
            We need your permission to use the camera to scan receipts and extract ingredients for your pantry.
          </Text>
          <TouchableOpacity 
            onPress={requestPermission}
            style={{ 
              backgroundColor: '#4F47E5', 
              width: '100%', 
              paddingVertical: 16, 
              borderRadius: 12, 
              alignItems: 'center',
              shadowColor: '#4F47E5',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 16, fontFamily: 'Figtree_700Bold' }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || scanState === 'processing') return;

    setScanState('processing');
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (!photo) throw new Error("Failed to capture image");

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const formData = new FormData();
      formData.append('file', {
        uri: manipulatedImage.uri,
        name: 'receipt.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await client.post<ExtractionResponse>('/v1/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      setScanResults(response.data);
      setScanState('success');
      
      Toast.show({
        type: 'success',
        text1: 'Scan Complete',
        text2: 'AI has successfully extracted your items.',
      });
    } catch (error: any) {
      console.error("[SCAN] Error:", error);
      setScanState('idle');
      
      const errorMessage = error.response?.data?.detail || "Failed to analyze receipt. Please try again.";
      Toast.show({
        type: 'error',
        text1: 'Scanning Failed',
        text2: errorMessage,
      });
    }
  };

  const handleClose = () => {
    navigation.navigate('Dashboard');
  };

  const resetScan = () => {
    setScanResults(null);
    setScanState('idle');
  };

  const navigateToPantry = () => {
    setScanResults(null);
    setScanState('idle');
    navigation.navigate('Pantry');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar barStyle="light-content" />
      <CameraView 
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        enableTorch={flashMode}
      >
        <CameraOverlay 
          onClose={handleClose}
          onCapture={handleCapture}
          flashMode={flashMode}
          onToggleFlash={() => setFlashMode(!flashMode)}
        />

        {scanState === 'processing' && <ProcessingState />}
        
        {scanState === 'success' && scanResults && (
          <SuccessSummary 
            itemCount={scanResults.saved_items.length}
            onScanAnother={resetScan}
            onViewPantry={navigateToPantry}
          />
        )}
      </CameraView>
    </View>
  );
};

export default ScanScreen;
