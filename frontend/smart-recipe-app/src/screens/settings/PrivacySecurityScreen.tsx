// src/screens/settings/PrivacySecurityScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ShieldCheck, Download, Trash2, FileJson, AlertTriangle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../context/AuthContext';
import { exportUserData, deleteAccount } from '../../api/users';
import Toast from 'react-native-toast-message';

const PrivacySecurityScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportUserData();
      // Use explicit cast for expo-file-system properties to handle strict type environments
      const documentDir = (FileSystem as any).documentDirectory;
      const encodingUTF8 = (FileSystem as any).EncodingType?.UTF8 || 'utf8';
      
      const fileUri = `${documentDir}ChefSync_Data_Export.json`;
      
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2), {
        encoding: encodingUTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Toast.show({ 
          type: 'error', 
          text1: 'Sharing Unavailable', 
          text2: 'Could not open the share sheet on this device.' 
        });
      }
    } catch (error) {
      console.error("[EXPORT] Failed:", error);
      Toast.show({ type: 'error', text1: 'Export Failed', text2: 'Could not bundle your data.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account?",
      "This will permanently erase your profile, pantry, and all saved recipes. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Everything", 
          style: "destructive", 
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount();
              Toast.show({ 
                type: 'success', 
                text1: 'Account Deleted', 
                text2: 'All your data has been removed from our servers.' 
              });
              await logout();
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Deletion Failed', text2: 'Please contact support.' });
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
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
          <Text className="text-foreground font-sans-bold text-lg ml-4">Privacy & Security</Text>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6">
            <View className="bg-indigo-50/50 p-6 rounded-3xl items-center mb-8">
              <ShieldCheck size={48} color="#4F47E5" />
              <Text className="text-slate-900 font-sans-bold text-xl mt-4">Your Privacy Matters</Text>
              <Text className="text-slate-500 font-sans-medium text-center mt-2 text-sm leading-relaxed">
                ChefSync puts you in control. You can export your data at any time or permanently delete your account.
              </Text>
            </View>

            {/* Data Export Section */}
            <View className="bg-white border border-border rounded-3xl p-6 mb-8 shadow-sm">
              <View className="flex-row items-center mb-4">
                <FileJson size={20} color="#64748b" />
                <Text className="text-slate-900 font-sans-bold text-lg ml-3">Data Portability</Text>
              </View>
              <Text className="text-slate-500 font-sans-medium text-sm mb-6 leading-relaxed">
                Download a complete copy of your profile, pantry inventory, and saved recipes in JSON format.
              </Text>
              <TouchableOpacity 
                onPress={handleExport}
                disabled={isExporting}
                className="bg-slate-50 border border-slate-200 py-4 rounded-2xl flex-row items-center justify-center"
              >
                {isExporting ? (
                  <ActivityIndicator color="#4F47E5" />
                ) : (
                  <>
                    <Download size={18} color="#4F47E5" />
                    <Text className="text-primary font-sans-bold ml-2">Export My Data</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Danger Zone */}
            <View className="bg-red-50/30 border border-red-100 rounded-3xl p-6 mb-12">
              <View className="flex-row items-center mb-4">
                <AlertTriangle size={20} color="#ef4444" />
                <Text className="text-red-700 font-sans-bold text-lg ml-3">Danger Zone</Text>
              </View>
              <Text className="text-red-600/70 font-sans-medium text-sm mb-6 leading-relaxed">
                Permanently delete your account and all associated data. This action is instantaneous and irreversible.
              </Text>
              <TouchableOpacity 
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-500 py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-red-200"
              >
                {isDeleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Trash2 size={18} color="white" />
                    <Text className="text-white font-sans-bold ml-2">Delete Account</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PrivacySecurityScreen;
