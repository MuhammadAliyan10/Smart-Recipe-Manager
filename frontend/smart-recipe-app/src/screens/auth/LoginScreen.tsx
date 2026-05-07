import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, CookingPot } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Loader from '../../components/ui/Loader';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').max(72, 'Password cannot exceed 72 characters').required('Password is required'),
});

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigation = useNavigation<any>();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have successfully logged in.',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Invalid email or password. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Loader visible={isSubmitting} message="Authenticating..." />
      
      {/* Background Split */}
      <View style={{ height: height * 0.5, backgroundColor: '#4F47E5', position: 'absolute', top: 0, left: 0, right: 0 }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Top Section */}
          <View style={{ height: height * 0.4, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <View style={{ marginBottom: 24 }}>
              <CookingPot size={52} color="white" />
            </View>
            <Text style={{ color: 'white', fontFamily: 'Figtree_700Bold', fontSize: 32, textAlign: 'center' }}>
              Sign in to your account
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Figtree_500Medium', marginTop: 8, textAlign: 'center' }}>
              Enter your email and password to login
            </Text>
          </View>

          {/* Form Card */}
          <View style={{ paddingHorizontal: 24, marginTop: -40 }}>
            <View 
              style={{ 
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 32,
                borderWidth: 1,
                borderColor: 'rgba(226, 232, 240, 0.5)',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10
              }}
            >
              <View>
                {/* Email Input */}
                <View>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ backgroundColor: 'rgba(241, 245, 249, 0.3)', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.email ? 'rgba(239, 68, 68, 0.5)' : '#e2e8f0' }}>
                        <Mail size={18} color="#64748b" />
                        <TextInput
                          placeholder="Email Address"
                          placeholderTextColor="#94a3b8"
                          style={{ flex: 1, marginLeft: 12, fontFamily: 'Figtree_500Medium', color: '#0f172a', fontSize: 14 }}
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
                    <Text style={{ color: '#ef4444', fontFamily: 'Figtree_500Medium', fontSize: 10, marginTop: 4, marginLeft: 4 }}>
                      {errors.email.message}
                    </Text>
                  )}
                </View>

                {/* Password Input */}
                <View style={{ marginTop: 16 }}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ backgroundColor: 'rgba(241, 245, 249, 0.3)', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: errors.password ? 'rgba(239, 68, 68, 0.5)' : '#e2e8f0' }}>
                        <Lock size={18} color="#64748b" />
                        <TextInput
                          placeholder="Password"
                          placeholderTextColor="#94a3b8"
                          style={{ flex: 1, marginLeft: 12, fontFamily: 'Figtree_500Medium', color: '#0f172a', fontSize: 14 }}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.password && (
                    <Text style={{ color: '#ef4444', fontFamily: 'Figtree_500Medium', fontSize: 10, marginTop: 4, marginLeft: 4 }}>
                      {errors.password.message}
                    </Text>
                  )}
                  
                  <TouchableOpacity style={{ marginTop: 12, alignItems: 'flex-end' }}>
                    <Text style={{ color: '#4F47E5', fontFamily: 'Figtree_600SemiBold', fontSize: 12 }}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity 
                  onPress={handleSubmit(onSubmit)}
                  activeOpacity={0.9}
                  style={{ backgroundColor: '#4F47E5', height: 56, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24, shadowColor: '#4F47E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }}
                >
                  <Text style={{ color: 'white', fontFamily: 'Figtree_700Bold', fontSize: 16 }}>Log In</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
                  <Text style={{ color: '#64748b', fontFamily: 'Figtree_500Medium', fontSize: 14 }}>New here? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={{ color: '#4F47E5', fontFamily: 'Figtree_700Bold', fontSize: 14 }}>Create Account</Text>
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

export default LoginScreen;
