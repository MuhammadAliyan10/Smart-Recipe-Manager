// src/screens/SettingsScreen.tsx
import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { 
  UserCircle, 
  Lock, 
  Bell, 
  Moon, 
  ShieldCheck, 
  Info, 
  LogOut 
} from 'lucide-react-native';

// Components
import ProfileHeader from '../components/settings/ProfileHeader';
import SectionHeader from '../components/settings/SectionHeader';
import SettingRow from '../components/settings/SettingRow';

const SettingsScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout }
      ]
    );
  };

  return (
    <ScrollView 
      className="flex-1 bg-background" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 60 }}
    >
      {/* Account Section */}
      <SectionHeader title="Account" />
      <ProfileHeader 
        fullName={user?.full_name}
        email={user?.email}
        pfpUrl={user?.pfp_url}
      />
      <SettingRow 
        icon={UserCircle} 
        title="Edit Profile" 
        subtitle="Update your name and photo" 
      />
      <SettingRow 
        icon={Lock} 
        title="Change Password" 
        subtitle="Secure your account" 
      />

      {/* Preferences Section */}
      <SectionHeader title="Preferences" />
      <SettingRow 
        icon={Bell} 
        title="Push Notifications" 
        value="On" 
      />
      <SettingRow 
        icon={Moon} 
        title="Appearance" 
        value="Light" 
      />

      {/* System Section */}
      <SectionHeader title="System" />
      <SettingRow 
        icon={ShieldCheck} 
        title="Privacy Policy" 
      />
      <SettingRow 
        icon={Info} 
        title="About" 
        value="v1.1.0"
      />

      {/* Danger Zone Section */}
      <SectionHeader title="Danger Zone" />
      <SettingRow 
        icon={LogOut} 
        title="Logout" 
        danger 
        onPress={handleLogout}
      />
    </ScrollView>
  );
};

export default SettingsScreen;
