// src/screens/SettingsScreen.tsx
import React from 'react';
import { 
  ScrollView, 
  View, 
  StatusBar, 
  SafeAreaView, 
  Text, 
  Switch, 
  Alert, 
  ActionSheetIOS, 
  Platform 
} from 'react-native';
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  LogOut, 
  ShieldCheck,
  CircleHelp
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { togglePushNotifications } from '../utils/notifications';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

// Components
import ProfileHeader from '../components/settings/ProfileHeader';
import SectionHeader from '../components/settings/SectionHeader';
import SettingRow from '../components/settings/SettingRow';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { theme, setTheme, pushEnabled, setPushEnabled } = usePreferences();

  const handleLogout = () => {
    logout();
    Toast.show({
      type: 'info',
      text1: 'Logged Out',
      text2: 'Come back soon to cook something great!',
    });
  };

  const handleComingSoon = (feature: string) => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: `${feature} will be available in the next update.`,
    });
  };

  const handleThemePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Light', 'Dark', 'System Default'],
          cancelButtonIndex: 0,
          title: 'Select Theme',
        },
        (buttonIndex) => {
          if (buttonIndex === 1) setTheme('light');
          else if (buttonIndex === 2) setTheme('dark');
          else if (buttonIndex === 3) setTheme('system');
        }
      );
    } else {
      // Android simple alert fallback
      Alert.alert(
        'Select Theme',
        'Choose your preferred appearance',
        [
          { text: 'Light', onPress: () => setTheme('light') },
          { text: 'Dark', onPress: () => setTheme('dark') },
          { text: 'System Default', onPress: () => setTheme('system') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const onTogglePush = async (value: boolean) => {
    const success = await togglePushNotifications(value);
    if (success || !value) {
      await setPushEnabled(value);
      if (value) {
        Toast.show({ type: 'success', text1: 'Notifications Enabled', text2: 'You will now receive recipe updates.' });
      }
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {/* Profile Section */}
          <ProfileHeader 
            fullName={user?.full_name || 'Anonymous Chef'} 
            email={user?.email || 'pantry@example.com'} 
          />

          {/* Account Settings */}
          <SectionHeader title="Account" />
          <SettingRow 
            icon={User} 
            title="Edit Profile" 
            onPress={() => navigation.navigate('EditProfile')} 
          />
          <SettingRow 
            icon={Lock} 
            title="Change Password" 
            onPress={() => navigation.navigate('ChangePassword')} 
          />
          <SettingRow 
            icon={ShieldCheck} 
            title="Privacy & Security" 
            onPress={() => navigation.navigate('PrivacySecurity')} 
          />

          {/* Preferences */}
          <SectionHeader title="Preferences" />
          <SettingRow 
            icon={Bell} 
            title="Push Notifications" 
            rightElement={
              <Switch 
                value={pushEnabled}
                onValueChange={onTogglePush}
                trackColor={{ false: '#cbd5e1', true: '#4F47E5' }}
                thumbColor="#ffffff"
              />
            }
          />
          <SettingRow 
            icon={Moon} 
            title="Dark Mode" 
            value={theme.charAt(0).toUpperCase() + theme.slice(1)}
            onPress={handleThemePress} 
          />

          {/* Support */}
          <SectionHeader title="Support" />
          <SettingRow 
            icon={CircleHelp} 
            title="Help Center" 
            onPress={() => handleComingSoon('Support')} 
          />

          {/* Danger Zone */}
          <SectionHeader title="Danger Zone" />
          <SettingRow 
            icon={LogOut} 
            title="Log Out" 
            danger 
            onPress={handleLogout} 
          />

          {/* Rebranding Watermark */}
          <View className="mt-12 items-center opacity-20">
            <Text className="text-slate-400 font-sans-bold text-[10px] uppercase tracking-[4px]">Powered by ChefSync</Text>
            <Text className="text-slate-300 font-sans-medium text-[8px] mt-1">Version 1.1.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SettingsScreen;
