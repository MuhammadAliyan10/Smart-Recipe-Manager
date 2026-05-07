// src/components/settings/ProfileHeader.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { User as UserIcon } from 'lucide-react-native';

interface ProfileHeaderProps {
  fullName?: string;
  email?: string;
  pfpUrl?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ fullName, email, pfpUrl }) => {
  return (
    <View className="flex-row items-center px-6 py-8 bg-white border-b border-border/30">
      <View className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 items-center justify-center overflow-hidden">
        {pfpUrl ? (
          <Image source={{ uri: pfpUrl }} className="w-full h-full" />
        ) : (
          <UserIcon size={32} color="#4F47E5" />
        )}
      </View>
      
      <View className="ml-5 flex-1">
        <Text className="text-xl font-sans-bold text-foreground">
          {fullName || 'Guest User'}
        </Text>
        <Text className="text-sm font-sans text-muted-foreground mt-1">
          {email || 'Not signed in'}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
