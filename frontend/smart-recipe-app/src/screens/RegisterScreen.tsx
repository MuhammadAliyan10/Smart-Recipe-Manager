import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const RegisterScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-primary mb-4">Create Account</Text>
      <TouchableOpacity className="bg-primary px-8 py-3 rounded-full">
        <Text className="text-white font-semibold">Register Placeholder</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
