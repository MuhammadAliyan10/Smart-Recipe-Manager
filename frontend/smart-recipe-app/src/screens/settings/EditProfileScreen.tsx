// src/screens/settings/EditProfileScreen.tsx
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
import { ArrowLeft, User, Save } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/users';
import Toast from 'react-native-toast-message';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Toast.show({ type: 'error', text1: 'Name Required', text2: 'Please enter your full name.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({ full_name: fullName });
      await updateUser({ full_name: fullName });
      Toast.show({ type: 'success', text1: 'Profile Updated', text2: 'Your name has been updated successfully.' });
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Update Failed', text2: 'Could not update your profile.' });
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
          <Text className="text-foreground font-sans-bold text-lg ml-4">Edit Profile</Text>
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
          >
            <View>
              <Text className="text-muted-foreground font-sans-bold text-[10px] uppercase tracking-widest mb-2 ml-1">Full Name</Text>
              <View className="bg-slate-50 border border-border px-5 py-4 rounded-2xl flex-row items-center">
                <User size={20} color="#64748b" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Your Full Name"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 ml-4 font-sans-medium text-foreground text-base"
                  autoCorrect={false}
                />
              </View>
              <Text className="text-muted-foreground font-sans-medium text-[11px] mt-4 ml-1">
                Your name will be visible across the app, including in recipe shared cards and dashboard greetings.
              </Text>
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
                  <Save size={20} color="white" />
                  <Text className="text-white font-sans-bold ml-3 text-lg">Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default EditProfileScreen;
