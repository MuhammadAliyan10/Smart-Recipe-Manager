// src/screens/settings/ChangePasswordScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react-native';
import { changePassword } from '../../api/users';
import Toast from 'react-native-toast-message';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Required Fields', text2: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Mismatch', text2: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      Toast.show({ type: 'error', text1: 'Weak Password', text2: 'New password must be at least 8 characters.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({ 
        current_password: currentPassword, 
        new_password: newPassword 
      });
      Toast.show({ type: 'success', text1: 'Security Updated', text2: 'Your password has been changed.' });
      navigation.goBack();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Could not change password.';
      Toast.show({ type: 'error', text1: 'Update Failed', text2: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-border/50 bg-white">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-foreground font-sans-bold text-lg ml-4">Change Password</Text>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-10 items-center">
              <View className="bg-indigo-50 p-6 rounded-full mb-4">
                <ShieldCheck size={40} color="#4F47E5" />
              </View>
              <Text className="text-slate-900 font-sans-bold text-xl">Protect your account</Text>
              <Text className="text-slate-500 font-sans-medium text-center mt-2">
                Choose a strong password to ensure your recipes and inventory data stay private.
              </Text>
            </View>

            {/* Current Password */}
            <View className="mb-6">
              <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase tracking-widest mb-2 ml-1">Current Password</Text>
              <View className="bg-slate-50 border border-border px-5 py-4 rounded-2xl flex-row items-center">
                <Lock size={20} color="#64748b" />
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showCurrent}
                  className="flex-1 ml-4 font-sans-medium text-foreground text-base"
                  autoCapitalize="none"
                  textContentType="password"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-6">
              <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase tracking-widest mb-2 ml-1">New Password</Text>
              <View className="bg-slate-50 border border-border px-5 py-4 rounded-2xl flex-row items-center">
                <Lock size={20} color="#64748b" />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Min 8 characters"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showNew}
                  className="flex-1 ml-4 font-sans-medium text-foreground text-base"
                  autoCapitalize="none"
                  textContentType="newPassword"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase tracking-widest mb-2 ml-1">Confirm New Password</Text>
              <View className="bg-slate-50 border border-border px-5 py-4 rounded-2xl flex-row items-center">
                <Lock size={20} color="#64748b" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-type new password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showNew}
                  className="flex-1 ml-4 font-sans-medium text-foreground text-base"
                  autoCapitalize="none"
                  textContentType="newPassword"
                  autoCorrect={false}
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Button - Stable Flex Footer */}
          <View className="px-6 py-6 border-t border-border/50 bg-white">
            <TouchableOpacity 
              onPress={handleSave}
              disabled={isSubmitting}
              className="bg-primary h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-primary/20"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <ShieldCheck size={20} color="white" />
                  <Text className="text-white font-sans-bold ml-3 text-lg">Update Password</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ChangePasswordScreen;
