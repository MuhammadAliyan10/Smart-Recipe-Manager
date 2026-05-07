// src/components/scanner/CameraOverlay.tsx
import React from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { X, Zap, ZapOff } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface CameraOverlayProps {
  onClose: () => void;
  onCapture: () => void;
  flashMode: boolean;
  onToggleFlash: () => void;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ 
  onClose, 
  onCapture, 
  flashMode, 
  onToggleFlash 
}) => {
  return (
    <View className="absolute inset-0 justify-between py-12">
      {/* Top Controls */}
      <View className="flex-row justify-between px-6 pt-6">
        <TouchableOpacity 
          onPress={onClose}
          className="bg-black/40 p-3 rounded-full border border-white/20"
        >
          <X size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onToggleFlash}
          className="bg-black/40 p-3 rounded-full border border-white/20"
        >
          {flashMode ? <Zap size={24} color="#facc15" /> : <ZapOff size={24} color="white" />}
        </TouchableOpacity>
      </View>

      {/* Center Reticle */}
      <View className="items-center justify-center">
        <View 
          className="border-2 border-white/50 rounded-3xl"
          style={{ width: width * 0.75, height: height * 0.45 }}
        >
          <View className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <View className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <View className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <View className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
        </View>
        <Text className="text-white font-sans-medium mt-6 bg-black/40 px-4 py-2 rounded-full overflow-hidden">
          Align receipt within the frame
        </Text>
      </View>

      {/* Capture Button */}
      <View className="items-center pb-10">
        <TouchableOpacity 
          onPress={onCapture}
          activeOpacity={0.8}
          className="w-20 h-20 rounded-full bg-white items-center justify-center border-4 border-primary/20"
        >
          <View className="w-16 h-16 rounded-full bg-primary border-4 border-white items-center justify-center">
            <View className="w-6 h-6 rounded-sm bg-white/20 border border-white/40" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraOverlay;
