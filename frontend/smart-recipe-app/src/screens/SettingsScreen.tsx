import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LogOut, User as UserIcon, Bell, Shield } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  const { logout } = useAuth();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-6 pt-16 items-center border-b border-gray-100">
        <View className="w-24 h-24 bg-indigo-100 rounded-full justify-center items-center mb-4">
          <UserIcon size={48} color="#4F47E5" />
        </View>
        <Text className="text-xl font-bold text-gray-900">User Account</Text>
        <Text className="text-gray-500">user@example.com</Text>
      </View>

      <View className="p-6">
        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center mb-3">
          <Bell size={20} color="#6B7280" />
          <Text className="ml-3 flex-1 text-gray-700">Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center mb-3">
          <Shield size={20} color="#6B7280" />
          <Text className="ml-3 flex-1 text-gray-700">Privacy & Security</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={logout}
          className="bg-red-50 p-4 rounded-xl flex-row items-center mt-6"
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="ml-3 flex-1 text-red-600 font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
