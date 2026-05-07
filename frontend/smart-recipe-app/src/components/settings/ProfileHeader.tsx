// src/components/settings/ProfileHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { User as UserIcon } from 'lucide-react-native';

interface ProfileHeaderProps {
  fullName: string;
  email: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ fullName, email }) => {
  return (
    <View className="items-center py-10 border-b border-border bg-card">
      <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center border-4 border-background shadow-sm">
        <UserIcon size={40} color="#4F47E5" />
      </View>
      
      <Text className="font-sans-bold text-2xl text-foreground mt-4">
        {fullName}
      </Text>
      
      <Text className="font-sans text-muted-foreground mt-1">
        {email}
      </Text>
    </View>
  );
};

export default ProfileHeader;
