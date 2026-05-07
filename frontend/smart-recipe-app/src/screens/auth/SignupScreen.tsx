import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, CookingPot } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Loader from '../../components/ui/Loader';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

const schema = yup.object().shape({
  fullName: yup.string().min(2, 'Name is too short').required('Full name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').max(72, 'Password cannot exceed 72 characters').required('Password is required'),
});

const SignupScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigation = useNavigation<any>();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await register(data.fullName, data.email, data.password);
      Toast.show({
        type: 'success',
        text1: 'ChefSync Account Ready!',
        text2: 'Welcome to the future of cooking.',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Something went wrong during registration.';
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Loader visible={isSubmitting} message="Joining ChefSync..." />
      
      <View style={{ height: height * 0.5, backgroundColor: '#4F47E5', position: 'absolute', top: 0, left: 0, right: 0 }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ height: height * 0.35, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <View className="bg-white/10 p-5 rounded-3xl border border-white/20 mb-6">
              <CookingPot size={48} color="white" />
            </View>
            <Text className="text-white font-sans-bold text-4xl text-center">Join ChefSync</Text>
            <Text className="text-white/70 font-sans-medium text-base mt-2 text-center">Smart inventory, personalized recipes.</Text>
          </View>

          <View style={{ paddingHorizontal: 24, marginTop: -40 }}>
            <View 
              style={{ 
                backgroundColor: '#ffffff',
                borderRadius: 32,
                padding: 32,
                borderWidth: 1,
                borderColor: 'rgba(226, 232, 240, 0.5)',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.1,
                shadowRadius: 30,
                elevation: 15
              }}
            >
              <View>
                <View>
                  <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ backgroundColor: '#f8fafc', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.fullName ? '#ef4444' : '#e2e8f0' }}>
                        <User size={20} color="#64748b" />
                        <TextInput
                          placeholder="Full Name"
                          placeholderTextColor="#94a3b8"
                          style={{ flex: 1, marginLeft: 12, fontFamily: 'Figtree_500Medium', color: '#0f172a', fontSize: 15 }}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      </View>
                    )}
                  />
                  {errors.fullName && (
                    <Text className="text-red-500 font-sans-medium text-[10px] mt-2 ml-2">
                      {errors.fullName.message}
                    </Text>
                  )}
                </View>

                <View style={{ marginTop: 16 }}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ backgroundColor: '#f8fafc', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.email ? '#ef4444' : '#e2e8f0' }}>
                        <Mail size={20} color="#64748b" />
                        <TextInput
                          placeholder="Email Address"
                          placeholderTextColor="#94a3b8"
                          style={{ flex: 1, marginLeft: 12, fontFamily: 'Figtree_500Medium', color: '#0f172a', fontSize: 15 }}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          autoCapitalize="none"
                          keyboardType="email-address"
                        />
                      </View>
                    )}
                  />
                  {errors.email && (
                    <Text className="text-red-500 font-sans-medium text-[10px] mt-2 ml-2">
                      {errors.email.message}
                    </Text>
                  )}
                </View>

                <View style={{ marginTop: 16 }}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ backgroundColor: '#f8fafc', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.password ? '#ef4444' : '#e2e8f0' }}>
                        <Lock size={20} color="#64748b" />
                        <TextInput
                          placeholder="Password"
                          placeholderTextColor="#94a3b8"
                          style={{ flex: 1, marginLeft: 12, fontFamily: 'Figtree_500Medium', color: '#0f172a', fontSize: 15 }}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.password && (
                    <Text className="text-red-500 font-sans-medium text-[10px] mt-2 ml-2">
                      {errors.password.message}
                    </Text>
                  )}
                </View>

                <TouchableOpacity 
                  onPress={handleSubmit(onSubmit)}
                  activeOpacity={0.9}
                  style={{ backgroundColor: '#4F47E5', height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 32, shadowColor: '#4F47E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 }}
                >
                  <Text className="text-white font-sans-bold text-lg">Create Account</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 }}>
                  <Text className="text-slate-500 font-sans-medium text-sm">Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text className="text-primary font-sans-bold text-sm">Log In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;
