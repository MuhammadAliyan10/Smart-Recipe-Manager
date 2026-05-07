import React from 'react';
import { View, Text, ActivityIndicator, Modal } from 'react-native';

interface LoaderProps {
  visible: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ visible, message }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-foreground/10 backdrop-blur-sm">
        <View className="bg-background p-8 rounded-3xl items-center shadow-2xl border border-border">
          <ActivityIndicator size="large" color="#4F47E5" />
          {message && (
            <Text className="text-foreground mt-4 font-sans-medium text-base">
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
