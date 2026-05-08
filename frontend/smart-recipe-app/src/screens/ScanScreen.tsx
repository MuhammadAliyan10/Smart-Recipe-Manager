// src/screens/ScanScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import { CameraOff, ArrowLeft } from 'lucide-react-native';

// API & Types
import { uploadReceipt, ExtractionResponse } from '../api/scanner';

// Components
import CameraOverlay from '../components/scanner/CameraOverlay';
import ProcessingState from '../components/scanner/ProcessingState';
import SuccessSummary from '../components/scanner/SuccessSummary';

type ScanState = 'idle' | 'processing' | 'success';

const ScanScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  // State Management
  const [cameraActive, setCameraActive] = useState(false);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [flashMode, setFlashMode] = useState(false);
  const [scannedData, setScannedData] = useState<ExtractionResponse | null>(null);

  useFocusEffect(
    useCallback(() => {
      setCameraActive(true);
      return () => setCameraActive(false);
    }, [])
  );

  const handleCapture = async () => {
    if (!cameraRef.current || scanState !== 'idle') return;
    let isMounted = true;

    try {
      setScanState('processing');

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const result = await uploadReceipt(manipResult.uri);
      if (isMounted) {
        setScannedData(result);
        setScanState('success');
      }
      
    } catch (error: any) {
      console.error("[SCAN] Workflow failure:", error);
      if (isMounted) {
        Toast.show({
          type: 'error',
          text1: 'Scan Failed',
          text2: error.response?.data?.detail || 'Failed to analyze receipt.',
        });
        setScanState('idle');
      }
    }
    return () => { isMounted = false; };
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handlePermissionRequest = async () => {
    if (permission?.canAskAgain) {
      await requestPermission();
    } else {
      Linking.openSettings();
    }
  };

  // Permission Guard
  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.backButton}>
              <ArrowLeft size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <CameraOff size={48} color="#64748b" />
            </View>

            <Text style={styles.title}>Camera Access Required</Text>
            
            <Text style={styles.description}>
              To scan grocery receipts and track your pantry, we need access to your camera.
            </Text>

            <TouchableOpacity 
              onPress={handlePermissionRequest}
              activeOpacity={0.9}
              style={styles.primaryButton}
            >
              <Text style={styles.buttonText}>
                {permission.canAskAgain ? "Allow Camera Access" : "Open Settings"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClose} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" />

      {cameraActive && scanState !== 'success' && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={flashMode}
        />
      )}

      {scanState === 'idle' && (
        <CameraOverlay 
          onClose={handleClose}
          onCapture={handleCapture}
          flashMode={flashMode}
          onToggleFlash={() => setFlashMode(!flashMode)}
        />
      )}

      {scanState === 'processing' && <ProcessingState />}

      {scanState === 'success' && scannedData && (
        <SuccessSummary 
          data={scannedData} 
          onDone={() => {
            setScanState('idle');
            navigation.navigate('Pantry');
          }} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: -40, // Offset for header height
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Figtree_700Bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Figtree_400Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  primaryButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#4F47E5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F47E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Figtree_600SemiBold',
    color: '#ffffff',
  },
  secondaryButton: {
    marginTop: 20,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Figtree_500Medium',
    color: '#94a3b8',
  },
});

export default ScanScreen;
