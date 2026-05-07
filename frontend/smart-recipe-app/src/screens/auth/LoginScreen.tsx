import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, CookingPot } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Loader from '../../components/ui/Loader';

const { height } = Dimensions.get('window');

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
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
    } catch (error) {
      console.error("[LOGIN] Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Loader visible={isSubmitting} message="Authenticating..." />

      {/* Background Split */}
      <View style={{ height: height * 0.5, backgroundColor: '#4F47E5' }} className="absolute top-0 left-0 right-0" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Top Section (on Primary) */}
          <View style={{ height: height * 0.4 }} className="items-center justify-center px-8">
            <View className="rounded-2xl items-center justify-center mb-6">
              <CookingPot size={42} color="white" />
            </View>
            <Text className="text-white font-sans-bold text-5xl text-center">
              Sign in to your account
            </Text>
            <Text className="text-white/80 font-sans-medium mt-2 text-center">
             Enter your email and password to login
            </Text>
          </View>

          {/* Form Card (In the Middle) */}
          <View className="px-6 -mt-12">
            <View
              style={{
                backgroundColor: '#ffffff',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10
              }}
              className="rounded-xl p-8 border border-border/50"
            >
              <View className="space-y-5">
                {/* Email Input */}
                <View>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className={`bg-muted/30 rounded-lg px-4 py-3 flex-row items-center border ${errors.email ? 'border-destructive/50' : 'border-border'}`}>
                        <Mail size={18} color="#64748b" />
                        <TextInput
                          placeholder="Email Address"
                          placeholderTextColor="#94a3b8"
                          className="flex-1 ml-3 font-sans-medium text-foreground text-sm"
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
                    <Text className="text-destructive font-sans-medium text-[10px] mt-1 ml-1">
                      {errors.email.message}
                    </Text>
                  )}
                </View>

                {/* Password Input */}
                <View className="mt-4">
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className={`bg-muted/30 rounded-lg px-4 py-3 flex-row items-center border ${errors.password ? 'border-destructive/50' : 'border-border'}`}>
                        <Lock size={18} color="#64748b" />
                        <TextInput
                          placeholder="Password"
                          placeholderTextColor="#94a3b8"
                          className="flex-1 ml-3 font-sans-medium text-foreground text-sm"
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
                    <Text className="text-destructive font-sans-medium text-[10px] mt-1 ml-1">
                      {errors.password.message}
                    </Text>
                  )}

                  <TouchableOpacity className="mt-3 items-end">
                    <Text className="text-primary font-sans-semibold text-xs">Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  activeOpacity={0.9}
                  className="bg-primary h-14 rounded-lg items-center justify-center mt-6 shadow-md shadow-primary/20"
                >
                  <Text className="text-white font-sans-bold text-base">Log In</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View className="flex-row justify-center items-center mt-6">
                  <Text className="text-muted-foreground font-sans-medium text-sm">New here? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text className="text-primary font-sans-bold text-sm">Create Account</Text>
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
