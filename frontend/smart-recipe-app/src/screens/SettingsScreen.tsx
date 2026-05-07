// src/screens/SettingsScreen.tsx
import React from 'react';
import { ScrollView, View, StatusBar, SafeAreaView } from 'react-native';
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  CircleHelp
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

// Components
import ProfileHeader from '../components/settings/ProfileHeader';
import SectionHeader from '../components/settings/SectionHeader';
import SettingRow from '../components/settings/SettingRow';

const SettingsScreen = () => {
  const { user, logout } = useAuth();

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

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }} // Clear custom Tab Bar
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
            onPress={() => handleComingSoon('Profile editing')} 
          />
          <SettingRow 
            icon={Lock} 
            title="Change Password" 
            onPress={() => handleComingSoon('Password reset')} 
          />
          <SettingRow 
            icon={ShieldCheck} 
            title="Privacy & Security" 
            onPress={() => handleComingSoon('Privacy settings')} 
          />

          {/* Preferences */}
          <SectionHeader title="Preferences" />
          <SettingRow 
            icon={Bell} 
            title="Push Notifications" 
            value="On"
            onPress={() => handleComingSoon('Notifications')} 
          />
          <SettingRow 
            icon={Moon} 
            title="Dark Mode" 
            value="System"
            onPress={() => handleComingSoon('Appearance')} 
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SettingsScreen;
